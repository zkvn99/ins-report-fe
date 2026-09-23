const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
import { notifyError } from '../shared/notificationStore.js'
const EXPIRED_TOKEN_CODE = 'AUTH_401_EXPIRED_TOKEN'
const SESSION_REPLACED_CODE = 'AUTH_401_SESSION_REPLACED'
export const SESSION_REPLACED_EVENT = 'medicover:session-replaced'
const REFRESH_PATH = '/api/v1/auth/refresh'
let refreshPromise = null

export async function request(path, options = {}) {
  return execute(path, options, false)
}

export async function requestBinary(path, options = {}) {
  const download = await executeBinary(path, options, false)
  return download.blob
}

export async function requestDownload(path, options = {}) {
  return executeBinary(path, options, false)
}

async function executeBinary(path, options, retried) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: { Accept: 'application/pdf', ...(options.headers || {}) }
  })
  if (!response.ok) {
    const contentType = response.headers.get('content-type') || ''
    const body = contentType.includes('application/json') ? await response.json() : await response.text()
    const message = typeof body === 'string' ? body : body?.errorMessage || body?.message || 'PDF를 생성하지 못했습니다.'
    if (shouldRefresh(path, options.method, response.status, body, retried)) {
      await refreshAccessToken()
      return executeBinary(path, options, true)
    }
    if (body?.errorCode === SESSION_REPLACED_CODE) notifySessionReplaced()
    notifyError(message)
    throw new Error(message)
  }
  return {
    blob: await response.blob(),
    filename: parseDownloadFilename(response.headers.get('content-disposition'))
  }
}

export function parseDownloadFilename(contentDisposition) {
  if (!contentDisposition) return null
  const encodedFilename = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i)
  if (encodedFilename) {
    try {
      return decodeURIComponent(encodedFilename[1])
    } catch {
      return encodedFilename[1]
    }
  }
  const quotedFilename = contentDisposition.match(/filename="([^"]+)"/i)
  return quotedFilename?.[1] || null
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
