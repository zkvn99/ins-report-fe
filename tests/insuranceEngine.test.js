import { describe, expect, it } from 'vitest'
import { buildInsuranceModel } from '../src/domain/insurance/insuranceEngine.js'

const base = {
  source_label: 'test',
  as_of_date: '2026-09-14',
  source_complete: true,
  provider_type: 'MERITZ_REPORT'
}

describe('insurance engine', () => {
  it('sums independent fixed coverages mapped to one standard coverage', () => {
    const model = buildInsuranceModel({
      ...base,
      coverages: [
        { source_entry_key: '1', policy_key: 'P1', company: 'A', product: 'X', rider_name: '암', amount_won: 10000000, coverage_id: 'C010', insured: 'self', payment_type: 'fixed_amount' },
        { source_entry_key: '2', policy_key: 'P2', company: 'B', product: 'Y', rider_name: '암', amount_won: 20000000, coverage_id: 'C010', insured: 'self', payment_type: 'fixed_amount' }
      ]
    }, [])
    expect(model.coverage.find(item => item.id === 'C010').currentWon).toBe(30000000)
  })

  it('preserves unmapped rider without adding it to standard coverage', () => {
    const model = buildInsuranceModel({
      ...base,
      coverages: [
        { source_entry_key: '1', policy_key: 'P1', company: 'A', product: 'X', rider_name: '복합담보', amount_won: 10000000, coverage_id: null, insured: 'self', payment_type: 'conditional' }
      ]
    }, [])
    expect(model.supplemental).toHaveLength(1)
  })
})
