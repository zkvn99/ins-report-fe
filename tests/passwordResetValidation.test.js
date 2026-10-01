import { describe, expect, it } from 'vitest'
import { validateNewPassword } from '../src/features/auth/passwordResetValidation.js'

describe('validateNewPassword', () => {
  it('accepts matching passwords that satisfy the existing length policy', () => {
    expect(validateNewPassword('password123', 'password123')).toBe('')
  })

  it('rejects a short password', () => {
    expect(validateNewPassword('short', 'short')).toContain('8자 이상')
  })

  it('rejects a different confirmation', () => {
    expect(validateNewPassword('password123', 'password456')).toContain('일치하지 않습니다')
  })
})
