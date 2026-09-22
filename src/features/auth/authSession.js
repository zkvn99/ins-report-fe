import { computed, ref } from 'vue'
import { getMe, login as loginRequest, logout as logoutRequest } from '../../api/authApi.js'

const user = ref(null)
const isInitialized = ref(false)
let initializationPromise = null

export const authUser = user
export const isAuthenticated = computed(() => Boolean(user.value))

function setUser(authInfo) {
  user.value = authInfo?.name
    ? { name: authInfo.name, role: authInfo.role || 'USER' }
    : null
  return user.value
}

function clear() {
  user.value = null
}

async function initialize() {
  if (isInitialized.value) return user.value
  if (!initializationPromise) {
    initializationPromise = getMe()
      .then(setUser)
      .catch(() => {
        clear()
        return null
      })
      .finally(() => {
        isInitialized.value = true
        initializationPromise = null
      })
  }
  return initializationPromise
}

async function login(credentials) {
  const authInfo = await loginRequest(credentials)
  return setUser(authInfo)
}

async function logout() {
  try {
    await logoutRequest()
  } finally {
    clear()
  }
}

export { clear, initialize, login, logout, setUser }