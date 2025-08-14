import { useState, useEffect } from 'react'
import { useStore } from './store/useStore'
import PrimaryHeader from './components/PrimaryHeader'
import TopBar from './components/TopBar'
import Sidebar from './components/Sidebar'
import Uploader from './components/Uploader'
import FileList from './components/FileList'
import ImagePreview from './components/ImagePreview'
import ActionsBar from './components/ActionsBar'
import PreviewModal from './components/PreviewModal'
import SetupModal from './components/SetupModal'

function App() {
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)

  const { loadFromStorage } = useStore()
  
  // 加载本地存储的数据
  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

  const handlePreviewClick = () => {
    setIsPreviewModalOpen(true)
  }

  return (
    <div className="min-h-screen">
      {/* Primary Header */}
      <PrimaryHeader />
      
      {/* 隐私声明 */}
      <div className="bg-blue-50 border-b border-blue-200 py-2">
        <div className="container text-center text-sm text-blue-700">
          处理在您的浏览器本地进行。文件不会上传到服务器。
        </div>
      </div>

      {/* 主头部 */}
      <TopBar onSetupClick={() => setIsSetupModalOpen(true)} />

      {/* 主内容区域 */}
      <div className="container lg:grid lg:grid-cols-[360px_minmax(0,1fr)] gap-6 py-6">
        {/* 左侧边栏 */}
        <Sidebar />
        
        {/* 右侧主内容 */}
        <div className="space-y-6">
          <Uploader />
          <FileList onPreviewClick={handlePreviewClick} />
          <ImagePreview />
          <ActionsBar />
        </div>
      </div>

      {/* 预览模态框 */}
      <PreviewModal 
        isOpen={isPreviewModalOpen} 
        onClose={() => setIsPreviewModalOpen(false)} 
      />

      {/* 设置模态框 */}
      <SetupModal 
        isOpen={isSetupModalOpen} 
        onClose={() => setIsSetupModalOpen(false)} 
      />
    </div>
  )
}

export default App

