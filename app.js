document.addEventListener("deviceready", function () {
    console.log("Device is ready!");
}, false);

function fetchEmployees() {
    fetch("https://vaibhavemployeemng.ct.ws/employees.php")
        .then(response => response.json())
        .then(data => {
            let table = $('#employeeTable').DataTable();
            table.clear().draw(); // Clear existing data

            data.forEach(emp => {
                table.row.add([
                    emp.id,
                    emp.name,
                    emp.position_name,
                    emp.department_name,
                    `<button class="btn btn-warning btn-sm" onclick="editEmployee(${emp.id})">Edit</button>
                     <button class="btn btn-danger btn-sm" onclick="deleteEmployee(${emp.id})">Delete</button>`
                ]).draw(false);
            });
        })
        .catch(error => console.error("Error fetching employees:", error));
}

// Fetch positions for dropdown
function fetchPositions() {
    fetch("https://vaibhavemployeemng.ct.ws/positions.php")
        .then(response => response.json())
        .then(data => {
            console.log("Positions Data:", data); // Debugging

            let positionDropdowns = document.querySelectorAll("#position, #add_position");

            positionDropdowns.forEach(dropdown => {
                if (!dropdown) {
                    console.error("Dropdown element not found");
                    return;
                }

                dropdown.innerHTML = '<option value="">Select Position</option>'; // Default option
                
                data.forEach(position => {
                    let option = document.createElement("option");
                    option.value = position.id;
                    option.textContent = position.name;
                    dropdown.appendChild(option);
                });

                console.log("Dropdown updated:", dropdown.innerHTML);
            });
        })
        .catch(error => console.error("Error fetching positions:", error));
}

// Fetch departments for dropdown
function fetchDepartments() {
    fetch("https://vaibhavemployeemng.ct.ws/departments.php")
        .then(response => response.json())
        .then(data => {
            console.log("Departments Data:", data); // Debugging

            let departmentDropdowns = document.querySelectorAll("#department, #add_department");

            departmentDropdowns.forEach(dropdown => {
                if (!dropdown) {
                    console.error("Dropdown element not found");
                    return;
                }

                dropdown.innerHTML = '<option value="">Select Department</option>'; // Default option
                
                data.forEach(department => {
                    let option = document.createElement("option");
                    option.value = department.id;
                    option.textContent = department.name;
                    dropdown.appendChild(option);
                });

                console.log("Dropdown updated:", dropdown.innerHTML);
            });
        })
        .catch(error => console.error("Error fetching departments:", error));
}

// Ensure dropdowns populate on page load
document.addEventListener("DOMContentLoaded", function () {
    fetchPositions();
    fetchDepartments();
});

// Handle Add Employee
document.addEventListener("DOMContentLoaded", function () {
    let addEmployeeForm = document.getElementById("addEmployeeForm");

    if (addEmployeeForm) {
        addEmployeeForm.addEventListener("submit", function (e) {
            e.preventDefault();

            let name = document.getElementById("add_name").value;
            let position = document.getElementById("add_position").value;
            let department = document.getElementById("add_department").value;

            console.log("Submitting New Employee: ", { name, position, department });

            fetch("https://vaibhavemployeemng.ct.ws/addEmployee.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, position, department })
            })
            .then(response => response.json())
            .then(data => {
                console.log("Add Response:", data);
                alert(data.message);
                fetchEmployees(); // Refresh table
                $('#addEmployeeModal').modal('hide'); // Hide Bootstrap modal
                addEmployeeForm.reset(); // Clear form
            })
            .catch(error => console.error("Error:", error));
        });
    }
});

// Handle Edit Employee
function editEmployee(empId) {
    console.log("Editing employee with ID:", empId);

    fetch(`https://vaibhavemployeemng.ct.ws/getEmployee.php?id=${empId}`)
        .then(response => response.json())
        .then(data => {
            if (!data || !data.id) {
                alert("Error: Employee not found.");
                return;
            }

            document.getElementById("emp_id").value = data.id;
            document.getElementById("name").value = data.name;

            let positionDropdown = document.getElementById("position");
            let departmentDropdown = document.getElementById("department");

            // Ensure the right position/department is selected
            Array.from(positionDropdown.options).forEach(option => {
                option.selected = option.value == data.position_id;
            });

            Array.from(departmentDropdown.options).forEach(option => {
                option.selected = option.value == data.department_id;
            });

            $('#updateEmployeeModal').modal('show'); // Show Bootstrap modal
        })
        .catch(error => console.error("Error fetching employee:", error));
}

// Handle Update Employee
document.addEventListener("DOMContentLoaded", function () {
    let updateForm = document.getElementById("updateEmployeeForm");

    if (updateForm) {
        updateForm.addEventListener("submit", function (e) {
            e.preventDefault();
        
            let empId = document.getElementById("emp_id").value;
            let name = document.getElementById("name").value;
            let position = document.getElementById("position").value;
            let department = document.getElementById("department").value;
        
            console.log("Submitting Update: ", { empId, name, position, department });

            fetch("https://vaibhavemployeemng.ct.ws/updateEmployee.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: empId, name, position, department })
            })
            .then(response => response.json())
            .then(data => {
                console.log("Update Response:", data);
                alert(data.message);
                fetchEmployees(); // Refresh table after update
                $('#updateEmployeeModal').modal('hide'); // Hide modal if using Bootstrap
            })
            .catch(error => console.error("Error:", error));
        });
    }
});

// Handle Delete Employee
function deleteEmployee(empId) {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    fetch(`https://vaibhavemployeemng.ct.ws/deleteEmployee.php?id=${empId}`, {
        method: "GET"
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        let table = $('#employeeTable').DataTable();
        table.row($(`#employeeTable button[onclick="deleteEmployee(${empId})"]`).parents('tr')).remove().draw(false);
    })
    .catch(error => console.error("Error:", error));
}
