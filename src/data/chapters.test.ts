import { describe, it, expect } from 'vitest'
import { getChapter, getChapterIndex, getAdjacentChapters, chapters } from './chapters'

describe('chapters', () => {
  it('has 20 chapters', () => {
    expect(chapters).toHaveLength(20)
  })

  it('getChapter returns correct chapter', () => {
    const ch = getChapter('s01')
    expect(ch?.title).toBe('Agent Loop')
    expect(ch?.phase).toBe(1)
  })

  it('getChapterIndex returns correct index', () => {
    expect(getChapterIndex('s01')).toBe(0)
    expect(getChapterIndex('s20')).toBe(19)
  })

  it('getAdjacentChapters returns prev/next correctly', () => {
    const { prev, next } = getAdjacentChapters('s02')
    expect(prev?.id).toBe('s01')
    expect(next?.id).toBe('s03')
  })

  it('getAdjacentChapters handles boundaries', () => {
    expect(getAdjacentChapters('s01').prev).toBeNull()
    expect(getAdjacentChapters('s20').next).toBeNull()
  })

  it('phase 1 has s01-s11, phase 2 has s12-s20', () => {
    const phase1 = chapters.filter(c => c.phase === 1)
    const phase2 = chapters.filter(c => c.phase === 2)
    expect(phase1).toHaveLength(11)
    expect(phase2).toHaveLength(9)
  })
})
