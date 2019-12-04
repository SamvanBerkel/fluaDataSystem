if(window.page == null) window.page = {
    patientJson: null,
    dbLink: "https://api.myjson.com/bins/qvzv6",
    rest: {
        getPatients: async function() {
            await $.get(page.dbLink, function(data, textStatus, jqXHR) {
                console.log(data);
                page.patientJson = data;
            }); 
        },
        postPatient: function(name, gender, age, weight) {
            page.patientJson.patients.push({
                name: name,
                gender: gender,
                age: age,
                weight: weight,
                intakes: []
            })
            
            $.ajax({
                url: page.dbLink,
                type:"PUT",
                data: JSON.stringify(page.patientJson.patients),
                contentType:"application/json; charset=utf-8",
                dataType:"json",
                success: function(data, textStatus, jqXHR){
            
                }
            }); 
        },
        delPatients: function() {
            $.ajax({
                url: page.dbLink,
                type:"PUT",
                data:'{"patients":"[]"}',
                contentType:"application/json; charset=utf-8",
                dataType:"json",
                success: function(data, textStatus, jqXHR){
            
                }
            }); 
        }
    },
    set: {
        patientList: function() {
            console.log("set")
            page.patientJson.forEach(function(patient) {
                let patientDiv = document.createElement('div');
                patientDiv.classList.add('divPatient');

                patientDiv.innerHTML = `
                    <p class="patientName">${patient.name}</p>
                    <p class="patientNumber">${patient.patientNumber}</p>
                `.trim();

                patientDiv.patient = patient;

                patientDiv.addEventListener('click', function(evt) {
                    page.set.patient(this.patient); 
                })

                document.getElementById('divPatientList').appendChild(patientDiv);
            })
        }, 
        patient: function(patient) {
            // Set today panel
            document.getElementById('pTodayLimit').innerHTML = `${patient.limit} ml`

            let today = new Date();
            let currentDate = today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();

            totalDrank = 0;
            patient.intakes.forEach(function(intake) {
                if (currentDate == intake.date) {
                    totalDrank += parseInt(intake.amount, 10);
                }
            })

            document.getElementById('pTodayDrank').innerHTML = `${totalDrank} ml`

            if (totalDrank >= patient.limit) {
                document.getElementById('pTodayStatus').innerHTML = 'Limit reached'
                document.getElementById('pTodayStatus').style.color = 'lightcoral'
            } else {
                document.getElementById('pTodayStatus').innerHTML = 'Limit not reached'
                document.getElementById('pTodayStatus').style.color = '#5DBB63'
            }

            // Set patient detail panel
            document.getElementById('pDetailsName').innerHTML = patient.name;
            document.getElementById('pDetailsPatientNumber').innerHTML = patient.patientNumber;
            document.getElementById('pDetailsBirthdate').innerHTML = patient.birthdate;
            document.getElementById('pDetailsGender').innerHTML = patient.gender;
            document.getElementById('pDetailsPhoneNumber').innerHTML = patient.phoneNumber;

            // Set the patient history panell
            page.set.historyGrid(16, 20, patient);
        }, 
        historyGrid: function(width, height, patient) {
            divGrid = document.getElementById('divHistoryGrid');
            divGrid.innerHTML = '';

            divGrid.style.gridTemplateColumns = `repeat(${width + 1}, 1fr)`;
            divGrid.style.gridTemplateRows = `repeat(${height + 1}, 1fr)`;

            // Set the amount indicators on the y axis
            for (let i = 0; i < height; i++) {
                let amountText = document.createElement('p');
                amountText.innerHTML = `${(i + 1) * 100} ml`
                
                amountText.style.gridColumn = "0";
                amountText.style.gridRow = height - i;
                amountText.style.borderRight = "solid 1px lightgrey";

                divGrid.appendChild(amountText);
            }

            let currentDate = patient.intakes[0].date;
            let intakeIndex = 0;

            // Set the date indicators on the x axis and add the amount bars.
            for (let i = 2; i < width + 2; i++) {
                let dateText = document.createElement('p');
                dateText.innerHTML = currentDate;
                
                dateText.style.gridRow = height + 1;
                dateText.style.gridColumn = i;
                dateText.style.borderTop = "solid 1px lightgrey";
                dateText.style.paddingTop =  '10px';

                divGrid.appendChild(dateText);

                let totalIntakeAmount = 0;

                // Check if we need to add data to the graph for this date
                for (let j = intakeIndex; j < patient.intakes.length; j++) {
                    if (currentDate == patient.intakes[j].date) {
                        totalIntakeAmount += parseInt(patient.intakes[j].amount, 10);
                        intakeIndex++;
                    }
                }

                // Add the bars that indiciate how much fluid was taken that day.
                let neededBars = Math.ceil(totalIntakeAmount / 100);
                if (neededBars > 20) {
                    neededBars = 20;
                }

                let barColor = '#5DBB63'
                if (totalIntakeAmount > parseInt(patient.limit, 10)) {
                    barColor = 'lightcoral'
                }

                for (let b = 0; b < neededBars; b++) {
                    let barDiv = document.createElement('div');

                    barDiv.style.backgroundColor = barColor;
                    barDiv.style.gridColumn = i;
                    barDiv.style.gridRow = height - b;

                    if (b + 1 == neededBars) {
                        let barText = document.createElement('p');
                        barText.innerHTML = totalIntakeAmount;
                        barText.style.paddingTop = '5px';
                        barText.style.textAlign = 'center'
                        barDiv.appendChild(barText);
                    }

                    divGrid.appendChild(barDiv);
                }

                let divLimit = document.createElement('div');
                divLimit.style.borderTop = 'solid 1px green';
                divLimit.style.gridRow = height - parseInt(patient.limit, 10) / 100 + 1;
                divGrid.appendChild(divLimit);

                currentDate = page.helpers.nextDate(currentDate);
            }
        }
    },
    helpers: {
        nextDate: function(dateString) {
            parts = dateString.split("-");
            day = parseInt(parts[0], 10);
            month = parseInt(parts[1], 10);
            year = parseInt(parts[2], 10);

            // Check if we need to go to the next year
            if (month == 12 && day == 31) {
                day = 1;
                month = 1;
                year++;
            }
            
            // Check if we need to go the next month
            if (day >= page.helpers.daysInMonth(month)) {
                day = 1;
                month++;
            } else {
                day++;
            }

            return `${day}-${month}-${year}`;
        },
        daysInMonth: function(monthString) {
            switch(monthString) {
                case 1:
                    return 31;
                case 2:
                    return 28;
                case 3:
                    return 31;
                case 4:
                    return 30;
                case 5:
                    return 31;
                case 6:
                    return 30;
                case 7:
                    return 31;
                case 8:
                    return 31;
                case 9:
                    return 30;
                case 10:
                    return 31;
                case 11:
                    return 30;
                case 12:
                    return 31;
            }
        }
    },
    init: async function() {
        console.log("loaded");
        let patients = document.querySelectorAll('.divPatient');
        
        console.log(patients)
    
        console.log("start")
        await page.rest.getPatients();
        page.set.patientList();

        page.set.patient(page.patientJson[0]);
    }
}

$( document ).ready(function() {
    page.init();
});