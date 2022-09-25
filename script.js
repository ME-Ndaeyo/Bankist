'use strict';
// // // // // // // // // //// // // // // // // // // //
// // // // // // // // // //// // // // // // // // // //
// BANKIST APP

// // // // // // // // // //// // // // // // // // // //
// // Data

// // // // // // // // // //
// DIFFERENT DATA: Contains movement dates, currency and locale
const account1 = {
  owner: 'Mmenyene Ndaeyo',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2021-11-18T21:31:17.178Z',
    '2021-12-23T07:42:02.383Z',
    '2022-01-28T09:15:04.904Z',
    '2022-04-01T10:17:24.185Z',
    '2022-05-08T14:11:59.604Z',
    '2022-09-20T17:01:17.194Z',
    '2022-09-22T23:36:17.929Z',
    '2022-09-24T10:51:36.790Z',
  ],
  currency: 'NGN',
  locale: 'en-NG', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2021-11-01T13:15:33.035Z',
    '2021-11-30T09:48:16.867Z',
    '2021-12-25T06:04:23.907Z',
    '2022-01-25T14:18:46.235Z',
    '2022-02-05T16:33:06.386Z',
    '2022-04-10T14:43:26.374Z',
    '2022-06-25T18:49:59.371Z',
    '2022-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// // // // // // // // // // // // // // // // // // // //
// VARIABLES
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


// // // // // // // // // // // // // // // // // // // //
// FUNCTIONS

// // // // // // // // // //
// Date formatting
const formatMovementDate = function(date, locale){
  const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1)/(1000*60*60*24));
  const daysPassed = calcDaysPassed(new Date(), date)

  if(daysPassed === 0) return 'Today';
  if(daysPassed === 1) return 'Yesterday';
  if(daysPassed <= 7) return `${daysPassed} days ago`;
  else{ 
    return new Intl.DateTimeFormat(locale, date).format(date)
  }
}

// // // // // // // // // //
// Currency string formatting
const formatCurrency = function(value, locale, currency){
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
}

// // // // // // // // // //
// Movements(income and expenses) display
const displayMovements = function(account, sort = false){
  containerMovements.innerHTML = '';
  const movs = sort? account.movements.slice().sort((a,b) => a-b) : account.movements

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    // Date creation
    const moveDate = new Date(account.movementsDates[i]);
    const displayDate = formatMovementDate(moveDate, account.locale);

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1}. ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formatCurrency(mov, account.locale, account.currency)}</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// // // // // // // // // //
// Create username
const createUsernames = function(account){
  account.forEach(acc => acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('') )
}
createUsernames(accounts);

// // // // // // // // // //
// Calculate and display account balance
const calcDisplayBalance = function(account){
  account.balance = account.movements.reduce((acc, mov) => acc+mov, 0);
  labelBalance.textContent = `${formatCurrency(account.balance, account.locale, account.currency)}`;
}

// // // // // // // // // //
// Calculate and display account summary
const calcDisplaySummary = function(account){
  // Income summary
  const income = account.movements.filter(mov => mov > 0).reduce((acc, mov) => acc+mov, 0);
  labelSumIn.textContent = `${formatCurrency(income, account.locale, account.currency)}`;
  // Expense summary
  const expense = account.movements.filter(mov => mov<0).reduce((acc, mov) => acc+mov, 0);
  labelSumOut.textContent = `${formatCurrency(Math.abs(expense), account.locale, account.currency)}`;
  // Interest summary
  const interest = account.movements.filter(mov=> mov>0).map(deposit => deposit * account.interestRate/100).filter(int=> int>=1).reduce((acc, int) => acc+int, 0);
  labelSumInterest.textContent = `${formatCurrency(interest, account.locale, account.currency)}`;
}

// // // // // // // // // //
// Update UI
const updateUI = function(account){
  // Display movements
  displayMovements(account);
  // Display balance
  calcDisplayBalance(account);
  // Display summary
  calcDisplaySummary(account);
}

// // // // // // // // // //
// Log out timer
const startLogOutTimer = function(){
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // In each call, print the remaining time to the UI
    labelTimer.textContent = `${min}:${sec}`;
    // When time gets to zero, timer stops and the user gets logged out
    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
    }
    // Decrease timer
    time--;
  };
  // Set time
  let time = 300;
  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000)

  return timer;
};

// // // // // // // // // // // // // // // // // // // //
// // EVENT HANDLERS

// // // // // // // // // //
// // Login
let currentAccount, timer;
btnLogin.addEventListener('click', function(e){
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  if(currentAccount?.pin === +inputLoginPin.value){
    console.log('login')
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
  }
  // Create current date and time
  const now = new Date();
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  };
  labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);
  // Clear input fields
  inputLoginPin.value = inputLoginUsername.value = '';
  inputLoginPin.blur();
  inputLoginUsername.blur();
  // Timer
  if(timer) clearInterval(timer);
  timer = startLogOutTimer();
  // Update UI
  updateUI(currentAccount);
});

// // // // // // // // // //
// // Transfers
btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiveAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  // Make transfer
  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiveAcc &&
    receiveAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiveAcc.movements.push(amount);
  }
  // Add transfer date
  currentAccount.movementsDates.push(new Date().toISOString());
  receiveAcc.movementsDates.push(new Date().toISOString());
  // Reset timer
  clearInterval(timer);
  timer = startLogOutTimer();
  // Update UI
  updateUI(currentAccount);
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
  inputTransferTo.blur();
});

// // // // // // // // // //
// // Get Loan
btnLoan.addEventListener('click', function(e){
  e.preventDefault();
  const loanAmount = Math.floor(inputLoanAmount.value);

  if(loanAmount>0 && currentAccount.movements.some(mov => mov>= loanAmount*0.15)){
    setTimeout(() => {
      // Add movement
      currentAccount.movements.push(loanAmount);
      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());
      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
      // Update UI
      updateUI(currentAccount);
    }, Math.round((Math.random()*2) +2)*1000)
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
})

// // // // // // // // // //
// // Deleting User Account
btnClose.addEventListener('click', function(e){
  e.preventDefault();
  
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
    ) {
      const currentAccountIndex = accounts.findIndex(acc => acc.username === currentAccount.username);
      // Delete Account
      accounts.splice(currentAccountIndex, 1);
      // Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
  labelWelcome.textContent = 'Log in to get started';
})

// // // // // // // // // //
// // Sorting user account movements
let sorted = false;
btnSort.addEventListener('click', function(e){
  e.preventDefault;
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
})

// const future = new Date(2029, 9, 10, 16, 30, 20)
// console.log(Number(future))

// const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1)/(1000 * 60 * 60 * 24))

// const day = calcDaysPassed(new Date(2022, 1, 2), new Date(2022, 1, 12));
// console.log(day)

// setInterval(function(){
//   const now = new Date();
//   const hour = now.getHours();
//   const min = now.getMinutes();
//   const sec = now.getSeconds();
//  console.log(`${hour}:${min}:${(sec>=0 && sec<=9)? '0'+sec : sec}`)
// }, 1000)