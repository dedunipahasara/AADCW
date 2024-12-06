$(document).ready(function () {
    const token = localStorage.getItem("authToken");

    // Ensure a valid token is present
    if (!token) {
        Swal.fire({
            icon: 'error',
            title: 'Authentication Error',
            text: 'No authentication token found!',
        });
        return;
    }

    // Fetch and populate staff data
    function fetchStaffData() {
        $.ajax({
            url: "http://localhost:8082/greenshadow/api/v1/staffs",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            },
            success: function (staffList) {
                populateStaffTable(staffList);
            },
            error: function (xhr) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: xhr.responseJSON?.message || 'Failed to fetch staff data.',
                });
            }
        });
    }

    // Populate the staff table
    function populateStaffTable(staffList) {
        const staffTableBody = $("#staffTable tbody");
        staffTableBody.empty(); // Clear existing table rows

        staffList.forEach(staff => {
            staffTableBody.append(`
                <tr>
                    <td>${staff.staffId}</td>
                    <td>${staff.firstName}</td>
                    <td>${staff.lastName}</td>
                    <td>${staff.gender}</td>
                    <td>${staff.designation}</td>
                    <td>${staff.email}</td>
                    <td>${staff.dob}</td>
                    <td>${staff.address}</td>
                    <td>${staff.contact}</td>
                    <td>${staff.joinDate}</td>
                    <td>${staff.role}</td>
                </tr>
            `);
        });
    }

    // Sort staff data
    function sortStaffData(sortBy, order) {
        $.ajax({
            url: "http://localhost:8082/greenshadow/api/v1/staffs",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            },
            success: function (staffList) {
                // Sort staff data
                staffList.sort((a, b) => {
                    let comparisonValue = a[sortBy].localeCompare(b[sortBy]);
                    if (order === "desc") comparisonValue *= -1;
                    return comparisonValue;
                });
                populateStaffTable(staffList); // Update table
            },
            error: function (xhr) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: xhr.responseJSON?.message || 'Failed to fetch staff data.',
                });
            }
        });
    }

    // Populate the form with row data when a row is clicked
    $("#staffTable tbody").on("click", "tr", function () {
        const selectedRow = $(this);

        // Extract row data
        $("#staffId").val(selectedRow.find("td:nth-child(1)").text()).prop("readonly", true);
        $("#firstName").val(selectedRow.find("td:nth-child(2)").text());
        $("#lastName").val(selectedRow.find("td:nth-child(3)").text());
        $("#gender").val(selectedRow.find("td:nth-child(4)").text());
        $("#designation").val(selectedRow.find("td:nth-child(5)").text());
        $("#email").val(selectedRow.find("td:nth-child(6)").text());
        $("#dob").val(selectedRow.find("td:nth-child(7)").text());
        $("#address").val(selectedRow.find("td:nth-child(8)").text());
        $("#contact").val(selectedRow.find("td:nth-child(9)").text());
        $("#joinDate").val(selectedRow.find("td:nth-child(10)").text());
        $("#role").val(selectedRow.find("td:nth-child(11)").text());
    });

    // Save staff data
    $("#staffForm").on("submit", function (event) {
        event.preventDefault();

        const staffData = {
            staffId: $("#staffId").val(),
            firstName: $("#firstName").val(),
            lastName: $("#lastName").val(),
            gender: $("#gender").val(),
            designation: $("#designation").val(),
            email: $("#email").val(),
            dob: $("#dob").val(),
            address: $("#address").val(),
            contact: $("#contact").val(),
            joinDate: $("#joinDate").val(),
            role: $("#role").val(),
        };

        $.ajax({
            url: "http://localhost:8082/greenshadow/api/v1/staffs",
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            data: JSON.stringify(staffData),
            success: function () {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Staff saved successfully!',
                });
                fetchStaffData();
                $("#staffForm")[0].reset(); // Clear the form
            },
            error: function (xhr) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: xhr.responseJSON?.message || 'Failed to save staff data.',
                });
            }
        });
    });

    // Update staff data
    $(".btn-update").on("click", function () {
        const staffId = $("#staffId").val();
        if (!staffId) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Staff ID is required to update!',
            });
            return;
        }

        const staffData = {
            firstName: $("#firstName").val(),
            lastName: $("#lastName").val(),
            gender: $("#gender").val(),
            designation: $("#designation").val(),
            email: $("#email").val(),
            dob: $("#dob").val(),
            address: $("#address").val(),
            contact: $("#contact").val(),
            joinDate: $("#joinDate").val(),
            role: $("#role").val(),
        };

        $.ajax({
            url: `http://localhost:8082/greenshadow/api/v1/staffs/${staffId}`,
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            data: JSON.stringify(staffData),
            success: function () {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Staff updated successfully!',
                });
                fetchStaffData();
                $("#staffForm")[0].reset(); // Clear the form
                $("#staffId").prop("readonly", false);
            },
            error: function (xhr) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: xhr.responseJSON?.message || 'Failed to update staff data.',
                });
            }
        });
    });

    // Delete staff data
    $(".btn-delete").on("click", function () {
        const staffId = $("#staffId").val();
        if (!staffId) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Staff ID is required to delete!',
            });
            return;
        }

        Swal.fire({
            title: 'Are you sure?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `http://localhost:8082/greenshadow/api/v1/staffs/${staffId}`,
                    method: "DELETE",
                    headers: {
                        "Authorization": "Bearer " + token
                    },
                    success: function () {
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: 'Staff deleted successfully!',
                        });
                        fetchStaffData();
                        $("#staffForm")[0].reset(); // Clear the form
                        $("#staffId").prop("readonly", false);
                    },
                    error: function (xhr) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: xhr.responseJSON?.message || 'Failed to delete staff.',
                        });
                    }
                });
            }
        });
    });

    // Handle sort selection changes
    $("#sortBy, #order").change(function () {
        const sortBy = $("#sortBy").val();
        const order = $("#order").val();
        sortStaffData(sortBy, order);
    });

    // Initialize
    fetchStaffData();
});
