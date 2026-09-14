<script setup>
import { computed } from 'vue'

const props = defineProps({
  points: { type: Array, default: () => [] },
  unit: { type: String, default: '' },
  valueScale: { type: Number, default: 1 }
})

const rows = computed(() => props.points.filter(point => Number.isFinite(point.value)))
const maxValue = computed(() => Math.max(1, ...rows.value.map(point => point.value / props.valueScale)))
function valueOf(point) { return point.value / props.valueScale }
function x(index) { return 28 + index * (236 / Math.max(1, rows.value.length)) + 12 }
function width() { return Math.min(34, 160 / Math.max(1, rows.value.length)) }
function y(value) { return 104 - (value / maxValue.value) * 72 }
function label(point) { return point.label ?? point.year ?? '' }
function number(value) { return Number(value).toLocaleString('ko-KR', { maximumFractionDigits: 1 }) }
</script>

<template>
  <div class="chart-wrap">
    <svg class="bar-chart" viewBox="0 0 290 135" role="img">
      <line x1="28" y1="104" x2="276" y2="104" class="axis" />
      <g v-for="(point, index) in rows" :key="`${label(point)}-${index}`">
        <rect
          :x="x(index) - width() / 2"
          :y="y(valueOf(point))"
          :width="width()"
          :height="104 - y(valueOf(point))"
          rx="4"
          class="bar"
        />
        <text :x="x(index)" :y="y(valueOf(point)) - 6" text-anchor="middle" class="value-text">{{ number(valueOf(point)) }}</text>
        <text :x="x(index)" y="121" text-anchor="middle" class="label-text">{{ label(point) }}</text>
      </g>
    </svg>
    <div class="chart-unit">{{ unit }}</div>
  </div>
</template>
