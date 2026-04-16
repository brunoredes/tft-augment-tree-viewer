<script lang="ts">
import { Background, Controls, SvelteFlow } from '@xyflow/svelte';
import '@xyflow/svelte/dist/style.css';
import type { Edge, Node, NodeTypes } from '@xyflow/svelte';
import type { Direction } from '../lib/layout';

type Props = {
  nodes: Node[];
  edges: Edge[];
  direction: Direction;
  nodeTypes: NodeTypes;
  onToggle: () => void;
};

const { nodes, edges, direction, nodeTypes, onToggle }: Props = $props();
</script>

<div class="canvas-wrapper">
	<SvelteFlow {nodes} {edges} {nodeTypes} fitView>
		<Background />
		<Controls />
	</SvelteFlow>
	<button class="toggle-btn" onclick={onToggle} type="button">
		{direction === "TB" ? "Switch to Horizontal" : "Switch to Vertical"}
	</button>
</div>

<style>
	.canvas-wrapper {
		position: relative;
		width: 100%;
		height: 100vh;
	}

	.toggle-btn {
		position: absolute;
		top: 1rem;
		right: 1rem;
		z-index: 10;
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		background: #fff;
		border: 1px solid #ccc;
		border-radius: 0.375rem;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
	}

	.toggle-btn:hover {
		background: #f4f4f4;
	}
</style>
