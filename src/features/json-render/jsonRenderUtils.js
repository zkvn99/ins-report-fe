import { validateReportData } from '../../report/reportValidator.js'

export function parseReportJson(jsonText) {
  let report
  try {
    report = JSON.parse(jsonText)
  } catch (cause) {
    throw new Error(`JSON 파싱 실패: ${cause.message}`)
  }

  const validation = validateReportData(report)
  if (!validation.valid) throw new Error(validation.errors.map(item => item.message).join('\n'))
  return report
}

export function emptyJsonRenderState() {
  return { jsonText: '', reportData: null, error: '' }
}
