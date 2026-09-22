<script setup>
import AppHeader from './shared/components/AppHeader.vue'
import AppToast from './shared/components/AppToast.vue'
</script>

<template>
  <AppHeader />
  <main class="app-shell"><RouterView /></main>
  <AppToast />
</template>
