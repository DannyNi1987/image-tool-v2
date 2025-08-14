import { useOptions, useOptionActions } from '../../store/useStore'

const FormatPanel: React.FC = () => {
  const options = useOptions()
  const { updateOptions } = useOptionActions()

  const formats = [
    { value: 'jpeg' as const, label: 'JPEG', description: '适合照片，文件较小' },
    { value: 'webp' as const, label: 'WebP', description: '现代格式，压缩率高' },
    { value: 'avif' as const, label: 'AVIF', description: '最新格式，最佳压缩' },
    { value: 'png' as const, label: 'PNG', description: '无损压缩，支持透明' },
    { value: 'gif' as const, label: 'GIF', description: '支持动画，文件较大' },
    { value: 'heic' as const, label: 'HEIC', description: 'iOS 格式，实验性支持' }
  ]

  return (
    <div className="space-y-4">
      <h3 className="font-title font-semibold text-primary">输出格式</h3>
      
      {/* 格式选择 */}
      <div className="space-y-2">
        {formats.map((format) => (
          <label key={format.value} className="flex items-start space-x-3 cursor-pointer">
            <input
              type="radio"
              name="format"
              value={format.value}
              checked={options.format.format === format.value}
              onChange={(e) => updateOptions({
                format: { ...options.format, format: e.target.value as any }
              })}
              className="mt-1"
            />
            <div>
              <div className="font-body font-medium text-text">{format.label}</div>
              <div className="text-sm text-muted">{format.description}</div>
            </div>
          </label>
        ))}
      </div>

      {/* 质量设置 */}
      <div className="space-y-2">
        <label className="block font-body font-medium text-text">
          质量: {options.format.quality}%
        </label>
        <input
          type="range"
          min="1"
          max="100"
          value={options.format.quality}
          onChange={(e) => updateOptions({
            format: { ...options.format, quality: parseInt(e.target.value) }
          })}
          disabled={options.format.format === 'png'}
          className={`w-full ${options.format.format === 'png' ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        <div className="flex justify-between text-xs text-muted">
          <span>低质量</span>
          <span>高质量</span>
        </div>
        {options.format.format === 'png' && (
          <p className="text-xs text-muted">PNG 格式不支持质量调整</p>
        )}
      </div>

      {/* 保留元数据 */}
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={options.format.keepMetadata}
          onChange={(e) => updateOptions({
            format: { ...options.format, keepMetadata: e.target.checked }
          })}
        />
        <span className="text-sm text-text">保留元数据 (EXIF)</span>
      </label>

      {/* 渐进式 JPEG */}
      {options.format.format === 'jpeg' && (
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={options.format.progressive}
            onChange={(e) => updateOptions({
              format: { ...options.format, progressive: e.target.checked }
            })}
          />
          <span className="text-sm text-text">渐进式 JPEG</span>
        </label>
      )}

      {/* HEIC 实验性提示 */}
      {options.format.format === 'heic' && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ HEIC 格式支持为实验性功能，可能在某些浏览器中无法正常工作。
          </p>
        </div>
      )}
    </div>
  )
}

export default FormatPanel

