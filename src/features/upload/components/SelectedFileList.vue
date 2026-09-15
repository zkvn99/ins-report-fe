<script setup>
defineProps({ files: { type: Array, default: () => [] }, disabled: { type: Boolean, default: false } })
defineEmits(['remove'])

function formatSize(size) {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}
</script>

<template>
  <ul v-if="files.length" class="selected-file-list">
    <li v-for="file in files" :key="`${file.name}-${file.size}-${file.lastModified}`">
      <span><b>{{ file.name }}</b><small>{{ formatSize(file.size) }}</small></span>
      <button type="button" class="file-remove" aria-label="파일 제거" :disabled="disabled" @click="$emit('remove', file)">×</button>
    </li>
  </ul>
</template>
