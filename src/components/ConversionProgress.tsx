import { useFiles, useSelectedFiles, useQueueActions } from '../store/useStore'
import { StopIcon } from '@heroicons/react/24/outline'

const ConversionProgress: React.FC = () => {
  const files = useFiles()
  const selectedFiles = useSelectedFiles()
  const { setQueueProcessing, clearQueue } = useQueueActions()

  const processingFiles = files.filter(f => 
    selectedFiles.includes(f.id) && f.status === 'processing'
  )
  
  const completedFiles = files.filter(f => 
    selectedFiles.includes(f.id) && f.status === 'done'
  )
  
  const totalFiles = selectedFiles.length
  const progress = totalFiles > 0 ? (completedFiles.length / totalFiles) * 100 : 0

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-body-medium text-primary-title">
          转换进度
        </h3>
        <button
          onClick={() => {
            setQueueProcessing(false)
            clearQueue()
          }}
          className="flex items-center space-x-2 px-3 py-1 text-red-600 hover:text-red-700 font-body-medium"
        >
          <StopIcon className="w-4 h-4" />
          <span>停止</span>
        </button>
      </div>

      {/* 总体进度 */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>总体进度</span>
          <span>{Math.round(progress)}% ({completedFiles.length}/{totalFiles})</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 文件进度 */}
      <div className="space-y-2">
        {processingFiles.map((file) => (
          <div key={file.id} className="flex items-center space-x-3">
            <div className="flex-1">
              <div className="text-sm font-body-medium text-primary-text truncate">
                {file.name}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                                 <div
                   className="bg-green-500 h-1 rounded-full transition-all duration-300"
                   style={{ width: `${file.progress || 0}%` }}
                 />
              </div>
            </div>
                         <div className="text-sm text-gray-500 w-12 text-right">
               {file.progress || 0}%
             </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ConversionProgress

