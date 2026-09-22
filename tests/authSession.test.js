import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getMe, login as loginRequest, logout as logoutRequest } from '../src/api/authApi.js'
import { authUser, clear, initialize, isAuthenticated, login, logout } from '../src/features/auth/authSession.js'

vi.mock('../src/api/authApi.js', () => ({
  getMe: vi.fn(),
  login: vi.fn(),
  logout: vi.fn()
}))

describe('auth session', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    clear()
  })

  it('restores the user from /me on initialization', async () => {
    getMe.mockResolvedValue({ name: '홍길동', role: 'USER' })

    await initialize()

    expect(authUser.value).toEqual({ name: '홍길동', role: 'USER' })
    expect(isAuthenticated.value).toBe(true)
  })

  it('stores name and role from a successful login', async () => {
    loginRequest.mockResolvedValue({ name: '관리자', role: 'ADMIN' })

    await login({ loginId: 'admin', password: 'password' })

    expect(loginRequest).toHaveBeenCalledWith({ loginId: 'admin', password: 'password' })
    expect(authUser.value).toEqual({ name: '관리자', role: 'ADMIN' })
  })

  it('clears the session after logout', async () => {
    authUser.value = { name: '홍길동', role: 'USER' }
    logoutRequest.mockResolvedValue(undefined)

    await logout()

    expect(logoutRequest).toHaveBeenCalledOnce()
    expect(authUser.value).toBe(null)
    expect(isAuthenticated.value).toBe(false)
  })
})
