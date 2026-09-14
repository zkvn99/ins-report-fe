const FIXED_COMPARABLE = new Set(['SUM', 'MAX', 'UNIQUE_POOL', 'PER_DAY', 'PER_EVENT'])

function sum(values) {
  return values.reduce((total, value) => total + value, 0)
}

function aggregateBucket(entries, warnings) {
  const sumEntries = entries.filter(e => e.aggregationType === 'SUM')
  const maxEntries = entries.filter(e => e.aggregationType === 'MAX')
  const perDayEntries = entries.filter(e => e.aggregationType === 'PER_DAY')
  const perEventEntries = entries.filter(e => e.aggregationType === 'PER_EVENT')
  const uniquePoolEntries = entries.filter(e => e.aggregationType === 'UNIQUE_POOL')

  const total = sum(sumEntries.map(e => e.amount_won || 0))
    + (maxEntries.length ? Math.max(...maxEntries.map(e => e.amount_won || 0)) : 0)
    + sum(perDayEntries.map(e => e.amount_won || 0))
    + sum(perEventEntries.map(e => e.amount_won || 0))

  const poolMap = new Map()
  for (const entry of uniquePoolEntries) {
    if (!entry.benefitPoolId) {
      warnings.push({
        level: 'warning',
        code: 'UNIQUE_POOL_ID_MISSING',
        message: `${entry.rider_name}: UNIQUE_POOL인데 benefit_pool_id가 없어 비교금액에서 제외했습니다.`
      })
      continue
    }
    const prev = poolMap.get(entry.benefitPoolId) || 0
    poolMap.set(entry.benefitPoolId, Math.max(prev, entry.amount_won || 0))
  }

  return total + sum([...poolMap.values()])
}

export function aggregateMappedCoverages(mappedEntries) {
  const warnings = []
  const buckets = new Map()

  for (const entry of mappedEntries) {
    if (!entry.targetCoverageId || !FIXED_COMPARABLE.has(entry.aggregationType)) continue
    if (!Number.isSafeInteger(entry.amount_won) || entry.amount_won < 0) continue
    if (!buckets.has(entry.targetCoverageId)) buckets.set(entry.targetCoverageId, [])
    buckets.get(entry.targetCoverageId).push(entry)
  }

  const amounts = new Map()
  for (const [coverageId, entries] of buckets) {
    amounts.set(coverageId, aggregateBucket(entries, warnings))
  }

  return { amounts, warnings }
}

export function calculateEconomicPortfolioAmount(mappedEntries) {
  const poolSeen = new Set()
  let total = 0

  for (const entry of mappedEntries) {
    if (!Number.isSafeInteger(entry.amount_won) || entry.amount_won < 0) continue
    if (['REIMBURSEMENT', 'NON_COMPARABLE'].includes(entry.aggregationType)) continue

    if (entry.aggregationType === 'UNIQUE_POOL') {
      if (!entry.benefitPoolId || poolSeen.has(entry.benefitPoolId)) continue
      poolSeen.add(entry.benefitPoolId)
    }
    total += entry.amount_won
  }
  return total
}
