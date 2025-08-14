import { ToolOptions } from '../types'

const PRESET_KEY = 'imgtool_presets_v1'
const DEFAULTS_KEY = 'imgtool_defaults_v1'

export type PresetMap = Record<string, ToolOptions>

/**
 * 加载所有预设
 */
export function loadPresets(): PresetMap {
  try {
    return JSON.parse(localStorage.getItem(PRESET_KEY) || '{}')
  } catch {
    return {}
  }
}

/**
 * 保存所有预设
 */
export function savePresets(all: PresetMap) {
  localStorage.setItem(PRESET_KEY, JSON.stringify(all))
}

/**
 * 保存单个预设
 */
export function savePreset(name: string, options: ToolOptions) {
  const all = loadPresets()
  all[name] = {
    ...options,
    _metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
  savePresets(all)
}

/**
 * 删除预设
 */
export function deletePreset(name: string) {
  const all = loadPresets()
  delete all[name]
  savePresets(all)
}

/**
 * 重命名预设
 */
export function renamePreset(oldName: string, newName: string) {
  const all = loadPresets()
  if (all[oldName] && !all[newName]) {
    all[newName] = {
      ...all[oldName],
      _metadata: {
        createdAt: all[oldName]._metadata?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
    delete all[oldName]
    savePresets(all)
    return true
  }
  return false
}

/**
 * 加载默认设置
 */
export function loadDefaults(): Partial<ToolOptions> {
  try {
    return JSON.parse(localStorage.getItem(DEFAULTS_KEY) || '{}')
  } catch {
    return {}
  }
}

/**
 * 保存默认设置
 */
export function saveDefaults(partial: Partial<ToolOptions>) {
  localStorage.setItem(DEFAULTS_KEY, JSON.stringify(partial))
}

/**
 * 导出所有预设和默认设置
 */
export function exportAllPresets() {
  const data = {
    presets: loadPresets(),
    defaults: loadDefaults(),
    exportedAt: new Date().toISOString(),
    version: '1.0'
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { 
    type: 'application/json' 
  })
  
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'image-tool-presets.json'
  a.click()
  
  // 延迟回收对象 URL
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/**
 * 导入预设和默认设置
 */
export async function importAllPresets(
  file: File, 
  mode: 'replace' | 'merge' = 'merge'
): Promise<PresetMap> {
  const text = await file.text()
  const data = JSON.parse(text || '{}')
  
  const current = loadPresets()
  const next = mode === 'replace' 
    ? (data.presets || {}) 
    : { ...current, ...(data.presets || {}) }
  
  savePresets(next)
  
  if (data.defaults) {
    saveDefaults(data.defaults)
  }
  
  return next
}

/**
 * 清除所有预设和默认设置
 */
export function clearAllPresets() {
  localStorage.removeItem(PRESET_KEY)
  localStorage.removeItem(DEFAULTS_KEY)
}
