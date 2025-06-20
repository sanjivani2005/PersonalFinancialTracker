// ========== Dark Mode ==========
document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// ========== Brand Name Generator ==========
const userNameInput = document.getElementById("userName");
const brandOutput = document.getElementById("brandOutput");

userNameInput.addEventListener("input", () => {
  const name = userNameInput.value.trim();
  if (name) {
    const shortName = name.slice(0, 4).toUpperCase();
    const financeWords = ["Wealth", "Tracker", "Wallet", "Saver", "Budgeter"];
    const randomWord = financeWords[Math.floor(Math.random() * financeWords.length)];
    brandOutput.innerHTML = `👉 Your Personal Finance Brand: <strong>${shortName}${randomWord}</strong>`;
  } else {
    brandOutput.innerHTML = "";
  }
});

// ========== Global Variables ==========
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
const expenseCategories = ["Groceries", "Utilities", "Entertainment", "Health", "Others"];
const incomeCategories = ["Salary", "Savings"];

// ========== DOM Elements ==========
const transactionForm = document.getElementById("transactionForm");
const transactionList = document.getElementById("transactionList");
const filterCategory = document.getElementById("filterCategory");
const filterDate = document.getElementById("filterDate");

// ========== Helpers ==========
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function updateSummary() {
  const income = transactions
    .filter(t => incomeCategories.includes(t.category))
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter(t => expenseCategories.includes(t.category))
    .reduce((sum, t) => sum + t.amount, 0);

  document.getElementById("totalIncome").innerText = income;
  document.getElementById("totalExpense").innerText = expense;
  document.getElementById("balance").innerText = income - expense;
}

// ========== Render Transactions ==========
function renderTransactions() {
  const selectedCategory = filterCategory.value;
  const selectedDate = filterDate.value;

  transactionList.innerHTML = "";

  transactions
    .filter(t => {
      const matchCategory = !selectedCategory || t.category === selectedCategory;
      const matchDate = !selectedDate || new Date(t.date).toLocaleDateString() === new Date(selectedDate).toLocaleDateString();
      return matchCategory && matchDate;
    })
    .forEach((t, i) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${t.description}</strong> - ₹${t.amount} 
        <span style="color: ${incomeCategories.includes(t.category) ? 'green' : 'red'};">[${t.category}]</span> 
        <small>(${t.date})</small>
      `;
      transactionList.appendChild(li);
    });
}

// ========== Add Transaction ==========
transactionForm.addEventListener("submit", e => {
  e.preventDefault();
  const description = document.getElementById("description").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value;
  const date = new Date().toLocaleDateString();

  if (!description || isNaN(amount) || !category) return;

  transactions.push({ description, amount, category, date });
  updateLocalStorage();
  renderTransactions();
  updateSummary();
  transactionForm.reset();
});

// ========== Filters ==========
filterCategory.addEventListener("change", renderTransactions);
filterDate.addEventListener("change", renderTransactions);

// ========== Export CSV ==========
document.getElementById("exportCSV").addEventListener("click", () => {
  let csv = "Description,Amount,Category,Date\n";
  transactions.forEach(t => {
    csv += `${t.description},${t.amount},${t.category},${t.date}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "transactions.csv";
  a.click();
  URL.revokeObjectURL(url);
});

// ========== Clear All Data ==========
document.getElementById("clearData").addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all transactions?")) {
    transactions = [];
    updateLocalStorage();
    renderTransactions();
    updateSummary();
  }
});

// ========== Finance Planner ==========
function generatePlan() {
  const salary = parseFloat(document.getElementById('plannedSalary').value);
  const spending = parseFloat(document.getElementById('plannedSpending').value);
  const savings = parseFloat(document.getElementById('plannedSavings').value);
  const goal = document.getElementById('futureGoals').value;
  const output = document.getElementById('planOutput');

  if (isNaN(salary) || isNaN(spending) || isNaN(savings) || !goal) {
    output.innerHTML = '<p style="color:red;">Please fill in all fields correctly.</p>';
    return;
  }

  const remaining = salary - (spending + savings);
  output.innerHTML = `
    <p>💡 Based on your plan:</p>
    <ul>
      <li><strong>Total Income:</strong> ₹${salary}</li>
      <li><strong>Total Expenses:</strong> ₹${spending}</li>
      <li><strong>Total Savings:</strong> ₹${savings}</li>
      <li><strong>Remaining Amount:</strong> ₹${remaining}</li>
      <li><strong>Goal:</strong> ${goal}</li>
    </ul>
  `;
}

// ========== Initial Load ==========
renderTransactions();
updateSummary();
