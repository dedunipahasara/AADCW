$(document).ready(function () {
    // Default CSS styles for hiding and showing sections
    var css1 = { display: "none" };
    var css2 = { display: "block" };

    // Function to show a specific section and hide others
    function showSection(sectionId) {
        $("section").css(css1); // Hide all sections
        $(`#${sectionId}`).css(css2); // Show the targeted section
    }

    // Function to handle navigation clicks and update title
    function handleNavClick(clickedElementId, title) {
        $(".dashboard-topic").text(title); // Update the topic text dynamically
        switch (clickedElementId) {
            case "nav-dashboard":
                showSection("dashboardSection");
                break;
            case "nav-staff":
                showSection("staffSection");
                break;
            case "nav-field":
                showSection("fieldSection");
                break;
            case "nav-crop":
                showSection("cropSection");
                break;
            case "nav-logs":
                showSection("logSection");
                break;
            case "nav-equipment":
                showSection("equipmentSection");
                break;
            case "nav-vehicles":
                showSection("vehicleSection");
                break;
            case "nav-profile":
                showSection("profileSection");
                break;
        }
    }

    // Set up click listeners for navigation items
    $("#nav-dashboard").click(function () {
        handleNavClick($(this).attr("id"), "Dashboard");
    });
    $("#nav-staff").click(function () {
        handleNavClick($(this).attr("id"), "Staff Management");
    });
    $("#nav-field").click(function () {
        handleNavClick($(this).attr("id"), "Field Management");
    });
    $("#nav-crop").click(function () {
        handleNavClick($(this).attr("id"), "Crop Management");
    });
    $("#nav-logs").click(function () {
        handleNavClick($(this).attr("id"), "Monitoring Logs");
    });
    $("#nav-equipment").click(function () {
        handleNavClick($(this).attr("id"), "Equipment Management");
    });
    $("#nav-vehicles").click(function () {
        handleNavClick($(this).attr("id"), "Vehicle Management");
    });

    // Initially check if the user is logged in
    if (localStorage.getItem("authToken")) {
        // Hide login section, show navbar, and display the dashboard
        $("#loginSection").show();
        $("#mainNavbar").hide();
        showSection("loginSection");
    } else {
        // Show login section and hide navbar
        $("#loginSection").show();
        $("#mainNavbar").hide();
    }

     // Handle the login form submission
     $("#loginForm").submit(async function (event) {
        event.preventDefault();

        const email = $("#loginEmail").val().trim();
        const password = $("#loginPassword").val().trim();

        if (!email || !password) {
            Swal.fire({
                iconHtml: "<i class='bx bxs-bug-alt' style='color: red; font-size: 24px;'></i>",
                title: "Incomplete Fields",
                text: "Please fill in both email and password.",
                showConfirmButton: true,
                confirmButtonColor: "#d33",
            });
            return;
        }

        try {
            const response = await fetch("http://localhost:8082/greenshadow/api/v1/auth/signIn", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            const data = await response.json();
            if (data.token) {
                localStorage.setItem("authToken", data.token);
                Swal.fire({
                    iconHtml: "<i class='bx bxs-leaf' style='color: green; font-size: 24px;'></i>",
                    title: "Login Successful",
                    text: "Redirecting to your dashboard... 😇",
                    showConfirmButton: false,
                    timer: 2000,
                });

                setTimeout(() => {
                    $("#loginSection").hide();
                    $("#mainNavbar").show();
                    showSection("dashboardSection");
                }, 2000);
            } else {
                throw new Error("Unexpected response format.");
            }
        } catch (error) {
            Swal.fire({
                iconHtml: "<i class='bx bxs-bug-alt' style='color: red; font-size: 24px;'></i>",
                title: "Login Failed",
                text: error.message || "An error occurred. Please try again.",
                showConfirmButton: true,
                confirmButtonColor: "#d33",
            });
        }
    });
});
