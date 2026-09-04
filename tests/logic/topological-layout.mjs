import assert from "node:assert/strict";
import { collectTopologyFocus, createTopologicalLayout } from "../../src/logic/topologicalLayout.js";

const nodes = [
  { id: "a", label: "A", cat: "base", priority: 1 },
  { id: "b", label: "B", cat: "base", priority: 2 },
  { id: "c", label: "C", cat: "branch", priority: 3 },
  { id: "d", label: "D", cat: "branch", priority: 4 },
  { id: "e", label: "E", cat: "branch", priority: 5 },
];

const graph = {
  nodes,
  edges: [["a", "b"], ["a", "c"], ["b", "d"], ["c", "d"], ["d", "e"]],
  categories: { base: {}, branch: {} },
};

const layout = createTopologicalLayout(graph);
assert.equal(layout.positions.size, nodes.length, "positions every node");
assert.equal(layout.maxRank, 3, "uses longest prerequisite path as rank");
assert.equal(layout.hasCycle, false, "recognizes a DAG");

for (const [source, target] of graph.edges) {
  assert.ok(
    layout.positions.get(source).rank < layout.positions.get(target).rank,
    `${source} must appear before ${target}`,
  );
}

layout.layers.forEach((layer) => {
  const positions = layer.map((node) => layout.positions.get(node.id)).sort((a, b) => a.y - b.y);
  for (let index = 1; index < positions.length; index += 1) {
    assert.ok(
      positions[index].y - positions[index - 1].y >= layout.config.nodeHeight + layout.config.rowGap,
      "nodes in one stage do not overlap",
    );
  }
});

const repeated = createTopologicalLayout(graph);
assert.deepEqual(
  [...layout.positions].map(([id, position]) => [id, position.rank, position.order, position.x, position.y]),
  [...repeated.positions].map(([id, position]) => [id, position.rank, position.order, position.x, position.y]),
  "layout is deterministic",
);

const rootFocus = collectTopologyFocus("a", layout);
assert.deepEqual([...rootFocus.descendants].sort(), ["b", "c"], "focus contains only direct dependants");
assert.equal(rootFocus.descendants.has("d"), false, "indirect descendants stay quiet");

const cyclic = createTopologicalLayout({
  nodes: nodes.slice(0, 2),
  edges: [["a", "b"], ["b", "a"]],
  categories: { base: {} },
});
assert.equal(cyclic.hasCycle, true, "cycles are reported without crashing the layout");
assert.equal(cyclic.positions.size, 2, "cyclic nodes remain visible");

console.log("topological layout: OK");
