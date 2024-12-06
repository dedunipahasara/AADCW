$(document).ready(function () {
    const token = localStorage.getItem("authToken");

    // Check authentication
    if (!token) {
        Swal.fire({
            icon: "error",
            title: "Authentication Error",
            text: "No authentication token found!",
        });
        return;
    }

    // Fetch all fields and populate the table
    function fetchFieldData() {
        $.ajax({
            url: "http://localhost:8082/greenshadow/api/v1/fields",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
            },
            success: function (fieldList) {
                populateFieldTable(fieldList);
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

    // Populate the field table
    function populateFieldTable(fieldList) {
        const fieldTableBody = $("#filedTable tbody");
        fieldTableBody.empty();

        if (fieldList.length === 0) {
            fieldTableBody.append("<tr><td colspan='8'>No fields available.</td></tr>");
            return;
        }

        fieldList.forEach((field) => {
            const staffIds = field.staffIds && field.staffIds.length > 0
                ? field.staffIds.join(", ")
                : "No Staff Assigned";

            fieldTableBody.append(`
                <tr data-field-id="${field.fieldId}">
                    <td>${field.fieldId}</td>
                    <td>${field.name}</td>
                    <td>${field.location}</td>
                    <td>${field.size}</td>
                    <td><img src="data:image/jpeg;base64,${field.image1}" alt="Image 1" width="50" height="50" /></td>
                    <td><img src="data:image/jpeg;base64,${field.image2}" alt="Image 2" width="50" height="50" /></td>
                    <td>${staffIds}</td>
                </tr>
            `);
        });

        // Click handler for table rows
        $("#filedTable tbody tr").on("click", function () {
            const fieldId = $(this).data("field-id");
            fetchFieldById(fieldId);
        });
    }

    // Fetch field details by ID and populate the form
    function fetchFieldById(fieldId) {
        $.ajax({
            url: `http://localhost:8082/greenshadow/api/v1/fields/${fieldId}`,
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
            },
            success: function (field) {
                $("#fieldId").val(field.fieldId).prop("readonly", true);
                $("#name").val(field.name);
                $("#location").val(field.location);
                $("#size").val(field.size);

                // Populate the staff dropdown with the selected staff
                $("#staffCode").val(field.staffIds[0] || "");

                // Image previews
                if (field.image1) {
                    $("#imagePreview1").attr("src", `data:image/jpeg;base64,${field.image1}`).show();
                } else {
                    $("#imagePreview1").hide();
                }
                if (field.image2) {
                    $("#imagePreview2").attr("src", `data:image/jpeg;base64,${field.image2}`).show();
                } else {
                    $("#imagePreview2").hide();
                }

                Swal.fire({
                    icon: "info",
                    title: "Field Selected",
                    text: `Details for Field ID ${field.fieldId} are loaded.`,
                });
            },
            error: function (xhr) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: xhr.responseJSON?.message || "Failed to fetch field details.",
                });
            },
        });
    }

    // Fetch staff dropdown data
    function fetchStaffDropdown() {
        $.ajax({
            url: "http://localhost:8082/greenshadow/api/v1/staffs",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
            },
            success: function (staffList) {
                const staffDropdown = $("#staffCode");
                staffDropdown.empty();
                staffDropdown.append('<option value="">Select Staff</option>');
                staffList.forEach((staff) => {
                    staffDropdown.append(
                        `<option value="${staff.staffId}">${staff.firstName} - ${staff.staffId}</option>`
                    );
                });
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

    // Image preview handling
    function setupImagePreview(inputSelector, previewSelector) {
        $(inputSelector).on("change", function (e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    $(previewSelector).attr("src", e.target.result).show();
                };
                reader.readAsDataURL(file);
            }
        });
    }
    setupImagePreview("#image1", "#imagePreview1");
    setupImagePreview("#image2", "#imagePreview2");

    // Save new field
    $("#fieldForm").on("submit", function (event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append(
            "fieldData",
            JSON.stringify({
                fieldId: $("#fieldId").val(),
                name: $("#name").val(),
                location: $("#location").val(),
                size: $("#size").val(),
                staffIds: [$("#staffCode").val()],
            })
        );

        const image1File = $("#image1")[0].files[0];
        const image2File = $("#image2")[0].files[0];

        if (image1File) formData.append("image1", image1File);
        if (image2File) formData.append("image2", image2File);

        $.ajax({
            url: "http://localhost:8082/greenshadow/api/v1/fields",
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
            },
            processData: false,
            contentType: false,
            data: formData,
            success: function () {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Field saved successfully!",
                });
                $("#fieldForm")[0].reset();
                fetchFieldData();
            },
            error: function (xhr) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: xhr.responseJSON?.message || "Failed to save field.",
                });
            },
        });
    });

    // Update field
    $("#btnUpdate").on("click", function () {
        const fieldId = $("#fieldId").val();

        if (!fieldId) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Field ID is required to update!",
            });
            return;
        }

        const formData = new FormData();
        formData.append(
            "fieldData",
            JSON.stringify({
                fieldId,
                name: $("#name").val(),
                location: $("#location").val(),
                size: $("#size").val(),
                staffIds: [$("#staffCode").val()],
            })
        );

        const image1File = $("#image1")[0].files[0];
        const image2File = $("#image2")[0].files[0];

        if (image1File) formData.append("image1", image1File);
        if (image2File) formData.append("image2", image2File);

        $.ajax({
            url: `http://localhost:8082/greenshadow/api/v1/fields/${fieldId}`,
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + token,
            },
            processData: false,
            contentType: false,
            data: formData,
            success: function () {
                Swal.fire({
                    icon: "success",
                    title: "Updated",
                    text: "Field updated successfully!",
                });
                $("#fieldForm")[0].reset();
                $("#fieldId").prop("readonly", false);
                fetchFieldData();
            },
            error: function (xhr) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: xhr.responseJSON?.message || "Failed to update field.",
                });
            },
        });
    });

    // Delete field
    $("#btnDelete").on("click", function () {
        const fieldId = $("#fieldId").val();

        if (!fieldId) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Field ID is required to delete!",
            });
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `http://localhost:8082/greenshadow/api/v1/fields/${fieldId}`,
                    method: "DELETE",
                    headers: {
                        "Authorization": "Bearer " + token,
                    },
                    success: function () {
                        Swal.fire({
                            icon: "success",
                            title: "Deleted",
                            text: "Field deleted successfully!",
                        });
                        $("#fieldForm")[0].reset();
                        $("#fieldId").prop("readonly", false);
                        fetchFieldData();
                    },
                    error: function (xhr) {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: xhr.responseJSON?.message || "Failed to delete field.",
                        });
                    },
                });
            }
        });
    });

    // Initialize data fetching
    fetchFieldData();
    fetchStaffDropdown();
});
