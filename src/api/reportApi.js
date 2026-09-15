const mockReportData = (await import('../../examples/report-data.example.json')).default

const mockAnalyses = new Map()

function makeMockStatus(analysisId) {
  const current = mockAnalyses.get(analysisId) || {
    analysisId,
    status: 'WAITING',
    progress: 0,
    message: '분석을 준비하고 있습니다.'
  }

  if (current.status === 'COMPLETED' || current.status === 'FAILED') {
    return current
  }

  current.progress = Math.min(100, current.progress + 25)
  if (current.progress < 50) {
    current.status = 'PROCESSING'
    current.message = '문서를 검토하고 있습니다.'
  } else if (current.progress < 100) {
    current.status = 'REVIEW_REQUIRED'
    current.message = '검토가 필요한 항목을 확인하고 있습니다.'
  } else {
    current.status = 'COMPLETED'
    current.progress = 100
    current.message = '보고서를 준비했습니다.'
  }

  mockAnalyses.set(analysisId, current)
  return { ...current }
}

function getMockAnalysis(analysisId) {
  return mockAnalyses.get(analysisId) || {
    analysisId,
    status: 'PROCESSING',
    progress: 15,
    message: '분석을 시작했습니다.'
  }
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { Accept: 'application/json', ...(options.headers || {}) },
    ...options
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(text || `Request failed: ${response.status}`)
  }

  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json()
  }

  return response.text()
}

export async function createAnalysis(formData) {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    const analysisId = `ANL-${Date.now()}`
    mockAnalyses.set(analysisId, {
      analysisId,
      status: 'PROCESSING',
      progress: 15,
      message: '문서를 업로드해 분석을 시작합니다.'
    })
    return { analysisId, status: 'PROCESSING' }
  }

  return request('/api/report-analyses', {
    method: 'POST',
    body: formData
  })
}

export async function getAnalysis(analysisId) {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    const data = makeMockStatus(analysisId)
    return {
      analysisId,
      status: data.status,
      progress: data.progress,
      message: data.message
    }
  }

  return request(`/api/report-analyses/${analysisId}`)
}

export async function getReviewItems(analysisId) {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    return [
      {
        reviewId: 101,
        type: 'COVERAGE_MAPPING',
        company: '교보생명',
        product: '무배당교보베스트플랜유니버셜CI보험',
        riderName: '주계약(분할납)',
        amountWon: 34153000,
        sourceRef: 'p.17',
        candidates: [{ coverageId: 'C010', name: '일반암' }]
      }
    ]
  }

  return request(`/api/report-analyses/${analysisId}/review-items`)
}

export async function submitReview(analysisId, reviewItems) {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    const current = getMockAnalysis(analysisId)
    current.status = 'PROCESSING'
    current.progress = 90
    current.message = '사용자 검토를 적용하고 다시 계산 중입니다.'
    mockAnalyses.set(analysisId, current)
    return { analysisId, accepted: true, reviewItems }
  }

  return request(`/api/report-analyses/${analysisId}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reviewItems })
  })
}

export async function getReport(analysisId) {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    const current = getMockAnalysis(analysisId)
    current.status = 'COMPLETED'
    current.progress = 100
    current.message = '보고서를 준비했습니다.'
    mockAnalyses.set(analysisId, current)
    return mockReportData
  }

  return request(`/api/report-analyses/${analysisId}/report`)
}
