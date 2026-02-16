import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import InternalLayout from "./InternalLayout";
import { apiGet } from "../api";
import FaucetDripsCumulativeChart from "./FaucetDripsCumulativeChart";
import FaucetDripsMonthlyChart from "./FaucetDripsMonthlyChart";

const FaucetDripsReport = () => {
    const [data, setData] = useState(null);
    const [showSpinner, setShowSpinner] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const res = await apiGet("faucet/drips");
            if (res.status === 403) {
                setShowSpinner(false);
                alert("Access denied. Please log in again.");
                return;
            }
            if (res.ok) {
                setShowSpinner(false);
                setData(await res.json());
            }
        };
        fetchData().catch(console.error);
    }, []);

    const computeCumulative = () => {
        if (!data) return null;
        const { monthlyDrips, communities } = data;
        const months = Object.keys(monthlyDrips).sort();
        const cumulative = {};
        const running = {};
        communities.forEach((c) => {
            cumulative[c] = [];
            running[c] = 0;
        });
        months.forEach((month) => {
            communities.forEach((c) => {
                running[c] += monthlyDrips[month]?.[c] || 0;
                cumulative[c].push({ x: month, y: running[c] });
            });
        });
        return { months, cumulative };
    };

    const cumulativeData = data ? computeCumulative() : null;

    return (
        <InternalLayout>
            <p style={{ fontSize: "3.5vh" }}>Faucet Drips</p>
            <br />
            {showSpinner && <Spinner />}
            {data && cumulativeData && (
                <div>
                    <FaucetDripsCumulativeChart
                        months={cumulativeData.months}
                        cumulative={cumulativeData.cumulative}
                        communities={data.communities}
                        uniqueDrippers={data.uniqueDrippers}
                    />
                    <br />
                    <FaucetDripsMonthlyChart
                        monthlyDrips={data.monthlyDrips}
                        communities={data.communities}
                        uniqueDrippers={data.uniqueDrippers}
                    />
                </div>
            )}
        </InternalLayout>
    );
};

export default FaucetDripsReport;
