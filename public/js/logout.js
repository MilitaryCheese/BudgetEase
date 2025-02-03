document.getElementById("logoutButton").addEventListener("click", async function () {
    try {
        // Call the logout API
        const response = await fetch("http://localhost:4000/logout", {
            method: "POST", // Adjust the method if your API uses a different HTTP method
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            alert("You have been logged out successfully.");

            // Redirect to login page
            window.location.href = "login.html";
        } else {
            // Handle API response errors
            const error = await response.json();
            alert(`Failed to logout: ${error.message || "Unknown error"}`);
        }
    } catch (err) {
        // Handle network or other errors
        console.error("Error during logout:", err);
        alert("An error occurred while logging out. Please try again.");
        window.location.href = "login.html";
    }
});
