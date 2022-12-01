class Employee {
    constructor(picture, firstName, lastName, email) {
        this.picture = picture;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.isCheckedIn = true;
    }

    checkOut() {
        this.isCheckedIn = false;
    }

    checkIn() {
        this.isCheckedIn = true;
    }
}

function dateFinder() {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    if (second < 10) {
        second = "0" + second;
    }
    if (minute < 10) {
        minute = "0" + minute;
    }
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }

    return day + "/" + month + "/" + year + " " + hour + ":" + minute + ":" + second
}

async function getEmployees() {
    const employees = [];
    const numberOfEmployees = 5;

    for (let i = 0; i < numberOfEmployees; i++) {
        await $.ajax({
                url: 'https://randomuser.me/api/',
                dataType: 'json',
                success: function (data) {
                    const employee = data.results[0];
                    const picture = employee.picture.large;
                    const firstName = employee.name.first;
                    const lastName = employee.name.last;
                    const email = employee.email;
                    const newEmployee = new Employee(picture, firstName, lastName, email);
                    employees.push(newEmployee);
                }
            }
        )
    }
    return employees;
}

function populateTable() {
    getEmployees()
        .then(employees => {
            employees.forEach(employee => {
                $("#employeeTable tbody").append(
                    `<tr>
                    <td><img src="${employee.picture}" alt="employee picture"></td>
                    <td>${employee.firstName}</td>
                    <td>${employee.lastName}</td>
                    <td>${employee.email}</td>
                    <td>${employee.isCheckedIn}</td>
                </tr>`
                );
            });
        })
}

$("document").ready( function () {
    populateTable();
});


