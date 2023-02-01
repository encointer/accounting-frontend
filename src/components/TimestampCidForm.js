import { useState } from "react";
import CidSelect from "./CidSelect";
import DateTimePicker from "react-datetime-picker";

const TimestampCidForm = ({ handleSubmit }) => {
    const [date, setDate] = useState(
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
                    <label>Date</label>
                    <div className="control">
                        <DateTimePicker
                            value={date}
                            onChange={(date) => setDate(date)}
                        />
                    </div>
                </div>
                <CidSelect />
                <div className="field">
                    <label>Password</label>
                    <div className="control">
                        <input
                            className="input"
                            type="password"
                            name="token"
                        />
                    </div>
                </div>

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

export default TimestampCidForm;
