import CidSelect from "./CidSelect";

const CidForm = ({ handleSubmit }) => {
    return (
        <form>
            <div style={{width: 'min(100%, 600px)'}}>
                <CidSelect/>
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
                        <button className="button is-link" onClick={handleSubmit}>
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default CidForm;
