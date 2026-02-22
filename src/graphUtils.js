// Tarjan's SCC algorithm — returns array of SCCs (each an array of node IDs).
// adj: { nodeId: [targetId, ...] }
export function findSCCs(adj) {
    let index = 0;
    const stack = [];
    const onStack = new Set();
    const indices = {};
    const lowlinks = {};
    const sccs = [];

    function strongconnect(v) {
        indices[v] = lowlinks[v] = index++;
        stack.push(v);
        onStack.add(v);

        for (const w of adj[v] || []) {
            if (indices[w] === undefined) {
                strongconnect(w);
                lowlinks[v] = Math.min(lowlinks[v], lowlinks[w]);
            } else if (onStack.has(w)) {
                lowlinks[v] = Math.min(lowlinks[v], indices[w]);
            }
        }

        if (lowlinks[v] === indices[v]) {
            const scc = [];
            let w;
            do {
                w = stack.pop();
                onStack.delete(w);
                scc.push(w);
            } while (w !== v);
            sccs.push(scc);
        }
    }

    for (const v of Object.keys(adj)) {
        if (indices[v] === undefined) strongconnect(v);
    }
    return sccs;
}
