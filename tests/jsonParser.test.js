import { describe, expect, it } from 'vitest'
import { parseJsonText } from '../src/input/jsonParser.js'

describe('parseJsonText', () => {
  it('parses plain json', () => {
    expect(parseJsonText('{"version":"2.0"}')).toEqual({ version: '2.0' })
  })

  it('removes markdown fences', () => {
    expect(parseJsonText('```json\n{"version":"2.0"}\n```')).toEqual({ version: '2.0' })
  })

  it('extracts json object from surrounding prose', () => {
    expect(parseJsonText('결과입니다.\n{"version":"2.0"}\n끝')).toEqual({ version: '2.0' })
  })
})
