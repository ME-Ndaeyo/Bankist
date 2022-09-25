'use strict';
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

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
    '2022-05-27T17:01:17.194Z',
    '2022-07-11T23:36:17.929Z',
    '2022-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
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

// Elements
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



const displayMovements = function(account, sort = false){
  containerMovements.innerHTML = '';
  const movs = sort? account.movements.slice().sort((a,b) => a-b) : account.movements

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    
    const date = new Date(account.movementsDates[i]);
    const year = date.getFullYear();
    const month = `${date.getMonth() +1}`.padStart(2, 0);
    const curDate = `${date.getDate()}`.padStart(2, 0);
    const displayDate = `${curDate}/${month}/${year}`

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1}. ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${(mov).toFixed(2)}€</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Create username
const createUsernames = function(account){
  account.forEach(acc => acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('') )
}
createUsernames(accounts);

// Calculate and display balance
const calcDisplayBalance = function(account){
  account.balance = account.movements.reduce((acc, mov) => acc+mov, 0);
  labelBalance.textContent = `${(account.balance).toFixed(2)}€`;
}

// Calculate and display summary
const calcDisplaySummary = function(account){
  // Income summary
  const income = account.movements.filter(mov => mov > 0).reduce((acc, mov) => acc+mov, 0);
  labelSumIn.textContent = `${(income).toFixed(2)}€`;
  // Expense summary
  const expense = account.movements.filter(mov => mov<0).reduce((acc, mov) => acc+mov, 0);
  labelSumOut.textContent = `${(Math.abs(expense)).toFixed(2)}€`;
  // Interest summary
  const interest = account.movements.filter(mov=> mov>0).map(deposit => deposit * account.interestRate/100).filter(int=> int>=1).reduce((acc, int) => acc+int, 0);
  labelSumInterest.textContent = `${(interest).toFixed(2)}€`;
}

// Update UI function
const updateUI = function(account){
  // Display movements
  displayMovements(account);
  // Display balance
  calcDisplayBalance(account);
  // Display summary
  calcDisplaySummary(account);
}

// Event Handlers
let currentAccount;

currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function(e){
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  if(currentAccount?.pin === +inputLoginPin.value){
    console.log('login')
  }
  // Display UI and message
  labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
  containerApp.style.opacity = 100;

  // Create current date and time
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, 0);
  const curDate = `${now.getDate()}`.padStart(2, 0);
  const hour = `${now.getHours()}`.padStart(2, 0);
  const min = `${now.getMinutes()}`.padStart(2, 0);

  labelDate.textContent = `${curDate}/${month}/${year}, ${hour}:${min}${
    hour >= 0 && hour <= 11 ? 'am' : 'pm'
  }`;

  // Clear input fields
  inputLoginPin.value = inputLoginUsername.value = '';
  inputLoginPin.blur();
  inputLoginUsername.blur();
  // Update UI
  updateUI(currentAccount);
});

// Transfers
btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiveAcc =  accounts.find(acc => acc.username === inputTransferTo.value);
  // Make transfer
  if(amount>0 && currentAccount.balance >= amount && receiveAcc && receiveAcc?.username !== currentAccount.username){
    currentAccount.movements.push(-amount);
    receiveAcc.movements.push(amount);
  }

  // Add transfer date
  currentAccount.movementsDates.push(new Date().toISOString());
  receiveAcc.movementsDates.push(new Date().toISOString());

  // Update UI
  updateUI(currentAccount);
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
  inputTransferTo.blur();
});

// Get Loan
btnLoan.addEventListener('click', function(e){
  e.preventDefault();
  const loanAmount = Math.floor(inputLoanAmount.value);

  if(loanAmount>0 && currentAccount.movements.some(mov => mov>= loanAmount*0.15)){
    // Add movement
    currentAccount.movements.push(loanAmount);

    // Add loan date
    currentAccount.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
})

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

let sorted = false;
btnSort.addEventListener('click', function(e){
  e.preventDefault;
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})
