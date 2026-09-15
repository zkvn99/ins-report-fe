<script setup>
import { computed } from 'vue'
import { formatWon, formatPercent } from '../formatters.js'

const props = defineProps({ item: { type: Object, required: true } })
const width = computed(() => `${Math.min(100, Math.max(0, props.item.ratio * 100))}%`)
</script>

<template>
  <div class="coverage-progress">
    <div class="coverage-progress-head">
      <b>{{ item.leaf || item.name }}</b>
      <strong :class="item.status.toLowerCase()">
        {{ item.status === 'ENOUGH' ? '충분' : item.status === 'ABSENT' ? '없음' : `${formatWon(item.gapWon)} 부족` }}
      </strong>
    </div>
    <div class="coverage-progress-amounts">
      <span>현재 {{ formatWon(item.currentWon) }}</span>
      <span>권장 {{ formatWon(item.targetWon) }}</span>
    </div>
    <div class="progress-track"><i :style="{ width }" /></div>
    <small>{{ formatPercent(item.ratio) }}</small>
  </div>
</template>
