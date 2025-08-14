import { useEffect, useState } from 'react'
import { useFiles, useSelectedFiles } from '../store/useStore'

const ImagePreview: React.FC = () => {
  const files = useFiles()
  const selectedFiles = useSelectedFiles()
  const [previewUrl, setPreviewUrl] = useState<string>('')

  const selectedFile = files.find(f => f.id === selectedFiles[0])

  useEffect(() => {
    if (selectedFile && selectedFile.arrayBuffer) {
      const blob = new Blob([selectedFile.arrayBuffer], { type: selectedFile.type })
      const url = URL.createObjectURL(blob)
      setPreviewUrl(url)
      
      return () => {
        URL.revokeObjectURL(url)
      }
    }
  }, [selectedFile])

  if (!selectedFile) return null

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="font-body-medium text-primary-title mb-4">
        图像预览
      </h3>
      
      <div className="flex justify-center">
        <div className="max-w-full max-h-96 overflow-hidden rounded-lg border border-gray-200">
          <img
            src={previewUrl}
            alt={selectedFile.name}
            className="max-w-full max-h-96 object-contain"
          />
        </div>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>文件名: {selectedFile.name}</p>
        <p>尺寸: 预览中...</p>
        <p>大小: {(selectedFile.size / 1024).toFixed(1)} KB</p>
      </div>
    </div>
  )
}

export default ImagePreview

