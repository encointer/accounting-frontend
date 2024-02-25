import { useState } from "react";
import CidSelect from "./CidSelect";
import DateTimePicker from "react-datetime-picker";
import AccountSelect from "./AccountSelect";

const AccountStartEndForm = ({ handleSubmit }) => {
    const [startDate, setStartDate] = useState(
        (() => {
            const d = new Date();
            d.setSeconds(0);
            d.setMilliseconds(0);
            return d;
        })()
    );

    const [endDate, setEndDate] = useState(
        (() => {
            const d = new Date();
            d.setSeconds(0);
            d.setMilliseconds(0);
            return d;
        })()
    );

    return (
        <form>
            <div>
                <div className="field">
                    <label>Start Date</label>
                    <div className="control">
                        <DateTimePicker
                            name="startDate"
                            value={startDate}
                            onChange={(date) => setStartDate(date)}
                        />
                    </div>
                </div>

                <div className="field">
                    <label>End Date</label>
                    <div className="control">
                        <DateTimePicker
                            name="endDate"
                            value={endDate}
                            onChange={(date) => setEndDate(date)}
                        />
                    </div>
                </div>

                <AccountSelect />

                <div className="field is-grouped">
                    <div className="control">
                        <button
                            className="button is-link"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default AccountStartEndForm;
