// Function to populate the staff dropdown
function fetchStaff() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        Swal.fire({
            icon: 'error',
            title: 'No token found!',
            text: 'Please log in.',
        });
        return;
    }

    $.ajax({
        url: 'http://localhost:8082/greenshadow/api/v1/staffs', // Staff API endpoint
        type: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        success: function (data) {
            const staffSelect = document.getElementById('staffie');
            staffSelect.innerHTML = '<option value="">Select Staff</option>'; // Reset options

            // Populate staff select dropdown with staff data
            data.forEach(staff => {
                const option = document.createElement('option');
                option.value = staff.staffId;
                option.textContent = `${staff.firstName} (ID: ${staff.staffId})`;
                staffSelect.appendChild(option);
            });
        },
        error: function (err) {
            console.error('Error fetching staff data:', err);
            Swal.fire({
                icon: 'error',
                title: 'Failed to retrieve staff data',
                text: 'An error occurred while fetching the staff list.',
            });
        }
    });
}

// Function to populate form fields with selected vehicle details
function populateForm(vehicle) {
    document.getElementById('vehicleId').value = vehicle.vehicleId || '';
    document.getElementById('plateNumber').value = vehicle.plateNumber || '';
    document.getElementById('vehicategory').value = vehicle.category || '';
    document.getElementById('fuelType').value = vehicle.fuelType || '';
    document.getElementById('vehistatus').value = vehicle.status || '';
    document.getElementById('remarks').value = vehicle.remarks || '';
    document.getElementById('staffie').value = vehicle.staffId || '';
}

// Function to fetch and update the vehicle table
function fetchAndUpdateTable() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        Swal.fire({
            icon: 'error',
            title: 'No token found!',
            text: 'Please log in.',
        });
        return;
    }

    $.ajax({
        url: 'http://localhost:8082/greenshadow/api/v1/vehicles', // Vehicle API endpoint
        type: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        success: function (data) {
            const vehicleTableBody = document.getElementById('vehicleTableBody');
            vehicleTableBody.innerHTML = ''; // Clear the table before appending new data

            data.forEach(vehicle => {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${vehicle.vehicleId}</td>
                    <td>${vehicle.plateNumber}</td>
                    <td>${vehicle.category}</td>
                    <td>${vehicle.fuelType}</td>
                    <td>${vehicle.status}</td>
                    <td>${vehicle.remarks}</td>
                    <td>${vehicle.staffId}</td>
                `;
                // Add click event to populate the form
                newRow.addEventListener('click', function () {
                    populateForm(vehicle);
                });
                vehicleTableBody.appendChild(newRow);
            });
        },
        error: function (err) {
            console.error('Error fetching vehicles:', err);
            Swal.fire({
                icon: 'error',
                title: 'Failed to retrieve vehicle data',
                text: 'An error occurred while fetching the vehicle list.',
            });
        }
    });
}

// Update Vehicle
document.getElementById('updateVehicle').addEventListener('click', function () {
    const vehicleId = document.getElementById('vehicleId').value.trim();
    if (!vehicleId) {
        Swal.fire({ icon: 'warning', title: 'Please select a vehicle first.' });
        return;
    }

    const vehicleData = {
        plateNumber: document.getElementById('plateNumber').value.trim(),
        category: document.getElementById('vehicategory').value.trim(),
        fuelType: document.getElementById('fuelType').value.trim(),
        status: document.getElementById('vehistatus').value.trim(),
        remarks: document.getElementById('remarks').value.trim(),
        staffId: document.getElementById('staffie').value.trim(),
    };

    const token = localStorage.getItem('authToken');
    $.ajax({
        url: `http://localhost:8082/greenshadow/api/v1/vehicles/${vehicleId}`,
        type: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        contentType: 'application/json',
        data: JSON.stringify(vehicleData),
        success: function () {
            Swal.fire({
                icon: 'success',
                title: 'Vehicle updated successfully!',
                text: 'The vehicle has been successfully updated.',
            });
            fetchAndUpdateTable(); // Refresh the table
        },
        error: function (err) {
            console.error('Error updating vehicle:', err);
            Swal.fire({
                icon: 'error',
                title: 'Failed to update vehicle',
                text: 'An error occurred while updating the vehicle.',
            });
        },
    });

    // Clear the form after updating
    document.getElementById('vehicleForm').reset();
});

// Delete Vehicle
document.getElementById('deleteVehicle').addEventListener('click', function () {
    const vehicleId = document.getElementById('vehicleId').value.trim();
    if (!vehicleId) {
        Swal.fire({ icon: 'warning', title: 'Please select a vehicle first.' });
        return;
    }

    const token = localStorage.getItem('authToken');
    $.ajax({
        url: `http://localhost:8082/greenshadow/api/v1/vehicles/${vehicleId}`,
        type: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
        success: function () {
            Swal.fire({
                icon: 'success',
                title: 'Vehicle deleted successfully!',
                text: 'The vehicle has been deleted from the system.',
            });
            fetchAndUpdateTable(); // Refresh the table
        },
        error: function (err) {
            console.error('Error deleting vehicle:', err);
            Swal.fire({
                icon: 'error',
                title: 'Failed to delete vehicle',
                text: 'An error occurred while deleting the vehicle.',
            });
        },
    });

    // Clear the form after deleting
    document.getElementById('vehicleForm').reset();
});

// Initialize on page load
fetchStaff(); // Populate staff dropdown
fetchAndUpdateTable(); // Populate vehicle table
