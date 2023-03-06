import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { apiGet } from "../api";
import TokenForm from "./TokenForm";
import AccountTokenOverview from "./AccountTokenOverview";
import InternalLayout from "./InternalLayout";

const AccountTokens = () => {
    const [data, setData] = useState({});
    const [showSpinner, setShowSpinner] = useState(true);

    const fetchData = async () => {
            const res = await apiGet(`accounting/tokens`);

            if (res.status === 403) {
                return;
            }

            if (res.ok) {
                const reportData = await res.json();
                setData(reportData);
                setShowSpinner(false);
            }
    };
    fetchData().catch(console.error);

    return (
        <InternalLayout>
            {showSpinner && <Spinner />}
            {Object.keys(data).length !== 0 && (
                <AccountTokenOverview data={data} />
            )}
        </InternalLayout>
    );
};

export default AccountTokens;
