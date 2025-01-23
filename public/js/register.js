document.getElementById("registerForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent form from refreshing the page

    // Get form data
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Construct the payload
    const payload = {
        firstName,
        lastName,
        email,
        password
    };

    try {
        // Call the register endpoint
        const response = await fetch("http://localhost:4000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        // Check response status
        if (response.ok) {
            const data = await response.json();
            alert("Registration successful!");
            window.location.href = "login.html"; // Redirect to login page
        } else {
            const error = await response.json();
            alert(`Error: ${error.message || "Registration failed"}`);
        }
    } catch (err) {
        console.error("Error during registration:", err);
        alert("An error occurred. Please try again.");
    }
});
