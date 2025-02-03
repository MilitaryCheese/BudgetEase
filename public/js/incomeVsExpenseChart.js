document.addEventListener("DOMContentLoaded", function () {
  // Helper function to extract transactions from the table.
  function getTransactions() {
    const rows = document.querySelectorAll("#transactionHistory tbody tr");
    const transactions = [];
    rows.forEach((row) => {
      const dateStr = row.cells[0].innerText.trim();
      const date = new Date(dateStr);
      const amountStr = row.cells[2].innerText.trim();
      const amount = parseFloat(amountStr.replace(/[^0-9.-]+/g, ""));
      // Try to get the type from a data attribute; if not present, use a simple heuristic.
      const type =
        row.getAttribute("data-transaction-type") ||
        (row.cells[1].innerText.toLowerCase().includes("salary")
          ? "income"
          : "expense");
      transactions.push({ date, amount, type });
    });
    return transactions;
  }

  // Group transactions by month (formatted as "YYYY-MM") and sum incomes and expenses.
  function groupByMonth(transactions) {
    const grouped = {};
    transactions.forEach((tx) => {
      const monthKey =
        tx.date.getFullYear() +
        "-" +
        String(tx.date.getMonth() + 1).padStart(2, "0");
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

  // Update the Income vs Expense Chart based on current table data.
  function updateIncomeExpenseChart() {
    const transactions = getTransactions();
    const grouped = groupByMonth(transactions);
    const months = Object.keys(grouped).sort(); // Sort keys in chronological order.

    const incomes = months.map((month) => grouped[month].income);
    const expenses = months.map((month) => grouped[month].expense);

    // Format month labels nicely, e.g. "January 2025"
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

  // Create the Income vs Expense Chart instance with empty data.
  const incomeExpenseCtx = document
    .getElementById("incomeVsExpenseChartCanvas")
    .getContext("2d");
  window.incomeExpenseChart = new Chart(incomeExpenseCtx, {
    type: "bar",
    data: {
      labels: [],
      datasets: [
        {
          label: "Income",
          data: [],
          backgroundColor: "#43a047",
        },
        {
          label: "Expenses",
          data: [],
          backgroundColor: "#e53935",
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

  // Initial update of the Income vs Expense chart.
  updateIncomeExpenseChart();
});
