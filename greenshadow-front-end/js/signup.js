document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signupForm");

    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Get user input
        const email = document.getElementById("signupEmail").value.trim();
        const password = document.getElementById("signupPassword").value.trim();
        const role = document.getElementById("signupRole").value;

        // Validate inputs
        if (!email || !password || !role) {
            alert("Please fill out all fields.");
            return;
        }

        try {
            // Send POST request to the server for signup
            const response = await fetch("http://localhost:8082/greenshadow/api/v1/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password, role }),
            });

            if (!response.ok) {
                throw new Error("Signup failed. Please try again.");
            }

            const data = await response.json();

            // Display success message
            alert("Signup successful! You can now log in.");
            // Redirect to login page
            window.location.href = "/login.html"; // Replace with your login page URL
        } catch (error) {
            console.error("Error during signup:", error);
            alert(error.message || "An error occurred during signup.");
        }
    });
});
