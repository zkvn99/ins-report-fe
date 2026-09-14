import reference from '../../data/reference-statistics.json'
import modules from '../../data/disease-modules.json'

function sourceMap() {
  return new Map(reference.sources.map(source => [source.id, source]))
}

function pickAgeBand(series, age) {
  if (!series || !Number.isInteger(age)) return null
  return series.age_bands?.find(band => age >= band.min_age && age <= band.max_age) || null
}

function historyFromSeries(series, age) {
  const band = pickAgeBand(series, age)
  if (!band) return null
  return {
    kind: series.metric,
    title: series.label,
    unit: series.unit,
    scope: `${band.min_age}–${band.max_age >= 120 ? '' : band.max_age}세`.replace('–세', '세 이상'),
    note: series.note,
    points: series.years
      .map(year => ({ year, value: band.values?.[year]?.value ?? null, sourceId: band.values?.[year]?.source_id ?? null }))
      .filter(point => Number.isFinite(point.value))
  }
}

function historyFromContext(context) {
  if (!context) return null
  return {
    kind: context.metric,
    title: context.label,
    unit: context.unit,
    scope: context.scope,
    note: context.note,
    points: (context.values || [])
      .filter(item => Number.isFinite(item.value))
      .map(item => ({ year: item.year, label: item.label, value: item.value, sourceId: context.source_id }))
  }
}

function resolveHistory(module, age) {
  const direct = module.history_id ? reference.historical_series?.[module.history_id] : null
  const history = historyFromSeries(direct, age)
  if (history?.points.length) return history

  const alternative = module.alternative_history_id
    ? reference.historical_series?.[module.alternative_history_id]
    : null
  const altHistory = historyFromSeries(alternative, age)
  if (altHistory?.points.length) return altHistory

  return historyFromContext(reference.context_series?.[module.context_id])
}

export function buildStatisticsModel({ customer }) {
  const sources = sourceMap()
  const moduleStats = modules.map(module => {
    const history = resolveHistory(module, customer.age)
    const benchmark = reference.benchmarks?.[module.benchmark_id] || null
    const sourceIds = new Set([
      ...(history?.points || []).map(point => point.sourceId),
      benchmark?.source_id
    ].filter(Boolean))
    return {
      moduleId: module.id,
      history,
      benchmark,
      sources: [...sourceIds].map(id => sources.get(id)).filter(Boolean)
    }
  })

  return {
    referenceVersion: reference.reference_version || reference.version,
    reviewedAt: reference.review_date || reference.reviewed_at,
    modules: moduleStats,
    sources: reference.sources
  }
}
