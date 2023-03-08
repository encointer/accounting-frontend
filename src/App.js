import "./styles.scss";
import "./Spinner.css";
import { Routes, Route } from "react-router-dom";
import { createContext, React, useEffect, useState } from "react";
import AccountReport from "./components/AccountReport";
import AccountOverview from "./components/AccountOverview";
import TurnoverReport from "./components/TurnoverReport";
import InternalLayout from "./components/InternalLayout";
import RewardsOverview from "./components/RewardsOverview";
import { apiGet } from "./api";
import LoginAs from "./components/LoginAs";
import AddUser from "./components/AddUser";
import ChangePassword from "./components/ChangePassword";
import SelectedRangeOverview from "./components/SelectedRangeOverview";

export const MeContext = createContext({});

function App() {
    const [me, setMe] = useState({});

    useEffect(() => {
        const fetchMe = async () => {
            const res = await apiGet("auth/me");
            if ([401, 403].includes(res.status)) {
                setMe({});
                return;
            }
            const me = await res.json();
            setMe(me);
        };
        fetchMe().catch(console.error);
    }, []);

    return (
        <MeContext.Provider value={{ me, setMe }}>
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
                    <Route
                        path="/account-overview"
                        element={<AccountOverview />}
                    />
                    <Route
                        path="/selected-range"
                        element={<SelectedRangeOverview />}
                    />
                    <Route
                        path="/turnover-report"
                        element={<TurnoverReport />}
                    />
                    <Route
                        path="/rewards-report"
                        element={<RewardsOverview />}
                    />
                    <Route path="/add-user" element={<AddUser />} />
                    <Route path="/account-report" element={<AccountReport />} />
                    <Route path="/login-as" element={<LoginAs />} />
                    <Route
                        path="/change-password"
                        element={<ChangePassword />}
                    />
                </Routes>
            </div>
        </MeContext.Provider>
    );
}

export default App;
