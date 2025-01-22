document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent the form from refreshing the page

    // Get form data
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Construct the payload
    const payload = { email, password };

    try {
        // Call the login endpoint
        const response = await fetch("http://localhost:4000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload), // Convert payload to JSON
        });

        // Handle the response
        if (response.ok) {
            const data = await response.json();
            alert("Login successful!");

            // Save token or user data to local storage (if applicable)
            localStorage.setItem("authToken", data.token); // Example if a token is provided

            // Redirect the user (e.g., to a dashboard page)
            window.location.href = "index.html";
        } else {
            const error = await response.json();
            alert(`Error: ${error.message || "Login failed"}`);
        }
    } catch (err) {
        console.error("Error during login:", err);
        alert("An error occurred. Please try again.");
    }
});
