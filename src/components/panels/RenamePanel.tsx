import { useOptions, useOptionActions } from '../../store/useStore'

const RenamePanel: React.FC = () => {
  const options = useOptions()
  const { updateOptions } = useOptionActions()

  return (
    <div className="space-y-4">
      <h3 className="font-body-medium text-primary-title">文件重命名</h3>
      
      {/* 启用重命名 */}
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={options.rename.enabled}
          onChange={(e) => updateOptions({
            rename: { ...options.rename, enabled: e.target.checked }
          })}
        />
        <span className="text-sm text-primary-text">重命名输出文件</span>
      </label>

      {options.rename.enabled && (
        <div className="space-y-4">
          {/* 命名模式 */}
          <div>
            <label className="block text-sm text-primary-text mb-1">命名模式</label>
            <input
              type="text"
              value={options.rename.pattern}
              onChange={(e) => updateOptions({
                rename: { ...options.rename, pattern: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="{base}-{w}x{h}-{fmt}"
            />
            <p className="text-xs text-gray-500 mt-1">
              支持变量: {'{base}'} {'{ext}'} {'{w}'} {'{h}'} {'{seq}'} {'{date}'}
            </p>
          </div>

          {/* 起始序号 */}
          <div>
            <label className="block text-sm text-primary-text mb-1">起始序号</label>
            <input
              type="number"
              min="1"
              value={options.rename.startIndex}
              onChange={(e) => updateOptions({
                rename: { ...options.rename, startIndex: parseInt(e.target.value) }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* 大小写 */}
          <div>
            <label className="block text-sm text-primary-text mb-1">大小写</label>
            <select
              value={options.rename.case || 'none'}
              onChange={(e) => updateOptions({
                rename: { ...options.rename, case: e.target.value as 'lower' | 'upper' | 'none' }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="none">保持原样</option>
              <option value="lower">全部小写</option>
              <option value="upper">全部大写</option>
            </select>
          </div>

          {/* 预览 */}
          <div>
            <label className="block text-sm text-primary-text mb-1">文件名预览</label>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
              {options.rename.pattern.replace(/\{(\w+)\}/g, (match, key) => {
                switch (key) {
                  case 'base': return 'image'
                  case 'ext': return 'jpg'
                  case 'w': return '1920'
                  case 'h': return '1080'
                  case 'seq': return options.rename.startIndex.toString()
                  case 'date': return new Date().toISOString().split('T')[0]
                  default: return match
                }
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RenamePanel

