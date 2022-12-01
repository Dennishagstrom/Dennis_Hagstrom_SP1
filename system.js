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
        this.outTime;
        this.duration;
        this.ERT;
    }

    checkOut(duration, ERT) {
        if(!ERT) {
            this.outTime = digitalClock("time");
            this.ERT = ERT;
            this.duration = this.outTime - digitalClock("time", ERT);
            return this.status = "Out";
        }
    }

    checkIn() {
        this.outTime = "";
        this.ERT = "";
        this.duration = "";
        return this.status = "In";
    }
}

function timeDifference(date1,date2) {
    const difference = date1.getTime() - date2.getTime();

    const daysDifference = Math.floor(difference/1000/60/60/24);
    difference -= daysDifference*1000*60*60*24

    const hoursDifference = Math.floor(difference/1000/60/60);
    difference -= hoursDifference*1000*60*60

    const minutesDifference = Math.floor(difference/1000/60);
    difference -= minutesDifference*1000*60

    const secondsDifference = Math.floor(difference/1000);

    console.log('difference = ' +
        daysDifference + ' day/s ' +
        hoursDifference + ' hour/s ' +
        minutesDifference + ' minute/s ' +
        secondsDifference + ' second/s ');
}


function digitalClock(type, calculation) {

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

    if(!calculation) {

        if (type === "date") {
            return day + "/" + month + "/" + year;
        }

        if (type === "time") {
            return hour + ":" + minute + ":" + second;
        }

        if (type === "dateTime") {
            return day + "/" + month + "/" + year + " " + hour + ":" + minute + ":" + second
        }

    } else {
        // calculation is the number of hours and minutes the staff member is out
        // calculate the duration of the staff member being out
        // calculate the time the staff member is expected to be back


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


        // const userToChange = parseInt(prompt("Enter the employee to check out")) - 1;
        // if(userToChange > staffMembers.length - 1 || userToChange < 0) {
        //     console.log("User not found");
        //     return;
        // }
        // const duration = prompt("How long will the staff member be out? Enter in H:M:S format");

    //     const staffMember = staffMembers[userToChange];
    //     staffMember.checkOut();

    });
});




