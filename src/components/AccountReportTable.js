import { summaryLogFields } from "../consts";
import SummaryLogRow from "./SummaryLogRow";

const AccountReportTable = ({ data }) => {
    return (
        <table className="table" style={{width:"80%"}}>
            <thead>
                <tr>
                    {summaryLogFields.map((val, i) => (
                        <th key={i}>{val}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.data.map((row, i) => (
                    <SummaryLogRow {...row} key={i} />
                ))}
            </tbody>
        </table>
    );
};

export default AccountReportTable;
