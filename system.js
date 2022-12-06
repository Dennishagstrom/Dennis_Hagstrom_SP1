class Employee {
    constructor(name, surname) {
        this.name = name;
        this.surname = surname;
    }
}

class StaffMember extends Employee {
    constructor(id, name, surname, picture, email) {
        super(name, surname);
        this.id = id;
        this.picture = picture;
        this.email = email;
        this.status = "Not Assigned";
        this.outTime = "";
        this.duration = "";
        this.ERT = "";
        this.isLate = false;
    }

    checkOut() {

        const timeOutOfOffice = prompt(
            `How long will ${this.name} be out of the office? Please enter in (HH:MM). Up to 24H.`);
        const timeAway = timeOutOfOffice.split(":");
        // Validate input HH:MM from user prompt
        if (timeAway.length !== 2 || timeAway[0].length !== 2 || timeAway[1].length !== 2 || timeAway[0] > 23 || timeAway[1] > 59 || timeAway[0] < 0 || timeAway[1] < 0) {
            alert("The time you have entered is not valid. Please try again.");
            return this.checkOut();
        }
        const outTime = new Date();
        const calculatedTime = calculateTime(timeOutOfOffice);
        const ERT = calculatedTime.ERT

        // ASSIGN VALUES
        this.status = "Out";
        this.outTime = digitalClock("time")
        this.ERT = `${calculatedTime.ERTHours}:${calculatedTime.ERTMinutes}`;
        this.duration = timeDifference(ERT, outTime);

    }

    checkIn() {
        this.outTime = "";
        this.duration = "";
        this.ERT = "";
        this.isLate = false;
        this.status = "In";
    }

    staffMemberIsLate(staffMember) {
        spawnToast(staffMember);
        return this.isLate = true;
    }
}

class DeliveryDriver extends Employee {
    constructor(id, name, surname, vehicle, telephone, deliverAddress, returnTime) {
        super(name, surname);
        this.id = id;
        this.vehicle = vehicle;
        this.telephone = telephone;
        this.deliverAddress = deliverAddress;
        this.returnTime = returnTime;
    }

    deliveryDriverIsLate() {

    }
}

function spawnToast(object) {
    $("#toastDiv").append(`
        <div class="toast-container position-fixed bottom-0 end-0 p-3">
            <div id="liveToast${object.id}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
              <div class="toast-header">
                <img src="${object.picture}" class="rounded me-2" height="40px" width="40px" alt="staffPicture">
                <strong class="me-auto">${object.name} ${object.surname} is late!</strong>
                <small></small>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
              </div>
              <div class="toast-body">
                <p>Expected Return Time: ${object.ERT}</p>
                <p>Out Time: ${object.outTime}</p>
                <p>Duration: ${object.duration}</p>
              </div>
            </div>
        </div>`);
    if(object.isLate === false) {
        $(`#liveToast${object.id}`).toast('show');
    }
}

function calculateTime(input) {
    const timeAway = input.split(":");
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

    if (type === "timeWithSec") {
        return hour + ":" + minute + ":" + second;
    }

    if (type === "time") {
        return hour + ":" + minute
    }

    if (type === "dateTime") {
        return day + "/" + month + "/" + year + " " + hour + ":" + minute + ":" + second
    }

}

function staffMemberRunningLate() {
    for(let i = 0; i < staffMembers.length; i++) {
        let staffMember = staffMembers[i]
        if (staffMember.ERT !== "") {
            let currentTime = digitalClock("time");
            currentTime = currentTime.split(":");
            const currentHourInt = parseInt(currentTime[0]);
            const currentMinuteInt = parseInt(currentTime[1]);
            const ERT = staffMember.ERT.split(":");
            const ERTHourInt = parseInt(ERT[0]);
            const ERTMinuteInt = parseInt(ERT[1]);
            if(currentMinuteInt > ERTMinuteInt) {
                if (currentHourInt > ERTHourInt || currentHourInt === ERTHourInt) {
                    staffMember.staffMemberIsLate(staffMember);
                }
            }
        }
    }
}



const employees = {
    "staffMembers": [],
    "deliveryDrivers": []
};

const staffMembers = employees.staffMembers;
const deliveryDrivers = employees.deliveryDrivers;

const all_id = [];

function randomId() {
    let randomId = Math.floor(Math.random() * 10000);
    while (all_id.includes(randomId)) {
        randomId = Math.floor(Math.random() * 10000);
    }
    all_id.push(randomId);
    return randomId;
}

async function getUsers() {
    const numberOfEmployees = 5;

    for (let i = 0; i < numberOfEmployees; i++) {
        await $.ajax({
                type: "GET",
                url: 'https://randomuser.me/api/',
                dataType: 'json',
                success: function (data) {
                    const id = randomId();
                    const employee = data.results[0];
                    const picture = employee.picture.large;
                    const name = employee.name.first;
                    const surname = employee.name.last;
                    const email = employee.email;
                    const newEmployee = new StaffMember(id, name, surname, picture, email);
                    employees.staffMembers.push(newEmployee);
                }
            }
        )
    }
    return employees;
}

