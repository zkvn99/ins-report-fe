import coverageCatalog from '../../data/coverage-catalog.json'
import { mapCoverageEntries } from './coverageMapper.js'
import { aggregateMappedCoverages, calculateEconomicPortfolioAmount } from './coverageAggregator.js'

function policyKey(entry) {
  if (entry.policy_key) return entry.policy_key
  return `FALLBACK:${entry.company}|${entry.product}`
}

function buildContracts(entries) {
  const contracts = new Map()
  for (const entry of entries) {
    if (entry.insured !== 'self') continue
    const key = policyKey(entry)
    if (!contracts.has(key)) {
      contracts.set(key, {
        policyKey: key,
        company: entry.company,
        product: entry.product,
        fallback: !entry.policy_key
      })
    }
  }
  return [...contracts.values()]
}

export function buildInsuranceModel(insurance, standardOverrides = []) {
  const mapped = mapCoverageEntries(
    insurance.coverages.map(entry => ({ ...entry, provider_type: insurance.provider_type }))
  )

  const own = mapped.filter(entry => entry.insured === 'self')
  const excluded = mapped.filter(entry => entry.insured !== 'self')
  const { amounts, warnings } = aggregateMappedCoverages(own)

  const overrideMap = new Map(
    standardOverrides
      .filter(item => item.coverage_id && Number.isSafeInteger(item.amount_won) && item.amount_won > 0)
      .map(item => [item.coverage_id, item.amount_won])
  )

  const coverage = coverageCatalog.map(item => {
    const targetWon = overrideMap.get(item.id) ?? item.standard_won
    const currentWon = amounts.get(item.id) ?? 0
    const sourceEntries = own.filter(entry => entry.targetCoverageId === item.id)
    const gapWon = Math.max(0, targetWon - currentWon)
    const ratio = targetWon > 0 ? currentWon / targetWon : 0
    return {
      ...item,
      targetWon,
      currentWon,
      gapWon,
      ratio,
      status: currentWon <= 0 ? 'ABSENT' : currentWon >= targetWon ? 'ENOUGH' : 'BELOW',
      sources: sourceEntries
    }
  })

  const supplemental = own.filter(entry => !entry.targetCoverageId)
  const mappingWarnings = supplemental.map(entry => ({
    level: 'warning',
    code: entry.mappingStatus || 'UNMAPPED',
    message: `${entry.rider_name}: 표준 비교항목에 매핑되지 않아 추가 보장으로 보존했습니다.`
  }))

  return {
    sourceLabel: insurance.source_label || '제공된 보험 가입내역',
    asOfDate: insurance.as_of_date,
    sourceComplete: insurance.source_complete,
    contracts: buildContracts(own),
    rawEntries: insurance.coverages,
    mappedEntries: mapped,
    coverage,
    supplemental,
    excluded,
    heldCount: coverage.filter(item => item.currentWon > 0).length,
    economicPortfolioAmountWon: calculateEconomicPortfolioAmount(own),
    warnings: [...warnings, ...mappingWarnings]
  }
}
