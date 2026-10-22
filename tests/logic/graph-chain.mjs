import assert from "node:assert/strict";
import { collectChain, nodeState } from "../../src/logic/graphChain.js";
import { createTopologicalLayout } from "../../src/logic/topologicalLayout.js";

const node = (id, priority, prerequisites = []) => ({ id, label: id.toUpperCase(), priority, cat: "x", prerequisites });
const nodes = [node("a", 1), node("b", 2, ["a"]), node("c", 3, ["b"]), node("d", 4, ["c"]), node("e", 5, ["a"])];
const graph = { nodes, edges: nodes.flatMap((n) => n.prerequisites.map((p) => [p, n.id])), categories: { x: {} } };
const layout = createTopologicalLayout(graph, { align: "center" });

const chain = collectChain("c", layout);
assert.deepEqual([...chain.ancestors].sort(), ["a", "b"], "ancestors are transitive");
assert.deepEqual([...chain.unlocks], ["d"], "unlocks are direct children");
assert.ok(chain.chainEdges.has("a->b") && chain.chainEdges.has("b->c"), "chain edges reach the node");
assert.ok(!chain.chainEdges.has("a->e"), "side branches are not part of the chain");
assert.ok(chain.outEdges.has("c->d"));
assert.equal(collectChain("zzz", layout).nodes.size, 0, "unknown node gives an empty focus");

// align center: la etapa de 2 nodos (b, e) y la de 1 nodo comparten centro vertical.
const center = (id) => layout.positions.get(id).y + layout.config.nodeHeight / 2;
assert.equal(center("a"), (center("b") + center("e")) / 2, "single-node stage is centred against the tallest stage");

const progress = { checked: new Set(["a"]), of: (id) => ({ a: { displayScore: 108, isComplete: true }, b: { displayScore: 70 } })[id] ?? {} };
assert.equal(nodeState(nodes[0], progress).kind, "extra");
assert.equal(nodeState(nodes[1], progress).kind, "progress");
assert.equal(nodeState(nodes[4], progress).kind, "available");
assert.equal(nodeState(nodes[2], progress).kind, "blocked");
assert.deepEqual(nodeState(nodes[2], progress).missing, ["b"]);

console.log("graph chain: OK");
