import { afterEach, describe, expect, it, vi } from 'vitest'
import { request } from '../src/api/httpClient.js'

afterEach(() => {
  vi.unstubAllGlobals()
})

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })
}

describe('HTTP client', () => {
  it('unwraps a successful API response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({
      success: true,
      data: { analysisId: 'analysis-1' }
    })))

    await expect(request('/api/v1/analysis')).resolves.toEqual({ analysisId: 'analysis-1' })
  })

  it('uses the API error message for a failed response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({
      success: false,
      data: null,
      errorMessage: 'PDF를 처리할 수 없습니다.'
    }, 400)))

    await expect(request('/api/v1/analysis')).rejects.toThrow('PDF를 처리할 수 없습니다.')
  })

  it('does not set a multipart Content-Type header for FormData', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ success: true, data: {} }))
    vi.stubGlobal('fetch', fetchMock)
    const formData = new FormData()

    await request('/api/v1/analysis', { method: 'POST', body: formData })

    expect(fetchMock.mock.calls[0][1].body).toBe(formData)
    expect(fetchMock.mock.calls[0][1].headers).toEqual({ Accept: 'application/json' })
    expect(fetchMock.mock.calls[0][1].credentials).toBe('include')
  })

  it('shares one refresh and retries concurrent expired requests once', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse({ success: false, errorCode: 'AUTH_401_EXPIRED_TOKEN' }, 401))
      .mockResolvedValueOnce(jsonResponse({ success: false, errorCode: 'AUTH_401_EXPIRED_TOKEN' }, 401))
      .mockResolvedValueOnce(jsonResponse({ success: true, data: null }))
      .mockResolvedValueOnce(jsonResponse({ success: true, data: { id: 1 } }))
      .mockResolvedValueOnce(jsonResponse({ success: true, data: { id: 2 } }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(Promise.all([
      request('/api/v1/reports/1'),
      request('/api/v1/reports/2')
    ])).resolves.toEqual([{ id: 1 }, { id: 2 }])

    expect(fetchMock.mock.calls.filter(([url]) => url.endsWith('/api/v1/auth/refresh'))).toHaveLength(1)
  })

  it('refreshes an expired me request and retries it once', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse({ success: false, errorCode: 'AUTH_401_EXPIRED_TOKEN' }, 401))
      .mockResolvedValueOnce(jsonResponse({ success: true, data: null }))
      .mockResolvedValueOnce(jsonResponse({ success: true, data: { name: '홍길동', role: 'USER' } }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(request('/api/v1/auth/me')).resolves.toEqual({ name: '홍길동', role: 'USER' })
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      'http://localhost:8080/api/v1/auth/me',
      'http://localhost:8080/api/v1/auth/refresh',
      'http://localhost:8080/api/v1/auth/me'
    ])
  })

  it('does not retry me when refresh fails', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse({ success: false, errorCode: 'AUTH_401_EXPIRED_TOKEN' }, 401))
      .mockResolvedValueOnce(jsonResponse({ success: false, errorCode: 'AUTH_401_EXPIRED_TOKEN' }, 401))
    vi.stubGlobal('fetch', fetchMock)

    await expect(request('/api/v1/auth/me')).rejects.toThrow()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
