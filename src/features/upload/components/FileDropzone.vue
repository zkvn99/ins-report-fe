<script setup>
import { computed, ref } from 'vue'
import SelectedFileList from './SelectedFileList.vue'
import { isAcceptedFile } from '../fileUtils.js'

const props = defineProps({
  label: { type: String, required: true },
  hint: { type: String, required: true },
  accept: { type: String, required: true },
  mimeTypes: { type: Array, default: () => [] },
  multiple: { type: Boolean, default: false },
  files: { type: Array, default: () => [] },
  disabled: { type: Boolean, default: false }
})
const emit = defineEmits(['add', 'remove', 'error'])
const input = ref(null)
const dragging = ref(false)
const extensions = computed(() => props.accept.split(',').map(value => value.trim().toLowerCase()))

function valid(file) {
  return isAcceptedFile(file, extensions.value, props.mimeTypes)
}

function add(files) {
  const candidates = Array.from(files || [])
  if (candidates.some(file => !valid(file))) {
    emit('error', `${props.label}에는 ${props.hint} 형식만 추가할 수 있습니다.`)
    return
  }
  emit('error', '')
  emit('add', props.multiple ? candidates : candidates.slice(0, 1))
}

function onChange(event) {
  add(event.target.files)
  event.target.value = ''
}

function onDrop(event) {
  dragging.value = false
  if (!props.disabled) add(event.dataTransfer.files)
}
</script>

<template>
  <section class="file-dropzone">
    <h2>{{ label }}</h2>
    <div
      :class="['dropzone-card', { 'is-dragging': dragging, 'is-disabled': disabled }]"
      @dragenter.prevent="dragging = !disabled"
      @dragover.prevent
      @dragleave.prevent="dragging = false"
      @drop.prevent="onDrop"
    >
      <p>문서를 선택하거나<br>이곳에 끌어놓으세요</p>
      <small>{{ hint }} · {{ multiple ? '여러 개' : '한 개' }}</small>
      <button type="button" class="app-button app-button--secondary app-button--sm" :disabled="disabled" @click="input?.click()">파일 선택</button>
      <input ref="input" class="visually-hidden" type="file" :accept="accept" :multiple="multiple" :disabled="disabled" @change="onChange">
    </div>
    <SelectedFileList :files="files" :disabled="disabled" @remove="$emit('remove', $event)" />
  </section>
</template>
