document.addEventListener("DOMContentLoaded", function () {
    function getTransactions() {
      const rows = document.querySelectorAll("#transactionHistory tbody tr");
      const transactions = [];
      let balance = 0;
  
      rows.forEach((row) => {
        const date = new Date(row.cells[0].innerText.trim());
        const transactionType = row.cells[1].innerText.trim();
        const amount = parseFloat(row.cells[2].innerText.replace(/[^0-9.-]+/g, ""));
        const type = row.getAttribute("data-transaction-type") || "expense";
  
        if (type === "income") {
          balance += amount;
        } else {
          balance -= amount;
        }
  
        transactions.push({ date, transactionType, amount, balance, type });
      });
  
      return transactions.sort((a, b) => a.date - b.date);
    }
  
    function updateCashFlowChart() {
      const transactions = getTransactions();
      const labels = transactions.map((t) => t.date.toISOString().split("T")[0]);
      const data = transactions.map((t) => t.balance);
  
      cashFlowChart.data.labels = labels;
      cashFlowChart.data.datasets[0].data = data;
      cashFlowChart.update();
    }
  
    const ctx = document.getElementById("cashFlowChartCanvas").getContext("2d");
    window.cashFlowChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Cash Flow",
            data: [],
            borderColor: "#36A2EB",
            backgroundColor: "rgba(54, 162, 235, 0.3)", // Light blue shaded area
            fill: true, // Fills the area under the line
            tension: 0.4, // Smooths the line slightly
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Date",
            },
          },
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: "Balance",
            },
          },
        },
      },
    });
  
    updateCashFlowChart();
  });
  