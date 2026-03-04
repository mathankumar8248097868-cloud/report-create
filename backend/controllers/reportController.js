const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  AlignmentType,
  PageBreak,
  UnderlineType
} = require("docx");

const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
require("chart.js/auto");
const fs = require("fs");

const chartCanvas = new ChartJSNodeCanvas({
  width: 800,
  height: 500
});

exports.generateReport = async (req, res) => {
  try {
    const d = req.body;
    const photos = req.files || [];

    const centerUnderline = (text, size) =>
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text,
            font: "Times New Roman",
            size,
            underline: { type: UnderlineType.SINGLE }
          })
        ]
      });

    const centerText = (text, size = 24) =>
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text,
            font: "Times New Roman",
            size
          })
        ]
      });

    const leftText = (text) =>
      new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [
          new TextRun({
            text,
            font: "Times New Roman",
            size: 24
          })
        ]
      });

    const blank = () => new Paragraph("");

    const children = [];

    // ================= FIRST PAGE =================

    children.push(centerUnderline(d.collegeName.toUpperCase(), 32));
    children.push(blank());
    children.push(centerUnderline(d.departmentName.toUpperCase(), 28));
    children.push(blank());
    children.push(centerUnderline(`CAMP REPORT – ${d.campLocation.toUpperCase()}`, 28));
    children.push(blank());
    children.push(centerUnderline(`DATE: ${d.reportDateShort}`, 26));
    children.push(blank());
    children.push(blank());

    children.push(leftText(
      `The Department of Public Health Dentistry, ${d.collegeName}, Madurai in association with ${d.associationName} and with ${d.projectName} conducted a dental treatment camp at ${d.campLocation} on ${d.reportDateLong}.`
    ));
    children.push(blank());

    children.push(leftText(
      `The Camp started at ${d.startTime} and concluded at ${d.endTime}. A team of dentists, including ${d.staffCount} staff, ${d.postgraduateCount} postgraduate and ${d.internCount} interns, rendered oral health care for the public.`
    ));
    children.push(blank());

    children.push(leftText(
      `A total of ${d.totalPatients} people attended the dental camp and ${d.treatmentCount} people were treatment in the camp. Oral cavity examination was done with oral health talk and oral hygiene instructions.`
    ));

    children.push(blank());
    children.push(blank());
    children.push(centerText("HEAD OF THE DEPARTMENT          PRINCIPAL", 26));
    children.push(new Paragraph({ children: [new PageBreak()] }));

    // ================= SECOND PAGE (PHOTOS) =================

    children.push(centerUnderline("PHOTOS", 30));
    children.push(blank());

    for (let photo of photos) {
      const img = fs.readFileSync(photo.path);
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new ImageRun({
              data: img,
              transformation: { width: 400, height: 250 }
            })
          ]
        })
      );
      children.push(blank());
    }

    children.push(centerText("HEAD OF THE DEPARTMENT          PRINCIPAL", 26));
    children.push(new Paragraph({ children: [new PageBreak()] }));

    // ================= THIRD PAGE (CAMP STATISTICS) =================

    const campChart = await chartCanvas.renderToBuffer({
      type: "bar",
      data: {
        labels: ["Male", "Female"],
        datasets: [{
          data: [parseInt(d.maleCount), parseInt(d.femaleCount)],
          backgroundColor: "blue"
        }]
      },
      options: { plugins: { legend: { display: false }}}
    });

    children.push(centerUnderline("CAMP STATISTICS", 30));
    children.push(blank());
    children.push(leftText(`TOTAL NUMBER OF PATIENTS    ${d.totalPatients}`));
    children.push(leftText(`MALE    ${d.maleCount}`));
    children.push(leftText(`FEMALE    ${d.femaleCount}`));
    children.push(blank());

    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new ImageRun({
            data: campChart,
            transformation: { width: 500, height: 300 }
          })
        ]
      })
    );

    children.push(centerText("HEAD OF THE DEPARTMENT          PRINCIPAL", 26));
    children.push(new Paragraph({ children: [new PageBreak()] }));

    // ================= FOURTH PAGE (SCREENING) =================

    const screeningChart = await chartCanvas.renderToBuffer({
      type: "bar",
      data: {
        labels: ["Dental Caries","Root Stump","Gingivitis","Periodontitis","Missing","Consultation","Others"],
        datasets: [{
          data: [
            d.dentalCaries,
            d.rootStump,
            d.gingivitis,
            d.periodontitis,
            d.missing,
            d.consultation,
            d.others
          ],
          backgroundColor: "blue"
        }]
      },
      options: { plugins: { legend: { display: false }}}
    });

    children.push(centerUnderline("SCREENING STATISTICS", 30));
    children.push(blank());
    children.push(leftText(`DENTAL CARIES    ${d.dentalCaries}`));
    children.push(leftText(`ROOT STUMP    ${d.rootStump}`));
    children.push(leftText(`GINGIVITIS    ${d.gingivitis}`));
    children.push(leftText(`PERIODONTITIS    ${d.periodontitis}`));
    children.push(leftText(`MISSING    ${d.missing}`));
    children.push(leftText(`CONSULTATION    ${d.consultation}`));
    children.push(leftText(`OTHERS    ${d.others}`));
    children.push(blank());

    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new ImageRun({
            data: screeningChart,
            transformation: { width: 500, height: 300 }
          })
        ]
      })
    );

    children.push(centerText("HEAD OF THE DEPARTMENT          PRINCIPAL", 26));
    children.push(new Paragraph({ children: [new PageBreak()] }));

    // ================= FIFTH PAGE (TREATMENT) =================

    const treatmentChart = await chartCanvas.renderToBuffer({
      type: "bar",
      data: {
        labels: ["Scaling"],
        datasets: [{
          data: [d.scaling],
          backgroundColor: "blue"
        }]
      },
      options: { plugins: { legend: { display: false }}}
    });

    children.push(centerUnderline("TREATMENT STATISTICS", 30));
    children.push(blank());
    children.push(leftText(`SCALING    ${d.scaling}`));
    children.push(blank());

    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new ImageRun({
            data: treatmentChart,
            transformation: { width: 500, height: 300 }
          })
        ]
      })
    );

    children.push(centerText("HEAD OF THE DEPARTMENT          PRINCIPAL", 26));

    const doc = new Document({
      sections: [{ children }]
    });

    const buffer = await Packer.toBuffer(doc);

    res.setHeader("Content-Disposition", "attachment; filename=Camp_Report.docx");
    res.send(buffer);

  } catch (err) {
    console.log(err);
    res.status(500).send("Error generating report");
  }
};