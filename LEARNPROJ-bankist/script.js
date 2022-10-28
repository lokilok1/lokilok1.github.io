"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// Display all movements
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}€</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html); // descending order ("beforeend" then ascending order)
  });
};

// displayMovements(account1.movements);

// Display the Balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

// calcDisplayBalance(account1.movements);

// Display Summary
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((mov) => (mov * acc.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${Math.trunc(interest)}€`;
};
// calcDisplaySummary(account1.movements);

// Create username for each account
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((el) => el.slice(0, 1))
      .join("");
  });
};
createUsernames(accounts);

// Update UI (displayMovements, displayBalance, displaySummary)
const updateUI = function (acc) {
  //Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display sumamry
  calcDisplaySummary(acc);
};

//Event handler
let currentAccount;

btnLogin.addEventListener("click", function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    // Add movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);

    inputLoanAmount.value = "";
  }
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  let index = accounts.findIndex(
    (acc) => acc.username === inputCloseUsername.value
  );

  if (
    inputCloseUsername.value == currentAccount.username &&
    inputClosePin.value == currentAccount.pin
  ) {
    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = "";
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES;

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// let arr = ["a", "b", "c", "d", "e"];

// // // SLICE
// // console.log(arr.slice(2));
// // console.log(arr.slice(2, 4));
// // console.log(arr.slice(-2)); // Extracting everything except the last two
// // console.log(arr.slice(-1));
// // console.log(arr.slice(1, -2));
// // console.log(arr.slice()); // Shallow copy
// // console.log([...arr]); // Shallow copy

// // // SPLICE
// // console.log(arr.splice(2));
// arr.splice(-1);
// console.log(arr);
// arr.splice(1, 2);
// console.log(arr);

// // REVERSE
// arr = ["a", "b", "c", "d", "e"];
// const arr2 = ["j", "i", "h", "g", "f"];
// console.log(arr2.reverse());
// console.log(arr2);

// // CONCAT
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr, ...arr2]);

// // JOIN
// console.log(letters.join(" - "));
// /////////////////////////////////////////////////

// const arr = [23, 11, 64];
// console.log(arr[0]);
// console.log(arr.at(0));

// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);
// console.log(arr.at(-1));
// console.log(arr.at(-2));

// console.log("jonas".at(0));
// // /////////////////////////////////////////////////

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // for (const movement of movements) {
// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
//   }
// }

// console.log("----- FOREACH -----");

// movements.forEach(function (mov, i, arr) {
//   if (mov > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${mov}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`);
//   }
// });
// // /////////////////////////////////////////////////

// const currencies = new Map([
//   ["USD", "United States dollar"],
//   ["EUR", "Euro"],
//   ["GBP", "Pound sterling"],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// const currenciesUnique = new Set(["USD", "GBP", "USD", "EUR", "EUR"]);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function (value, _, map) {
//   console.log(`${_}: ${value}`);
// });
// // /////////////////////////////////////////////////
// // /////////////////////////////////////////////////
// // Coding Challenge #1

// const checkDogs = function (dogsJulia, dogsKate) {
//   let dogsJuliaCorrected = dogsJulia.slice(1, 3);
//   console.log(dogsJuliaCorrected);
//   const arr = [...dogsJuliaCorrected, ...dogsKate];
//   console.log(arr);
//   arr.forEach(function (el, i) {
//     el >= 3
//       ? console.log(`Dog number ${i + 1} is an adult, and is ${el} years old`)
//       : console.log(`Dog number ${i + 1} is still a puppy.`);
//   });
// };

// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);
/////////////////////////////////////////////////
/////////////////////////////////////////////////

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const eurToUsd = 1.1;

// const movementsUSD = movements.map((mov) => mov * eurToUsd);
// //   // return 23;
// //   // console.log(movements);

// console.log(movements);
// console.log(movementsUSD);

// const movementsUSDfor = [];
// for (const mov of movements) movementsUSDfor.push(mov * eurToUsd);

// const movementsDescriptions = movements.map(
//   (mov, i) =>
//     `Movement ${i + 1}: You ${mov > 0 ? "deposited" : "withdrew"} ${Math.abs(
//       mov
//     )}`
// );

// console.log(movementsDescriptions);
// // /////////////////////////////////////////////////

// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });
// console.log(movements);
// console.log(deposits);
// const asd = function (moves) {
//   const depositsFor = [];
//   for (const mov of moves) if (mov > 0) depositsFor.push(mov);
//   return depositsFor;
// };
// console.log(asd(movements)); // "CREATE" a function

// const withdrawals = movements.filter(function (mov) {
//   return mov < 0;
// });

// console.log(withdrawals);
// /////////////////////////////////////////////////

// console.log(movements);

// // // const balance = movements.reduce(function (accu, cur, i, arr) {
// // //   console.log(`Iteration ${i}: ${accu}`);
// // //   return accu + cur;
// // // }, 0);

// const balance = movements.reduce((accu, cur) => accu + cur, 0);
// console.log(balance);
// //
// let balance2 = 0;
// for (const mov of movements) balance2 += mov;
// console.log(balance2);

// // Maximum value
// const max = movements.reduce(function (acc, mov) {
//   if (mov > acc) {
//     acc = mov;
//   }
//   return acc;
// });
// console.log(max);

// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) return acc;
//   else return mov;
// }, movements[0]);
// // /////////////////////////////////////////////////
// /////////////////////////////////////////////////

// const eurToUsd = 1.1;
// const totalDepositsUSD = movements
//   .filter((mov) => mov > 0)
//   .map((mov, i, arr) => {
//     // make a code-block under arrow function
//     console.log(arr);
//     return mov * eurToUsd;
//   })
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositsUSD);

