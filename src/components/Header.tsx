import { Cog6ToothIcon } from '@heroicons/react/24/outline'

interface HeaderProps {
  onSetupClick: () => void
}

const Header: React.FC<HeaderProps> = ({ onSetupClick }) => {
  return (
    <header className="bg-white header-shadow">
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <a 
              href="https://bdwebtek.com" 
              className="text-2xl font-title text-primary-title hover:text-blue-600 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              BDWebTek
            </a>
            <span className="text-gray-400">|</span>
            <h1 className="text-xl font-title text-primary-title">
              图像转换工具
            </h1>
          </div>

          {/* 设置按钮 */}
          <button
            onClick={onSetupClick}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-body-medium"
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

export default Header

