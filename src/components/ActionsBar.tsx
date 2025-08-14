import { useState } from 'react'
import { PlayIcon, StopIcon, TrashIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { useFiles, useSelectedFiles, useQueue, useFileActions, useStore } from '../store/useStore'
import { downloadBlob } from '../utils/download'
import { zipAndDownload } from '../utils/zip'

const ActionsBar: React.FC = () => {
  const files = useFiles()
  const selectedFiles = useSelectedFiles()
  const queue = useQueue()
  const { clearFiles } = useFileActions()
  const { startConversion, cancelConversion } = useStore()
  const [showClearOptions, setShowClearOptions] = useState(false)

  const hasSelectedFiles = selectedFiles.length > 0
  const hasFiles = files.length > 0
  const hasCompletedFiles = files.some(f => f.status === 'done')
  const hasErrorFiles = files.some(f => f.status === 'error')
  const hasProcessingFiles = files.some(f => f.status === 'processing')
  const completedFiles = files.filter(f => f.status === 'done' && f.resultBlob)

  const handleConvert = () => {
    if (hasSelectedFiles) {
      startConversion()
    }
  }

  const handleCancel = () => {
    cancelConversion()
  }

  const handleClearCompleted = () => {
    const completedFileIds = files
      .filter(f => f.status === 'done')
      .map(f => f.id)
    
    // TODO: 从 store 中移除已完成的文件
    console.log('清除已完成的文件:', completedFileIds)
  }

  const handleClearAll = () => {
    clearFiles()
    setShowClearOptions(false)
  }

  const handleDownloadAll = async () => {
    if (completedFiles.length === 0) {
      alert('没有可下载的文件')
      return
    }

    if (hasProcessingFiles) {
      alert('请等待所有文件处理完成后再下载')
      return
    }

    const options = useStore.getState().options

    if (options.download.zipAll) {
      // ZIP 下载
      try {
        const filesWithNames = completedFiles.map(file => ({
          name: file.outputName || file.name,
          blob: file.resultBlob!
        }))
        
        await zipAndDownload(
          filesWithNames,
          options.download.zipName || 'converted-images.zip'
        )
      } catch (error) {
        console.error('ZIP 创建失败:', error)
        alert('ZIP 创建失败')
      }
    } else {
      // 逐个下载
      for (const file of completedFiles) {
        const filename = file.outputName || file.name
        downloadBlob(file.resultBlob!, filename)
        // 添加小延迟，避免浏览器阻止多个下载
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
  }

  if (!hasFiles) return null

  return (
    <div className="rounded-[12px] border border-panel-border bg-white shadow-panel p-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-title font-semibold text-primary">
            操作控制
          </h3>
          <p className="text-sm text-muted mt-1">
            已选择 {selectedFiles.length} 个文件，共 {files.length} 个文件
          </p>
        </div>

        <div className="flex space-x-3">
          {/* 转换按钮 */}
          {queue.processing ? (
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 px-6 py-3 bg-danger text-white rounded-lg hover:bg-danger/90 transition-colors font-body font-medium"
            >
              <StopIcon className="w-5 h-5" />
              <span>取消转换</span>
            </button>
          ) : (
            <button
              onClick={handleConvert}
              disabled={!hasSelectedFiles}
              className={`
                flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors font-body font-medium
                ${hasSelectedFiles
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              <PlayIcon className="w-5 h-5" />
              <span>开始转换</span>
            </button>
          )}

          {/* 下载按钮 */}
          {hasCompletedFiles && (
            <button
              onClick={handleDownloadAll}
              disabled={hasProcessingFiles}
              className={`
                flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors font-body font-medium
                ${hasProcessingFiles
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-accent text-white hover:bg-accent/90'
                }
              `}
              title={hasProcessingFiles ? '请等待处理完成' : '下载所有完成的文件'}
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
              <span>下载</span>
            </button>
          )}

          {/* 清除按钮 */}
          <div className="relative">
            <button
              onClick={() => setShowClearOptions(!showClearOptions)}
              className="flex items-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-body-medium"
            >
              <TrashIcon className="w-5 h-5" />
              <span>清除</span>
            </button>

            {/* 清除选项下拉菜单 */}
            {showClearOptions && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                {hasCompletedFiles && (
                  <button
                    onClick={handleClearCompleted}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    清除已完成
                  </button>
                )}
                {hasErrorFiles && (
                  <button
                    onClick={() => {
                      // TODO: 清除错误文件
                      setShowClearOptions(false)
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    清除错误文件
                  </button>
                )}
                <button
                  onClick={handleClearAll}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  清除全部
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 状态提示 */}
      {!hasSelectedFiles && hasFiles && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            请选择要转换的文件
          </p>
        </div>
      )}

      {/* 点击外部关闭清除选项 */}
      {showClearOptions && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowClearOptions(false)}
        />
      )}
    </div>
  )
}

export default ActionsBar
