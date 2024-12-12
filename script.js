// Budget Tracker Script
let totalAmount = document.getElementById("total-amount");
let userAmount = document.getElementById("user-amount");
const checkAmountButton = document.getElementById("check-amount");
const totalAmountButton = document.getElementById("total-amount-button");
const productTitle = document.getElementById("Expense-title"); // Updated to match HTML
const errorMessage = document.getElementById("budget-error");
const productTitleError = document.getElementById("Expense-title-error"); // Updated to match HTML
const amount = document.getElementById("amount");
const expenditureValue = document.getElementById("expenditure-value");
const balanceValue = document.getElementById("balance-amount");
const list = document.getElementById("list");
let tempAmount = 0;
let expenses = [];

// Load budget and expenses from localStorage
document.addEventListener("DOMContentLoaded", () => {
  const storedAmount = localStorage.getItem("budget");
  const storedExpenses = JSON.parse(localStorage.getItem("expenses"));

  if (storedAmount) {
    tempAmount = parseInt(storedAmount) || 0;
    amount.innerText = tempAmount;
    balanceValue.innerText = tempAmount;
  }

  if (storedExpenses && Array.isArray(storedExpenses)) {
    expenses = storedExpenses;
    expenses.forEach(expense => {
      listCreator(expense.title, expense.amount);
      updateExpenditure(expense.amount);
    });
  }
});

// Set Budget
totalAmountButton.addEventListener("click", () => {
  const budgetInput = parseInt(totalAmount.value);
  if (isNaN(budgetInput) || budgetInput <= 0) {
    errorMessage.classList.remove("hide");
    return;
  }
  errorMessage.classList.add("hide");

  tempAmount = budgetInput;
  amount.innerText = tempAmount;
  balanceValue.innerText = tempAmount - parseInt(expenditureValue.innerText || 0);
  localStorage.setItem("budget", tempAmount);
  totalAmount.value = "";
});

// Disable Buttons
const disableButtons = (disable) => {
  const editButtons = document.getElementsByClassName("edit");
  Array.from(editButtons).forEach(button => button.disabled = disable);
};

// Modify Element
const modifyElement = (button, edit = false) => {
  const parentDiv = button.parentElement;
  const expenseName = parentDiv.querySelector(".product").innerText;
  const expenseAmount = parseInt(parentDiv.querySelector(".amount").innerText);

  if (edit) {
    productTitle.value = expenseName;
    userAmount.value = expenseAmount;
    disableButtons(true);
  }

  updateExpenditure(-expenseAmount);
  parentDiv.remove();

  expenses = expenses.filter(expense => expense.title !== expenseName);
  saveExpensesToLocalStorage();
};

// Create List
const listCreator = (title, value) => {
  const sublistContent = document.createElement("div");
  sublistContent.classList.add("sublist-content", "flex-space");
  sublistContent.innerHTML = `<p class="product">${title}</p><p class="amount">${value}</p>`;

  const editButton = document.createElement("button");
  editButton.classList.add("fa-solid", "fa-pen-to-square", "edit");
  editButton.style.fontSize = "1.2em";
  editButton.addEventListener("click", () => modifyElement(editButton, true));

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("fa-solid", "fa-trash-can", "delete");
  deleteButton.style.fontSize = "1.2em";
  deleteButton.addEventListener("click", () => modifyElement(deleteButton));

  sublistContent.append(editButton, deleteButton);
  list.appendChild(sublistContent);
};

// Save Expenses
const saveExpensesToLocalStorage = () => {
  localStorage.setItem("expenses", JSON.stringify(expenses));
};

// Update Expenditure
const updateExpenditure = (amount) => {
  const currentExpenditure = parseInt(expenditureValue.innerText || 0);
  const updatedExpenditure = currentExpenditure + amount;

  expenditureValue.innerText = updatedExpenditure;
  balanceValue.innerText = tempAmount - updatedExpenditure;
};

// Add Expense
checkAmountButton.addEventListener("click", () => {
  const expenseName = productTitle.value.trim();
  const expenseAmount = parseInt(userAmount.value);

  if (!expenseName || isNaN(expenseAmount) || expenseAmount <= 0) {
    productTitleError.classList.remove("hide");
    return;
  }
  productTitleError.classList.add("hide");

  updateExpenditure(expenseAmount);

  const expense = { title: expenseName, amount: expenseAmount };
  expenses.push(expense);
  listCreator(expenseName, expenseAmount);
  saveExpensesToLocalStorage();

  productTitle.value = "";
  userAmount.value = "";
});
