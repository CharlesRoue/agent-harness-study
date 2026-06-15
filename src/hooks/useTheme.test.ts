import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTheme } from './useTheme'

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('defaults to light theme', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
  })

  it('toggles correctly', () => {
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.toggleTheme()
    })
    expect(result.current.theme).toBe('dark')

    act(() => {
      result.current.toggleTheme()
    })
    expect(result.current.theme).toBe('light')
  })

  it('persists to localStorage', () => {
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.toggleTheme()
    })
    expect(localStorage.getItem('agent-harness-theme')).toBe('dark')
  })

  it('sets data-theme attribute', () => {
    const { result } = renderHook(() => useTheme())

    expect(document.documentElement.getAttribute('data-theme')).toBe('light')

    act(() => {
      result.current.toggleTheme()
    })
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })
})
