<script lang="ts">
import { Handle, Position } from '@xyflow/svelte';
import type { Direction } from '../lib/layout';

type NodeData = {
  label: string;
  hasChildren: boolean;
  isCollapsed: boolean;
  direction: Direction;
  probability: number | null;
  onToggle: (id: string) => void;
};

type Props = { data: NodeData; id: string };

const { data, id }: Props = $props();

const nodeBg = $derived(
  data.label === 'S'
    ? '#C0C0C0'
    : data.label === 'G'
      ? '#D3AF37'
      : data.label === 'P'
        ? 'linear-gradient(135deg, #fff 0%, #c084fc 20%, #93c5fd 37%, #cefff7 52%, #fde8f0 70%, #fefce8 100%)'
        : '#fff',
);

const sourcePosition = $derived(
  data.direction === 'LR' ? Position.Right : Position.Bottom,
);
const targetPosition = $derived(
  data.direction === 'LR' ? Position.Left : Position.Top,
);
</script>

<Handle type="target" position={targetPosition} />

<div class="node" style="background: {nodeBg};">
  <div class="content">
    <span class="label">{data.label}</span>
    {#if data.probability !== null}
      <span class="probability">{data.probability}%</span>
    {/if}
  </div>
  {#if data.hasChildren}
    <button
      class="toggle"
      type="button"
      aria-label={data.isCollapsed ? 'Expand node' : 'Collapse node'}
      onclick={() => data.onToggle(id)}
    >
      {data.isCollapsed ? '+' : '−'}
    </button>
  {/if}
</div>

<Handle type="source" position={sourcePosition} />

<style>
  .node {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.625rem;
    border: 1px solid #aaa;
    border-radius: 0.375rem;
    font-size: 0.8125rem;
    font-weight: 600;
    min-width: 5rem;
    justify-content: space-between;
    color: #000;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    gap: 0.125rem;
  }

  .probability {
    font-size: 0.6875rem;
    font-weight: 400;
    opacity: 0.75;
  }

  .toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    padding: 0;
    font-size: 1rem;
    line-height: 1;
    cursor: pointer;
    background: #f0f0f0;
    border: 1px solid #bbb;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .toggle:hover {
    background: #e0e0e0;
  }
</style>
