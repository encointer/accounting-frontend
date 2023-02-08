import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { apiGet } from "../api";
import TokenForm from "./TokenForm";
import AccountTokenOverview from "./AccountTokenOverview";
import InternalLayout from "./InternalLayout";

const AccountTokens = () => {
    const [data, setData] = useState({});
    const [token, setToken] = useState(null);
    const [wrongPassword, setWrongPassword] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (token) {
                const res = await apiGet(`get-tokens`, token);

                if (res.status === 403) {
                    setWrongPassword(true);
                    return;
                }

                if (res.ok) {
                    const reportData = await res.json();
                    setWrongPassword(false);
                    setData(reportData);
                    setShowSpinner(false);
                }
            }
        };
        fetchData().catch(console.error);
    }, [token]);

    const handleSubmitForm = (e) => {
        e.preventDefault();
        setToken(e.target.form.token.value);
    };

    return (
        <InternalLayout>
            <TokenForm handleSubmit={handleSubmitForm} />
            {wrongPassword && <p style={{ color: "red" }}>Wrong password</p>}
            <br />
            <br />
            {showSpinner && <Spinner />}
            {Object.keys(data).length !== 0 && (
                <AccountTokenOverview data={data} />
            )}
        </InternalLayout>
    );
};

export default AccountTokens;
