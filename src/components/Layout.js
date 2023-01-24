import "bulma/css/bulma.min.css";

const Layout = ({ children }) => {
    return (
        <div
            className="main"
            style={{
                paddingLeft: "10vw",
                paddingRight: "10vw",
                minHeight: "100vh",
                margin: 0,
                display: "grid",
                gridTemplateRows: "auto 1fr auto",
            }}
        >
            <div class="columns is-vcentered">
                <div className="column is-3">
                    <img src="https://encointer.org/wp-content/uploads/2022/03/Frame-4.png" />
                </div>
                <div className="column is-size-3 has-text-right">Accounting</div>
            </div>
            {children}
            <footer>
                <br />
                <br />
                <br />
                © 2023 Encointer Association
            </footer>
        </div>
    );
};

export default Layout;
