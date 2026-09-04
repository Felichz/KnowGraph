const DEFAULTS = {
  nodeWidth: 236,
  nodeHeight: 86,
  columnGap: 116,
  rowGap: 38,
  paddingX: 104,
  paddingTop: 170,
  paddingBottom: 110,
  sweeps: 8,
};

function compareNodes(a, b, categoryOrder) {
  return (
    a.priority - b.priority ||
    (categoryOrder.get(a.cat) ?? 0) - (categoryOrder.get(b.cat) ?? 0) ||
    a.label.localeCompare(b.label)
  );
}

function averageNeighborOrder(nodeId, neighbors, orderById) {
  const values = [...(neighbors.get(nodeId) ?? [])]
    .map((id) => orderById.get(id))
    .filter(Number.isFinite);
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function reorderLayer(layer, neighbors, orderById, categoryOrder) {
  const previousOrder = new Map(layer.map((node, index) => [node.id, index]));
  return [...layer].sort((a, b) => {
    const aCenter = averageNeighborOrder(a.id, neighbors, orderById);
    const bCenter = averageNeighborOrder(b.id, neighbors, orderById);
    if (aCenter !== null && bCenter !== null && Math.abs(aCenter - bCenter) > 0.001) return aCenter - bCenter;
    if (aCenter !== null && bCenter === null) return -1;
    if (aCenter === null && bCenter !== null) return 1;
    return (previousOrder.get(a.id) ?? 0) - (previousOrder.get(b.id) ?? 0) || compareNodes(a, b, categoryOrder);
  });
}

function buildOrderIndex(layers) {
  const order = new Map();
  layers.forEach((layer) => layer.forEach((node, index) => order.set(node.id, index)));
  return order;
}

export function createTopologicalLayout(graph, options = {}) {
  const config = { ...DEFAULTS, ...options };
  const nodesById = new Map(graph.nodes.map((node) => [node.id, node]));
  const categoryOrder = new Map(Object.keys(graph.categories).map((id, index) => [id, index]));
  const parents = new Map(graph.nodes.map((node) => [node.id, new Set()]));
  const children = new Map(graph.nodes.map((node) => [node.id, new Set()]));
  const validEdges = [];

  graph.edges.forEach(([source, target]) => {
    if (!nodesById.has(source) || !nodesById.has(target) || source === target) return;
    parents.get(target).add(source);
    children.get(source).add(target);
    validEdges.push([source, target]);
  });

  const indegree = new Map(graph.nodes.map((node) => [node.id, parents.get(node.id).size]));
  const queue = graph.nodes
    .filter((node) => indegree.get(node.id) === 0)
    .sort((a, b) => compareNodes(a, b, categoryOrder));
  const rankById = new Map();
  const visited = new Set();

  while (queue.length) {
    const node = queue.shift();
    visited.add(node.id);
    const parentRanks = [...parents.get(node.id)].map((id) => rankById.get(id)).filter(Number.isFinite);
    rankById.set(node.id, parentRanks.length ? Math.max(...parentRanks) + 1 : 0);
    [...children.get(node.id)]
      .map((id) => nodesById.get(id))
      .sort((a, b) => compareNodes(a, b, categoryOrder))
      .forEach((child) => {
        indegree.set(child.id, indegree.get(child.id) - 1);
        if (indegree.get(child.id) === 0) {
          queue.push(child);
          queue.sort((a, b) => compareNodes(a, b, categoryOrder));
        }
      });
  }

  const cyclicNodes = graph.nodes
    .filter((node) => !visited.has(node.id))
    .sort((a, b) => compareNodes(a, b, categoryOrder));
  cyclicNodes.forEach((node) => {
    const knownParentRanks = [...parents.get(node.id)].map((id) => rankById.get(id)).filter(Number.isFinite);
    rankById.set(node.id, knownParentRanks.length ? Math.max(...knownParentRanks) + 1 : 0);
  });

  const maxRank = Math.max(0, ...rankById.values());
  const layers = Array.from({ length: maxRank + 1 }, () => []);
  graph.nodes.forEach((node) => layers[rankById.get(node.id) ?? 0].push(node));
  layers.forEach((layer) => layer.sort((a, b) => compareNodes(a, b, categoryOrder)));

  for (let pass = 0; pass < config.sweeps; pass += 1) {
    let orderById = buildOrderIndex(layers);
    for (let rank = 1; rank < layers.length; rank += 1) {
      layers[rank] = reorderLayer(layers[rank], parents, orderById, categoryOrder);
      orderById = buildOrderIndex(layers);
    }
    orderById = buildOrderIndex(layers);
    for (let rank = layers.length - 2; rank >= 0; rank -= 1) {
      layers[rank] = reorderLayer(layers[rank], children, orderById, categoryOrder);
      orderById = buildOrderIndex(layers);
    }
  }

  const rowStep = config.nodeHeight + config.rowGap;
  const columnStep = config.nodeWidth + config.columnGap;
  const maxLayerSize = Math.max(1, ...layers.map((layer) => layer.length));
  const contentHeight = maxLayerSize * config.nodeHeight + Math.max(0, maxLayerSize - 1) * config.rowGap;
  const height = config.paddingTop + contentHeight + config.paddingBottom;
  const width = config.paddingX * 2 + config.nodeWidth + maxRank * columnStep;
  const positions = new Map();

  layers.forEach((layer, rank) => {
    const startY = config.paddingTop;
    layer.forEach((node, index) => {
      positions.set(node.id, {
        node,
        rank,
        order: index,
        x: config.paddingX + rank * columnStep,
        y: startY + index * rowStep,
      });
    });
  });

  return {
    config,
    layers,
    positions,
    edges: validEdges,
    parents,
    children,
    maxRank,
    width,
    height,
    hasCycle: cyclicNodes.length > 0,
  };
}

export function collectTopologyFocus(nodeId, layout) {
  if (!nodeId || !layout.positions.has(nodeId)) {
    return { ancestors: new Set(), descendants: new Set(), nodes: new Set(), edges: new Set() };
  }

  const walk = (adjacency) => {
    const found = new Set();
    for (const next of adjacency.get(nodeId) ?? []) found.add(next);
    return found;
  };

  const ancestors = walk(layout.parents);
  const descendants = walk(layout.children);
  const nodes = new Set([nodeId, ...ancestors, ...descendants]);
  const edges = new Set(
    layout.edges
      .filter(([source, target]) => source === nodeId || target === nodeId)
      .map(([source, target]) => `${source}->${target}`)
  );
  return { ancestors, descendants, nodes, edges };
}
