import modules from '../data/disease-modules.json'
import { formatDate } from './formatters.js'
import { REPORT_LAYOUT } from './layout.js'

function chunk(array, size) {
  const result = []
  for (let i = 0; i < array.length; i += size) result.push(array.slice(i, i + size))
  return result
}

function uniqueWarnings(items) {
  const seen = new Set()
  return items.filter(item => {
    const key = `${item.code}|${item.message}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function buildReportViewModel({ input, health, insurance, statistics, warnings = [] }) {
  const coverageById = new Map(insurance.coverage.map(item => [item.id, item]))
  const healthById = new Map(health.areas.map(item => [item.id, item]))
  const statsById = new Map(statistics.modules.map(item => [item.moduleId, item]))

  const diseaseModules = modules.map(module => ({
    ...module,
    healthAreas: module.health_area_ids.map(id => healthById.get(id)).filter(Boolean),
    coreCoverages: module.core_coverage_ids.map(id => coverageById.get(id)).filter(Boolean),
    coverages: module.coverage_ids.map(id => coverageById.get(id)).filter(Boolean),
    statistics: statsById.get(module.id) || null
  }))

  const priorityAreaIds = new Set(
    health.areas.filter(area => ['action', 'watch'].includes(area.state)).map(area => area.id)
  )
  const relatedCoverageIds = new Set(
    health.areas
      .filter(area => priorityAreaIds.has(area.id))
      .flatMap(area => area.coverage_ids || [])
  )

  const recommendations = insurance.coverage
    .filter(item => relatedCoverageIds.has(item.id) && item.gapWon > 0)
    .sort((a, b) => b.gapWon - a.gapWon)
    .slice(0, REPORT_LAYOUT.maxRecommendations)

  const combinedWarnings = uniqueWarnings([...warnings, ...insurance.warnings])

  return {
    meta: {
      title: '건강자산 & 보장분석',
      reportDate: formatDate(input.report_date),
      sourceVersion: input.version,
      referenceVersion: statistics.referenceVersion
    },
    customer: {
      ...input.customer,
      displayAge: input.customer.age === null ? '연령 미상' : `${input.customer.age}세`
    },
    health: {
      ...health,
      recentRecordDisplay: health.recentRecord ? {
        ...health.recentRecord,
        checkup_date: formatDate(health.recentRecord.checkup_date)
      } : null
    },
    insurance,
    statistics,
    diseaseModules,
    coveragePages: chunk(insurance.coverage, REPORT_LAYOUT.coverageRowsPerPage),
    recommendations,
    warnings: combinedWarnings,
    summary: {
      contractCount: insurance.contracts.length,
      heldCoverageCount: insurance.heldCount,
      totalCoverageCount: insurance.coverage.length,
      actionCount: health.actionCount,
      watchCount: health.watchCount,
      goodCount: health.goodCount
    }
  }
}
