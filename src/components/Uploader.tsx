import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { PhotoIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { useFileActions } from '../store/useStore'

const Uploader: React.FC = () => {
  const { addFiles } = useFileActions()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter(file => 
      file.type.startsWith('image/') || 
      file.name.toLowerCase().endsWith('.heic') ||
      file.name.toLowerCase().endsWith('.avif')
    )
    if (imageFiles.length > 0) {
      addFiles(imageFiles)
    }
  }, [addFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp', '.avif', '.heic']
    },
    multiple: true
  })

  return (
    <div
      {...getRootProps()}
      className={`
        rounded-[12px] border border-panel-border bg-white p-8 text-center cursor-pointer transition-colors
        ${isDragActive 
          ? 'ring-2 ring-accent/40 border-accent' 
          : 'border-panel-border hover:border-gray-300'
        }
      `}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center space-y-4">
        {isDragActive ? (
          <ArrowUpTrayIcon className="w-12 h-12 text-accent" />
        ) : (
          <PhotoIcon className="w-12 h-12 text-muted" />
        )}
        
        <div>
          <h3 className="text-lg font-title font-semibold text-primary">
            {isDragActive ? '释放文件以上传' : '拖拽图片到此处或点击选择'}
          </h3>
          <p className="text-sm text-muted mt-1">
            支持 JPEG, PNG, GIF, WebP, AVIF, HEIC 格式
          </p>
        </div>
        
        <p className="text-xs text-muted">
          点击选择文件或拖拽到此处
        </p>
      </div>
    </div>
  )
}

export default Uploader
