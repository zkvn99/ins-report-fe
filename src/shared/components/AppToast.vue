<script setup>
import { notifications, dismissNotification } from '../notificationStore.js'
</script>

<template>
  <aside class="toast-region" aria-label="알림" aria-live="assertive">
    <div v-for="notification in notifications" :key="notification.id" class="toast-error" role="alert">
      <span>{{ notification.message }}</span>
      <button type="button" aria-label="알림 닫기" @click="dismissNotification(notification.id)">×</button>
    </div>
  </aside>
</template>
