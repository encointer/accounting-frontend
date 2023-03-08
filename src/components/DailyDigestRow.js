import { round } from "../util";

const DailyDigestRow = ({ dayString, data }) => {
    return (
        <tr>
            <td>{dayString}</td>
            <td>{data.numIncoming}</td>
            <td>{round(data.sumIncoming)}</td>
            <td>{data.numOutgoing}</td>
            <td>{round(data.sumOutgoing)}</td>
            <td>{data.numIssues}</td>
            <td>{round(data.sumIssues)}</td>
            <td>{data.numDistinctClients}</td>
            <td>{round(data.avgTxnValue)}</td>
        </tr>
    );
};

export default DailyDigestRow;
