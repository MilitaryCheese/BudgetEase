document.addEventListener("DOMContentLoaded", function () {
    const categoryForm = document.getElementById("categoryForm");
    const categoryTableBody = document.getElementById("categoryTableBody");
    const editCategoryForm = document.getElementById("editCategoryForm");

    // Initialize Materialize components
    M.FormSelect.init(document.querySelectorAll("select"));
    M.Modal.init(document.getElementById("editCategoryModal"));

    // Fetch and display categories
    async function loadCategories() {
        try {

            const response = await fetch("http://localhost:4000/getCategories", {
                method: "GET",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
    
            if (!response.ok) throw new Error("Failed to fetch categories");
            const categories = await response.json();

            categoryTableBody.innerHTML = "";
            categories.forEach(category => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${category.name.charAt(0).toUpperCase() + category.name.slice(1)}</td>
                    <td>${category.type.charAt(0).toUpperCase() + category.type.slice(1)}</td>
                    <td>
                        <button class="btn-small blue lighten-2 edit-btn" data-id="${category._id}" data-name="${category.name}" data-type="${category.type}">
                            <i class="material-icons">edit</i>
                        </button>
                        <button class="btn-small red lighten-2 delete-btn" data-id="${category._id}">
                            <i class="material-icons">delete</i>
                        </button>
                    </td>
                `;
                categoryTableBody.appendChild(row);
            });

            attachEventListeners();
        } catch (error) {
            console.error("Error loading categories:", error);
        }
    }

    // Add new category
    categoryForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const name = document.getElementById("categoryName").value;
        const type = document.getElementById("categoryType").value;

        try {
            const response = await fetch("http://localhost:4000/addcategories", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`, // Include auth token
                },
                body: JSON.stringify({ name, type }),
              });
          
              if (!response.ok) {
                throw new Error("Failed to add category.");
              }

            categoryForm.reset();
            M.FormSelect.init(document.querySelectorAll("select"));
            loadCategories();
        } catch (error) {
            console.error("Error adding category:", error);
        }


    });

    // Open edit modal with category data
    function openEditModal(event) {
        const button = event.target.closest(".edit-btn");
        if (!button) return;

        document.getElementById("editCategoryId").value = button.dataset.id;
        document.getElementById("editCategoryName").value = button.dataset.name;
        document.getElementById("editCategoryType").value = button.dataset.type;

        M.FormSelect.init(document.querySelectorAll("select"));
        M.Modal.getInstance(document.getElementById("editCategoryModal")).open();
    }

    // Update category
    editCategoryForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const id = document.getElementById("editCategoryId").value;
        const name = document.getElementById("editCategoryName").value;
        const type = document.getElementById("editCategoryType").value;

        try {
            const response = await fetch(`http://localhost:4000/updateCategories/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ name, type }),
            });
    
            if (!response.ok) throw new Error("Failed to update transaction");
            alert("Category updated successfully!");

            M.Modal.getInstance(document.getElementById("editCategoryModal")).close();
            loadCategories();
        } catch (error) {
            console.error("Error updating category:", error);
        }



    });

    // Delete category
    async function deleteCategory(event) {
        const button = event.target.closest(".delete-btn");
        if (!button) return;

        const id = button.dataset.id;
        if (!confirm("Are you sure you want to delete this category?")) return;

        try {
            const response = await fetch(`http://localhost:4000/delCategories/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            if (!response.ok) throw new Error("Failed to delete category");

            loadCategories();
        } catch (error) {
            console.error("Error deleting category:", error);
        }

    }

    // Attach event listeners to dynamically added buttons
    function attachEventListeners() {
        document.querySelectorAll(".edit-btn").forEach(button => button.addEventListener("click", openEditModal));
        document.querySelectorAll(".delete-btn").forEach(button => button.addEventListener("click", deleteCategory));
    }

    // Load categories on page load
    loadCategories();
});