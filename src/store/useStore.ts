import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { 
  FileItem, 
  ToolOptions, 
  Preset, 
  QueueState,
  EncodeJob,
  EncodeResult
} from '../types'
import { defaultToolOptions, defaultPresets } from './defaultOptions'
import { 
  saveOptionsToStorage, 
  loadOptionsFromStorage,
  savePresetsToStorage,
  loadPresetsFromStorage,
  exportPresets,
  importPresets
} from './storage'
import { loadDefaults } from '../utils/presets'
import { WorkerPool } from '../workers/workerPool'
import { generateOutputName } from '../utils/naming'

// WorkerPool 实例
let workerPool: WorkerPool | null = null

// 应用状态接口
interface AppState {
  // 状态
  files: FileItem[]
  options: ToolOptions
  presets: Record<string, Preset>
  queue: QueueState
  selectedFiles: string[]
  
  // 文件操作
  addFiles: (files: File[]) => Promise<void>
  removeFile: (id: string) => void
  clearFiles: () => void
  updateFileStatus: (id: string, status: FileItem['status'], error?: string) => void
  updateFileResult: (id: string, resultBlob: Blob, outputName: string, meta?: Record<string, unknown>) => void
  
  // 文件选择
  selectFile: (id: string) => void
  selectAllFiles: () => void
  deselectAllFiles: () => void
  
  // 选项操作
  updateOptions: (updates: Partial<ToolOptions>) => void
  resetOptions: () => void
  
  // 预设操作
  savePreset: (name: string, options: ToolOptions) => void
  loadPreset: (id: string) => void
  deletePreset: (id: string) => void
  exportPresetsData: () => string
  importPresetsData: (jsonString: string) => void
  
  // 队列操作
  addToQueue: (fileIds: string[]) => void
  removeFromQueue: (fileId: string) => void
  clearQueue: () => void
  setQueueProcessing: (processing: boolean) => void
  setCurrentJob: (jobId?: string) => void
  
  // 编码操作
  startEncoding: (jobs: EncodeJob[]) => void
  handleEncodeResult: (result: EncodeResult) => void
  
  // 实际转换操作
  startConversion: () => void
  cancelConversion: () => void
  handleWorkerEvent: (event: any) => void
  
  // 持久化
  loadFromStorage: () => void
  saveToStorage: () => void
}

