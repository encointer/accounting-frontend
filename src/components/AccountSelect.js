import { useEffect, useState } from "react";
import { apiGet } from "../api";

const AccountSelect = () => {
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        const getAccounts = async () => {
            const res = await apiGet(`auth/users`);
            setAccounts(await res.json());
        };

        getAccounts().catch(console.error);
    }, []);

    if (accounts) {
        return (
            <div className="field">
                <label>Account</label>
                <div className="control">
                    <div className="select">
                        <select name="account">
                            {accounts.map((account, idx) => (
                                <option value={account.address} key={idx}>
                                    {account.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        );
    }
};

export default AccountSelect;
