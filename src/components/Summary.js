import AccountReportRevenueChart from "./AccountReportRevenueChart";
import AccountReportTable from "./AccountReportTable";
import AccountReportTransactionChart from "./AccountReportTransactionChart";


const Summary = ({ data, handleSummaryLogDownlaod }) => {
    return (
        <div>
            <p
                style={{ fontSize: "3.5vh" }}
            >{`${data.name} at ${data.communityName} ${data.year}`}</p>
            <br />
            <br />
            <p style={{ fontSize: "2vh" }}>Revenue Summary</p>
            <br/>
            <div style={{width: "min(80vw, 900px)"}}>
                <AccountReportRevenueChart data={data} />
            </div>
            <p style={{ fontSize: "2vh" }}>Transaction Summary</p>
            <br/>
            <div style={{width: "min(80vw, 900px)"}}>
                <AccountReportTransactionChart data={data} />
            </div>
            <br />
            <br />
            <p style={{ fontSize: "2vh" }}>Report</p>
            <br />
            <AccountReportTable data={data}/>
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
