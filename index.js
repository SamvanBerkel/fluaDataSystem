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
        patients: function() {
            console.log("set")
            page.patientJson.forEach(function(patient) {
                let patientDiv = document.createElement('div');
                patientDiv.classList.add('divPatient');

                patientDiv.innerHTML = `
                    <i class="fas fa-user-injured patientIcon"></i>
                    <p class="patientName">${patient.name}</p>
                    <p class="patientGender">${patient.gender}</p>
                    <p class="patientBirthdate">4-7-1984</p>
                    <p class="patientCity">Delft</p>
                    <p class="patientWeight">${patient.weight}</p>
                `.trim();

                patientDiv.addEventListener('click', function(evt) {
                    window.location.href = "succes.html";
                    console.log("test");
                })

                document.getElementById('divPatientList').appendChild(patientDiv);
            })
        }
    },
    init: async function() {
        console.log("loaded");
        let patients = document.querySelectorAll('.divPatient');
        
        console.log(patients)
    
        console.log("start")
        await page.rest.getPatients();
        page.set.patients();
    }
}

$( document ).ready(function() {
    page.init();
});