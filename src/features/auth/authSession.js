import { computed, ref } from 'vue'
import { getMe, login as loginRequest, logout as logoutRequest } from '../../api/authApi.js'
import { SESSION_REPLACED_EVENT } from '../../api/httpClient.js'

const user = ref(null)
const isInitialized = ref(false)
const AUTH_SESSION_MARKER = 'medicover:authenticated'
let initializationPromise = null

if (typeof window !== 'undefined') window.addEventListener(SESSION_REPLACED_EVENT, clear)

export const authUser = user
export const isAuthenticated = computed(() => Boolean(user.value))

function setUser(authInfo) {
  user.value = authInfo?.name
    ? { name: authInfo.name, role: authInfo.role || 'USER' }
    : null
  if (user.value) saveAuthMarker()
  else removeAuthMarker()
  return user.value
}

function clear() {
  user.value = null
  removeAuthMarker()
  isInitialized.value = false
}

async function initialize() {
  if (isInitialized.value) return user.value
  if (!hasAuthMarker()) {
    isInitialized.value = true
    return null
  }
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

function hasAuthMarker() {
  try {
    return typeof window !== 'undefined'
      && window.localStorage.getItem(AUTH_SESSION_MARKER) === 'true'
  } catch {
    return false
  }
}

function saveAuthMarker() {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(AUTH_SESSION_MARKER, 'true')
    }
  } catch {
    // 저장소를 사용할 수 없어도 현재 탭의 로그인 상태는 유지한다.
  }
}

function removeAuthMarker() {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(AUTH_SESSION_MARKER)
    }
  } catch {
    // 저장소 접근 실패 시 메모리 상태만 초기화한다.
  }
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
