function issue(level, code, message, path = null) {
  return { level, code, message, path }
}

export function validateCustomerInput(input) {
  const errors = []
  const warnings = []

  for (const item of input.issues) {
    const target = item.severity === 'blocking' ? errors : warnings
    target.push(issue(item.severity === 'blocking' ? 'error' : item.severity, item.type || 'SOURCE_ISSUE', item.message, item.source_ref))
  }

  if (!input.customer.name || input.customer.name === '고객') {
    warnings.push(issue('warning', 'CUSTOMER_NAME_MISSING', '고객 이름이 없어 기본 표시명을 사용합니다.', 'customer.name'))
  }

  if (input.customer.source_age !== null && input.customer.age !== null && input.customer.source_age !== input.customer.age) {
    warnings.push(issue('warning', 'AGE_RECALCULATED', `원문 나이 ${input.customer.source_age}세 대신 생년월일 기준 만 나이 ${input.customer.age}세를 통계에 사용합니다.`, 'customer.age'))
  }

  const selfCoverages = input.insurance.coverages.filter(c => c.insured === 'self')
  if (selfCoverages.length > 0 && !input.insurance.source_complete) {
    errors.push(issue('error', 'INSURANCE_SOURCE_INCOMPLETE', '보험 원문 전체 확인이 끝나지 않았습니다.', 'insurance.source_complete'))
  }

  selfCoverages.forEach((coverage, index) => {
    if (coverage.amount_won === null) {
      const target = coverage.coverage_id ? errors : warnings
      target.push(issue(
        coverage.coverage_id ? 'error' : 'warning',
        'INSURANCE_AMOUNT_MISSING',
        `${coverage.rider_name}: 보장금액을 확인할 수 없습니다.`,
        `insurance.coverages[${index}].amount_won`
      ))
    }
    if (!coverage.policy_key) {
      warnings.push(issue('warning', 'POLICY_KEY_FALLBACK', `${coverage.company} ${coverage.product}: policy_key가 없어 보험사+상품명 기준으로 임시 그룹화합니다.`, `insurance.coverages[${index}].policy_key`))
    }
  })

  const unknownInsured = input.insurance.coverages.filter(c => c.insured === 'unknown')
  if (unknownInsured.length) {
    warnings.push(issue('warning', 'INSURED_UNKNOWN', `피보험자 확인이 필요한 담보 ${unknownInsured.length}건은 본인 보장 합계에서 제외합니다.`, 'insurance.coverages'))
  }

  return { errors, warnings }
}
