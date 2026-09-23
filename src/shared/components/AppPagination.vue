<script setup>
import { computed } from 'vue'

const props = defineProps({
  page: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['change'])

const visiblePages = computed(() => {
  const start = Math.max(0, Math.min(props.page - 2, props.totalPages - 5))
  const end = Math.min(props.totalPages, start + 5)
  return Array.from({ length: Math.max(0, end - start) }, (_, index) => start + index)
})

function moveTo(targetPage) {
  if (props.disabled || targetPage < 0 || targetPage >= props.totalPages || targetPage === props.page) return
  emit('change', targetPage)
}
</script>

<template>
  <nav v-if="totalPages > 0" class="app-pagination" aria-label="페이지 이동">
    <button type="button" :disabled="disabled || page === 0" aria-label="이전 페이지" @click="moveTo(page - 1)">‹</button>
    <button
      v-for="pageNumber in visiblePages"
      :key="pageNumber"
      type="button"
      :class="{ 'is-current': pageNumber === page }"
      :aria-current="pageNumber === page ? 'page' : undefined"
      :disabled="disabled"
      @click="moveTo(pageNumber)"
    >
      {{ pageNumber + 1 }}
    </button>
    <button type="button" :disabled="disabled || page >= totalPages - 1" aria-label="다음 페이지" @click="moveTo(page + 1)">›</button>
  </nav>
</template>
