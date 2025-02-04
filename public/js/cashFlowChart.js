document.addEventListener("DOMContentLoaded", function () {
    // function getTransactions() {
    //   const rows = document.querySelectorAll("#transactionHistory tbody tr");
    //   console.log("data for charts");
    //   console.log(rows);
    //   const transactions = [];
    //   let balance = 0;
  
    //   rows.forEach((row) => {
    //     const date = new Date(row.cells[0].innerText.trim());
    //     const transactionType = row.cells[1].innerText.trim();
    //     const amount = parseFloat(row.cells[2].innerText.replace(/[^0-9.-]+/g, ""));
    //     const type = row.getAttribute("data-transaction-type") || "expense";
  
    //     if (type === "income") {
    //       balance += amount;
    //     } else {
    //       balance -= amount;
    //     }
  
    //     transactions.push({ date, transactionType, amount, balance, type });
    //   });
  
    //   return transactions.sort((a, b) => a.date - b.date);
    // }
  
    async function updateCashFlowChart() {
      const transactions = await getTransactionsfromDb();
      const labels = transactions.map((t) => new Date(t.date).toISOString().split("T")[0]);
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
  

async function getTransactionsfromDb() {
    try {
      const response = await fetch("http://localhost:4000/getTransactions", {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    if (!response.ok) throw new Error("Failed to fetch transactions");

  

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error adding transaction:", error);
  }
}