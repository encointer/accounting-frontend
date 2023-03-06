import { useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../api";
import { API_URL } from "../consts";

const InternalLayout = ({ children }) => {
    const [me, setMe] = useState(async () => {
        const res = await apiGet("auth/me");
        if ([401, 403].includes(res.status)) {
            setMe(null);
            return;
        }
        const me = await res.json();
        console.log(me);
        setMe(me);
    });

    const authenticate = async (e) => {
        e.preventDefault();
        const res = await fetch(`${API_URL}/auth/authenticate`, {
            method: "POST",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                address: e.target.form[0].value,
                password: e.target.form[1].value,
            }),
        });
        if ([401, 403].includes(res.status)) {
            return;
        }
        const me = await res.json();
        console.log(me);
        setMe(me);
    };

    return (
        <div
            style={{
                paddingLeft: "10vw",
                paddingRight: "10vw",
                minHeight: "100vh",
                margin: 0,
                display: "grid",
                gridTemplateRows: "auto 1fr auto",
            }}
        >
            <div className="columns is-vcentered">
                <div className="column is-3">
                    <Link to="/internal">
                        <img
                            src="logos/encointerLogoLeuColors.png"
                            alt="Logo"
                        />
                    </Link>
                </div>
                <div className="column"></div>
                <div className="column is-narrow has-background-light m-1">
                    <Link to="/account-overview">Account Overview</Link>
                </div>
                <div className="column is-narrow has-background-light m-1">
                    <Link to="/turnover-report">Turnover Report</Link>
                </div>
                <div className="column is-narrow has-background-light m-1">
                    <Link to="/rewards-report">Rewards Report</Link>
                </div>
                <div className="column is-narrow has-background-light m-1">
                    <Link to="/account-tokens">Tokens</Link>
                </div>
            </div>{" "}
            {me?.isAdmin && (
                <div className="is-align-items-flex-start"> {children}</div>
            )}
            {!me?.isAdmin && (
                <form>
                    <h1>Login</h1>
                    <div>
                        <label>Username : </label>
                        <input
                            type="text"
                            placeholder="Enter Username"
                            name="username"
                            required
                        />
                        <label>Password : </label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            name="password"
                            required
                        />
                        <button type="submit" onClick={authenticate}>
                            Login
                        </button>
                    </div>
                </form>
            )}
            <footer>
                <br />
                <br />
                <br />© 2023 Encointer Association
            </footer>
        </div>
    );
};

export default InternalLayout;
