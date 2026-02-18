import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MeContext } from "../App";
import LoginForm from "./LoginForm";
import LogoutButton from "./LogoutButton";

const InternalLayout = ({ children }) => {
    const { me, setMe } = useContext(MeContext);
    const [isActive, setisActive] = useState(false);
    const buttonRef = useRef();

    useEffect(() => {
        window.onclick = (event) => {
            if (event.target !== buttonRef.current) {
                setisActive(false);
            }
        };
    }, []);

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
                <div className="column is-6"></div>
                {(me?.isAdmin || me?.isReadonlyAdmin) && (
                    <>
                        <div
                            style={{ marginRight: "2vw" }}
                            className={`dropdown ${
                                isActive ? "is-active" : ""
                            }`}
                        >
                            <div className="dropdown-trigger">
                                <button
                                    className="button navbar-link"
                                    aria-haspopup="true"
                                    aria-controls="dropdown-menu"
                                    onClick={() => {
                                        setisActive(!isActive);
                                    }}
                                    ref={buttonRef}
                                >
                                    Menu
                                </button>
                            </div>
                            <div
                                className="dropdown-menu"
                                id="dropdown-menu"
                                role="menu"
                            >
                                <div className="dropdown-content">
                                    <div className="dropdown-item">
                                        <Link to="/account-overview">
                                            Account Overview
                                        </Link>
                                    </div>
                                    <div className="dropdown-item">
                                        <Link to="/turnover-report">
                                            Turnover Report
                                        </Link>
                                    </div>
                                    <div className="dropdown-item">
                                        <Link to="/money-velocity-report">
                                            Money Velocity Report
                                        </Link>
                                    </div>
                                    <div className="dropdown-item">
                                        <Link to="/rewards-report">
                                            Rewards Report
                                        </Link>
                                    </div>
                                    <div className="dropdown-item">
                                        <Link to="/reputables-by-cindex">
                                            Reputables by Cindex
                                        </Link>
                                    </div>
                                    <div className="dropdown-item">
                                        <Link to="/frequency-of-attendance">
                                            Frequency of Attendance
                                        </Link>
                                    </div>
                                    <div className="dropdown-item">
                                        <Link to="/transaction-activity">
                                            Transaction Activity
                                        </Link>
                                    </div>
                                    <div className="dropdown-item">
                                        <Link to="/sankey-report">
                                            Sankey Report
                                        </Link>
                                    </div>
                                    <div className="dropdown-item">
                                        <Link to="/community-flow">
                                            Community Flow
                                        </Link>
                                    </div>
                                    <div className="dropdown-item">
                                        <Link to="/faucet-drips">
                                            Faucet Drips
                                        </Link>
                                    </div>
                                    {me.isAdmin && (
                                        <>
                                            <div className="dropdown-item">
                                                <Link to="/add-user">
                                                    Add User
                                                </Link>
                                            </div>
                                            <div className="dropdown-item">
                                                <Link to="/login-as">
                                                    Login as
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <LogoutButton me={me} />
                    </>
                )}
            </div>{" "}
            {(me?.isAdmin || me?.isReadonlyAdmin) && (
                <div className="is-align-items-flex-start"> {children}</div>
            )}
            {!(me?.isAdmin || me?.isReadonlyAdmin) && (
                <LoginForm setMe={setMe} />
            )}
            <footer>
                <br />
                <br />
                <br />© 2025 Encointer Association
            </footer>
        </div>
    );
};

export default InternalLayout;
