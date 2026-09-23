const STATUS_LABELS = {
  RECEIVED: '접수완료',
  PROCESSING: '처리중',
  COMPLETED: '산출완료',
  FAILED: '실패'
}

export function calculateHistoryNumber(totalElements, page, size, index) {
  return totalElements - page * size - index
}

export function formatHistoryDate(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  const parts = new Intl.DateTimeFormat('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Seoul'
  }).formatToParts(date)
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]))
  return `${values.month}.${values.day} ${values.hour}:${values.minute}`
}

export function getAnalysisStatusLabel(status) {
  return STATUS_LABELS[status] || status || '-'
}

export function canDownloadPdf(result) {
  return result?.status === 'COMPLETED' && Boolean(result?.reportId)
}
