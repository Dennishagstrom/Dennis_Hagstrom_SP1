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
        const outOfOfficeTime = prompt(
            `How long will ${this.name} be out of the office? Please enter in (HH:MM)`
        );

        const outTime = new Date();
        const calculatedTime = calculateTime(outOfOfficeTime);
        const ERT = calculatedTime.ERT

        // ASSIGN VALUES
        this.outTime = digitalClock("time")
        this.ERT = `${calculatedTime.ERTHours}:${calculatedTime.ERTMinutes}:${calculatedTime.ERTSeconds}`;
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

function calculateTime(userPrompt) {
    const timeAway = userPrompt.split(":");
    const hours = parseInt(timeAway[0]);
    const minutes = parseInt(timeAway[1]);
    const seconds = hours * 60 * 60 + minutes * 60;
    const outTime = new Date();
    const ERT = new Date(outTime.getTime() + seconds * 1000);
    let ERTHours = ERT.getHours();
    let ERTMinutes = ERT.getMinutes();
    let ERTSeconds = ERT.getSeconds();

    if (ERTSeconds < 10) {
        ERTSeconds = "0" + ERTSeconds;
    }
    if (ERTMinutes < 10) {
        ERTMinutes = "0" + ERTMinutes;
    }
    if (ERTHours < 10) {
        ERTHours = "0" + ERTHours;
    }
    return {ERT, ERTHours, ERTMinutes, ERTSeconds};
    // return `${ERTHours}:${ERTMinutes}:${ERTSeconds}`;
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
            <td><input class="staffOut" type="checkbox" id="input${i}" name="check${i}"/></td>
            <td id="picture${i}"><img src="${staffMember.picture}" heigth="50px" width="50px" alt="employee picture"></td>
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

function addDeliveryToTable(vehicle, name, surname, telephone, deliveryAddress, returnTime) {
    $("#deliveryTable tbody").append(
        `<tr id="row${employees.deliveryDrivers.length}">
        <td id="vehicle${employees.deliveryDrivers.length}">${vehicle}</td>
        <td id="name${employees.deliveryDrivers.length}">${name}</td>
        <td id="surname${employees.deliveryDrivers.length}">${surname}</td>
        <td id="telephone${employees.deliveryDrivers.length}">${telephone}</td>
        <td id="deliveryAddress${employees.deliveryDrivers.length}">${deliveryAddress}</td>
        <td id="returnTime${employees.deliveryDrivers.length}">${returnTime}</td>
        </tr>`
    );
}

function validation(vehicle, name, surname, telephone, deliverAddress, returnTime) {
    const errorList = [];

    if (vehicle === "" || name === "" || surname === "" || telephone === "" || deliverAddress === "" || returnTime === "") {
        errorList.push("All fields must be filled");
    }
    if (!name.match(/^[a-zA-Z]+$/) || !surname.match(/^[a-zA-Z]+$/)) {
        errorList.push("Name and surname must contain only letters");
    }
    if (!telephone.match(/^[0-9]+$/)) {
        errorList.push("Telephone must contain only numbers, and cant be longer than 10 digits");
    }
    if (vehicle !== "car" && vehicle !== "motorcycle" && vehicle !== "bicycle") {
        errorList.push("Vehicle must be Car, Motorcycle or Bicycle");
    }
    return errorList;

}

$("document").ready(async function () {

    // Clock
    setInterval(function () {
        $("#date").html(digitalClock("dateTime"));
    }, 1000);

    // GET USERS FROM API
    await getUsers()

    // POPULATE STAFF TABLE
    populateStaffTable();

    const staffMembers = employees.staffMembers;

    // CHECK OUT A STAFF MEMBER AND UPDATE THE TABLE
    $("#checkOut").click(function () {
        let checked = $("input:checked").length;
        if (!checked) {
            alert("You must select at least one staff member to check out.");
        }

        for (let i = 0; i < staffMembers.length; i++) {
            $("#input" + i).is(":checked") ? staffMembers[i].checkOut() : null;
            $("#status" + i).html(staffMembers[i].status);
            $("#outTime" + i).html(staffMembers[i].outTime);
            $("#duration" + i).html(staffMembers[i].duration);
            $("#ERT" + i).html(staffMembers[i].ERT);
            $("#input" + i).prop("checked", false);
        }
    });

    // CHECK IN A STAFF MEMBER AND UPDATE THE TABLE
    $("#checkIn").click(function () {
        let checked = $("input:checked").length;
        if (!checked) {
            console.log("Nothing checked");
        }

        for (let i = 0; i < staffMembers.length; i++) {
            $("#input" + i).is(":checked") ? staffMembers[i].checkIn() : null;
            $("#status" + i).html(staffMembers[i].status);
            $("#outTime" + i).html(staffMembers[i].outTime);
            $("#duration" + i).html(staffMembers[i].duration);
            $("#ERT" + i).html(staffMembers[i].ERT);
            $("#input" + i).prop("checked", false);
        }
    });

    // ADD A DELIVERY TO THE DELIVERY TABLE
    $("#addDelivery").click(function () {
        let vehicle = $("#vehicleInput").val();
        vehicle = vehicle.toLowerCase();
        const telephone = $("#telephoneInput").val();
        const deliveryAddress = $("#deliverAddressInput").val();
        const returnTime = $("#returnTimeInput").val();
        const name = $("#nameInput").val();
        const surname = $("#surnameInput").val();
        const validate = validation(vehicle, name, surname, telephone, deliveryAddress, returnTime)
        if (validate.length === 0) {
            if(vehicle === "car"){
                vehicle = "🚗"
            } else if(vehicle === "motorcycle"){
                vehicle = "🏍️"
            } else if(vehicle === "bicycle"){
                vehicle = "🚲"
            }
            const newDeliveryDriver = new DeliveryDriver(vehicle, name, surname, telephone, deliveryAddress, returnTime);
            addDeliveryToTable(vehicle, name, surname, telephone, deliveryAddress, returnTime);
            employees.deliveryDrivers.push(newDeliveryDriver)
        } else {
            for (let i = 0; i < validate.length; i++) {
                alert(validate[i])
            }
        }
    });
});