// 创建 store
export const useStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // 初始状态
        files: [],
        options: { ...defaultToolOptions, ...loadDefaults() },
        presets: Object.entries(defaultPresets).reduce((acc, [id, options]) => {
          acc[id] = {
            id,
            name: getPresetName(id),
            options,
            createdAt: Date.now(),
            updatedAt: Date.now()
          }
          return acc
        }, {} as Record<string, Preset>),
        queue: {
          processing: false,
          jobs: [],
          currentJob: undefined
        },
        selectedFiles: [],

        // 文件操作
        addFiles: async (files: File[]) => {
          const newFiles: FileItem[] = await Promise.all(
            files.map(async (file, index) => {
              const arrayBuffer = await file.arrayBuffer()
              return {
                id: `${Date.now()}-${index}`,
                name: file.name,
                type: file.type,
                size: file.size,
                arrayBuffer,
                status: 'queued' as const
              }
            })
          )

          set((state) => ({
            files: [...state.files, ...newFiles],
            selectedFiles: [...state.selectedFiles, ...newFiles.map(f => f.id)]
          }))
        },

        removeFile: (id: string) => {
          set((state) => ({
            files: state.files.filter(f => f.id !== id),
            selectedFiles: state.selectedFiles.filter(f => f !== id),
            queue: {
              ...state.queue,
              jobs: state.queue.jobs.filter(jobId => jobId !== id)
            }
          }))
        },

        clearFiles: () => {
          set({
            files: [],
            selectedFiles: [],
            queue: {
              processing: false,
              jobs: [],
              currentJob: undefined
            }
          })
        },

        updateFileStatus: (id: string, status: FileItem['status'], error?: string) => {
          set((state) => ({
            files: state.files.map(f => 
              f.id === id 
                ? { ...f, status, ...(error && { error }) }
                : f
            )
          }))
        },

        updateFileResult: (id: string, resultBlob: Blob, outputName: string, meta?: Record<string, unknown>) => {
          set((state) => ({
            files: state.files.map(f => 
              f.id === id 
                ? { ...f, resultBlob, outputName, meta, status: 'done' as const }
                : f
            )
          }))
        },

        // 文件选择
        selectFile: (id: string) => {
          set((state) => ({
            selectedFiles: state.selectedFiles.includes(id)
              ? state.selectedFiles.filter(f => f !== id)
              : [...state.selectedFiles, id]
          }))
        },

        selectAllFiles: () => {
          set((state) => ({
            selectedFiles: state.files.map(f => f.id)
          }))
        },

        deselectAllFiles: () => {
          set({ selectedFiles: [] })
        },

        // 选项操作
        updateOptions: (updates: Partial<ToolOptions>) => {
          set((state) => ({
            options: { ...state.options, ...updates }
          }))
        },

        resetOptions: () => {
          set({ options: defaultToolOptions })
        },

        // 预设操作
        savePreset: (name: string, options: ToolOptions) => {
          const id = `preset-${Date.now()}`
          const preset: Preset = {
            id,
            name,
            options,
            createdAt: Date.now(),
            updatedAt: Date.now()
          }

          set((state) => ({
            presets: { ...state.presets, [id]: preset }
          }))
        },

        loadPreset: (id: string) => {
          const preset = get().presets[id]
          if (preset) {
            set({ options: preset.options })
          }
        },

        deletePreset: (id: string) => {
          set((state) => {
            const newPresets = { ...state.presets }
            delete newPresets[id]
            return { presets: newPresets }
          })
        },

        exportPresetsData: () => {
          return exportPresets(get().presets)
        },

        importPresetsData: (jsonString: string) => {
          try {
            const importedPresets = importPresets(jsonString)
            set((state) => ({
              presets: { ...state.presets, ...importedPresets }
            }))
          } catch (error) {
            console.error('Failed to import presets:', error)
            throw error
          }
        },

        // 队列操作
        addToQueue: (fileIds: string[]) => {
          set((state) => ({
            queue: {
              ...state.queue,
              jobs: [...state.queue.jobs, ...fileIds]
            }
          }))
        },

        removeFromQueue: (fileId: string) => {
          set((state) => ({
            queue: {
              ...state.queue,
              jobs: state.queue.jobs.filter(id => id !== fileId)
            }
          }))
        },

        clearQueue: () => {
          set(() => ({
            queue: {
              processing: false,
              jobs: [],
              currentJob: undefined
            }
          }))
        },

        setQueueProcessing: (processing: boolean) => {
          set(() => ({
            queue: { ...get().queue, processing }
          }))
        },

        setCurrentJob: (jobId?: string) => {
          set(() => ({
            queue: { ...get().queue, currentJob: jobId }
          }))
        },

        // 编码操作
        startEncoding: (jobs: EncodeJob[]) => {
          // TODO: 实现 Web Worker 编码
          console.log('Starting encoding jobs:', jobs)
          set((state) => ({
            queue: { ...state.queue, processing: true }
          }))
        },

        handleEncodeResult: (result: EncodeResult) => {
          if (result.success && result.blob) {
            get().updateFileResult(result.fileId, result.blob, `converted_${result.fileId}`, result.outputMeta)
          } else {
            get().updateFileStatus(result.fileId, 'error', result.error)
          }
        },

        // 实际转换操作
        startConversion: () => {
          const state = get()
          const queuedFiles = state.files.filter(f => f.status === 'queued')
          
          if (queuedFiles.length === 0) return
          
          // 初始化 WorkerPool
          if (!workerPool) {
            workerPool = new WorkerPool('/src/workers/codecWorker.ts')
          }
          
          // 创建编码任务
          const jobs = queuedFiles.map(file => ({
            id: `job-${file.id}-${Date.now()}`,
            fileId: file.id,
            options: state.options,
            arrayBuffer: file.arrayBuffer!
          }))
          
          // 更新文件状态为处理中
          queuedFiles.forEach(file => {
            get().updateFileStatus(file.id, 'processing')
          })
          
          // 设置队列状态
          set((state) => ({
            queue: { 
              ...state.queue, 
              processing: true,
              jobs: jobs.map(j => j.id)
            }
          }))
          
          // 添加任务到 WorkerPool
          jobs.forEach(job => {
            workerPool!.on(job.id, (event) => {
              get().handleWorkerEvent(event)
            })
            workerPool!.add(job)
          })
        },

        cancelConversion: () => {
          if (workerPool) {
            const state = get()
            state.queue.jobs.forEach(jobId => {
              workerPool!.cancel(jobId)
            })
            
            // 重置文件状态
            state.files.forEach(file => {
              if (file.status === 'processing') {
                get().updateFileStatus(file.id, 'queued')
              }
            })
            
            set((state) => ({
              queue: { 
                ...state.queue, 
                processing: false,
                jobs: []
              }
            }))
          }
        },

        handleWorkerEvent: (event: any) => {
          const { type, fileId, progress, blob, outputMeta, error } = event
          
          if (type === 'progress') {
            // 更新文件进度
            const state = get()
            const file = state.files.find(f => f.id === fileId)
            if (file) {
              set((state) => ({
                files: state.files.map(f => 
                  f.id === fileId 
                    ? { ...f, progress: Math.round(progress * 100) }
                    : f
                )
              }))
            }
          } else if (type === 'done') {
            // 处理完成
            const outputName = generateOutputName(
              get().files.find(f => f.id === fileId)?.name || 'image',
              get().options.rename,
              outputMeta,
              0
            )
            
            get().updateFileResult(fileId, blob, outputName, outputMeta)
            get().updateFileStatus(fileId, 'done')
            
            // 检查是否所有任务都完成
            const state = get()
            const processingFiles = state.files.filter(f => f.status === 'processing')
            if (processingFiles.length === 0) {
              set((state) => ({
                queue: { 
                  ...state.queue, 
                  processing: false,
                  jobs: []
                }
              }))
            }
          } else if (type === 'error') {
            // 处理错误
            get().updateFileStatus(fileId, 'error', error)
            
            // 检查是否所有任务都完成
            const state = get()
            const processingFiles = state.files.filter(f => f.status === 'processing')
            if (processingFiles.length === 0) {
              set((state) => ({
                queue: { 
                  ...state.queue, 
                  processing: false,
                  jobs: []
                }
              }))
            }
          }
        },

        // 持久化
        loadFromStorage: () => {
          const storedOptions = loadOptionsFromStorage()
          const storedPresets = loadPresetsFromStorage()
          
          if (storedOptions) {
            set({ options: storedOptions })
          }
          
          if (Object.keys(storedPresets).length > 0) {
            set((state) => ({
              presets: { ...state.presets, ...storedPresets }
            }))
          }
        },

        saveToStorage: () => {
          const { options, presets } = get()
          saveOptionsToStorage(options)
          savePresetsToStorage(presets)
        }
      }),
      {
        name: 'image-converter-storage',
        partialize: (state) => ({
          options: state.options,
          presets: state.presets
        })
      }
    ),
    {
      name: 'image-converter-store'
    }
  )
)

