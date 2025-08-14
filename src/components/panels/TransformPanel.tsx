import { useOptions, useOptionActions } from '../../store/useStore'

const TransformPanel: React.FC = () => {
  const options = useOptions()
  const { updateOptions } = useOptionActions()

  return (
    <div className="space-y-4">
      <h3 className="font-body-medium text-primary-title">图像变换</h3>
      
      {/* 启用变换 */}
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={options.transform.enabled}
          onChange={(e) => updateOptions({
            transform: { ...options.transform, enabled: e.target.checked }
          })}
        />
        <span className="text-sm text-primary-text">应用图像变换</span>
      </label>

      {options.transform.enabled && (
        <div className="space-y-4">
          {/* 旋转 */}
          <div>
            <label className="block text-sm text-primary-text mb-1">旋转角度</label>
            <input
              type="range"
              min="-180"
              max="180"
              value={options.transform.rotate}
              onChange={(e) => updateOptions({
                transform: { ...options.transform, rotate: parseInt(e.target.value) }
              })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>-180°</span>
              <span>{options.transform.rotate}°</span>
              <span>180°</span>
            </div>
          </div>

          {/* 快捷旋转按钮 */}
          <div className="flex space-x-2">
            {[-90, -45, 0, 45, 90].map((angle) => (
              <button
                key={angle}
                onClick={() => updateOptions({
                  transform: { ...options.transform, rotate: angle }
                })}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  options.transform.rotate === angle
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {angle}°
              </button>
            ))}
          </div>

          {/* 翻转 */}
          <div className="space-y-2">
            <label className="block text-sm text-primary-text">翻转</label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={options.transform.flipH}
                  onChange={(e) => updateOptions({
                    transform: { ...options.transform, flipH: e.target.checked }
                  })}
                />
                <span className="text-sm text-primary-text">水平翻转</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={options.transform.flipV}
                  onChange={(e) => updateOptions({
                    transform: { ...options.transform, flipV: e.target.checked }
                  })}
                />
                <span className="text-sm text-primary-text">垂直翻转</span>
              </label>
            </div>
          </div>

          {/* 背景色 */}
          <div>
            <label className="block text-sm text-primary-text mb-1">背景色</label>
            <input
              type="color"
              value={options.transform.canvasBg || '#ffffff'}
              onChange={(e) => updateOptions({
                transform: { ...options.transform, canvasBg: e.target.value }
              })}
              className="w-full h-10 border border-gray-300 rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">
              用于填充旋转后的透明区域
            </p>
          </div>

          {/* 裁剪 */}
          <div className="space-y-2">
            <label className="block text-sm text-primary-text">裁剪区域</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-600">X 坐标</label>
                <input
                  type="number"
                  value={options.transform.crop?.x || ''}
                  onChange={(e) => updateOptions({
                    transform: { 
                      ...options.transform, 
                      crop: { 
                        x: e.target.value ? parseInt(e.target.value) : 0,
                        y: options.transform.crop?.y || 0,
                        w: options.transform.crop?.w || 0,
                        h: options.transform.crop?.h || 0
                      } 
                    }
                  })}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600">Y 坐标</label>
                <input
                  type="number"
                  value={options.transform.crop?.y || ''}
                  onChange={(e) => updateOptions({
                    transform: { 
                      ...options.transform, 
                      crop: { 
                        x: options.transform.crop?.x || 0,
                        y: e.target.value ? parseInt(e.target.value) : 0,
                        w: options.transform.crop?.w || 0,
                        h: options.transform.crop?.h || 0
                      } 
                    }
                  })}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600">宽度</label>
                <input
                  type="number"
                  value={options.transform.crop?.w || ''}
                  onChange={(e) => updateOptions({
                    transform: { 
                      ...options.transform, 
                      crop: { 
                        x: options.transform.crop?.x || 0,
                        y: options.transform.crop?.y || 0,
                        w: e.target.value ? parseInt(e.target.value) : 0,
                        h: options.transform.crop?.h || 0
                      } 
                    }
                  })}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                  placeholder="自动"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600">高度</label>
                <input
                  type="number"
                  value={options.transform.crop?.h || ''}
                  onChange={(e) => updateOptions({
                    transform: { 
                      ...options.transform, 
                      crop: { 
                        x: options.transform.crop?.x || 0,
                        y: options.transform.crop?.y || 0,
                        w: options.transform.crop?.w || 0,
                        h: e.target.value ? parseInt(e.target.value) : 0
                      } 
                    }
                  })}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                  placeholder="自动"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TransformPanel

