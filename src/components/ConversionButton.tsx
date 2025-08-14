import { useFiles, useSelectedFiles, useQueue, useQueueActions } from '../store/useStore'
import { PlayIcon, StopIcon } from '@heroicons/react/24/outline'

const ConversionButton: React.FC = () => {
  const files = useFiles()
  const selectedFiles = useSelectedFiles()
  const queue = useQueue()
  const { setQueueProcessing, clearQueue } = useQueueActions()

  const hasSelectedFiles = selectedFiles.length > 0
  const hasFiles = files.length > 0

  if (!hasFiles) return null

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-body-medium text-primary-title">
            转换控制
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            已选择 {selectedFiles.length} 个文件
          </p>
        </div>

        <div className="flex space-x-3">
          {queue.processing ? (
            <button
              onClick={() => {
                setQueueProcessing(false)
                clearQueue()
              }}
              className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-body-medium"
            >
              <StopIcon className="w-5 h-5" />
              <span>停止转换</span>
            </button>
          ) : (
            <button
              onClick={() => {
                // TODO: 实现转换逻辑
                console.log('开始转换选中的文件:', selectedFiles)
              }}
              disabled={!hasSelectedFiles}
              className={`
                flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors font-body-medium
                ${hasSelectedFiles
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              <PlayIcon className="w-5 h-5" />
              <span>开始转换</span>
            </button>
          )}
        </div>
      </div>

      {!hasSelectedFiles && hasFiles && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            请选择要转换的文件
          </p>
        </div>
      )}
    </div>
  )
}

export default ConversionButton

