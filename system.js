class Employee {
    constructor(name, surname) {
        this.name = name;
        this.surname = surname;
    }
}

class StaffMember extends Employee {
    constructor(name, surname, picture, email) {
        super(name, surname);
        this.picture = picture;
        this.email = email;
        this.status = "Not Assigned";
        this.outTime = "";
        this.duration = "";
        this.ERT = "";
    }

    checkOut() {
        this.status = "Out";
        const outOfOfficeTime = prompt(`How long will ${this.name} be out of the office? Please enter in (HH:MM)`);
        const timeAway = outOfOfficeTime.split(":");
        const hours = parseInt(timeAway[0]);
        const minutes = parseInt(timeAway[1]);
        const seconds = hours * 60 * 60 + minutes * 60;
        const outTime = new Date();
        const ERT = new Date(outTime.getTime() + seconds * 1000);
        const ERTHours = ERT.getHours();
        const ERTMinutes = ERT.getMinutes();
        const ERTSeconds = ERT.getSeconds();

        // ASSIGN VALUES
        this.outTime = digitalClock("time")
        this.ERT = `${ERTHours}:${ERTMinutes}:${ERTSeconds}`;
        console.log(this.ERT)
        this.duration = timeDifference(ERT, outTime);

    }

    checkIn() {
        this.outTime = "";
        this.duration = "";
        this.ERT = "";
        return this.status = "In";
    }
}


class DeliveryDriver extends Employee {
    constructor(name, surname, vehicle, telephone, deliverAddress, returnTime) {
        super(name, surname);
        this.vehicle = vehicle;
        this.telephone = telephone;
        this.deliverAddress = deliverAddress;
        this.returnTime = returnTime;
    }

}

function timeDifference(date1,date2) {
    let difference = date1.getTime() - date2.getTime();

    const hoursDifference = Math.floor(difference/1000/60/60);
    difference -= hoursDifference*1000*60*60

    const minutesDifference = Math.floor(difference/1000/60);

    return hoursDifference + ' hour/s ' +
        minutesDifference + ' minute/s ';
}


function digitalClock(type) {

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

    if (type === "date") {
        return day + "/" + month + "/" + year;
    }

    if (type === "time") {
        return hour + ":" + minute + ":" + second;
    }

    if (type === "dateTime") {
        return day + "/" + month + "/" + year + " " + hour + ":" + minute + ":" + second
    }

}

const employees = {
    "staffMembers": [],
    "deliveryDrivers": []
};

async function getUsers() {
    const numberOfEmployees = 5;

    for (let i = 0; i < numberOfEmployees; i++) {
        await $.ajax({
                type: "GET",
                url: 'https://randomuser.me/api/',
                dataType: 'json',
                success: function (data) {
                    const employee = data.results[0];
                    const picture = employee.picture.large;
                    const name = employee.name.first;
                    const surname = employee.name.last;
                    const email = employee.email;
                    const newEmployee = new StaffMember(name, surname, picture, email);
                    employees.staffMembers.push(newEmployee);
                }
            }
        )
    }
    return employees;
}

function populateStaffTable() {
    for (let i = 0; i < employees.staffMembers.length; i++) {
        let staffMember = employees.staffMembers[i];
        $("#employeeTable tbody").append(
            `<tr id="row${i}">
            <td><input type="checkbox" id="input${i}" name="check${i}"/></td>
            <td id="picture${i}"><img src="${staffMember.picture}" alt="employee picture"></td>
            <td id="name${i}">${staffMember.name}</td>
            <td id="surname${i}">${staffMember.surname}</td>
            <td id="email${i}">${staffMember.email}</td>
            <td id="status${i}">${staffMember.status}</td>
            <td id="outTime${i}">${staffMember.outTime}</td>
            <td id="duration${i}">${staffMember.duration}</td>
            <td id="ERT${i}">${staffMember.ERT}</td>
            </tr>`
        );
    }
}

$("document").ready( async function () {

    // GET USERS FROM API
    await getUsers()

    const staffMembers = employees.staffMembers;

    // POPULATE STAFF TABLE
    populateStaffTable();

    // CHECK OUT A STAFF MEMBER AND UPDATE THE TABLE
    $("#checkOut").click(function () {
        let checked = $("input:checked").length;
        if (!checked) {
            console.log("Nothing checked");
        }

        for(let i = 0; i < staffMembers.length; i++) {
            $("#input" + i).is(":checked") ? staffMembers[i].checkOut() : null;
            $("#status" + i).html(staffMembers[i].status);
            $("#outTime" + i).html(staffMembers[i].outTime);
            $("#duration" + i).html(staffMembers[i].duration);
            $("#ERT" + i).html(staffMembers[i].ERT);
            $("#input" + i).prop("checked", false);
        }
    });

    $("#checkIn").click(function () {
        let checked = $("input:checked").length;
        if (!checked) {
            console.log("Nothing checked");
        }

        for(let i = 0; i < staffMembers.length; i++) {
            $("#input" + i).is(":checked") ? staffMembers[i].checkIn() : null;
            $("#status" + i).html(staffMembers[i].status);
            $("#outTime" + i).html(staffMembers[i].outTime);
            $("#duration" + i).html(staffMembers[i].duration);
            $("#ERT" + i).html(staffMembers[i].ERT);
            $("#input" + i).prop("checked", false);
        }
    });

    $("#addDelivery").click(function () {
        const vehicle = $("#vehicleInput").val();
        const telephone = $("#telephoneInput").val();
        const deliverAddress = $("#deliverAddressInput").val();
        const returnTime = $("#returnTimeInput").val();
        const name = $("#nameInput").val();
        const surname = $("#surnameInput").val();

        const newDeliveryDriver = new DeliveryDriver(name, surname, vehicle, telephone, deliverAddress, returnTime);
        employees.deliveryDrivers.push(newDeliveryDriver)
        console.log(employees.deliveryDrivers);
    })

    console.log(employees)
});







$("document").ready(function () {

    const staffMembers = [];

    for (let i = 0; i < 5; i++) {
        $.ajax({
            url: "https://randomuser.me/api/",
            type: "GET",
            dataType: "json",
            success: function (data) {
                const user = data.results[0];
                const picture = user.picture.large;
                const name = user.name.first;
                const surname = user.name.last;
                const email = user.email;
                const newStaff = new StaffMember(name, surname, picture, email);
                staffMembers.push(newStaff);
                console.log(newStaff);
            }
        });
    }
});