const balance = document.getElementById("balance")
const money_plus = document.getElementById("money-plus")
const money_minus = document.getElementById("money-minus")
const list = document.getElementById("list")
const form = document.getElementById("form")
const text = document.getElementById("text")
const amount = document.getElementById("amount")

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
      amount: +amount.value,
    }
    console.log(transaction)
    transactions.push(transaction)
    addTransactionDOM(transaction)
    updateValues()
    updateLocalStorage()
    text.value = ""
    amount.value = ""
  }
}

//Generate random id
function generateId() {
  return Math.floor(Math.random() * 1000000)
}
console.log(generateId())

//Add transaction to DOM list
function addTransactionDOM(transactions) {
  //Get sign
  const sign = transactions.amount < 0 ? "-" : "+"
  const item = document.createElement("li")
  //Add class based on value
  item.classList.add(transactions.amount < 0 ? "minus" : "plus")
  item.innerHTML = `
    ${transactions.text} 
    <span>${sign}${transactions.amount}</span>
    <button class="delete-btn" onclick="removeTransaction(${transactions.id})">x</button>
  `
  list.appendChild(item)
}

//Update the balance, income and expense
function updateValues() {
  const amounts = transactions.map((transaction) => transaction.amount)
  console.log("amounts =", amounts)

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2)
  console.log("total =", total)

  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2)
  console.log("income =", income)

  const expense = (
    amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2)
  console.log("expense =", expense)

  balance.innerText = `$${total}`
  money_plus.innerText = `$${income}`
  money_minus.innerText = `$${expense}`
}

//Remove transaction by ID
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
