<script setup>
import { ref } from 'vue'

const props = defineProps({
  ready: Boolean,
  fileName: String,
  messages: { type: Array, default: () => [] }
})

const emit = defineEmits(['load-text', 'load-object', 'clear', 'print', 'export-json', 'export-html'])
const paste = ref('')
const expanded = ref(true)

async function onFile(event) {
  const file = event.target.files?.[0]
  if (!file) return
  emit('load-text', await file.text(), file.name)
  event.target.value = ''
}

function applyPaste() {
  emit('load-text', paste.value, '붙여넣은 JSON')
}
</script>

<template>
  <header class="toolbar screen-only">
    <div class="toolbar-row">
      <div>
        <b>건강자산 &amp; 보장분석</b>
        <small>{{ ready ? fileName : '고객 데이터 없음' }}</small>
      </div>
      <div class="toolbar-actions">
        <button type="button" @click="expanded = !expanded">자료 넣기</button>
        <label class="file-button">
          JSON 선택
          <input type="file" accept="application/json,.json" @change="onFile" />
        </label>
        <button type="button" :disabled="!ready" @click="$emit('export-json')">정규화 JSON</button>
        <button type="button" :disabled="!ready" @click="$emit('export-html')">완성 HTML</button>
        <button type="button" :disabled="!ready" @click="$emit('print')">인쇄 · PDF</button>
        <button type="button" @click="$emit('clear')">초기화</button>
      </div>
    </div>

    <div v-if="expanded" class="input-panel">
      <textarea v-model="paste" placeholder="customer_input_v2.json 내용을 붙여넣으세요." />
      <div class="input-panel-actions">
        <button type="button" @click="applyPaste">JSON 적용</button>
        <span>{{ fileName }}</span>
      </div>
    </div>

    <div v-if="messages.length" class="message-panel">
      <div v-for="(message, index) in messages" :key="`${message.code}-${index}`" :class="['message', message.level]">
        <b>{{ message.code }}</b>
        <span>{{ message.message }}</span>
      </div>
    </div>
  </header>
</template>
