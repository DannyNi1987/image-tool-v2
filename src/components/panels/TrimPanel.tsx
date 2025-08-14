import { useOptions, useOptionActions } from '../../store/useStore'

const TrimPanel: React.FC = () => {
  const options = useOptions()
  const { updateOptions } = useOptionActions()

  return (
    <div className="space-y-4">
      <h3 className="font-body-medium text-primary-title">自动裁剪</h3>
      
      {/* 启用裁剪 */}
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={options.trim.enabled}
          onChange={(e) => updateOptions({
            trim: { ...options.trim, enabled: e.target.checked }
          })}
        />
        <span className="text-sm text-primary-text">自动裁剪空白边缘</span>
      </label>

      {options.trim.enabled && (
        <div className="space-y-4">
          {/* 模式 */}
          <div>
            <label className="block text-sm text-primary-text mb-1">裁剪模式</label>
            <select
              value={options.trim.mode}
              onChange={(e) => updateOptions({
                trim: { ...options.trim, mode: e.target.value as 'transparent' | 'solid' }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="transparent">透明区域</option>
              <option value="solid">指定颜色</option>
            </select>
          </div>

          {/* 指定颜色 */}
          {options.trim.mode === 'solid' && (
            <div>
              <label className="block text-sm text-primary-text mb-1">裁剪颜色</label>
              <input
                type="color"
                value={options.trim.solidColor || '#ffffff'}
                onChange={(e) => updateOptions({
                  trim: { ...options.trim, solidColor: e.target.value }
                })}
                className="w-full h-10 border border-gray-300 rounded-lg"
              />
            </div>
          )}

          {/* 容差 */}
          <div>
            <label className="block text-sm text-primary-text mb-1">容差: {options.trim.tolerance}</label>
            <input
              type="range"
              min="0"
              max="30"
              value={options.trim.tolerance}
              onChange={(e) => updateOptions({
                trim: { ...options.trim, tolerance: parseInt(e.target.value) }
              })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>精确</span>
              <span>宽松</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              容差越低，裁剪越精确；容差越高，裁剪越宽松
            </p>
          </div>

          {/* 内边距 */}
          <div>
            <label className="block text-sm text-primary-text mb-1">内边距 (px)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={options.trim.padding}
              onChange={(e) => updateOptions({
                trim: { ...options.trim, padding: parseInt(e.target.value) }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default TrimPanel

