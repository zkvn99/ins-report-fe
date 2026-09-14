export function parseJsonText(raw) {
  let text = String(raw ?? '').replace(/^\uFEFF/, '').trim()
  if (!text) throw new Error('JSON 내용이 비어 있습니다.')

  text = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  if (!text.startsWith('{')) {
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    if (start >= 0 && end > start) text = text.slice(start, end + 1)
  }

  try {
    return JSON.parse(text)
  } catch (error) {
    throw new Error(`JSON 파싱 실패: ${error.message}`)
  }
}
