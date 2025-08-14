import { ToolOptions, Preset } from '../types'

const STORAGE_KEYS = {
  OPTIONS: 'image-converter-options',
  PRESETS: 'image-converter-presets',
  CUSTOM_PRESETS: 'image-converter-custom-presets'
} as const

// 保存选项到本地存储
export function saveOptionsToStorage(options: ToolOptions): void {
  try {
    localStorage.setItem(STORAGE_KEYS.OPTIONS, JSON.stringify(options))
  } catch (error) {
    console.warn('Failed to save options to localStorage:', error)
  }
}

// 从本地存储加载选项
export function loadOptionsFromStorage(): ToolOptions | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.OPTIONS)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.warn('Failed to load options from localStorage:', error)
    return null
  }
}

// 保存预设到本地存储
export function savePresetsToStorage(presets: Record<string, Preset>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_PRESETS, JSON.stringify(presets))
  } catch (error) {
    console.warn('Failed to save presets to localStorage:', error)
  }
}

// 从本地存储加载预设
export function loadPresetsFromStorage(): Record<string, Preset> {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_PRESETS)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.warn('Failed to load presets from localStorage:', error)
    return {}
  }
}

// 导出预设为 JSON
export function exportPresets(presets: Record<string, Preset>): string {
  return JSON.stringify(presets, null, 2)
}

// 导入预设从 JSON
export function importPresets(jsonString: string): Record<string, Preset> {
  try {
    const parsed = JSON.parse(jsonString)
    // 验证数据结构
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed
    }
    throw new Error('Invalid preset data structure')
  } catch (error) {
    console.error('Failed to import presets:', error)
    throw new Error('无效的预设文件格式')
  }
}

// 清除本地存储
export function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.OPTIONS)
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_PRESETS)
  } catch (error) {
    console.warn('Failed to clear localStorage:', error)
  }
}
