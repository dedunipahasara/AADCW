$(document).ready(function () {
    const token = localStorage.getItem("authToken");

    if (!token) {
        Swal.fire({
            icon: "error",
            title: "Authentication Error",
            text: "No authentication token found!",
        });
        return;
    }

    // Fetch Field IDs and populate dropdown
    function fetchFieldIds() {
        $.ajax({
            url: "http://localhost:8082/greenshadow/api/v1/fields",
            headers: { Authorization: `Bearer ${token}` },
            method: "GET",
            success: function (response) {
                const fieldDropdown = $("#field_Id");
                fieldDropdown.empty();
                fieldDropdown.append('<option value="">Select Field</option>');
                response.forEach((field) => {
                    fieldDropdown.append(
                        `<option value="${field.fieldId}">${field.fieldId}</option>`
                    );
                });
            },
            error: function () {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to fetch field IDs!",
                });
            },
        });
    }

    // Fetch All Crops and Populate Table
    function fetchAllCrops() {
        $.ajax({
            url: "http://localhost:8082/greenshadow/api/v1/crops",
            headers: { Authorization: `Bearer ${token}` },
            method: "GET",
            success: function (response) {
                populateCropTable(response);
            },
            error: function () {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to fetch crops!",
                });
            },
        });
    }

    function populateCropTable(crops) {
        const cropTableBody = $("#cropTableBody");
        cropTableBody.empty();

        if (crops.length === 0) {
            cropTableBody.append("<tr><td colspan='7'>No crops available.</td></tr>");
            return;
        }

        crops.forEach((crop) => {
            const imageUrl = crop.image1
                ? `data:image/png;base64,${crop.image1}`
                : "No Image";

            cropTableBody.append(`
                <tr data-crop-id="${crop.id}">
                    <td>${crop.id}</td>
                    <td>${crop.commonName}</td>
                    <td>${crop.specificName}</td>
                    <td>${crop.category}</td>
                    <td>${crop.season}</td>
                    <td>${crop.fieldId ? crop.fieldId : "None"}</td>
                    <td>
                        ${
                imageUrl !== "No Image"
                    ? `<img src="${imageUrl}" style="width: 50px; height: 50px;">`
                    : imageUrl
            }
                    </td>
                </tr>
            `);
        });

        // Add click listener for rows to fetch crop details
        $("#cropTableBody tr").click(function () {
            const cropId = $(this).data("crop-id");
            fetchCropDetails(cropId);
        });
    }

    // Fetch Crop Details for Editing
    function fetchCropDetails(cropId) {
        $.ajax({
            url: `http://localhost:8082/greenshadow/api/v1/crops/${cropId}`,
            headers: { Authorization: `Bearer ${token}` },
            method: "GET",
            success: function (crop) {
                $("#cropId").val(crop.id);
                $("#commonName").val(crop.commonName);
                $("#specificName").val(crop.specificName);
                $("#category").val(crop.category);
                $("#season").val(crop.season);
                $("#field_Id").val(crop.fieldId);

                if (crop.image1) {
                    $("#imagePreview").attr("src", `data:image/png;base64,${crop.image1}`).show();
                } else {
                    $("#imagePreview").hide();
                }
            },
            error: function () {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to fetch crop details!",
                });
            },
        });
    }

    // Save Crop
    $("#cropForm").submit(function (event) {
        event.preventDefault();

        const fieldIdsArray = $("#field_Id").val();
        const cropData = {
            id: $("#cropId").val(),
            commonName: $("#commonName").val(),
            specificName: $("#specificName").val(),
            category: $("#category").val(),
            season: $("#season").val(),
            fieldId: fieldIdsArray,
        };

        const formData = new FormData();
        formData.append("cropData", JSON.stringify(cropData));

        const imageFile = $("#imageFile")[0].files[0];
        if (imageFile) {
            formData.append("imageFile", imageFile);
        }

        $.ajax({
            url: "http://localhost:8082/greenshadow/api/v1/crops",
            headers: { Authorization: `Bearer ${token}` },
            method: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Crop saved successfully!",
                });
                fetchAllCrops();
            },
            error: function () {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to save crop!",
                });
            },
        });
    });

    // Update Crop
    // Update Crop
    $("#CropUpdate").click(function () {
        const cropId = $("#cropId").val();
        if (!cropId) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Please select a crop to update!",
            });
            return;
        }

        // Prepare crop data excluding fieldId for update
        const cropData = {
            id: cropId,
            commonName: $("#commonName").val(),
            specificName: $("#specificName").val(),
            category: $("#category").val(),
            season: $("#season").val(),
            // Do not include fieldId here as you don't want to update it
        };

        // Prepare FormData
        const formData = new FormData();
        formData.append("cropData", JSON.stringify(cropData));

        // Check if there is a new image file and append it to FormData
        const imageFile = $("#imageFile")[0].files[0];
        if (imageFile) {
            formData.append("imageFile", imageFile);
        }

        // Send the update request with the crop data and the new image (if any)
        $.ajax({
            url: `http://localhost:8082/greenshadow/api/v1/crops/${cropId}`,
            headers: { Authorization: `Bearer ${token}` },
            method: "PUT",
            data: formData,
            processData: false,
            contentType: false, // Let the browser set the content type for file uploads
            success: function () {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Crop updated successfully!",
                });
                fetchAllCrops();
            },
            error: function () {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to update crop!",
                });
            },
        });
    });

    // Delete Crop
    $("#CropDelete").click(function () {
        const cropId = $("#cropId").val();
        if (!cropId) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Please select a crop to delete!",
            });
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `http://localhost:8082/greenshadow/api/v1/crops/${cropId}`,
                    headers: { Authorization: `Bearer ${token}` },
                    method: "DELETE",
                    success: function () {
                        Swal.fire({
                            icon: "success",
                            title: "Deleted!",
                            text: "Your crop has been deleted.",
                        });
                        fetchAllCrops();
                    },
                    error: function () {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "Failed to delete crop!",
                        });
                    },
                });
            }
        });
    });

    // Initial Data Fetch
    fetchFieldIds();
    fetchAllCrops();
});
