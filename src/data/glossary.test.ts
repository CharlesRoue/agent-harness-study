import { describe, it, expect } from 'vitest'
import { glossary, glossaryMap, getTermsForChapter, findTermsInText } from './glossary'

describe('glossary', () => {
  it('has at least 15 terms', () => {
    expect(glossary.length).toBeGreaterThanOrEqual(15)
  })

  it('every term has required fields', () => {
    for (const t of glossary) {
      expect(t.term).toBeTruthy()
      expect(t.category).toBeTruthy()
      expect(t.definition).toBeTruthy()
      expect(t.analogy).toBeTruthy()
      expect(t.firstSeen).toBeTruthy()
    }
  })

  it('glossaryMap lookup works', () => {
    const term = glossaryMap.get('agent loop')
    expect(term).toBeDefined()
    expect(term?.category).toBe('核心机制')
  })

  it('getTermsForChapter filters correctly', () => {
    const s01Terms = getTermsForChapter('s01')
    expect(s01Terms.length).toBeGreaterThan(0)
    for (const t of s01Terms) {
      expect(t.firstSeen).toBe('s01')
    }
  })

  it('findTermsInText locates terms', () => {
    const text = 'The Agent Loop uses Tool Calling to interact with the Harness.'
    const found = findTermsInText(text)
    expect(found.length).toBeGreaterThanOrEqual(2)
    const terms = found.map(f => f.term.term)
    expect(terms).toContain('Agent Loop')
    expect(terms).toContain('Tool Calling')
  })
})
