import CidSelect from "./CidSelect";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";

const StartEndForm = ({ handleSubmit }) => {
    const [start, setStart] = useState(new Date());
    const [end, setEnd] = useState(new Date());
    const handleStart = (date) => {
        setStart(date);
    };
    const handleEnd = (date) => {
        setEnd(date);
    };
    return (
        <form>
            <div style={{ width: "min(100%, 600px)" }}>
                <CidSelect />
                Start:
                <DatePicker
                    selected={start}
                    onChange={handleStart}
                    name="start"
                />
                <br />
                End:
                <br />
                <DatePicker selected={end} onChange={handleEnd} name="end" />
                <br />
                <br />
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

export default StartEndForm;
