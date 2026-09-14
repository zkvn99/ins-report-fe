export function formatWon(value) {
  if (!Number.isFinite(value)) return '—'
  const abs = Math.abs(value)
  const sign = value < 0 ? '-' : ''
  if (abs >= 100000000) return `${sign}${(abs / 100000000).toFixed(abs % 100000000 === 0 ? 0 : 1)}억원`
  if (abs >= 10000) return `${sign}${Math.round(abs / 10000).toLocaleString('ko-KR')}만원`
  return `${sign}${Math.round(abs).toLocaleString('ko-KR')}원`
}

export function formatDate(value) {
  if (!value) return '—'
  return String(value).replace(/-/g, '.')
}

export function formatPercent(value, digits = 0) {
  if (!Number.isFinite(value)) return '—'
  return `${(value * 100).toFixed(digits)}%`
}
