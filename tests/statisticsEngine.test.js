import { describe, expect, it } from 'vitest'
import { buildStatisticsModel } from '../src/domain/statistics/statisticsEngine.js'

describe('statistics engine', () => {
  it('selects age-band history for the customer age', () => {
    const model = buildStatisticsModel({ customer: { age: 47 } })
    const brain = model.modules.find(item => item.moduleId === 'brain')
    expect(brain.history.scope).toContain('40')
    expect(brain.history.points.length).toBeGreaterThan(0)
  })
})
