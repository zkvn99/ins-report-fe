import { request } from './httpClient.js'

export function analyzePdfs(formData) {
  return request('/api/v1/analysis', { method: 'POST', body: formData })
}
