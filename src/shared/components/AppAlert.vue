<script setup>
defineProps({ type: { type: String, default: 'error' } })
</script>

<template><p :class="['app-alert', `app-alert--${type}`]"><slot /></p></template>
