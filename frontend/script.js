/* ===== ADD SCREENING FIELD ===== */

function addScreening(){

const container = document.getElementById("screeningContainer");

const wrapper = document.createElement("div");
wrapper.style.display = "flex";
wrapper.style.gap = "10px";

const nameInput = document.createElement("input");
nameInput.placeholder = "Screening Name";
nameInput.name = "screeningName[]";

const valueInput = document.createElement("input");
valueInput.placeholder = "Value";
valueInput.name = "screeningValue[]";

wrapper.appendChild(nameInput);
wrapper.appendChild(valueInput);

container.appendChild(wrapper);

}

/* ===== ADD TREATMENT FIELD ===== */

function addTreatment(){

const container = document.getElementById("treatmentContainer");

const wrapper = document.createElement("div");
wrapper.style.display = "flex";
wrapper.style.gap = "10px";

const nameInput = document.createElement("input");
nameInput.placeholder = "Treatment Name";
nameInput.name = "treatmentName[]";

const valueInput = document.createElement("input");
valueInput.placeholder = "Value";
valueInput.name = "treatmentValue[]";

wrapper.appendChild(nameInput);
wrapper.appendChild(valueInput);

container.appendChild(wrapper);

}

/* ===== FORM SUBMIT ===== */

document.getElementById("form").addEventListener("submit", async function(e){

e.preventDefault();

const formData = new FormData(this);

const response = await fetch("http://localhost:5000/api/report/generate", {
method: "POST",
body: formData
});

const blob = await response.blob();

const link = document.createElement("a");
link.href = window.URL.createObjectURL(blob);
link.download = "Camp_Report.docx";
link.click();

});
