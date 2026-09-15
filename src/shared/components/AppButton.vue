<script setup>
defineProps({
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  type: { type: String, default: 'button' }
})
</script>

<template><button :type="type" :class="['app-button', `app-button--${variant}`, `app-button--${size}`]"><slot /></button></template>
