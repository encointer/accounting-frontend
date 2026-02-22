import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const monthShort = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// First month with data: Jun 2022 (index 0)
const ORIGIN_YEAR = 2022;
const ORIGIN_MONTH = 5;

function indexToYearMonth(index) {
    let m = ORIGIN_MONTH + index;
    const y = ORIGIN_YEAR + Math.floor(m / 12);
    m = m % 12;
    return { year: y, month: m };
}

function yearMonthToIndex(year, month) {
    return (year - ORIGIN_YEAR) * 12 + (month - ORIGIN_MONTH);
}

function formatLabel(index) {
    const { year, month } = indexToYearMonth(index);
    return `${monthShort[month]} ${year}`;
}

const MonthRangeSlider = ({ value, onChange }) => {
    const now = new Date();
    const maxIndex = yearMonthToIndex(now.getUTCFullYear(), now.getUTCMonth());

    // Build marks at year boundaries
    const marks = {};
    for (let i = 0; i <= maxIndex; i++) {
        const { year, month } = indexToYearMonth(i);
        if (month === 0) {
            marks[i] = { label: `${year}`, style: { fontSize: "11px" } };
        }
    }

    const rangeLabel = value[0] === value[1]
        ? formatLabel(value[0])
        : `${formatLabel(value[0])} \u2014 ${formatLabel(value[1])}`;

    return (
        <div style={{ padding: "0 10px" }}>
            <p style={{ marginBottom: "8px", fontWeight: 500 }}>{rangeLabel}</p>
            <Slider
                range
                min={0}
                max={maxIndex}
                value={value}
                onChange={onChange}
                marks={marks}
                allowCross={false}
                styles={{
                    track: { backgroundColor: "#3273dc" },
                    handle: { borderColor: "#3273dc" },
                }}
            />
            <div style={{ height: "30px" }} />
        </div>
    );
};

// Export helpers for consumers
MonthRangeSlider.indexToYearMonth = indexToYearMonth;
MonthRangeSlider.yearMonthToIndex = yearMonthToIndex;

export default MonthRangeSlider;
