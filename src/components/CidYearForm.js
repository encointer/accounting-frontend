import CidSelect from "./CidSelect";

const CidYearForm = ({ handleSubmit }) => {
    return (
        <form>
            <div style={{ width: "min(100%, 600px)" }}>
                <CidSelect />

                <div className="field">
                    <label>Year</label>
                    <div className="control">
                        <div className="select">
                            <select class="form-select" id="year" name="year">
                                <option value="2025">2025</option>
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                                <option value="2022">2022</option>
                            </select>
                        </div>
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

export default CidYearForm;