function populateStaffTable() {
    for (let i = 0; i < staffMembers.length; i++) {
        let staffMember = staffMembers[i];
        $("#staffMemberTable tbody").append(
            `<tr id="${staffMember.id}">
            <td><input class="staffOut" type="checkbox" id="input${staffMember.id}" name="check${staffMember.id}"/></td>
            <td id="picture${staffMember.id}"><img src="${staffMember.picture}" height="50px" width="50px" alt="employee picture"></td>
            <td id="name${staffMember.id}">${staffMember.name}</td>
            <td id="surname${staffMember.id}">${staffMember.surname}</td>
            <td id="emai${staffMember.id}}">${staffMember.email}</td>
            <td id="status${staffMember.id}">${staffMember.status}</td>
            <td id="outTime${staffMember.id}">${staffMember.outTime}</td>
            <td id="duration${staffMember.id}">${staffMember.duration}</td>
            <td id="ERT${staffMember.id}">${staffMember.ERT}</td>
            </tr>`
        );
    }
}

function addDeliveryToTable(deliveryDriver) {
    $("#deliveryTable tbody").append(
        `<tr id="${deliveryDriver.id}">
        <td><input class="deliveryClear" type="checkbox" id="deliveryCheck${deliveryDriver.id}" name="delivery${deliveryDriver.id}"/></td>
        <td id="vehicle${deliveryDriver.id}">${deliveryDriver.vehicle}</td>
        <td id="name${deliveryDriver.id}">${deliveryDriver.name}</td>
        <td id="surname${deliveryDriver.id}">${deliveryDriver.surname}</td>
        <td id="telephone${deliveryDriver.id}">${deliveryDriver.telephone}</td>
        <td id="deliveryAddress${deliveryDriver.id}">${deliveryDriver.deliverAddress}</td>
        <td id="returnTime${deliveryDriver.id}">${deliveryDriver.returnTime}</td>
        </tr>`
    );
}

function validateDelivery(vehicle, name, surname, telephone, deliverAddress, returnTime) {
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

    $('.toast').toast('show')

    // Clock
    setInterval(function () {
        $("#date").html(digitalClock("dateTime"));
    }, 1000);

    // GET USERS FROM API
    await getUsers()

    // POPULATE STAFF TABLE
    populateStaffTable();

    // CHECK IF STAFF MEMBER IS RUNNING LATE
    setInterval(staffMemberRunningLate, 1000);

    // CHECK OUT A STAFF MEMBER AND UPDATE THE TABLE
    $("#checkOut").click(function () {
        let checked = $("input:checked").length;
        if (!checked) {
            alert("You must select at least one staff member to check out.");
        }

        $("#staffMemberTable input:checked").each(function () {
            const id = $(this).parent().parent().attr("id")
            const staffMember = staffMembers.find(staffMember => staffMember.id === parseInt(id));
            staffMember.checkOut();
            $("#status" + id).html(staffMember.status);
            $("#outTime" + id).html(staffMember.outTime);
            $("#duration" + id).html(staffMember.duration);
            $("#ERT" + id).html(staffMember.ERT);
            $("#input" + id).prop("checked", false);
        })
    });

    // CHECK IN A STAFF MEMBER AND UPDATE THE TABLE
    $("#checkIn").click(function () {
        let checked = $("input:checked").length;
        if (!checked) {
            console.log("You must select at least one staff member to check in.");
        }
        $("#staffMemberTable input:checked").each(function () {
            const id = $(this).parent().parent().attr("id")
            const staffMember = staffMembers.find(staffMember => staffMember.id === parseInt(id));
            staffMember.checkIn();
            $("#status" + id).html(staffMember.status);
            $("#outTime" + id).html(staffMember.outTime);
            $("#duration" + id).html(staffMember.duration);
            $("#ERT" + id).html(staffMember.ERT);
            $("#input" + id).prop("checked", false);
        });
    });

    // ADD A DELIVERY TO THE DELIVERY TABLE
    $("#addDelivery").click(function () {
        const id = randomId();
        let vehicle = $("#vehicleInput").val();
        vehicle = vehicle.toLowerCase();
        const telephone = $("#telephoneInput").val();
        const deliveryAddress = $("#deliverAddressInput").val();
        const returnTime = $("#returnTimeInput").val();
        const name = $("#nameInput").val();
        const surname = $("#surnameInput").val();
        const validate = validateDelivery(
            vehicle,
            name,
            surname,
            telephone,
            deliveryAddress,
            returnTime
        )
        if (validate.length === 0) {
            if (vehicle === "car") {
                vehicle = "🚗"
            } else if (vehicle === "motorcycle") {
                vehicle = "🏍️"
            } else if (vehicle === "bicycle") {
                vehicle = "🚲"
            }
            const newDeliveryDriver = new DeliveryDriver(
                id,
                name,
                surname,
                vehicle,
                telephone,
                deliveryAddress,
                returnTime
            );
            addDeliveryToTable(newDeliveryDriver);
            console.log(newDeliveryDriver);
            deliveryDrivers.push(newDeliveryDriver)
        } else {
            for (let i = 0; i < validate.length; i++) {
                alert(validate[i])
            }
        }
    });

    // CLEAR DELIVERIES FROM THE DELIVERY TABLE
    $("#clearDelivery").click(function () {
        let checked = $("input:checked").length;
        if (!checked) {
            alert("You must select at least one delivery to clear.");
        }

        // Grab the ID from the selected checkbox
        $("#deliveryTable input:checked").each(function () {
            let id = $(this).parent().parent().attr("id");

            // Remove the delivery from the array
            deliveryDrivers.splice(deliveryDrivers.indexOf(id), 1)
            // Remove the delivery from the table
            $(this).parent().parent().remove();
        });
    });
});
