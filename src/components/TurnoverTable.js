const TurnoverTable = ({
    header,
    rows,
    communityName,
    year,
    handleDownloadReport,
}) => {
    return (
        <div>
            <table className="table">
                <thead>
                    <tr>
                        <th></th>
                        {header.map((item, i) => (
                            <th key={i}>{item}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i}>
                            <th>{row[0]}</th>
                            {row.slice(1).map((data, idx) => (
                                <td key={idx}>{data}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="button is-link" onClick={handleDownloadReport}>
                Download Report
            </button>
        </div>
    );
};

export default TurnoverTable;
