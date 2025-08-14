import { useFiles, useSelectedFiles, useFileActions } from '../store/useStore'
import { TrashIcon, EyeIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { downloadBlob } from '../utils/download'

interface FileListProps {
  onPreviewClick: (fileId: string) => void
}

const FileList: React.FC<FileListProps> = ({ onPreviewClick }) => {
  const files = useFiles()
  const selectedFiles = useSelectedFiles()
  const { selectFile, selectAllFiles, deselectAllFiles, removeFile } = useFileActions()

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="rounded-[12px] border border-panel-border bg-white shadow-panel p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-title font-semibold text-primary">
          文件列表 ({files.length})
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={selectAllFiles}
            className="text-sm text-accent hover:text-accent/80 font-body font-medium"
          >
            全选
          </button>
          <button
            onClick={deselectAllFiles}
            className="text-sm text-muted hover:text-gray-700 font-body font-medium"
          >
            取消全选
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {files.map((file) => (
          <div
            key={file.id}
            className={`
              flex items-center space-x-3 p-3 rounded-lg border transition-colors hover:bg-gray-50
              ${selectedFiles.includes(file.id)
                ? 'border-accent bg-accent/5'
                : 'border-panel-border'
              }
            `}
          >
            {/* 选择框 */}
            <input
              type="checkbox"
              checked={selectedFiles.includes(file.id)}
              onChange={() => selectFile(file.id)}
              className="rounded"
            />

            {/* 文件图标 */}
            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
              <EyeIcon className="w-5 h-5 text-gray-500" />
            </div>

                        {/* 文件信息 */}
            <div className="flex-1 min-w-0">
              <div className="font-body font-medium text-text truncate">
                {file.name}
              </div>
              <div className="text-sm text-muted">
                {formatFileSize(file.size)} • {file.type}
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`text-sm ${
                  file.status === 'queued' ? 'text-muted' :
                  file.status === 'processing' ? 'text-accent' :
                  file.status === 'done' ? 'text-success' :
                  'text-danger'
                }`}>
                  {file.status === 'queued' && '等待中'}
                  {file.status === 'processing' && `处理中 ${file.progress || 0}%`}
                  {file.status === 'done' && '已完成'}
                  {file.status === 'error' && '错误'}
                </span>
              </div>
              {file.status === 'error' && file.error && (
                <div className="text-sm text-danger mt-1">
                  错误: {file.error}
                </div>
              )}
            </div>

            {/* 操作按钮 */}
            <div className="flex space-x-1">
              <button
                onClick={() => onPreviewClick(file.id)}
                className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                title="查看大图"
              >
                <EyeIcon className="w-4 h-4" />
              </button>
              {file.status === 'done' && file.resultBlob && (
                <button
                  onClick={() => {
                    const filename = file.outputName || file.name
                    downloadBlob(file.resultBlob!, filename)
                  }}
                  className="p-1 text-gray-400 hover:text-green-500 transition-colors"
                  title="下载"
                >
                  <ArrowDownTrayIcon className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => removeFile(file.id)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="删除文件"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FileList

