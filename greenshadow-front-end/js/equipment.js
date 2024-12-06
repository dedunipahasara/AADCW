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

    // Fetch Equipment Data
    function fetchEquipment() {
        $.ajax({
            url: "http://localhost:8082/greenshadow/api/v1/equipments",
            type: "GET",
            headers: { Authorization: `Bearer ${token}` },
            success: function (equipment) {
                populateEquipmentTable(equipment);
            },
            error: function (xhr) {
                console.error("Error fetching equipment:", xhr.responseText);
                Swal.fire({
                    icon: "error",
                    title: "Error Fetching Equipment",
                    text: xhr.responseJSON?.message || "Failed to fetch equipment.",
                });
            }
        });
    }

    function populateEquipmentTable(equipment) {
        const equipmentTableBody = $("#equipmentTableBody");
        equipmentTableBody.empty();

        if (!equipment || equipment.length === 0) {
            equipmentTableBody.append("<tr><td colspan='4'>No equipment available.</td></tr>");
            return;
        }

        equipment.forEach(item => {
            equipmentTableBody.append(
                `<tr data-equipment-id="${item.equipmentId}">
                    <td>${item.equipmentId}</td>
                    <td>${item.type}</td>
                    <td>${item.name}</td>
                    <td>${item.status}</td>
                </tr>`
            );
        });
    }

    // Handle Equipment Form Submit
    $("#equipmentForm").on("submit", function (e) {
        e.preventDefault();

        const equipmentData = {
            equipmentId: $("#equipmentId").val(),
            type: $("#type").val(),
            name: $("#eqname").val(),
            status: $("#status").val(),
        };

        $.ajax({
            url: "http://localhost:8082/greenshadow/api/v1/equipments",
            type: "POST",
            headers: { Authorization: `Bearer ${token}` },
            data: JSON.stringify(equipmentData),
            contentType: "application/json",
            success: function () {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Equipment saved successfully!",
                });
                fetchEquipment();
                $("#equipmentForm")[0].reset();
            },
            error: function (xhr) {
                console.error("Error saving equipment:", xhr.responseText);
                Swal.fire({
                    icon: "error",
                    title: "Error Saving Equipment",
                    text: xhr.responseJSON?.message || "Failed to save equipment.",
                });
            }
        });
    });

    // Handle Equipment Row Click to Populate Fields
    $("#equipmentTableBody").on("click", "tr", function () {
        const equipmentId = $(this).data("equipment-id");
        if (!equipmentId) return;

        $.ajax({
            url: `http://localhost:8082/greenshadow/api/v1/equipments/${equipmentId}`,
            type: "GET",
            headers: { Authorization: `Bearer ${token}` },
            success: function (equipment) {
                $("#equipmentId").val(equipment.equipmentId);
                $("#type").val(equipment.type);
                $("#eqname").val(equipment.name);
                $("#status").val(equipment.status);
            },
            error: function (xhr) {
                console.error("Error fetching equipment details:", xhr.responseText);
                Swal.fire({
                    icon: "error",
                    title: "Error Fetching Equipment Details",
                    text: xhr.responseJSON?.message || "Failed to fetch equipment details.",
                });
            }
        });
    });

    // Handle Equipment Update
    $("#updateEquipment").on("click", function () {
        const equipmentId = $("#equipmentId").val();
        if (!equipmentId) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Equipment ID is required to update!",
            });
            return;
        }

        const equipmentData = {
            equipmentId,
            type: $("#type").val(),
            name: $("#eqname").val(),
            status: $("#status").val(),
        };

        $.ajax({
            url: `http://localhost:8082/greenshadow/api/v1/equipments/${equipmentId}`,
            type: "PUT",
            headers: { Authorization: `Bearer ${token}` },
            data: JSON.stringify(equipmentData),
            contentType: "application/json",
            success: function () {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Equipment updated successfully!",
                });
                fetchEquipment();
                $("#equipmentForm")[0].reset();
            },
            error: function (xhr) {
                console.error("Error updating equipment:", xhr.responseText);
                Swal.fire({
                    icon: "error",
                    title: "Error Updating Equipment",
                    text: xhr.responseJSON?.message || "Failed to update equipment.",
                });
            }
        });
    });

    // Handle Equipment Deletion
    $("#deleteEquipment").on("click", function () {
        const equipmentId = $("#equipmentId").val();

        if (!equipmentId) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Please select an equipment to delete!",
            });
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to delete this equipment?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, keep it",
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `http://localhost:8082/greenshadow/api/v1/equipments/${equipmentId}`,
                    type: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                    success: function () {
                        Swal.fire({
                            icon: "success",
                            title: "Deleted!",
                            text: "Equipment has been deleted.",
                        });
                        fetchEquipment();
                        $("#equipmentForm")[0].reset();
                    },
                    error: function (xhr) {
                        console.error("Error deleting equipment:", xhr.responseText);
                        Swal.fire({
                            icon: "error",
                            title: "Error Deleting Equipment",
                            text: xhr.responseJSON?.message || "Failed to delete equipment.",
                        });
                    }
                });
            }
        });
    });

    // Initialize
    fetchEquipment();
});

