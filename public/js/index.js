// Check if the user is logged in by looking for a cookie
function isLoggedIn() {
    const token = getCookie('refreshToken');
    return token ? true : false;
}

// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}  

// Get the value of a cookie by name
function getCookie(name) {
    console.log("1"); // Debugging
    const value = `; ${document.cookie}`;
    console.log(value); // Debugging: Show the cookies in the console
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        const cookieValue = parts.pop().split(';').shift();
        console.log(`Cookie Found: ${name} = ${cookieValue}`); // Debugging
        return cookieValue;
    }
    console.log(`Cookie Not Found: ${name}`);
    return null; // Explicitly return null if the cookie is not found
}

// Redirect to the login page if not logged in
// if (!isLoggedIn()) {
//     console.log(document.cookie);
//     console.log("not logged");
//     // window.location.href = 'login.html';  // Redirect to login if not logged in
// }else{
//     console.log(document.cookie);
//     console.log("logged");
// }

// Handle logout

// fetchUserData();

// Fetch and display the user's budget summary
function fetchUserData() {

    // Fetch user data from localStorage
    const userEmail = localStorage.getItem("userEmail");
    const userFirstName = localStorage.getItem("userFirstName");
    const userLastName = localStorage.getItem("userLastName");

    // Update the profile section
    document.getElementById("userProfile").innerHTML = `
    <h2>User Profile</h2>
    <p><strong>Name:</strong> ${userFirstName} ${userLastName}</p>
    <p><strong>Email:</strong> ${userEmail}</p>
    `;

    // Optional: You can also update the Budget Summary or other sections with dynamic data.
    document.getElementById("budgetSummary").innerHTML = `
    <h2>Budget Summary</h2>
    <p>Total Income: $5000</p>
    <p>Total Expenses: $3000</p>
    <p>Remaining Balance: $2000</p>
    `;
    // const token = getCookie('accessToken');

    // const response = await fetch("http://localhost:4000/register", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(payload)
    // });
    
    // // Assuming an API endpoint to get the budget summary (e.g., /api/user/budget-summary)
    // fetch('/api/user/budget-summary', {
    //     headers: {
    //         'Authorization': `Bearer ${token}`
    //     }
    // })
    // .then(response => response.json())
    // .then(data => {
    //     const budgetData = document.getElementById('budgetData');
    //     budgetData.innerHTML = `
    //         <p>Monthly Budget: $${data.monthlyBudget}</p>
    //         <p>Current Balance: $${data.balance}</p>
    //     `;
    // })
    // .catch(error => {
    //     console.error('Error fetching budget summary:', error);
    // });
}

// Fetch and display the user's budget summary
function fetchBudgetSummary() {
    // const token = getCookie('accessToken');
    // // Assuming an API endpoint to get the budget summary (e.g., /api/user/budget-summary)
    // fetch('/api/user/budget-summary', {
    //     headers: {
    //         'Authorization': `Bearer ${token}`
    //     }
    // })
    // .then(response => response.json())
    // .then(data => {
    //     const budgetData = document.getElementById('budgetData');
    //     budgetData.innerHTML = `
    //         <p>Monthly Budget: $${data.monthlyBudget}</p>
    //         <p>Current Balance: $${data.balance}</p>
    //     `;
    // })
    // .catch(error => {
    //     console.error('Error fetching budget summary:', error);
    // });
}

// Fetch and display transaction history
async function fetchTransactions() {
    console.log("fetching transactions");
    try {
        // Fetch all transactions for the user
        const response = await fetch("http://localhost:4000/getTransactions", {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,  // Pass JWT token if needed
          },
        });
        const transactions = await response.json();

        // Initialize variables for total income, expense, and budget
        let totalIncome = 0;
        let totalExpense = 0;
        let totalBudget = 0;

        
    
        // For each transaction, get the category name and populate the table
        const transactionTableBody = document.querySelector('#transactionHistory tbody');
        transactionTableBody.innerHTML = ''; // Clear any existing rows
    
        for (const transaction of transactions) {
          // Fetch category by categoryId
          const categoryResponse = await fetch(`http://localhost:4000/getCategoriesID/${transaction.category}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Pass JWT token if needed
            },
          });
          const category = await categoryResponse.json();
    
          // Add row to transaction table
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${new Date(transaction.date).toLocaleDateString()}</td>
            <td>${capitalizeFirstLetter(category.type)}</td>
            <td>$${transaction.amount}</td>
            <td>${capitalizeFirstLetter(category.name)}</td>
          `;
          transactionTableBody.appendChild(row);

          // Determine if the transaction is income or expense based on category
            if (category.type === 'income') {
                totalIncome += transaction.amount;
            } else if (category.type === 'expense') {
                totalExpense += transaction.amount;
            }
        }
        // Calculate total budget (Income - Expenses)
        totalBudget = totalIncome - totalExpense;

        console.log("total budget" + totalBudget);
        console.log("total income" + totalIncome);
        console.log("total expense" + totalExpense);

        // Update the budget summary section
        document.getElementById("budgetSummary").innerHTML = `
        <h2>Budget Summary</h2>
        <p>Total Income: $${totalIncome.toFixed(2)}</p>
        <p>Total Expenses: $${totalExpense.toFixed(2)}</p>
        <p>Remaining Balance: $${totalBudget.toFixed(2)}</p>
    `;

      } catch (err) {
        console.error('Error fetching transactions:', err);
      }
}



document.getElementById("addTransactionBtn").onclick = function () {
    window.location.href = "transaction.html";
};
document.getElementById("editTransactionBtn").onclick = function () {
  window.location.href = "editTransactions.html";
};



// Initialize the dashboard by fetching data
function initializeDashboard() {
    fetchUserData();
    fetchBudgetSummary();
    fetchTransactions();
}

// Initialize the page when it loads
window.onload = function() {
    initializeDashboard();
};