import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { PhotoIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { useFileActions } from '../store/useStore'

const FileUploader: React.FC = () => {
  const { addFiles } = useFileActions()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter(file => 
      file.type.startsWith('image/')
    )
    if (imageFiles.length > 0) {
      addFiles(imageFiles)
    }
  }, [addFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp', '.avif']
    },
    multiple: true
  })

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${isDragActive 
          ? 'border-blue-400 bg-blue-50' 
          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }
      `}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center space-y-4">
        {isDragActive ? (
          <ArrowUpTrayIcon className="w-12 h-12 text-blue-500" />
        ) : (
          <PhotoIcon className="w-12 h-12 text-gray-400" />
        )}
        
        <div>
          <p className="text-lg font-body-medium text-primary-text">
            {isDragActive ? '释放文件以上传' : '拖拽图像文件到此处'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            或点击选择文件
          </p>
        </div>
        
        <p className="text-xs text-gray-400">
          支持 JPEG, PNG, GIF, BMP, WebP, AVIF 格式
        </p>
      </div>
    </div>
  )
}

export default FileUploader