// // /////////////////////////////////////////////////
// // Coding Challenge #2 #3

// const calcAverageHumanAge = (ages) =>
//   ages
//     .map((age) => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter((age, i, arr) => age >= 18)
//     .reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

// const avg1 = [5, 2, 4, 1, 15, 8, 3];
// const avg2 = [16, 6, 10, 5, 6, 1, 4];

// console.log(calcAverageHumanAge(avg1), calcAverageHumanAge(avg2));
// /////////////////////////////////////////////////
// /////////////////////////////////////////////////

// const firstWithdrawal = movements.find((mov) => mov < 0);
// console.log(movements);
// console.log(firstWithdrawal);

// console.log(accounts);

// const account = accounts.find((acc) => acc.owner === "Jessica Davis");

// for (const el of accounts) {
//   var acc;
//   if (el.owner === "Jessica Davis") {
//     acc = el;
//   }
// }
// console.log(acc);
// // console.log(account);
/////////////////////////////////////////////////

// console.log(movements);
// console.log(movements.includes(-130));

// // SOME
// console.log(movements.some((mov) => mov === -130));

// const anyDeposits = movements.some((mov) => mov > 5000);
// console.log(anyDeposits);

// // EVERY
// console.log(movements.every((mov) => mov > 0));
// console.log(account4.movements.every((mov) => mov > 0));

// // Separate callback

// const deposit = (mov) => mov > 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));
// /////////////////////////////////////////////////

// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());
// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(2));

// const overallBalance = accounts
//   .map((acc) => acc.movements)
//   .flat()
//   .reduce((prev, cur) => prev + cur, 0);
// console.log(overallBalance);

// const overallBalance2 = accounts
//   .flatMap((acc) => acc.movements)
//   .reduce((prev, cur) => prev + cur, 0);
// console.log(overallBalance);

// /////////////////////////////////////////////////

// Sorting strings
// const owners = ["Jonas", "Zach", "Adam", "Martha"];
// console.log(owners.sort());
// console.log(owners);

// // Sorting numbers
// console.log(movements);
// // console.log(movements.sort()); NOT WORK

// movements.sort((a, b) => a - b);
// console.log(movements);
// movements.sort((a, b) => b - a);
// console.log(movements);
// // /////////////////////////////////////////////////

// const arr = [1, 2, 3, 4, 5, 6, 7];
// console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// const x = new Array(7);
// console.log(x);
// console.log(x.map(() => 5));

// x.fill(0);
// x.fill(1, 3, 5);
// console.log(x);

// arr.fill(23, 4, 6);
// console.log(arr);

// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);

// const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);

// // const million = Array.from({ length: 100 }, () =>
// //   Math.floor(Math.random() * 6 + 1)
// // );

// labelBalance.addEventListener("click", function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll(".movements__value")
//   );

//   console.log(movementsUI.map((el) => el.textContent.replace("€", "")));
// });
// /////////////////////////////////////////////////

