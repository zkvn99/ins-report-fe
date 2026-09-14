import coverageCatalog from '../../data/coverage-catalog.json'
import mappingRulePack from '../../data/insurance-mapping-rules.json'

const catalogMap = new Map(coverageCatalog.map(item => [item.id, item]))

export function normalizeInsuranceText(value) {
  return String(value ?? '')
    .normalize('NFKC')
    .replace(/\s+/g, '')
    .replace(/[·ㆍ]/g, '')
    .trim()
    .toLowerCase()
}

function regexMatch(pattern, value) {
  if (!pattern) return true
  try {
    return new RegExp(pattern, 'i').test(String(value ?? '').trim())
  } catch {
    return false
  }
}

function matchRule(entry, rule) {
  if (!rule.enabled) return false
  if (rule.provider_type && rule.provider_type !== entry.provider_type) return false
  return regexMatch(rule.company_pattern, entry.company)
    && regexMatch(rule.product_pattern, entry.product)
    && regexMatch(rule.source_group_pattern, entry.source_group)
    && regexMatch(rule.rider_pattern, entry.rider_name)
}

function defaultAggregation(paymentType) {
  switch (paymentType) {
    case 'daily': return 'PER_DAY'
    case 'per_day': return 'PER_DAY'
    case 'per_event': return 'PER_EVENT'
    case 'reimbursement': return 'REIMBURSEMENT'
    case 'conditional': return 'NON_COMPARABLE'
    default: return 'SUM'
  }
}

export function mapCoverageEntry(entry, options = {}) {
  const rules = options.rules ?? mappingRulePack.rules

  if (entry.coverage_id && catalogMap.has(entry.coverage_id)) {
    return {
      ...entry,
      targetCoverageId: entry.coverage_id,
      mappingStatus: 'DIRECT_ID',
      mappingRuleId: null,
      aggregationType: entry.aggregation_type || defaultAggregation(entry.payment_type),
      benefitPoolId: entry.benefit_pool_id || null
    }
  }

  if (entry.coverage_id && !catalogMap.has(entry.coverage_id)) {
    return {
      ...entry,
      targetCoverageId: null,
      mappingStatus: 'INVALID_ID',
      mappingRuleId: null,
      aggregationType: 'NON_COMPARABLE',
      benefitPoolId: entry.benefit_pool_id || null
    }
  }

  const matches = rules
    .filter(rule => matchRule(entry, rule))
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))

  if (!matches.length) {
    return {
      ...entry,
      targetCoverageId: null,
      mappingStatus: 'UNMAPPED',
      mappingRuleId: null,
      aggregationType: 'NON_COMPARABLE',
      benefitPoolId: entry.benefit_pool_id || null
    }
  }

  const topPriority = matches[0].priority ?? 0
  const top = matches.filter(rule => (rule.priority ?? 0) === topPriority)
  const uniqueTargets = new Set(top.map(rule => rule.target_coverage_id))
  if (uniqueTargets.size !== 1) {
    return {
      ...entry,
      targetCoverageId: null,
      mappingStatus: 'AMBIGUOUS_RULE',
      mappingRuleId: top.map(rule => rule.id).join(','),
      aggregationType: 'NON_COMPARABLE',
      benefitPoolId: entry.benefit_pool_id || null
    }
  }

  const rule = top[0]
  return {
    ...entry,
    targetCoverageId: rule.target_coverage_id,
    mappingStatus: 'RULE',
    mappingRuleId: rule.id,
    aggregationType: entry.aggregation_type || rule.aggregation_type || defaultAggregation(rule.payment_type || entry.payment_type),
    benefitPoolId: entry.benefit_pool_id || null
  }
}

export function mapCoverageEntries(entries, options = {}) {
  return entries.map(entry => mapCoverageEntry(entry, options))
}
