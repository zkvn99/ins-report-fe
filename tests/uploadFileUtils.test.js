import { describe, expect, it } from 'vitest'
import { addUniqueFiles, createAnalysisFormData, isAcceptedFile } from '../src/features/upload/fileUtils.js'

const pdf = { name: 'health.pdf', size: 10, lastModified: 1 }
const otherPdf = { name: 'insurance.PDF', size: 20, lastModified: 2 }
const xlsx = { name: 'standard.xlsx', size: 30, lastModified: 3 }

describe('upload file handling', () => {
  it('accepts PDF selection and rejects unsupported extensions', () => {
    expect(isAcceptedFile(pdf, ['.pdf'])).toBe(true)
    expect(isAcceptedFile({ name: 'health.csv' }, ['.pdf'])).toBe(false)
  })

  it('adds multiple dropped files without duplicates', () => {
    expect(addUniqueFiles([pdf], [pdf, otherPdf])).toEqual([pdf, otherPdf])
  })

  it('keeps one standard file', () => {
    expect(addUniqueFiles([pdf], [xlsx], false)).toEqual([xlsx])
  })

  it('uses the backend multipart field names', () => {
    const formData = createAnalysisFormData([pdf], [otherPdf], xlsx)
    expect([...formData.keys()]).toEqual(['healthFiles', 'insuranceFiles', 'standardFile'])
  })
})
