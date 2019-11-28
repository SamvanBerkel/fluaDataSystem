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
                    <p class="patientBirthdate">4-7-1984</p>
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
            document.getElementById('pTodayLimit').innerHTML = `Limit: ${patient.limit} ml`

            totalDrank = 0;
            patient.intakes.forEach(function(intake) {
                totalDrank += parseInt(intake.amount, 10)
            })

            document.getElementById('pTodayDrank').innerHTML = `Drank: ${totalDrank} ml`

            if (totalDrank >= patient.limit) {
                document.getElementById('pTodayStatus').innerHTML = 'Limit reached'
                document.getElementById('pTodayStatus').style.color = 'lightcoral'
            } else {
                document.getElementById('pTodayStatus').innerHTML = 'Limit not reached'
                document.getElementById('pTodayStatus').style.color = 'green'
            }

            // Set patient detail panel
            document.getElementById('pDetailsName').innerHTML = patient.name;
            document.getElementById('pDetailsPatientNumber').innerHTML = patient.patientNumber;
            document.getElementById('pDetailsBirthdate').innerHTML = patient.birthdate;
            document.getElementById('pDetailsGender').innerHTML = patient.gender;
            document.getElementById('pDetailsPhoneNumber').innerHTML = patient.phoneNumber;
        }, 
        historyGrid: function(width, height, patient) {
            divGrid = document.getElementById('divHistoryGrid');

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

            const startDate = patient.intakes[0].date; 

            // Set the date indicators on the x axis
            for (let i = 0; i < width; i++) {
                let dateText = document.createElement('p');
                dateText.innerHTML = `${(i + 1) * 100} ml`
                
                amountText.style.gridColumn = "0";
                amountText.style.gridRow = height - i;
                amountText.style.borderRight = "solid 1px lightgrey";

                divGrid.appendChild(amountText);
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
            if (month == 12 && days == 31) {
                days = 1;
                month = 1;
                year++;
            }
            
            // Check if we need to go the next month
            if (days >= page.helpers.daysInMonth(month)) {
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
        page.set.historyGrid(16, 20);
    }
}

$( document ).ready(function() {
    page.init();
});