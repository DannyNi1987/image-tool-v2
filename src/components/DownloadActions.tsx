import { useFiles, useSelectedFiles, useOptions } from '../store/useStore'
import { FileItem } from '../types'
import { downloadBlob } from '../utils/download'
import { zipAndDownload } from '../utils/zip'
import { ArrowDownTrayIcon, FolderArrowDownIcon } from '@heroicons/react/24/outline'

const DownloadActions: React.FC = () => {
  const files = useFiles()
  const selectedFiles = useSelectedFiles()
  const options = useOptions()

  const completedFiles = files.filter(f => 
    selectedFiles.includes(f.id) && f.status === 'done' && f.resultBlob
  )

  const handleDownloadSingle = (file: FileItem) => {
    if (file.resultBlob) {
      const filename = file.outputName || file.name
      downloadBlob(file.resultBlob, filename)
    }
  }

  const handleDownloadAll = async () => {
    const completedFiles = files.filter(f => f.status === 'done' && f.resultBlob)
    
    if (completedFiles.length === 0) {
      alert('没有可下载的文件')
      return
    }

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
        handleDownloadSingle(file)
        // 添加小延迟，避免浏览器阻止多个下载
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
  }



  if (completedFiles.length === 0) return null

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="font-body-medium text-primary-title mb-4">
        下载转换结果
      </h3>

      <div className="flex flex-wrap gap-3">
        {options.download.zipAll ? (
          <button
            onClick={handleDownloadAll}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-body-medium"
          >
            <FolderArrowDownIcon className="w-5 h-5" />
            <span>下载 ZIP 文件</span>
          </button>
        ) : (
          <>
            <button
              onClick={handleDownloadAll}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-body-medium"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
              <span>下载全部 ({completedFiles.length})</span>
            </button>
            
            {completedFiles.map((file) => (
              <button
                key={file.id}
                onClick={() => handleDownloadSingle(file)}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-body-medium"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                <span className="text-sm">{file.name}</span>
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default DownloadActions

