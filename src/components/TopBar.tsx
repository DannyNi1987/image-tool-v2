import { Cog6ToothIcon } from '@heroicons/react/24/outline'

interface TopBarProps {
  onSetupClick: () => void
}

const TopBar: React.FC<TopBarProps> = ({ onSetupClick }) => {
  return (
    <header className="bg-white shadow-sm border-b border-panel-border">
      <div className="container">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <a 
              href="https://bdwebtek.com" 
              className="text-2xl font-title text-primary hover:text-accent transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              BDWebTek
            </a>
            <span className="text-muted">|</span>
            <h1 className="text-xl font-title text-primary">
              图像转换工具
            </h1>
          </div>

          {/* 设置按钮 */}
          <button
            onClick={onSetupClick}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-body font-medium"
            aria-label="设置"
          >
            <Cog6ToothIcon className="w-5 h-5" />
            <span>设置</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default TopBar