// /////////////////////////////////////////////////
// // Array methods Practice

// // 1.
// const bankDepositSum = accounts
//   .map(
//     (acc) => acc.movements
//   ) /* take movments of each account out and put them into an array*/
//   .flat()
//   .filter((mov) => mov > 0)
//   .reduce((prev, cur) => prev + cur, 0);

// console.log(bankDepositSum);

// // 2.
// const numDeposits1000 = accounts
//   .flatMap((acc) => acc.movements)
//   .reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0);
// // .filter((mov) => mov >= 1000).length;

// console.log(numDeposits1000);

// // prefixed ++ operator
// let a = 10;
// console.log(a++);
// console.log(++a);
// console.log(a);

// // 3.
// const { deposits, withdrawals } = accounts
//   .flatMap((acc) => acc.movements)
//   .reduce(
//     (sums, cur) => {
//       // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
//       sums[cur > 0 ? "deposits" : "withdrawals"] += cur;
//       return sums;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );
// // console.log(sums);
// console.log(deposits, withdrawals);

// const movements2 = accounts.flatMap((acc) => acc.movements);

// let arr = [0, 0];
// arr = movements2.reduce(
//   (pV, cV) => {
//     if (cV > 0) {
//       arr[0] += cV;
//     } else if (cV < 0) {
//       arr[1] += cV;
//     }
//     return arr;
//   },
//   [0, 0]
// );

// console.log(arr);

// // 4.
// // this is a nice title -> This Is a Nice Title
// const convertTitleCase = function (title) {
//   const capitalize = (str) => str[0].toUpperCase() + str.slice(1);

//   const exceptions = ["a", "an", "and", "the", "but", "or", "on", "in", "with"];

//   const titleCase = title
//     .toLowerCase()
//     .split(" ")
//     .map((word) => (exceptions.includes(word) ? word : capitalize(word)))
//     .join(" ");
//   return capitalize(titleCase);
// };

// console.log(convertTitleCase("this is a nice title"));
// console.log(convertTitleCase("this is a LONG title but not too long"));
// console.log(convertTitleCase("and here is another title with an EXAMPLE"));
// // /////////////////////////////////////////////////\
// // Coding Challenge #4
// const dogs = [
//   { weight: 22, curFood: 250, owners: ["Alice", "Bob"] },
//   { weight: 8, curFood: 200, owners: ["Matilda"] },
//   { weight: 13, curFood: 275, owners: ["Sarah", "John"] },
//   { weight: 32, curFood: 340, owners: ["Michael"] },
// ];

// // Task 1
// dogs.forEach((dog) => {
//   dog.recommendedFood = dog.weight ** 0.75 * 28; // in grams
// });

// console.log(dogs);

// // Task 2
// const SarahsDog = dogs[dogs.findIndex((dog) => dog.owners.includes("Sarah"))];

// console.log(SarahsDog);

// console.log(
//   `${
//     SarahsDog.curFood > SarahsDog.recommendedFood
//       ? "Eating too much"
//       : "Eating too little"
//   }`
// );

// // Task 3
// const ownersEatTooMuch = dogs
//   .filter((dog) => dog.curFood > dog.recommendedFood)
//   .map((dog) => dog.owners);
// const ownersEatTooLittle = dogs
//   .filter((dog) => dog.curFood < dog.recommendedFood)
//   .map((dog) => dog.owners);

// console.log(ownersEatTooMuch, ownersEatTooLittle);

// // Task 4

// console.log(`${ownersEatTooMuch.flat().join(" and ")}'s dogs eat too much!`);
// console.log(
//   `${ownersEatTooLittle.flat().join(" and ")}'s dogs eat too little!`
// );

// // Task 5
// console.log(dogs.some((dog) => dog.curFood == dog.recommendedFood));

// //Task 6

// const eatingOkay = (dog) =>
//   dog.curFood <= dog.recommendedFood * 1.1 &&
//   dog.curFood >= dog.recommendedFood * 0.9;

// console.log(dogs.some(eatingOkay));
// // Task 7

// const dogsEatingOkay = dogs.filter(eatingOkay);

// console.log(dogsEatingOkay);

// // Task 8
// console.log(dogs.slice().sort((a, b) => a.recommendedFood - b.recommendedFood));
// // /////////////////////////////////////////////////
