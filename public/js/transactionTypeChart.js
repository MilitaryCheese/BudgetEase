document.addEventListener("DOMContentLoaded", function () {
  
    function groupByTransactionType(transactions) {
      const grouped = {};
        transactions.forEach((tx) => {
            if (grouped[tx.type]) {
                grouped[tx.type] += tx.amount;
            } else {
                grouped[tx.type] = tx.amount;
            }
        });
        return grouped;
    }
  
    async function updateTransactionTypeChart() {
      const transactions = await getTransactionsfromDb();
        if (!transactions) return;
      console.log(transactions);
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