import { useEffect, useState } from "react";
import { apiGet } from "../api";

const CidSelect = ({ value }) => {
    const [cids, setCids] = useState([]);

    useEffect(() => {
        const getCids = async () => {
            const res = await apiGet(`communities/all-communities`);
            setCids(await res.json());
        };

        getCids().catch(console.error);
    }, [value]);

    if (cids) {
        return (
            <div className="field">
                <label>CID</label>
                <div className="control">
                    <div className="select">
                        <select name="cid" defaultValue={value}>
                            {cids.map((cid, idx) => (
                                <option value={cid.cid} key={idx}>
                                    {cid.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        );
    }
};

export default CidSelect;
