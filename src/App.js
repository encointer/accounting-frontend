import "bulma/css/bulma.min.css";
import "./Spinner.css";
import { Routes, Route } from "react-router-dom";
import { React } from "react";
import AccountReport from "./components/AccountReport";
import AccountOverview from "./components/AccountOverview";
import Home from "./components/Home";
import TurnoverReport from "./components/TurnoverReport";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Home></Home>} />
                <Route path="/account-report" element={<AccountReport />} />
                <Route path="/account-overview" element={<AccountOverview />} />
                <Route path="/turnover-report" element={<TurnoverReport />} />
            </Routes>
        </div>
    );
}

export default App;
