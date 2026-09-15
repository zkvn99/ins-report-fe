<script setup>
const props = defineProps({ state: { type: String, default: 'unknown' } })
const LABELS = { action: '확인 필요', watch: '관리', good: '양호', info: '참고', unknown: '자료 없음' }
</script>

<template>
  <span :class="['status-tag', state]">{{ LABELS[state] || LABELS.unknown }}</span>
</template>
