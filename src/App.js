import "./styles.scss";
import "./Spinner.css";
import { Routes, Route } from "react-router-dom";
import { React } from "react";
import AccountReport from "./components/AccountReport";
import AccountOverview from "./components/AccountOverview";
import TurnoverReport from "./components/TurnoverReport";
import InternalLayout from "./components/InternalLayout";
import AccountTokens from "./components/AccountTokens";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<AccountReport />} />
                <Route
                    path="/internal"
                    element={
                        <InternalLayout>
                            <div></div>
                        </InternalLayout>
                    }
                />
                <Route path="/account-overview" element={<AccountOverview />} />
                <Route path="/turnover-report" element={<TurnoverReport />} />
                <Route path="/account-tokens" element={<AccountTokens />} />
            </Routes>
        </div>
    );
}

export default App;
