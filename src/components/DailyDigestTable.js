import { dailyDigestFields } from "../consts";
import DailyDigestRow from "./DailyDigestRow";

const DailyDigestTable = ({ dailyDigest }) => {
    return (
        <table className="table" style={{ width: "80%" }}>
            <thead>
                <tr>
                    {dailyDigestFields.map((val, i) => (
                        <th key={i}>{val}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {Object.entries(dailyDigest).map(([dayString, data]) => (
                    <DailyDigestRow
                        dayString={dayString}
                        data={data}
                        key={dayString}
                    />
                ))}
            </tbody>
        </table>
    );
};

export default DailyDigestTable;
