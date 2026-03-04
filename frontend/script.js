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