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

    // Fetch dropdown data
    function fetchSelectors() {
        fetchDropdownData("fields", "#fieldSelector");
        fetchDropdownData("crops", "#cropSelector");
        fetchDropdownData("staffs", "#staffSelector");
    }

    function fetchDropdownData(apiEndpoint, selectorId) {
        $.ajax({
            url: `http://localhost:8082/greenshadow/api/v1/${apiEndpoint}`,
            type: "GET",
            headers: { Authorization: `Bearer ${token}` },
            success: function (response) {
                const options = response.map(item =>
                    `<option value="${item.id || item.fieldId || item.staffId}">${item.name || item.commonName || item.firstName}</option>`
                );
                $(selectorId).html(`<option value="">Select ${apiEndpoint}</option>` + options.join(""));
            },
            error: function (xhr) {
                console.error(`Error fetching ${apiEndpoint}:`, xhr.responseText);
                Swal.fire({
                    icon: "error",
                    title: `Error Fetching ${apiEndpoint}`,
                    text: xhr.responseJSON?.message || `Failed to fetch ${apiEndpoint}.`,
                });
            }
        });
    }

    // Fetch logs and populate the table
    function fetchLogs() {
        $.ajax({
            url: "http://localhost:8082/greenshadow/api/v1/logs",
            type: "GET",
            headers: { Authorization: `Bearer ${token}` },
            success: function (logs) {
                populateLogTable(logs);
            },
            error: function (xhr) {
                console.error("Error fetching logs:", xhr.responseText);
                Swal.fire({
                    icon: "error",
                    title: "Error Fetching Logs",
                    text: xhr.responseJSON?.message || "Failed to fetch logs.",
                });
            }
        });
    }

    function populateLogTable(logs) {
        const logTableBody = $("#logTable tbody");
        logTableBody.empty();

        if (!logs || logs.length === 0) {
            logTableBody.append("<tr><td colspan='7'>No logs available.</td></tr>");
            return;
        }

        logs.forEach(log => {
            const fieldIds = log.fieldIds ? log.fieldIds.join(", ") : "No Fields";
            const cropIds = log.cropIds ? log.cropIds.join(", ") : "No Crops";
            const staffIds = log.staffIds ? log.staffIds.join(", ") : "No Staff";

            logTableBody.append(`
                <tr data-log-id="${log.logId}">
                    <td>${log.logId}</td>
                    <td>${log.logDetails}</td>
                    <td>${log.date}</td>
                    <td>${log.image2 ? `<img src="data:image/jpeg;base64,${log.image2}" alt="Log Image" style="width: 100px; height: auto;">` : 'No Image'}</td>
                    <td>${fieldIds}</td>
                    <td>${cropIds}</td>
                    <td>${staffIds}</td>
                </tr>
            `);
        });
    }

    // Save log
    $("#logForm").on("submit", function (e) {
        e.preventDefault();

        const logData = {
            logId: $("#logId").val(),
            date: $("#logDate").val(),
            logDetails: $("#logDetails").val(),
            fieldIds: [$("#fieldSelector").val()],
            cropIds: [$("#cropSelector").val()],
            staffIds: [$("#staffSelector").val()],
        };

        if (!logData.logId || !logData.date || !logData.logDetails) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Log ID, Date, and Details are required.",
            });
            return;
        }

        const formData = new FormData();
        formData.append("logData", JSON.stringify(logData));

        const logImage = $("#imageFile2")[0]?.files[0];
        if (logImage) {
            formData.append("imageFile", logImage);
        }

        $.ajax({
            url: "http://localhost:8082/greenshadow/api/v1/logs",
            type: "POST",
            headers: { Authorization: `Bearer ${token}` },
            processData: false,
            contentType: false,
            data: formData,
            success: function () {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Log saved successfully!",
                });
                fetchLogs();
                $("#logForm")[0].reset();
            },
            error: function (xhr) {
                console.error("Error saving log:", xhr.responseText || xhr.statusText);
                Swal.fire({
                    icon: "error",
                    title: "Error Saving Log",
                    text: xhr.responseJSON?.message || "Failed to save the log. Check console for details.",
                });
            }
        });
    });

    // Populate input fields and preview image on row click
    $("#logTable").on("click", "tr", function () {
        const logId = $(this).data("log-id");
        if (!logId) return;

        $.ajax({
            url: `http://localhost:8082/greenshadow/api/v1/logs/${logId}`,
            type: "GET",
            headers: { Authorization: `Bearer ${token}` },
            success: function (log) {
                $("#logId").val(log.logId);
                $("#logDate").val(log.date);
                $("#logDetails").val(log.logDetails);
                $("#fieldSelector").val(log.fieldIds[0] || "");
                $("#cropSelector").val(log.cropIds[0] || "");
                $("#staffSelector").val(log.staffIds[0] || "");

                if (log.image2) {
                    const byteArray = atob(log.image2);
                    const blob = new Blob([Uint8Array.from(byteArray)], { type: "image/jpeg" });
                    const file = new File([blob], "logImage.jpg", { type: "image/jpeg" });

                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    $("#imageFile2")[0].files = dataTransfer.files;

                    $("#imagePre").attr("src", `data:image/jpeg;base64,${log.image2}`).show();
                } else {
                    $("#imagePre").hide();
                }
            },
            error: function (xhr) {
                console.error("Error fetching log details:", xhr.responseText);
                Swal.fire({
                    icon: "error",
                    title: "Error Fetching Log Details",
                    text: xhr.responseJSON?.message || "Failed to fetch log details.",
                });
            }
        });
    });

    // Update log
    $("#updateLog").on("click", function () {
        const logId = $("#logId").val();
        if (!logId) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Log ID is required to update!",
            });
            return;
        }

        const logData = {
            logId,
            date: $("#logDate").val(),
            logDetails: $("#logDetails").val(),
            fieldIds: [$("#fieldSelector").val()],
            cropIds: [$("#cropSelector").val()],
            staffIds: [$("#staffSelector").val()],
        };

        const formData = new FormData();
        formData.append("logData", JSON.stringify(logData));

        const logImage = $("#imageFile2")[0]?.files[0];
        if (logImage) {
            formData.append("imageFile", logImage);
        }

        $.ajax({
            url: `http://localhost:8082/greenshadow/api/v1/logs/${logId}`,
            type: "PUT",
            headers: { Authorization: `Bearer ${token}` },
            processData: false,
            contentType: false,
            data: formData,
            success: function () {
                Swal.fire({
                    icon: "success",
                    title: "Updated",
                    text: "Log updated successfully!",
                });
                fetchLogs();
                $("#logForm")[0].reset();
            },
            error: function (xhr) {
                console.error("Error updating log:", xhr.responseText);
                Swal.fire({
                    icon: "error",
                    title: "Error Updating Log",
                    text: xhr.responseJSON?.message || "Failed to update the log.",
                });
            }
        });
    });

    // Delete log
    $("#deleteLog").on("click", function () {
        const logId = $("#logId").val();
        if (!logId) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Log ID is required to delete!",
            });
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `http://localhost:8082/greenshadow/api/v1/logs/${logId}`,
                    type: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                    success: function () {
                        Swal.fire({
                            icon: "success",
                            title: "Deleted",
                            text: "Log deleted successfully!",
                        });
                        fetchLogs();
                        $("#logForm")[0].reset();
                    },
                    error: function (xhr) {
                        console.error("Error deleting log:", xhr.responseText);
                        Swal.fire({
                            icon: "error",
                            title: "Error Deleting Log",
                            text: xhr.responseJSON?.message || "Failed to delete the log.",
                        });
                    }
                });
            }
        });
    });

    // Image preview on file input change
    $("#imageFile2").on("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                $("#imagePre").attr("src", e.target.result).show();
            };
            reader.readAsDataURL(file);
        } else {
            $("#imagePre").hide();
        }
    });

    // Initialize
    fetchSelectors();
    fetchLogs();
});
