import { request } from './httpClient.js'

export function createReportAnalysis(formData) {
  return request('/api/v1/analysis', { method: 'POST', body: formData })
}

export function getReportAnalysis(analysisId) {
  return request(`/api/v1/analysis/${encodeURIComponent(analysisId)}`)
}

export function getReport(reportId) {
  return request(`/api/v1/reports/${encodeURIComponent(reportId)}`)
}
