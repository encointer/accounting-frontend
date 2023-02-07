import { Link } from "react-router-dom";

const Layout = ({ children, title, communityName }) => {
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
                <div className="column"></div>

                <div className="column is-narrow m-1">{title}</div>
            </div>
            <div className="is-align-items-flex-start"> {children}</div>
            <footer>
                <br />
                <br />
                <br />© 2023 Encointer Association
            </footer>
        </div>
    );
};

export default Layout;
