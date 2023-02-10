export function round(n) {
    return n.toFixed(2);
}

export function downloadDataUrl(dataurl, filename) {
    const link = document.createElement("a");
    link.href = dataurl;
    link.download = filename;
    link.click();
}

export function getMonthName(idx) {
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    return monthNames[idx];
}

function getDateString(timestamp) {
    return new Date(parseInt(timestamp)).toUTCString().replace(",", "");
}

export function getTxnLogCsv(data) {
    const csvString = [
        ["Timestamp", "Counterparty", "Amount"],
        ...data.map((item) => [
            getDateString(item.timestamp),
            item.counterParty,
            item.amount,
        ]),
    ]
        .map((e) => e.join(","))
        .join("\n");
    return csvString;
}

export function getAccountOverviewCsv(data) {
    const csvString = [
        ["Account", "Balance"],
        ...data.map((item) => [item.account, item.balance]),
    ]
        .map((e) => e.join(","))
        .join("\n");
    return csvString;
}

export function getRewardsReportCsv(data) {
    const csvString = [
        ["Cindex", "# Particiants", "Total Rewards"],
        ...Object.entries(data).map(([cindex, item]) => [
            cindex,
            item.numParticipants,
            item.totalRewards,
        ]),
    ]
        .map((e) => e.join(","))
        .join("\n");
    return csvString;
}

export function getTurnoverReportCsv(header, rows) {
    const csvString = [["Month"].concat(header), ...rows]
        .map((e) => e.join(","))
        .join("\n");
    return csvString;
}
