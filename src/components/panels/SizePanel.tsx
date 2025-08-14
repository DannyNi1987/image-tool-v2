import { useOptions, useOptionActions } from '../../store/useStore'

const SizePanel: React.FC = () => {
  const options = useOptions()
  const { updateOptions } = useOptionActions()

  return (
    <div className="space-y-4">
      <h3 className="font-body-medium text-primary-title">尺寸调整</h3>
      
      {/* 启用尺寸调整 */}
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={options.size.enabled}
          onChange={(e) => updateOptions({
            size: { ...options.size, enabled: e.target.checked }
          })}
        />
        <span className="text-sm text-primary-text">调整图像尺寸</span>
      </label>

      {options.size.enabled && (
        <div className="space-y-4">
          {/* 宽度 */}
          <div>
            <label className="block text-sm text-primary-text mb-1">宽度 (px)</label>
            <input
              type="number"
              value={options.size.width || ''}
              onChange={(e) => updateOptions({
                size: { ...options.size, width: e.target.value ? parseInt(e.target.value) : undefined }
              })}
              disabled={!!options.size.maxSide}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                options.size.maxSide ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              placeholder="自动"
            />
          </div>

          {/* 高度 */}
          <div>
            <label className="block text-sm text-primary-text mb-1">高度 (px)</label>
            <input
              type="number"
              value={options.size.height || ''}
              onChange={(e) => updateOptions({
                size: { ...options.size, height: e.target.value ? parseInt(e.target.value) : undefined }
              })}
              disabled={!!options.size.maxSide}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                options.size.maxSide ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              placeholder="自动"
            />
          </div>

          {/* 最大边长 */}
          <div>
            <label className="block text-sm text-primary-text mb-1">最大边长 (px)</label>
            <input
              type="number"
              value={options.size.maxSide || ''}
              onChange={(e) => updateOptions({
                size: { ...options.size, maxSide: e.target.value ? parseInt(e.target.value) : undefined }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="不限制"
            />
          </div>

          {/* 放大限制 */}
          <div>
            <label className="block text-sm text-primary-text mb-1">放大限制 (倍)</label>
            <input
              type="number"
              min="1"
              max="10"
              step="0.1"
              value={options.size.upscaleLimit || ''}
              onChange={(e) => updateOptions({
                size: { ...options.size, upscaleLimit: e.target.value ? parseFloat(e.target.value) : undefined }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="不限制"
            />
          </div>

          {/* DPI */}
          <div>
            <label className="block text-sm text-primary-text mb-1">DPI</label>
            <input
              type="number"
              min="72"
              max="600"
              value={options.size.dpi || ''}
              onChange={(e) => updateOptions({
                size: { ...options.size, dpi: e.target.value ? parseInt(e.target.value) : undefined }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="72"
            />
          </div>

          {/* 重采样方法 */}
          <div>
            <label className="block text-sm text-primary-text mb-1">重采样方法</label>
            <select
              value={options.size.resample}
              onChange={(e) => updateOptions({
                size: { ...options.size, resample: e.target.value as 'lanczos' | 'cubic' | 'default' }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="lanczos">Lanczos (高质量)</option>
              <option value="cubic">Cubic (平衡)</option>
              <option value="default">默认 (快速)</option>
            </select>
          </div>

          {/* 保持宽高比 */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.size.keepAspect}
              onChange={(e) => updateOptions({
                size: { ...options.size, keepAspect: e.target.checked }
              })}
            />
            <span className="text-sm text-primary-text">保持宽高比</span>
          </label>

          {/* 适配方式 */}
          <div>
            <label className="block text-sm text-primary-text mb-1">适配方式</label>
            <select
              value={options.size.fit}
              onChange={(e) => updateOptions({
                size: { ...options.size, fit: e.target.value as 'contain' | 'cover' | 'stretch' }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="contain">包含 (contain)</option>
              <option value="cover">覆盖 (cover)</option>
              <option value="stretch">拉伸 (stretch)</option>
            </select>
          </div>

          {/* 快捷预设 */}
          <div>
            <label className="block text-sm text-primary-text mb-2">快捷预设</label>
            <div className="flex space-x-2">
              {[256, 512, 1024].map((size) => (
                <button
                  key={size}
                  onClick={() => updateOptions({
                    size: { 
                      ...options.size, 
                      width: size, 
                      height: size,
                      maxSide: undefined 
                    }
                  })}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  {size}×{size}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SizePanel

