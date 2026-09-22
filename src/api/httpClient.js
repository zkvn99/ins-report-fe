const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
import { notifyError } from '../shared/notificationStore.js'
const EXPIRED_TOKEN_CODE = 'AUTH_401_EXPIRED_TOKEN'
const SESSION_REPLACED_CODE = 'AUTH_401_SESSION_REPLACED'
export const SESSION_REPLACED_EVENT = 'medicover:session-replaced'
const REFRESH_PATH = '/api/v1/auth/refresh'
let refreshPromise = null

export async function request(path, options = {}) {
  return execute(path, options, false)
}

async function execute(path, options, retried) {
  const { headers = {}, ...requestOptions } = options
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    credentials: 'include',
    headers: { Accept: 'application/json', ...headers }
  })

  const contentType = response.headers.get('content-type') || ''
  const responseBody = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    if (shouldRefresh(path, requestOptions.method, response.status, responseBody, retried)) {
      await refreshAccessToken()
      return execute(path, options, true)
    }
    const message = typeof responseBody === 'string'
      ? responseBody
      : responseBody?.errorMessage || responseBody?.message || responseBody?.error
    const error = new Error(message || `요청에 실패했습니다. (${response.status})`)
    error.status = response.status
    error.errorCode = responseBody?.errorCode
    if (error.errorCode === SESSION_REPLACED_CODE) {
      notifySessionReplaced()
      notifyError(message)
    } else if (shouldNotifyError(path, response.status)) {
      notifyError(message || `요청에 실패했습니다. (${response.status})`)
    }
    throw error
  }

  if (responseBody && typeof responseBody === 'object' && typeof responseBody.success === 'boolean') {
    if (!responseBody.success) {
      const error = new Error(responseBody.errorMessage || '요청에 실패했습니다.')
      notifyError(error.message)
      throw error
    }
    return responseBody.data
  }

  return responseBody
}

function notifySessionReplaced() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(SESSION_REPLACED_EVENT))
}

function shouldNotifyError(path, status) {
  return !(path === '/api/v1/auth/me' && status === 401)
}

function shouldRefresh(path, method = 'GET', status, body, retried) {
  return !retried
    && status === 401
    && body?.errorCode === EXPIRED_TOKEN_CODE
    && !isAuthRefreshExcluded(path, method)
}

function isAuthRefreshExcluded(path, method) {
  const excludedRequests = new Set([
    'POST /api/v1/auth/login',
    'POST /api/v1/auth/signup',
    'POST /api/v1/auth/refresh',
    'POST /api/v1/auth/logout'
  ])
  return excludedRequests.has(`${method.toUpperCase()} ${path}`)
}

function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = execute(REFRESH_PATH, { method: 'POST' }, true)
      .finally(() => { refreshPromise = null })
  }
  return refreshPromise
}
