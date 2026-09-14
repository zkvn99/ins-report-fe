<script setup>
import anatomyUrl from '../assets/anatomy.png'
import { ANATOMY_POINTS } from '../data/anatomy-positions.js'

const props = defineProps({
  areas: { type: Array, default: () => [] },
  highlightPosition: { type: String, default: null }
})

const POINTS = ANATOMY_POINTS
const COLORS = { action: '#bf414b', watch: '#ae7728', good: '#287d78', info: '#7a8993', unknown: '#aab7be' }
function point(area) { return POINTS[area.position] || POINTS[area.id] || POINTS.abdomen }
function color(area) { return COLORS[area.state] || COLORS.unknown }
</script>

<template>
  <svg class="anatomy-figure" viewBox="0 0 678 1704" role="img" aria-label="인체 위치 안내">
    <image :href="anatomyUrl" x="0" y="0" width="678" height="1704" />
    <g v-for="area in areas" :key="area.id">
      <circle :cx="point(area)[0]" :cy="point(area)[1]" r="35" :fill="color(area)" opacity=".13" />
      <circle :cx="point(area)[0]" :cy="point(area)[1]" r="14" :fill="color(area)" stroke="#fff" stroke-width="5" />
    </g>
    <circle
      v-if="highlightPosition && POINTS[highlightPosition]"
      :cx="POINTS[highlightPosition][0]"
      :cy="POINTS[highlightPosition][1]"
      r="47"
      fill="none"
      stroke="#193d50"
      stroke-width="5"
      stroke-dasharray="12 9"
    />
  </svg>
</template>
