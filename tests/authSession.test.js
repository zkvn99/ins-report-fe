import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getMe, login as loginRequest, logout as logoutRequest } from '../src/api/authApi.js'
import { authUser, clear, initialize, isAuthenticated, login, logout } from '../src/features/auth/authSession.js'

vi.mock('../src/api/authApi.js', () => ({
  getMe: vi.fn(),
  login: vi.fn(),
  logout: vi.fn()
}))

describe('auth session', () => {
  let storage

  beforeEach(() => {
    vi.clearAllMocks()
    storage = new Map()
    vi.stubGlobal('window', {
      localStorage: {
        getItem: vi.fn(key => storage.get(key) ?? null),
        setItem: vi.fn((key, value) => storage.set(key, value)),
        removeItem: vi.fn(key => storage.delete(key))
      }
    })
    clear()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('does not request /me without a login marker', async () => {
    await initialize()

    expect(getMe).not.toHaveBeenCalled()
    expect(isAuthenticated.value).toBe(false)
  })

  it('restores the user from /me only with a login marker', async () => {
    storage.set('mida:authenticated', 'true')
    getMe.mockResolvedValue({ name: '홍길동', role: 'USER' })

    await initialize()

    expect(authUser.value).toEqual({ name: '홍길동', role: 'USER' })
    expect(isAuthenticated.value).toBe(true)
    expect(getMe).toHaveBeenCalledOnce()
  })

  it('removes a stale login marker when /me rejects the session', async () => {
    storage.set('mida:authenticated', 'true')
    getMe.mockRejectedValue(new Error('invalid session'))

    await initialize()

    expect(authUser.value).toBe(null)
    expect(storage.has('mida:authenticated')).toBe(false)
  })

  it('stores name and role from a successful login', async () => {
    loginRequest.mockResolvedValue({ name: '관리자', role: 'ADMIN' })

    await login({ loginId: 'admin', password: 'password' })

    expect(loginRequest).toHaveBeenCalledWith({ loginId: 'admin', password: 'password' })
    expect(authUser.value).toEqual({ name: '관리자', role: 'ADMIN' })
    expect(storage.get('mida:authenticated')).toBe('true')
  })

  it('clears the session after logout', async () => {
    authUser.value = { name: '홍길동', role: 'USER' }
    logoutRequest.mockResolvedValue(undefined)

    await logout()

    expect(logoutRequest).toHaveBeenCalledOnce()
    expect(authUser.value).toBe(null)
    expect(isAuthenticated.value).toBe(false)
    expect(storage.has('mida:authenticated')).toBe(false)
  })
})
