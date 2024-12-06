$(document).ready(function () {
    const token = localStorage.getItem("authToken");

    if (!token) {
        Swal.fire({
            icon: 'error',
            title: 'Authentication Error',
            text: 'No authentication token found!',
        });
        return;
    }

    // Fetch and display staff data
    function fetchStaffData() {
        $.ajax({
            url: "http://localhost:8082/greenshadow/api/v1/staffs", // Staff API URL
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
            },
            success: function (staffList) {
                populateStaffTable(staffList);

                // Update total staff count
                const totalStaff = staffList.length;
                $("#totalStaff").text(`Total Staff: ${totalStaff}`);
            },
            error: function (xhr) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: xhr.responseJSON?.message || "Failed to fetch staff data.",
                });
            },
        });
    }

    // Fetch and display field data
    function fetchFieldData() {
        $.ajax({
            url: "http://localhost:8082/greenshadow/api/v1/fields", // Fields API URL
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
            },
            success: function (fieldList) {
                populateFieldTable(fieldList);

                // Update total fields count
                const totalFields = fieldList.length;
                $("#totalFields").text(`Total Fields: ${totalFields}`);
            },
            error: function (xhr) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: xhr.responseJSON?.message || "Failed to fetch field data.",
                });
            },
        });
    }

    // Fetch and display crop data
    function fetchCropData() {
        $.ajax({
            url: "http://localhost:8082/greenshadow/api/v1/crops", // Crops API URL
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
            },
            success: function (cropList) {
                populateCropTable(cropList);

                // Update total crops count
                const totalCrops = cropList.length;
                $("#totalCrops").text(`Total Crops: ${totalCrops}`);
            },
            error: function (xhr) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: xhr.responseJSON?.message || "Failed to fetch crop data.",
                });
            },
        });
    }

    // Example functions to populate tables
    function populateStaffTable(staffList) {
        console.log("Populating staff table:", staffList);
        // Add code to populate the staff table in the UI
    }

    function populateFieldTable(fieldList) {
        console.log("Populating field table:", fieldList);
        // Add code to populate the field table in the UI
    }

    function populateCropTable(cropList) {
        console.log("Populating crop table:", cropList);
        // Add code to populate the crop table in the UI
    }

    // Initialize data fetching
    fetchStaffData();
    fetchFieldData();
    fetchCropData();
});