// 辅助函数
function getPresetName(id: string): string {
  const names: Record<string, string> = {
    'web-optimized': 'Web 优化',
    'high-quality': '高质量',
    'small-size': '小尺寸',
    'social-media': '社交媒体'
  }
  return names[id] || id
}

// 便捷 hooks
export const useFiles = () => useStore((s) => s.files)
export const useSelectedFiles = () => useStore((s) => s.selectedFiles)
export const useOptions = () => useStore((s) => s.options)
export const usePresets = () => useStore((s) => s.presets)
export const useQueue = () => useStore((s) => s.queue)

export const useFileActions = () => useStore((s) => ({
  addFiles: s.addFiles,
  removeFile: s.removeFile,
  clearFiles: s.clearFiles,
  selectFile: s.selectFile,
  selectAllFiles: s.selectAllFiles,
  deselectAllFiles: s.deselectAllFiles
}))

export const useOptionActions = () => useStore((s) => ({
  updateOptions: s.updateOptions,
  resetOptions: s.resetOptions
}))

export const usePresetActions = () => useStore((s) => ({
  savePreset: s.savePreset,
  loadPreset: s.loadPreset,
  deletePreset: s.deletePreset,
  exportPresetsData: s.exportPresetsData,
  importPresetsData: s.importPresetsData
}))

export const useQueueActions = () => useStore((s) => ({
  addToQueue: s.addToQueue,
  removeFromQueue: s.removeFromQueue,
  clearQueue: s.clearQueue,
  setQueueProcessing: s.setQueueProcessing,
  setCurrentJob: s.setCurrentJob
}))
