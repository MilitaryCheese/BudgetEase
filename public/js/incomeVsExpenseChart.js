document.addEventListener("DOMContentLoaded", async function () {
  // Function to group transactions by month (formatted as "YYYY-MM") and sum incomes and expenses.
  function groupByMonth(transactions) {
    const grouped = {};

    transactions.forEach((tx) => {
      const date = new Date(tx.date);
      const monthKey = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0");

      if (!grouped[monthKey]) {
        grouped[monthKey] = { income: 0, expense: 0 };
      }

      if (tx.type === "income") {
        grouped[monthKey].income += tx.amount;
      } else {
        grouped[monthKey].expense += tx.amount;
      }
    });

    return grouped;
  }

  // Function to fetch transactions from the database
  async function getTransactionsFromDb() {
    try {
      const response = await fetch("http://localhost:4000/getTransactions", {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch transactions");

      const result = await response.json(); // Expected format: [{ date: "2025-02-01", type: "income", amount: 1000 }]
      return result;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return null;
    }
  }

  // Fetch transactions and update the Income vs Expense Chart
  async function updateIncomeExpenseChart() {
    const transactions = await getTransactionsFromDb();
    if (!transactions) return;

    const grouped = groupByMonth(transactions);
    const months = Object.keys(grouped).sort(); // Sort keys in chronological order

    const incomes = months.map((month) => grouped[month].income);
    const expenses = months.map((month) => grouped[month].expense);

    // Format month labels, e.g., "January 2025"
    const labels = months.map((month) => {
      const dateObj = new Date(month + "-01");
      return dateObj.toLocaleString("default", { month: "long", year: "numeric" });
    });

    // Update the chart data
    incomeExpenseChart.data.labels = labels;
    incomeExpenseChart.data.datasets[0].data = incomes;
    incomeExpenseChart.data.datasets[1].data = expenses;
    incomeExpenseChart.update();
  }

  // Create the Income vs Expense Chart instance
  const incomeExpenseCtx = document.getElementById("incomeVsExpenseChartCanvas").getContext("2d");
  window.incomeExpenseChart = new Chart(incomeExpenseCtx, {
    type: "bar",
    data: {
      labels: [],
      datasets: [
        {
          label: "Income",
          data: [],
          backgroundColor: "#43a047", // Green
        },
        {
          label: "Expenses",
          data: [],
          backgroundColor: "#e53935", // Red
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  // Initial update of the Income vs Expense chart
  updateIncomeExpenseChart();
});
