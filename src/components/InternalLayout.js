import { useContext } from "react";
import { Link } from "react-router-dom";
import { MeContext } from "../App";
import LoginForm from "./LoginForm";
import LogoutButton from "./LogoutButton";

const InternalLayout = ({ children }) => {
    const { me, setMe } = useContext(MeContext);
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
                    <Link to="/">
                        <img
                            src="logos/encointerLogoLeuColors.png"
                            alt="Logo"
                        />
                    </Link>
                </div>
                {me.isAdmin && (
                    <>
                        <div className="column"></div>
                        <div className="column is-narrow has-background-light m-1">
                            <Link to="/account-overview">Account Overview</Link>
                        </div>
                        <div className="column is-narrow has-background-light m-1">
                            <Link to="/turnover-report">Turnover Report</Link>
                        </div>
                        <div className="column is-narrow has-background-light m-1">
                            <Link to="/money-velocity-report">Money Velocity Report</Link>
                        </div>
                        <div className="column is-narrow has-background-light m-1">
                            <Link to="/rewards-report">Rewards Report</Link>
                        </div>
                        <div className="column is-narrow has-background-light m-1">
                            <Link to="/add-user">Add User</Link>
                        </div>
                        <div className="column is-narrow has-background-light m-1">
                            <Link to="/login-as">Login as</Link>
                        </div>
                        <LogoutButton me={me} />
                    </>
                )}
            </div>{" "}
            {me?.isAdmin && (
                <div className="is-align-items-flex-start"> {children}</div>
            )}
            {!me?.isAdmin && <LoginForm setMe={setMe} />}
            <footer>
                <br />
                <br />
                <br />© 2023 Encointer Association
            </footer>
        </div>
    );
};

export default InternalLayout;
