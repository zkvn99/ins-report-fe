import { describe, expect, it } from 'vitest'
import { addUniqueFiles, createAnalysisFormData, isAcceptedFile } from '../src/features/upload/fileUtils.js'

const pdf = { name: 'health.pdf', size: 10, lastModified: 1 }
const otherPdf = { name: 'insurance.PDF', size: 20, lastModified: 2 }

describe('upload file handling', () => {
  it('accepts PDF selection and rejects unsupported extensions', () => {
    expect(isAcceptedFile(pdf, ['.pdf'], ['application/pdf'])).toBe(true)
    expect(isAcceptedFile({ name: 'health.csv' }, ['.pdf'], ['application/pdf'])).toBe(false)
  })

  it('accepts PDFs whose browser MIME type is generic', () => {
    expect(isAcceptedFile({ name: 'health.pdf', type: 'application/octet-stream' }, ['.pdf'], ['application/pdf'])).toBe(true)
  })

  it('rejects a PDF extension with a known incompatible MIME type', () => {
    expect(isAcceptedFile({ name: 'health.pdf', type: 'text/plain' }, ['.pdf'], ['application/pdf'])).toBe(false)
  })

  it('accepts Excel extensions for the recommendation amount file', () => {
    expect(isAcceptedFile({ name: 'recommendation.xlsx' }, ['.xls', '.xlsx'])).toBe(true)
    expect(isAcceptedFile({ name: 'recommendation.pdf' }, ['.xls', '.xlsx'])).toBe(false)
  })

  it('adds multiple dropped files without duplicates', () => {
    expect(addUniqueFiles([pdf], [pdf, otherPdf])).toEqual([pdf, otherPdf])
  })

  it('adds a file to an empty array', () => {
    expect(addUniqueFiles([], [pdf])).toEqual([pdf])
  })

  it('uses an empty array when current files are undefined', () => {
    expect(addUniqueFiles(undefined, [pdf])).toEqual([pdf])
  })

  it('normalizes an incoming FileList-like value', () => {
    const fileList = { 0: pdf, 1: otherPdf, length: 2 }
    expect(addUniqueFiles([], fileList)).toEqual([pdf, otherPdf])
  })

  it('keeps files with the same name but different metadata', () => {
    const newerPdf = { ...pdf, size: 11, lastModified: 2 }
    expect(addUniqueFiles([pdf], [newerPdf])).toEqual([pdf, newerPdf])
  })

  it('allows a removed file to be added again', () => {
    const remainingFiles = addUniqueFiles([pdf, otherPdf], []).filter(file => file !== pdf)
    expect(addUniqueFiles(remainingFiles, [pdf])).toEqual([otherPdf, pdf])
  })

  it('replaces the optional Excel when only one file is allowed', () => {
    const previous = { name: 'old.xlsx', size: 30, lastModified: 3 }
    const replacement = { name: 'new.xlsx', size: 40, lastModified: 4 }

    expect(addUniqueFiles([previous], [replacement], false)).toEqual([replacement])
  })

  it('uses the backend multipart field names', () => {
    const formData = createAnalysisFormData([pdf, otherPdf])
    expect([...formData.keys()]).toEqual(['files', 'files'])
  })

  it('keeps actual files in the multipart form data', () => {
    const healthFile = new File(['health'], 'health.pdf', { type: 'application/pdf', lastModified: 1 })
    const insuranceFile = new File(['insurance'], 'insurance.pdf', { type: 'application/pdf', lastModified: 2 })

    const formData = createAnalysisFormData([healthFile, insuranceFile])

    expect(formData.getAll('files')).toEqual([healthFile, insuranceFile])
  })
})
