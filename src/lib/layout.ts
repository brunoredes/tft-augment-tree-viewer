import Dagre from '@dagrejs/dagre';
import type { Edge, Node } from '@xyflow/svelte';

const NODE_WIDTH = 120;
const NODE_HEIGHT = 40;

export type Direction = 'TB' | 'LR';

export const applyLayout = (
  nodes: Node[],
  edges: Edge[],
  direction: Direction,
): Node[] => {
  const g = new Dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: direction, ranksep: 60, nodesep: 30 });

  for (const node of nodes)
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  for (const edge of edges) g.setEdge(edge.source, edge.target);

  Dagre.layout(g);

  return nodes.map((node) => {
    const { x, y } = g.node(node.id);
    return {
      ...node,
      position: { x: x - NODE_WIDTH / 2, y: y - NODE_HEIGHT / 2 },
    };
  });
};
