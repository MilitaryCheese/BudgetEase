// Check if the user is logged in by looking for a cookie
function isLoggedIn() {
    const token = getCookie('accessToken');
    return token ? true : false;
}

// Get the value of a cookie by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Redirect to the login page if not logged in
// if (!isLoggedIn()) {
//     window.location.href = 'login.html';  // Redirect to login if not logged in
// }

// Handle logout


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
function fetchTransactions() {
    // const token = getCookie('accessToken');
    // // Assuming an API endpoint to fetch transactions (e.g., /api/user/transactions)
    // fetch('/api/user/transactions', {
    //     headers: {
    //         'Authorization': `Bearer ${token}`
    //     }
    // })
    // .then(response => response.json())
    // .then(data => {
    //     const tableBody = document.getElementById('transactionTable').getElementsByTagName('tbody')[0];
    //     data.forEach(transaction => {
    //         const row = tableBody.insertRow();
    //         row.innerHTML = `
    //             <td>${transaction.date}</td>
    //             <td>${transaction.description}</td>
    //             <td>$${transaction.amount}</td>
    //             <td>${transaction.category}</td>
    //         `;
    //     });
    // })
    // .catch(error => {
    //     console.error('Error fetching transactions:', error);
    // });
}

// Initialize the dashboard by fetching data
function initializeDashboard() {
    fetchBudgetSummary();
    fetchTransactions();
}

// Initialize the page when it loads
window.onload = function() {
    initializeDashboard();
};