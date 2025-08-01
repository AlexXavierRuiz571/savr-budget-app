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
    incomeInput.value = "";
    updateBudget();
  }
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

  expenseNameInput.value = "";
  expenseAmountInput.value = "";
  expenseCategoryInput.value = "Housing";

  updateBudget();
});

//------------ Handle Delete ------------

expenseList.addEventListener("click", (e) => {
  if (e.target.classList.contains("expenses__delete-button")) {
    const id = parseInt(e.target.dataset.id);
    expenses = expenses.filter((item) => item.id !== id);
    updateBudget();
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

//------------ Footer Year ------------

document.querySelector("#footer-year").textContent = new Date().getFullYear();
