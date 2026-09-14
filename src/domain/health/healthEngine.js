import healthAreas from '../../data/health-areas.json'

const PRIORITY = { action: 0, watch: 1, good: 2, info: 3, unknown: 4 }

function stateOf(metrics, note) {
  if (note?.state) return note.state
  if (!metrics.length) return 'unknown'
  return [...metrics].sort((a, b) => PRIORITY[a.state] - PRIORITY[b.state])[0].state
}

function displayMetrics(metrics) {
  const featured = metrics.filter(item => item.featured)
  const source = featured.length ? featured : [...metrics].sort((a, b) => PRIORITY[a.state] - PRIORITY[b.state])
  return source.slice(0, 2)
}

function formatMetric(metric) {
  const value = metric.value === null || metric.value === undefined ? '—' : metric.value
  return `${metric.short_name || metric.name} ${value}${metric.unit ? ` ${metric.unit}` : ''}`
}

export function buildHealthModel(health) {
  const areaNotes = new Map(health.area_notes.filter(n => n.area).map(n => [n.area, n]))

  const areas = healthAreas.map(area => {
    const metrics = health.metrics.filter(metric => metric.areas.includes(area.id))
    const note = areaNotes.get(area.id)
    const shown = displayMetrics(metrics)
    const state = stateOf(metrics, note)
    return {
      ...area,
      state,
      metrics,
      shownMetrics: shown,
      result: state === 'unknown' || !shown.length ? '평가자료 없음' : shown.map(formatMetric).join(' · '),
      detail: note?.detail || shown.find(metric => metric.comment)?.comment || ''
    }
  })

  const uncategorized = health.metrics.filter(metric => !metric.areas.length)
  const recentRecord = [...health.records]
    .filter(record => record.checkup_date)
    .sort((a, b) => String(b.checkup_date).localeCompare(String(a.checkup_date)))[0] || health.records[0] || null

  return {
    records: health.records,
    recentRecord,
    metrics: health.metrics,
    areas,
    uncategorized,
    actionCount: areas.filter(area => area.state === 'action').length,
    watchCount: areas.filter(area => area.state === 'watch').length,
    goodCount: areas.filter(area => area.state === 'good').length
  }
}
