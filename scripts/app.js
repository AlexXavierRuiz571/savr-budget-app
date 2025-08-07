//------------ Budget State ------------

let income = 0;
let expenses = [];

//------------ DOM Elements ------------

const incomeInput = document.querySelector("#income");
const budgetForm = document.querySelector("#budget-form");
const totalIncomeEl = document.querySelector("#total-income");
const totalExpensesEl = document.querySelector("#total-expenses");
const remainingBudgetEl = document.querySelector("#remaining-budget");

const expenseForm = document.querySelector("#expense-form");
const expenseNameInput = document.querySelector("#expense-name");
const expenseAmountInput = document.querySelector("#expense-amount");
const expenseCategoryInput = document.querySelector("#expense-category");
const expenseList = document.querySelector("#expense-list");

//------------ Handle Budget Form ------------

budgetForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newIncome = parseFloat(incomeInput.value);

  if (!isNaN(newIncome) && newIncome > 0) {
    income = newIncome;
    budgetForm.reset();
    setBudgetButtonState(false);
    updateBudget();
  }
});

budgetForm.addEventListener("input", function () {
  const isValid = incomeInput.value.trim().length > 0;
  setBudgetButtonState(isValid);
});

//------------ Handle Add Expense ------------

expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = expenseNameInput.value.trim();
  const amount = parseFloat(expenseAmountInput.value);
  const category = expenseCategoryInput.value;

  if (!name || isNaN(amount) || amount <= 0) return;

  const expense = {
    id: Date.now(),
    name,
    amount,
    category,
  };

  expenses.push(expense);

  expenseForm.reset();
  setSubmitButtonState(false);
  updateBudget();
});


expenseForm.addEventListener("input", function () {
  const isValid =
    expenseNameInput.value.trim().length > 0 &&
    expenseAmountInput.value.trim().length > 0;
  setSubmitButtonState(isValid);
});

//------------ Handle Delete ------------

expenseList.addEventListener("click", (e) => {
  if (e.target.classList.contains("expenses__delete-button")) {
    const id = parseInt(e.target.dataset.id);
    expenses = expenses.filter((item) => item.id !== id);
    updateBudget();
  }
});

//------------ Handle Right-Click Context Menu ------------

expenseList.addEventListener("contextmenu", (e) => {
  e.preventDefault();

  const expenseItem = e.target.closest(".expenses__item");
  if (!expenseItem) return;

  const button = expenseItem.querySelector(".expenses__delete-button");
  const id = parseInt(button.dataset.id);
  const expense = expenses.find((item) => item.id === id);

  if (expense) {
    alert(`Right-clicked on: ${expense.name} — $${expense.amount.toFixed(2)} (${expense.category})`);
  }
});

//------------ Update Budget Summary ------------

function updateBudget() {
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const remaining = income - totalExpenses;

  totalIncomeEl.textContent = income.toFixed(2);
  totalExpensesEl.textContent = totalExpenses.toFixed(2);
  remainingBudgetEl.textContent = remaining.toFixed(2);

  const remainingWrapper = remainingBudgetEl.closest(".budget-input__summary-item");

  if (remaining < 0) {
    remainingWrapper.classList.add("budget-input__summary-item--negative");
  } else {
    remainingWrapper.classList.remove("budget-input__summary-item--negative");
  }

  renderExpenses();
}

//------------ Render Expenses ------------

function renderExpenses() {
  expenseList.innerHTML = "";

  expenses.forEach((item) => {
    const li = document.createElement("li");
    li.className = "expenses__item";
    li.innerHTML = `
      <span>${item.name} — $${item.amount.toFixed(2)} (${item.category})</span>
      <button class="expenses__delete-button" data-id="${item.id}">✕</button>
    `;
    expenseList.appendChild(li);
  });
}

function setSubmitButtonState(isFormValid) {
  const addButton = expenseForm.querySelector(".expenses__button");

  if (isFormValid) {
    addButton.removeAttribute("disabled");
    addButton.classList.remove("expenses__button_disabled");
  } else {
    addButton.setAttribute("disabled", true);
    addButton.classList.add("expenses__button_disabled");
  }
}

function setBudgetButtonState(isFormValid) {
  const budgetButton = budgetForm.querySelector(".budget-input__button");

  if (isFormValid) {
    budgetButton.removeAttribute("disabled");
    budgetButton.classList.remove("budget-input__button_disabled");
  } else {
    budgetButton.setAttribute("disabled", true);
    budgetButton.classList.add("budget-input__button_disabled");
  }
}

//------------ Footer Year ------------

document.querySelector("#footer-year").textContent = new Date().getFullYear();
