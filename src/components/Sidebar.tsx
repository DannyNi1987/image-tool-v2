import { useState } from 'react'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import FormatPanel from './panels/FormatPanel'
import SizePanel from './panels/SizePanel'
import TransformPanel from './panels/TransformPanel'
import WatermarkPanel from './panels/WatermarkPanel'
import TrimPanel from './panels/TrimPanel'
import RenamePanel from './panels/RenamePanel'
import DownloadPanel from './panels/DownloadPanel'

const Sidebar: React.FC = () => {
  const [isSidebarCollapsed] = useState(false)
  const [activePanel, setActivePanel] = useState('format')
  const [openPanels, setOpenPanels] = useState<Set<string>>(new Set(['format']))

  const panels = [
    { id: 'format', label: '格式', component: FormatPanel, alwaysOpen: true },
    { id: 'size', label: '尺寸', component: SizePanel },
    { id: 'transform', label: '变换', component: TransformPanel },
    { id: 'watermark', label: '水印', component: WatermarkPanel },
    { id: 'trim', label: '裁剪', component: TrimPanel },
    { id: 'rename', label: '重命名', component: RenamePanel },
    { id: 'download', label: '下载', component: DownloadPanel }
  ]

  const togglePanel = (panelId: string) => {
    if (panelId === 'format') return // Format 面板永远开启
    
    setOpenPanels(prev => {
      const newSet = new Set(prev)
      if (newSet.has(panelId)) {
        newSet.delete(panelId)
      } else {
        newSet.add(panelId)
      }
      return newSet
    })
  }

  if (isSidebarCollapsed) {
    return (
      <div className="w-16 bg-white rounded-lg shadow-lg p-2">
        {panels.map((panel) => (
          <button
            key={panel.id}
            onClick={() => setActivePanel(panel.id)}
            className={`w-full h-12 mb-2 rounded-lg flex items-center justify-center transition-colors ${
              activePanel === panel.id
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={panel.label}
          >
            <span className="text-xs font-medium">{panel.label.charAt(0)}</span>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="lg:sticky lg:top-24 space-y-4">
      <h2 className="text-lg font-title font-semibold text-primary">转换选项</h2>
      <div className="space-y-4">
        {panels.map((panel) => {
          const PanelComponent = panel.component
          const isOpen = openPanels.has(panel.id)
          
          return (
            <div key={panel.id} className="rounded-[12px] border border-panel-border bg-white shadow-panel">
              <button
                onClick={() => togglePanel(panel.id)}
                className="w-full px-4 py-3 text-left font-body font-medium text-text hover:bg-gray-50 transition-colors flex justify-between items-center"
              >
                <span>{panel.label}</span>
                {panel.id !== 'format' && (
                  isOpen ? (
                    <ChevronDownIcon className="w-4 h-4" />
                  ) : (
                    <ChevronRightIcon className="w-4 h-4" />
                  )
                )}
              </button>
              {isOpen && (
                <div className="p-4 md:p-5 border-t border-panel-border">
                  <PanelComponent />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Sidebar

