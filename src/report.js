import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { dailyDigestFields, summaryLogFields } from "./consts";

import { round } from "./util";
import { poppins } from "./fonts";
const loadImage = (src) =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
export async function getReport(data) {
    const doc = new jsPDF();
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    doc.addFileToVFS("Poppins.ttf", poppins);
    doc.addFont("Poppins.ttf", "Poppins", "normal");
    doc.setFont("Poppins");
    doc.setFontSize(20);
    doc.text(10, 25, `Encointer Report ${data.year}`);
    doc.setFontSize(15);
    doc.text(10, 35, `${data.name} at ${data.communityName}`);
    doc.text(10, 50, "Summary");

    const logo = await loadImage(`logos/${data.communityName}.png`);
    const logoWidth = logo.naturalWidth;
    const logoHeight = logo.naturalHeight;
    const margin = 2;
    const logoEffectiveWidth = 35;
    const logoEffectiveHeight = Math.round(
        (logoHeight * logoEffectiveWidth) / logoWidth
    );

    doc.addImage(
        logo,
        "png",
        width - logoEffectiveWidth - margin,
        margin,
        logoEffectiveWidth,
        logoEffectiveHeight
    );
    autoTable(doc, {
        head: [summaryLogFields],
        body: data.data.map((e) => [
            e.month,
            round(e.incomeMinusExpenses),
            round(e.sumIssues),
            round(e.balance),
            round(e.costDemurrage),
            e.numIncoming,
            e.numOutgoing,
            e.numIssues,
            e.numDistinctClients,
            round(e.avgTxnValue),
        ]),
        startY: 60,
        headStyles: { fillColor: [107, 196, 232] },
        styles: { font: "Poppins", fontSize: 8 },
    });

    for (const monthItem of data.data) {
        doc.addPage();
        doc.setFontSize(20);
        doc.text(10, 25, `${monthItem.month} ${data.year} Daily Digest`);

        autoTable(doc, {
            head: [dailyDigestFields],
            body: Object.entries(monthItem.dailyDigest).map(
                ([dayString, data]) => [
                    dayString,
                    data.numIncoming,
                    round(data.sumIncoming),
                    data.numOutgoing,
                    round(data.sumOutgoing),
                    data.numIssues,
                    round(data.sumIssues),
                    data.numDistinctClients,
                    round(data.avgTxnValue),
                ]
            ),
            columnStyles: {
                0: { cellWidth: 25 },
            },
            startY: 40,
            headStyles: { fillColor: [107, 196, 232] },
            styles: { font: "Poppins", fontSize: 8 },
        });

        doc.addPage();
        doc.setFontSize(20);
        doc.text(10, 25, `${monthItem.month} ${data.year} Detailed Report`);
        autoTable(doc, {
            head: [["Timestamp", "Counterparty", "Amount"]],
            body: monthItem.txnLog.map((e) => [
                new Date(parseInt(e.timestamp)).toUTCString(),
                e.counterParty,
                e.amount,
            ]),
            startY: 40,
            headStyles: { fillColor: [107, 196, 232] },
            styles: { font: "Poppins", fontSize: 8 },
        });
    }

    // add pagenumbers
    const pages = doc.internal.getNumberOfPages();
    doc.setFontSize(8); //Optional
    for (let j = 1; j < pages + 1; j++) {
        let horizontalPos = width / 2; //Can be fixed number
        let verticalPos = height - 6; //Can be fixed number
        doc.setPage(j);
        doc.text(`${j} of ${pages}`, horizontalPos, verticalPos, {
            align: "center",
        });
    }
    return doc;
}
