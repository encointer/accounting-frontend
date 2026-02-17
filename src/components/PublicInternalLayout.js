import { useContext } from "react";
import { Link } from "react-router-dom";
import { MeContext } from "../App";
import LoginForm from "./LoginForm";
import LogoutButton from "./LogoutButton";

const PublicInternalLayout = ({ children, communityName }) => {
    const { me, setMe } = useContext(MeContext);
    return (
        <div
            style={{
                width: "100vw",
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
                    <Link to="/">
                        <img
                            style={{
                                marginTop: "15px",
                                width: "150px",
                            }}
                            src={`logos/${communityName}.png`}
                            alt="Logo"
                            onError={({ currentTarget }) => {
                                currentTarget.onerror = null; // prevents looping
                                currentTarget.src =
                                    "logos/encointerLogoLeuColors.png";
                            }}
                        />
                    </Link>
                </div>

                {me?.address && (
                    <>
                        <div className="column"></div>
                        <div className="column is-narrow m-1">Welcome, {me.name || me.address}</div>
                        <div className="column is-narrow has-background-light m-1">
                            <Link to="/account-report">Monthly Report</Link>
                        </div>
                        <div className="column is-narrow has-background-light m-1">
                            <Link to="/selected-range">Selected Range</Link>
                        </div>
                        <div className="column is-narrow has-background-light m-1">
                            <Link to="/transaction-history">Transaction History</Link>
                        </div>
                        <div className="column is-narrow has-background-light m-1">
                            <Link to="/change-password">Change Password</Link>
                        </div>
                        <LogoutButton me={me} />
                    </>
                )}
            </div>
            {me?.address && (
                <div className="is-align-items-flex-start"> {children}</div>
            )}
            {!me?.address && <LoginForm setMe={setMe} />}

            <footer>
                <br />
                <br />
                <br />© 2025 Encointer Association
            </footer>
        </div>
    );
};

export default PublicInternalLayout;
