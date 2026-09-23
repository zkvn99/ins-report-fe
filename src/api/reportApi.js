import { request, requestDownload } from './httpClient.js'

export function createReportAnalysis(formData) {
  return request('/api/v1/analysis', { method: 'POST', body: formData })
}

export function getReportAnalysis(analysisId) {
  return request(`/api/v1/analysis/${encodeURIComponent(analysisId)}`)
}

export function getReport(reportId) {
  return request(`/api/v1/reports/${encodeURIComponent(reportId)}`)
}

export function downloadReportPdf(reportId) {
  return requestDownload(`/api/v1/reports/${encodeURIComponent(reportId)}/pdf`)
}

export function getReportResults(page = 0, size = 20) {
  const query = new URLSearchParams({ page: String(page), size: String(size) })
  return request(`/api/v1/report-results?${query}`)
}
