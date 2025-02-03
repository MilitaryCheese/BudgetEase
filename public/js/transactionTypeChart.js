document.addEventListener("DOMContentLoaded", function () {
    function getTransactions() {
      const rows = document.querySelectorAll("#transactionHistory tbody tr");
      const transactions = [];
      rows.forEach((row) => {
        const transactionType = row.cells[1].innerText.trim();
        const amount = parseFloat(row.cells[2].innerText.replace(/[^0-9.-]+/g, ""));
        transactions.push({ transactionType, amount });
      });
      return transactions;
    }
  
    function groupByTransactionType(transactions) {
      const grouped = {};
      transactions.forEach((tx) => {
        if (grouped[tx.transactionType]) {
          grouped[tx.transactionType] += tx.amount;
        } else {
          grouped[tx.transactionType] = tx.amount;
        }
      });
      return grouped;
    }
  
    function updateTransactionTypeChart() {
      const transactions = getTransactions();
      const groupedData = groupByTransactionType(transactions);
      const labels = Object.keys(groupedData);
      const data = labels.map((label) => groupedData[label]);
  
      transactionTypeChart.data.labels = labels;
      transactionTypeChart.data.datasets[0].data = data;
      transactionTypeChart.update();
    }
  
    const ctx = document.getElementById("transactionTypeChartCanvas").getContext("2d");
    window.transactionTypeChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: [],
        datasets: [
          {
            label: "Transaction Type Breakdown",
            data: [],
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9C27B0"],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "left",
          },
        },
      },
    });
  
    updateTransactionTypeChart();
  });
  