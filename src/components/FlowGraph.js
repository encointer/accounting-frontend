import { useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import { findSCCs } from "../graphUtils";

const typeColors = {
    acceptancePoint: "#3273dc",
    voucher: "#ff9f43",
    gov: "#b86bff",
    personal: "#23d160",
};

const FlowGraph = ({ nodes, edges }) => {
    const containerRef = useRef(null);
    const cyRef = useRef(null);

    useEffect(() => {
        if (!nodes?.length || !containerRef.current) return;

        // Build adjacency list and find circular flows
        const adj = {};
        for (const n of nodes) adj[n.id] = [];
        for (const e of edges) {
            if (adj[e.source]) adj[e.source].push(e.target);
        }
        const sccs = findSCCs(adj);
        // Separate reciprocal pairs (SCC size 2) from true cycles (size 3+)
        const reciprocalNodes = new Set();
        const circularNodes = new Set();
        for (const scc of sccs) {
            if (scc.length === 2) scc.forEach((id) => reciprocalNodes.add(id));
            else if (scc.length >= 3) scc.forEach((id) => circularNodes.add(id));
        }
        const reciprocalEdges = new Set();
        const circularEdges = new Set();
        for (const e of edges) {
            if (circularNodes.has(e.source) && circularNodes.has(e.target)) {
                circularEdges.add(`${e.source}|${e.target}`);
            } else if (reciprocalNodes.has(e.source) && reciprocalNodes.has(e.target)) {
                reciprocalEdges.add(`${e.source}|${e.target}`);
            }
        }

        // Compute scales
        const nodeFlows = {};
        for (const e of edges) {
            nodeFlows[e.source] = (nodeFlows[e.source] || 0) + e.amount;
            nodeFlows[e.target] = (nodeFlows[e.target] || 0) + e.amount;
        }
        const maxFlow = Math.max(...Object.values(nodeFlows), 1);
        const maxAmount = Math.max(...edges.map((e) => e.amount), 1);

        const cyNodes = nodes.map((n) => ({
            data: {
                id: n.id,
                label: n.name,
                type: n.type,
                size: 20 + ((nodeFlows[n.id] || 0) / maxFlow) * 60,
                borderColor: circularNodes.has(n.id) ? "#FFD700" : "#888",
                borderWidth: circularNodes.has(n.id) ? 3 : 1,
            },
        }));

        const cyEdges = edges.map((e) => ({
            data: {
                source: e.source,
                target: e.target,
                amount: e.amount,
                count: e.count,
                width: 1 + (e.amount / maxAmount) * 7,
                color: circularEdges.has(`${e.source}|${e.target}`)
                    ? "#FFD700"
                    : reciprocalEdges.has(`${e.source}|${e.target}`)
                        ? "#999"
                        : "#ccc",
            },
        }));

        if (cyRef.current) cyRef.current.destroy();

        cyRef.current = cytoscape({
            container: containerRef.current,
            elements: [...cyNodes, ...cyEdges],
            style: [
                {
                    selector: "node",
                    style: {
                        label: "data(label)",
                        width: "data(size)",
                        height: "data(size)",
                        "background-color": (ele) =>
                            typeColors[ele.data("type")] || "#888",
                        "border-color": "data(borderColor)",
                        "border-width": "data(borderWidth)",
                        "font-size": "10px",
                        "text-valign": "bottom",
                        "text-margin-y": 5,
                        "text-wrap": "ellipsis",
                        "text-max-width": "80px",
                    },
                },
                {
                    selector: "edge",
                    style: {
                        width: "data(width)",
                        "line-color": "data(color)",
                        "target-arrow-color": "data(color)",
                        "target-arrow-shape": "triangle",
                        "curve-style": "bezier",
                        opacity: 0.7,
                    },
                },
            ],
            layout: {
                name: "cose",
                animate: false,
                nodeRepulsion: () => 8000,
                idealEdgeLength: () => 120,
                edgeElasticity: () => 100,
            },
        });

        return () => {
            if (cyRef.current) cyRef.current.destroy();
        };
    }, [nodes, edges]);

    return (
        <div
            ref={containerRef}
            style={{ width: "100%", height: "70vh", border: "1px solid #eee" }}
        />
    );
};

export default FlowGraph;
