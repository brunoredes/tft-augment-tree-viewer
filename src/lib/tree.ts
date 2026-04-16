import type { Edge, Node } from '@xyflow/svelte';
import { probabilities } from './probabilities';

export type TreeNode = {
  id: string;
  label: string;
  children: TreeNode[];
};

const buildTree = (): TreeNode => ({
  id: 'start',
  label: 'Start',
  children: [
    {
      id: 'start-S',
      label: 'S',
      children: [
        {
          id: 'start-S-S',
          label: 'S',
          children: [
            { id: 'start-S-S-G', label: 'G', children: [] },
            { id: 'start-S-S-P', label: 'P', children: [] },
          ],
        },
        {
          id: 'start-S-G',
          label: 'G',
          children: [
            { id: 'start-S-G-G', label: 'G', children: [] },
            { id: 'start-S-G-P', label: 'P', children: [] },
          ],
        },
        {
          id: 'start-S-P',
          label: 'P',
          children: [{ id: 'start-S-P-P', label: 'P', children: [] }],
        },
      ],
    },
    {
      id: 'start-G',
      label: 'G',
      children: [
        {
          id: 'start-G-S',
          label: 'S',
          children: [
            { id: 'start-G-S-G', label: 'G', children: [] },
            { id: 'start-G-S-P', label: 'P', children: [] },
          ],
        },
        {
          id: 'start-G-G',
          label: 'G',
          children: [
            { id: 'start-G-G-G', label: 'G', children: [] },
            { id: 'start-G-G-P', label: 'P', children: [] },
          ],
        },
        {
          id: 'start-G-P',
          label: 'P',
          children: [
            { id: 'start-G-P-S', label: 'S', children: [] },
            { id: 'start-G-P-G', label: 'G', children: [] },
            { id: 'start-G-P-P', label: 'P', children: [] },
          ],
        },
      ],
    },
    {
      id: 'start-P',
      label: 'P',
      children: [
        {
          id: 'start-P-S',
          label: 'S',
          children: [
            { id: 'start-P-S-G', label: 'G', children: [] },
            { id: 'start-P-S-P', label: 'P', children: [] },
          ],
        },
        {
          id: 'start-P-G',
          label: 'G',
          children: [
            { id: 'start-P-G-G', label: 'G', children: [] },
            { id: 'start-P-G-P', label: 'P', children: [] },
          ],
        },
        {
          id: 'start-P-P',
          label: 'P',
          children: [
            { id: 'start-P-P-G', label: 'G', children: [] },
            { id: 'start-P-P-P', label: 'P', children: [] },
          ],
        },
      ],
    },
  ],
});

const collectNodes = (node: TreeNode, acc: Node[]): void => {
  acc.push({
    id: node.id,
    type: 'collapseNode',
    position: { x: 0, y: 0 },
    data: {
      label: node.label,
      hasChildren: node.children.length > 0,
      probability: probabilities[node.id] ?? null,
    },
  });
  for (const child of node.children) collectNodes(child, acc);
};

const collectEdges = (node: TreeNode, acc: Edge[]): void => {
  for (const child of node.children) {
    acc.push({
      id: `${node.id}->${child.id}`,
      source: node.id,
      target: child.id,
    });
    collectEdges(child, acc);
  }
};

const buildChildrenMap = (node: TreeNode, map: Map<string, string[]>): void => {
  map.set(
    node.id,
    node.children.map((c) => c.id),
  );
  for (const child of node.children) buildChildrenMap(child, map);
};

const collectDescendants = (
  id: string,
  map: Map<string, string[]>,
  acc: Set<string>,
): void => {
  for (const child of map.get(id) ?? []) {
    acc.add(child);
    collectDescendants(child, map, acc);
  }
};

export const getHiddenIds = (
  collapsedIds: Set<string>,
  childrenMap: Map<string, string[]>,
): Set<string> => {
  const hidden = new Set<string>();
  for (const id of collapsedIds) collectDescendants(id, childrenMap, hidden);
  return hidden;
};

export const buildFlowData = (): {
  nodes: Node[];
  edges: Edge[];
  childrenMap: Map<string, string[]>;
} => {
  const root = buildTree();
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const childrenMap = new Map<string, string[]>();
  collectNodes(root, nodes);
  collectEdges(root, edges);
  buildChildrenMap(root, childrenMap);
  return { nodes, edges, childrenMap };
};
