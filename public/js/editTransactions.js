let allCategories = [];

document.addEventListener("DOMContentLoaded", async () => {
    M.Modal.init(document.querySelectorAll(".modal")); // Initialize Materialize modal
    await populateCategories();
    await loadTransactions();
});

// Load transactions and display them in the table
async function loadTransactions() {
    try {
        const response = await fetch("http://localhost:4000/getTransactions", {
            method: "GET",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!response.ok) throw new Error("Failed to fetch transactions");

        const transactions = await response.json();
        const tableBody = document.getElementById("transactionsTableBody");
        tableBody.innerHTML = ""; // Clear existing rows

        transactions.forEach((transaction) => {
            
            console.log(allCategories);
            // Find the category name from the global allCategories array
            const category = allCategories.find(cat => cat._id === transaction.category);

            const categoryName = category ? category.name : "Unknown Category";

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${new Date(transaction.date).toLocaleDateString()}</td>
                <td>${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}</td>
                <td>${transaction.amount}</td>
                <td>${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</td>
                <td>
                    <button class="btn-small edit-btn" data-id="${transaction._id}" data-amount="${transaction.amount}" data-category="${transaction.category._id}">
                        <i class="material-icons">edit</i>
                    </button>
                    <button class="btn-small red delete-btn" data-id="${transaction._id}">
                        <i class="material-icons">delete</i>
                    </button>
                </td>
            `;

            tableBody.appendChild(row);
        });

        // Add event listeners to edit and delete buttons
        document.querySelectorAll(".edit-btn").forEach((button) =>
            button.addEventListener("click", openEditModal)
        );
        document.querySelectorAll(".delete-btn").forEach((button) =>
            button.addEventListener("click", deleteTransaction)
        );
    } catch (error) {
        console.error("Error loading transactions:", error);
    }
}

// Open edit modal and populate fields
function openEditModal(event) {
    const button = event.target;
    const transactionId = button.dataset.id;
    const amount = button.dataset.amount;
    const categoryId = button.dataset.category;

    document.getElementById("editTransactionId").value = transactionId;
    document.getElementById("editAmount").value = amount;

    // Set the category dropdown value
    document.getElementById("editCategoryDropdown").value = categoryId;
    M.FormSelect.init(document.getElementById("editCategoryDropdown"));

    // Open the modal
    const modal = M.Modal.getInstance(document.getElementById("editTransactionModal"));
    modal.open();
}

// Update transaction on form submit
document.getElementById("editTransactionForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const transactionId = document.getElementById("editTransactionId").value;
    const newAmount = document.getElementById("editAmount").value;
    const newCategory = document.getElementById("editCategoryDropdown").value;

    try {
        const response = await fetch(`http://localhost:4000/updateTransactions/${transactionId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ amount: newAmount, category: newCategory }),
        });

        if (!response.ok) throw new Error("Failed to update transaction");

        alert("Transaction updated successfully!");
        M.Modal.getInstance(document.getElementById("editTransactionModal")).close();
        await loadTransactions(); // Refresh transactions
    } catch (error) {
        console.error("Error updating transaction:", error);
    }
});

// Delete transaction
async function deleteTransaction(event) {
    const transactionId = event.target.dataset.id;

    if (!confirm("Are you sure you want to delete this transaction?")) return;

    try {
        const response = await fetch(`http://localhost:4000/delTransactions/${transactionId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!response.ok) throw new Error("Failed to delete transaction");

        alert("Transaction deleted successfully!");
        await loadTransactions(); // Refresh transactions
    } catch (error) {
        console.error("Error deleting transaction:", error);
    }
}

// Populate categories in the edit dropdown
async function populateCategories() {
    try {
        const response = await fetch("http://localhost:4000/getCategories", {
            method: "GET",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!response.ok) throw new Error("Failed to fetch categories");

        allCategories = await response.json();
        console.log("all categories");
        console.log(allCategories);
        const categoryDropdown = document.getElementById("editCategoryDropdown");
        categoryDropdown.innerHTML = `<option value="" disabled selected>Choose a category</option>`;

        allCategories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category._id;
            option.textContent = `${category.name} (${category.type})`;
            categoryDropdown.appendChild(option);
        });

        M.FormSelect.init(categoryDropdown); // Reinitialize Materialize select
    } catch (error) {
        console.error("Error loading categories:", error.message);
    }
}