import { useOptions, useOptionActions } from '../../store/useStore'

const WatermarkPanel: React.FC = () => {
  const options = useOptions()
  const { updateOptions } = useOptionActions()

  const positions = [
    { value: 'top-left', label: '左上角' },
    { value: 'top-center', label: '顶部居中' },
    { value: 'top-right', label: '右上角' },
    { value: 'center-left', label: '左侧居中' },
    { value: 'center', label: '中心' },
    { value: 'center-right', label: '右侧居中' },
    { value: 'bottom-left', label: '左下角' },
    { value: 'bottom-center', label: '底部居中' },
    { value: 'bottom-right', label: '右下角' }
  ]

  return (
    <div className="space-y-4">
      <h3 className="font-body-medium text-primary-title">水印设置</h3>
      
      {/* 启用水印 */}
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={options.watermark.enabled}
          onChange={(e) => updateOptions({
            watermark: { ...options.watermark, enabled: e.target.checked }
          })}
        />
        <span className="text-sm text-primary-text">添加水印</span>
      </label>

      {options.watermark.enabled && (
        <div className="space-y-4">
          {/* 水印文字 */}
          <div>
            <label className="block text-sm text-primary-text mb-1">水印文字</label>
            <input
              type="text"
              value={options.watermark.text?.content || ''}
              onChange={(e) => updateOptions({
                watermark: {
                  ...options.watermark,
                  text: { 
                    content: e.target.value,
                    font: 'Arial',
                    size: 24,
                    weight: 400,
                    color: '#000000',
                    opacity: 50,
                    pos: 'bottom-right',
                    x: 0,
                    y: 0,
                    rotation: 0
                  }
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="输入水印文字"
            />
          </div>

          {/* 字体大小 */}
          <div>
            <label className="block text-sm text-primary-text mb-1">字体大小</label>
            <input
              type="range"
              min="12"
              max="72"
              value={options.watermark.text?.size || 24}
              onChange={(e) => updateOptions({
                watermark: {
                  ...options.watermark,
                  text: { 
                    content: options.watermark.text?.content || '',
                    font: 'Arial',
                    size: parseInt(e.target.value),
                    weight: 400,
                    color: '#000000',
                    opacity: 50,
                    pos: 'bottom-right',
                    x: 0,
                    y: 0,
                    rotation: 0
                  }
                }
              })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>12px</span>
              <span>{options.watermark.text?.size || 24}px</span>
              <span>72px</span>
            </div>
          </div>

          {/* 透明度 */}
          <div>
            <label className="block text-sm text-primary-text mb-1">透明度</label>
            <input
              type="range"
              min="0"
              max="100"
              value={options.watermark.text?.opacity || 50}
              onChange={(e) => updateOptions({
                watermark: {
                  ...options.watermark,
                  text: { 
                    content: options.watermark.text?.content || '',
                    font: 'Arial',
                    size: options.watermark.text?.size || 24,
                    weight: 400,
                    color: '#000000',
                    opacity: parseInt(e.target.value),
                    pos: 'bottom-right',
                    x: 0,
                    y: 0,
                    rotation: 0
                  }
                }
              })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>透明</span>
              <span>{options.watermark.text?.opacity || 50}%</span>
              <span>不透明</span>
            </div>
          </div>

          {/* 位置 */}
          <div>
            <label className="block text-sm text-primary-text mb-1">位置</label>
            <select
              value={options.watermark.text?.pos || 'bottom-right'}
              onChange={(e) => updateOptions({
                watermark: {
                  ...options.watermark,
                  text: { 
                    content: options.watermark.text?.content || '',
                    font: 'Arial',
                    size: options.watermark.text?.size || 24,
                    weight: 400,
                    color: '#000000',
                    opacity: options.watermark.text?.opacity || 50,
                    pos: e.target.value,
                    x: 0,
                    y: 0,
                    rotation: 0
                  }
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              {positions.map(pos => (
                <option key={pos.value} value={pos.value}>{pos.label}</option>
              ))}
            </select>
          </div>

          {/* 颜色 */}
          <div>
            <label className="block text-sm text-primary-text mb-1">颜色</label>
            <input
              type="color"
              value={options.watermark.text?.color || '#000000'}
              onChange={(e) => updateOptions({
                watermark: {
                  ...options.watermark,
                  text: { 
                    content: options.watermark.text?.content || '',
                    font: 'Arial',
                    size: options.watermark.text?.size || 24,
                    weight: 400,
                    color: e.target.value,
                    opacity: options.watermark.text?.opacity || 50,
                    pos: options.watermark.text?.pos || 'bottom-right',
                    x: 0,
                    y: 0,
                    rotation: 0
                  }
                }
              })}
              className="w-full h-10 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default WatermarkPanel

