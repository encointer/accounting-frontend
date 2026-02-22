import { useEffect, useState, forwardRef } from "react";
import { apiGet } from "../api";

const CidSelect = forwardRef(({ value, onLoad }, ref) => {
    const [cids, setCids] = useState([]);

    useEffect(() => {
        const getCids = async () => {
            const res = await apiGet(`communities/all-communities`);
            const data = await res.json();
            setCids(data);
            if (onLoad && data.length > 0) {
                onLoad(value || data[0].cid);
            }
        };

        getCids().catch(console.error);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (cids) {
        return (
            <div className="field">
                <label>CID</label>
                <div className="control">
                    <div className="select">
                        <select name="cid" defaultValue={value} ref={ref}>
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
});

export default CidSelect;
