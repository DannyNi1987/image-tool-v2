import { useState, useRef } from 'react'
import { Dialog, Transition, Tab } from '@headlessui/react'
import { XMarkIcon, PlusIcon, TrashIcon, PencilIcon, CheckIcon } from '@heroicons/react/24/outline'
import { useOptions, useOptionActions } from '../store/useStore'
import { 
  loadPresets, 
  savePreset, 
  deletePreset, 
  loadDefaults, 
  saveDefaults, 
  exportAllPresets, 
  importAllPresets,
  type PresetMap 
} from '../utils/presets'

interface SetupModalProps {
  isOpen: boolean
  onClose: () => void
}

const SetupModal: React.FC<SetupModalProps> = ({ isOpen, onClose }) => {
  const options = useOptions()
  const { updateOptions } = useOptionActions()
  const [activeTab, setActiveTab] = useState(0)
  const [presets, setPresets] = useState<PresetMap>(loadPresets())
  const [newPresetName, setNewPresetName] = useState('')

  const [importMode, setImportMode] = useState<'replace' | 'merge'>('merge')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const tabs = [
    { name: '预设管理', icon: PlusIcon },
    { name: '默认设置', icon: CheckIcon },
    { name: '导入导出', icon: PencilIcon }
  ]

  const refreshPresets = () => {
    setPresets(loadPresets())
  }

  const handleSavePreset = () => {
    if (!newPresetName.trim()) return
    
    const existingPreset = presets[newPresetName]
    if (existingPreset) {
      if (!confirm(`预设 "${newPresetName}" 已存在，是否覆盖？`)) return
    }
    
    savePreset(newPresetName, options)
    setNewPresetName('')
    refreshPresets()
  }

  const handleApplyPreset = (presetName: string) => {
    const preset = presets[presetName]
    if (preset) {
      updateOptions(preset)
    }
  }

  const handleDeletePreset = (presetName: string) => {
    if (confirm(`确定要删除预设 "${presetName}" 吗？`)) {
      deletePreset(presetName)
      refreshPresets()
    }
  }



  const handleExport = () => {
    exportAllPresets()
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    try {
      await importAllPresets(file, importMode)
      refreshPresets()
      alert('导入成功！')
    } catch (error) {
      alert('导入失败：' + (error as Error).message)
    }
    
    // 清空文件输入
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSaveDefaults = () => {
    saveDefaults(options)
    alert('默认设置已保存！')
  }

  const handleResetDefaults = () => {
    if (confirm('确定要重置为系统默认设置吗？')) {
      const defaults = loadDefaults()
      updateOptions(defaults)
    }
  }

  return (
    <Transition show={isOpen} as="div" className="relative z-50">
      <Dialog onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          <Transition.Child
            as="div"
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className="fixed inset-0 bg-black/60"
          />

          <Transition.Child
            as="div"
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
            className="relative w-full max-w-4xl bg-white rounded-2xl shadow-panel"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-panel-border">
              <h2 className="text-xl font-title font-semibold text-primary">设置</h2>
              <button
                onClick={onClose}
                className="p-2 text-muted hover:text-text transition-colors"
                aria-label="关闭"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
                <Tab.List className="flex space-x-1 rounded-lg bg-gray-100 p-1 mb-6">
                  {tabs.map((tab) => (
                    <Tab
                      key={tab.name}
                      className={({ selected }) =>
                        `flex-1 rounded-md py-2 px-3 text-sm font-body font-medium transition-colors ${
                          selected
                            ? 'bg-white text-primary shadow-sm'
                            : 'text-muted hover:text-text'
                        }`
                      }
                    >
                      {tab.name}
                    </Tab>
                  ))}
                </Tab.List>

                <Tab.Panels>
                  {/* 预设管理 */}
                  <Tab.Panel className="space-y-6">
                    <div>
                      <h3 className="text-lg font-title font-semibold text-primary mb-4">保存当前设置</h3>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newPresetName}
                          onChange={(e) => setNewPresetName(e.target.value)}
                          placeholder="输入预设名称"
                          className="flex-1 h-10 rounded-md border border-panel-border px-3 font-body"
                          onKeyPress={(e) => e.key === 'Enter' && handleSavePreset()}
                        />
                        <button
                          onClick={handleSavePreset}
                          disabled={!newPresetName.trim()}
                          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-body font-medium"
                        >
                          保存
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-title font-semibold text-primary mb-4">已保存的预设</h3>
                      {Object.keys(presets).length === 0 ? (
                        <p className="text-muted text-center py-8">暂无保存的预设</p>
                      ) : (
                        <div className="space-y-2">
                          {Object.entries(presets).map(([name, preset]) => (
                            <div
                              key={name}
                              className="flex items-center justify-between p-3 border border-panel-border rounded-lg"
                            >
                              <div className="flex-1">
                                <div className="font-body font-medium text-text">{name}</div>
                                <div className="text-sm text-muted">
                                  创建于 {new Date(preset._metadata?.createdAt || Date.now()).toLocaleString()}
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleApplyPreset(name)}
                                  className="px-3 py-1 text-sm bg-accent text-white rounded hover:bg-accent/90 font-body"
                                >
                                  应用
                                </button>
                                
                                <button
                                  onClick={() => handleDeletePreset(name)}
                                  className="p-1 text-muted hover:text-danger"
                                  title="删除"
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Tab.Panel>

                  {/* 默认设置 */}
                  <Tab.Panel className="space-y-6">
                    <div>
                      <h3 className="text-lg font-title font-semibold text-primary mb-4">默认设置</h3>
                      <p className="text-muted mb-4">
                        这些设置将作为新页面的默认值。当前设置将作为默认值保存。
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveDefaults}
                          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 font-body font-medium"
                        >
                          保存当前为默认
                        </button>
                        <button
                          onClick={handleResetDefaults}
                          className="px-4 py-2 border border-panel-border text-text rounded-md hover:bg-gray-50 font-body font-medium"
                        >
                          重置为系统默认
                        </button>
                      </div>
                    </div>
                  </Tab.Panel>

                  {/* 导入导出 */}
                  <Tab.Panel className="space-y-6">
                    <div>
                      <h3 className="text-lg font-title font-semibold text-primary mb-4">导出设置</h3>
                      <p className="text-muted mb-4">
                        导出所有预设和默认设置到 JSON 文件。
                      </p>
                      <button
                        onClick={handleExport}
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 font-body font-medium"
                      >
                        导出设置
                      </button>
                    </div>

                    <div>
                      <h3 className="text-lg font-title font-semibold text-primary mb-4">导入设置</h3>
                      <p className="text-muted mb-4">
                        从 JSON 文件导入预设和默认设置。
                      </p>
                      <div className="space-y-4">
                        <div className="flex space-x-4">
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              value="merge"
                              checked={importMode === 'merge'}
                              onChange={(e) => setImportMode(e.target.value as 'replace' | 'merge')}
                            />
                            <span className="font-body">合并（保留现有预设）</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              value="replace"
                              checked={importMode === 'replace'}
                              onChange={(e) => setImportMode(e.target.value as 'replace' | 'merge')}
                            />
                            <span className="font-body">替换（覆盖所有预设）</span>
                          </label>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".json"
                          onChange={handleImport}
                          className="block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-body file:bg-primary file:text-white hover:file:bg-primary/90"
                        />
                      </div>
                    </div>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export default SetupModal

