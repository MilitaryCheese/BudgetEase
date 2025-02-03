const form = document.getElementById("transactionForm");
const tableBody = document.getElementById("transactionsTableBody");
let allCategories = [];

document.addEventListener("DOMContentLoaded", async () => {
  M.FormSelect.init(document.querySelectorAll("select"));
  await populateCategories();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("categoryDropdown").value;

  if (!amount || !category) {
    alert("Amount and category are required.");
    return;
  }
  console.log(category);

    // Find the selected category to get its type (income/expense)
    const selectedCategory = allCategories.find(cat => cat._id === category);
    if (!selectedCategory) {
      alert("Invalid category selected.");
      return;
    }
    const type = selectedCategory.type; // Get the type from the category

  try {
    const response = await fetch("http://localhost:4000/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Include auth token
      },
      body: JSON.stringify({ amount, type, category }),
    });

    if (!response.ok) {
      throw new Error("Failed to add transaction");
    }

    const result = await response.json();
    alert(result.message); // Notify user

    document.getElementById("transactionForm").reset(); // Reset form
    setDefaultDate(); // Reset date field
    await loadTransactions(); // Refresh transaction table
  } catch (error) {
    console.error("Error adding transaction:", error);
  }



  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${date}</td>
    <td>${description}</td>
    <td>${amount}</td>
    <td>${category}</td>
  `;

  tableBody.appendChild(row);

  // Reset the form after submission
  form.reset();
});

async function addTransaction() {
  const amount = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value;
  console.log(category);

  if (!amount || !category || !type) {
    alert("Amount, type and category are required.");
    return;
  }

  // Find the selected category to get its type (income/expense)
  const selectedCategory = allCategories.find(cat => cat._id === categoryId);
  if (!selectedCategory) {
    alert("Invalid category selected.");
    return;
  }
  const type = selectedCategory.type; // Get the type from the category

  try {
    const response = await fetch("http://localhost:4000/addTransaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Include auth token
      },
      body: JSON.stringify({ date, amount, type, category }),
    });

    if (!response.ok) {
      throw new Error("Failed to add transaction");
    }

    const result = await response.json();
    alert(result.message); // Notify user

    document.getElementById("transactionForm").reset(); // Reset form
    setDefaultDate(); // Reset date field
    await loadTransactions(); // Refresh transaction table
  } catch (error) {
    console.error("Error adding transaction:", error);
  }
}


async function populateCategories() {
  try {
    const response = await fetch("http://localhost:4000/getCategories", {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,  // Pass JWT token if needed
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    allCategories = await response.json();
    const categoryDropdown = document.getElementById("categoryDropdown");
    categoryDropdown.innerHTML = `<option value="" disabled selected>Choose a category</option>`;


    // Populate dropdown with categories
    
    allCategories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category._id;
      option.textContent = category.name.charAt(0).toUpperCase() + category.name.slice(1); // Capitalize first letter
      categoryDropdown.appendChild(option);
    });

    // Reinitialize Materialize select component
    M.FormSelect.init(categoryDropdown);
  } catch (error) {
    console.error("Error loading categories:", error.message);
  }
}
