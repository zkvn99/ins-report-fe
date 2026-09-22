import { ref } from 'vue'

const notifications = ref([])
let nextNotificationId = 0

export function notifyError(message) {
  if (!message) return
  const notification = { id: ++nextNotificationId, message }
  notifications.value = [...notifications.value, notification]
  globalThis.setTimeout(() => dismissNotification(notification.id), 5000)
}

export function dismissNotification(id) {
  notifications.value = notifications.value.filter(notification => notification.id !== id)
}

export { notifications }
