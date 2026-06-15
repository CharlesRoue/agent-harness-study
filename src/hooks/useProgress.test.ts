import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useProgress } from './useProgress'

describe('useProgress', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts with default progress', () => {
    const { result } = renderHook(() => useProgress())
    expect(result.current.progress.currentChapter).toBe('s01')
    expect(Object.keys(result.current.progress.chapters)).toHaveLength(0)
  })

  it('marks chapter as read', () => {
    const { result } = renderHook(() => useProgress())

    act(() => {
      result.current.markRead('s01')
    })

    expect(result.current.progress.chapters['s01']?.read).toBe(true)
  })

  it('sets current chapter', () => {
    const { result } = renderHook(() => useProgress())

    act(() => {
      result.current.setCurrentChapter('s05')
    })

    expect(result.current.progress.currentChapter).toBe('s05')
  })

  it('records answers and computes score', () => {
    const { result } = renderHook(() => useProgress())

    act(() => {
      result.current.recordAnswer('s01', 'ex1', true, 'answer1', 3)
    })

    expect(result.current.progress.chapters['s01']?.score).toBe('1/3')
    expect(result.current.progress.chapters['s01']?.exercises).toBe('in_progress')
  })

  it('marks all_correct when all correct', () => {
    const { result } = renderHook(() => useProgress())

    act(() => {
      result.current.recordAnswer('s01', 'ex1', true, 'a1', 2)
      result.current.recordAnswer('s01', 'ex2', true, 'a2', 2)
    })

    expect(result.current.progress.chapters['s01']?.score).toBe('2/2')
    expect(result.current.progress.chapters['s01']?.exercises).toBe('all_correct')
    expect(result.current.progress.chapters['s01']?.completedAt).toBeTruthy()
  })

  it('persists to localStorage', () => {
    const { result } = renderHook(() => useProgress())

    act(() => {
      result.current.markRead('s01')
      result.current.setCurrentChapter('s02')
    })

    const saved = JSON.parse(localStorage.getItem('agent-harness-learn-progress') || '{}')
    expect(saved.currentChapter).toBe('s02')
    expect(saved.chapters['s01']?.read).toBe(true)
  })
})
