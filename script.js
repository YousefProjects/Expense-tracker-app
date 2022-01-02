const balance = document.getElementById("balance")
const money_plus = document.getElementById("money-plus")
const money_minus = document.getElementById("money-minus")
const list = document.getElementById("list")
const form = document.getElementById("form")
const text = document.getElementById("text")
const date = document.getElementById("date")
const amount = document.getElementById("amount")
const toggle = document.querySelector(".toggle")

// Switch Theme Btn (Dark/ Light)
toggle.addEventListener("click", (e) => {
  const html = document.querySelector("html")
  if (html.classList.contains("dark")) {
    html.classList.remove("dark")
    e.target.innerHTML = 'dark'
    console.log('light toggled')
  } else {
    html.classList.add("dark")
    e.target.innerHTML = 'light'
    console.log('dark toggled')
  }
})

// to store transaction
const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
)
let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : []

//Add transaction
function addTransaction(e) {
  e.preventDefault()
  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please add a text and amount")
  } else {
    const transaction = {
      id: generateId(),
      text: text.value,
      date: date.value,
      amount: +amount.value,
    }
    console.log("new transaction =>", transaction)
    transactions.push(transaction)
    addTransactionDOM(transaction)
    updateValues()
    updateLocalStorage()
    text.value = ""
    date.value = ""
    amount.value = ""
  }
}

//Generate random id for new transaction
function generateId() {
  return Math.floor(Math.random() * 1000000)
}

//Add transaction to DOM list
function addTransactionDOM(transactions) {
  //Get sign +/-
  const sign = transactions.amount < 0 ? "-" : "+"
  const item = document.createElement("li")
  //Add item to list
  item.classList.add(transactions.amount < 0 ? "minus" : "plus")
  item.innerHTML = `
    ${transactions.text}
    <span class="date">${transactions.date.substring(5, 10)}</span>
    <span>${sign}${transactions.amount}</span>
    <button class="delete-btn" onclick="removeTransaction(${
      transactions.id
    })">x</button>
  `
  list.appendChild(item)
  console.log(transactions.date)
}

//Update balance, income and expense
function updateValues() {
  // all mounts in the list
  const amounts = transactions.map((transaction) => transaction.amount)
  console.log("amounts =", amounts)
  // calculate balance, income , expense
  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2)
  const expense = (
    amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2)
  const total = income - expense

  // print them in the console
  console.log("amounts =", amounts)
  console.log("income =", income)
  console.log("expense =", expense)
  console.log("total =", total)

  // render the results
  balance.innerText = `$${total}`
  money_plus.innerText = `$${income}`
  money_minus.innerText = `$${expense}`
}

//Remove transaction from the list - by ID
function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id)
  updateLocalStorage()
  init()
}

// Update local storage transactions
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions))
}

//Init app
function init() {
  list.innerHTML = ""
  transactions.forEach(addTransactionDOM)
  updateValues()
}
init()
form.addEventListener("submit", addTransaction)
