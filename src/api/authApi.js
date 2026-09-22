import { request } from './httpClient.js'

export function signup(payload) {
  return request('/api/v1/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
}

export function login(payload) {
  return request('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
}

export function getMe() {
  return request('/api/v1/auth/me')
}

export function logout() {
  return request('/api/v1/auth/logout', { method: 'POST' })
}
