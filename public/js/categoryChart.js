document.addEventListener("DOMContentLoaded", async function () {
  // Fetch category names
  async function getCategories() {
    try {
      const response = await fetch("http://localhost:4000/getCategories", {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch categories");

      const result = await response.json(); 
      return result;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return null;
    }
  }

  // Function to group transactions by category name
  function groupByCategory(transactions, categoryMap) {
    const grouped = {};

    transactions.forEach((tx) => {
      const categoryName = categoryMap[tx.category] || "Unknown"; // Use category name instead of ID
      if (grouped[categoryName]) {
        grouped[categoryName] += tx.amount;
      } else {
        grouped[categoryName] = tx.amount;
      }
    });

    return grouped;
  }

  // Fetch transactions and update chart
  async function updateCategoryChart() {
    const transactions = await getTransactionsFromDb();
    const categories = await getCategories();

    if (!transactions || !categories) return;

    // Convert category array to a lookup object { _id: name }
    const categoryMap = {};
    categories.forEach((cat) => {
      categoryMap[cat._id] = cat.name; // Use `_id` as the key
    });

    const groupedData = groupByCategory(transactions, categoryMap);
    const labels = Object.keys(groupedData); // Category names instead of IDs
    const data = labels.map((label) => groupedData[label]);

    categoryChart.data.labels = labels; // Set chart labels as category names
    categoryChart.data.datasets[0].data = data;
    categoryChart.update();
  }

  const ctx = document.getElementById("categoryChartCanvas").getContext("2d");
  window.categoryChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: [],
      datasets: [
        {
          label: "Category Breakdown",
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

  updateCategoryChart();
});

// Function to fetch transactions
async function getTransactionsFromDb() {
  try {
    const response = await fetch("http://localhost:4000/getTransactions", {
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    if (!response.ok) throw new Error("Failed to fetch transactions");

    const result = await response.json(); // Expected format: [{ id: 1, category: "67a1573e4e301dba13afc98c", amount: 50 }]
    return result;
  } catch (error) {
    console.error("Error fetching transactions:", error);
  }
}
