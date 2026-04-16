<script lang="ts">
import type { Edge, Node } from '@xyflow/svelte';
import { applyLayout, type Direction } from '../lib/layout';
import { buildFlowData, getHiddenIds } from '../lib/tree';
import CollapseNode from './CollapseNode.svelte';
import FlowCanvas from './FlowCanvas.svelte';

const { nodes: rawNodes, edges: rawEdges, childrenMap } = buildFlowData();

const nodeTypes = { collapseNode: CollapseNode };

let direction = $state<Direction>('TB');
let collapsedIds = $state(new Set<string>());

const toggleCollapse = (id: string) => {
  collapsedIds = new Set(
    collapsedIds.has(id)
      ? [...collapsedIds].filter((x) => x !== id)
      : [...collapsedIds, id],
  );
};

const hiddenIds = $derived(getHiddenIds(collapsedIds, childrenMap));

const visibleNodes = $derived<Node[]>(
  rawNodes
    .filter((n) => !hiddenIds.has(n.id))
    .map((n) => ({
      ...n,
      data: {
        ...n.data,
        isCollapsed: collapsedIds.has(n.id),
        direction,
        onToggle: toggleCollapse,
      },
    })),
);

const visibleEdges = $derived<Edge[]>(
  rawEdges.filter((e) => !hiddenIds.has(e.source) && !hiddenIds.has(e.target)),
);

const nodes = $derived<Node[]>(
  applyLayout(visibleNodes, visibleEdges, direction),
);

const toggleDirection = () => {
  direction = direction === 'TB' ? 'LR' : 'TB';
};
</script>

<FlowCanvas {nodes} edges={visibleEdges} {direction} {nodeTypes} onToggle={toggleDirection} />
