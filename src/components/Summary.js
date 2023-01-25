import { summaryLogFields } from "../consts";
import SummaryLogRow from "./SummaryLogRow";

const Summary = ({ data, handleSummaryLogDownlaod }) => {
    return (
        <div>
            <p
                style={{ fontSize: "3.5vh" }}
            >{`${data.name} at ${data.communityName} ${data.year}`}</p>
            <br />
            <br />
            <table className="table">
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
            <button
                className="button is-link"
                onClick={handleSummaryLogDownlaod}
            >
                Download Report
            </button>
        </div>
    );
};

export default Summary;
