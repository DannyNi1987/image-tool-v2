#!/usr/bin/env node

/**
 * 图像转换工具测试脚本
 * 用于测试各个功能模块
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

console.log('🧪 开始测试图像转换工具...\n')

// 测试项目结构
function testProjectStructure() {
  console.log('📁 测试项目结构...')
  
  const requiredFiles = [
    'package.json',
    'vite.config.ts',
    'tailwind.config.js',
    'src/main.tsx',
    'src/App.tsx',
    'src/store/useStore.ts',
    'src/types/index.ts',
    'src/workers/codecWorker.ts',
    'src/workers/workerPool.ts',
    'src/utils/decode.ts',
    'src/utils/encode.ts',
    'src/utils/download.ts',
    'src/utils/zip.ts',
    'src/utils/presets.ts',
    'src/components/SetupModal.tsx'
  ]
  
  const missingFiles = []
  
  for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
      missingFiles.push(file)
    }
  }
  
  if (missingFiles.length === 0) {
    console.log('✅ 项目结构完整')
  } else {
    console.log('❌ 缺少文件:', missingFiles.join(', '))
  }
  
  return missingFiles.length === 0
}

// 测试构建
function testBuild() {
  console.log('\n🔨 测试构建...')
  
  try {
    execSync('npm run build', { stdio: 'pipe' })
    console.log('✅ 构建成功')
    return true
  } catch (error) {
    console.log('❌ 构建失败:', error.message)
    return false
  }
}

// 测试类型检查
function testTypeCheck() {
  console.log('\n🔍 测试类型检查...')
  
  try {
    execSync('npx tsc --noEmit', { stdio: 'pipe' })
    console.log('✅ 类型检查通过')
    return true
  } catch (error) {
    console.log('❌ 类型检查失败:', error.message)
    return false
  }
}

// 测试依赖
function testDependencies() {
  console.log('\n📦 测试依赖...')
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  const requiredDeps = [
    'react',
    'react-dom',
    'typescript',
    'vite',
    'zustand',
    '@squoosh/lib',
    'jszip',
    'tailwindcss'
  ]
  
  const missingDeps = []
  
  for (const dep of requiredDeps) {
    if (!packageJson.dependencies[dep] && !packageJson.devDependencies[dep]) {
      missingDeps.push(dep)
    }
  }
  
  if (missingDeps.length === 0) {
    console.log('✅ 依赖完整')
  } else {
    console.log('❌ 缺少依赖:', missingDeps.join(', '))
  }
  
  return missingDeps.length === 0
}

// 生成测试报告
function generateTestReport(results) {
  console.log('\n📊 测试报告')
  console.log('='.repeat(50))
  
  const passed = Object.values(results).filter(Boolean).length
  const total = Object.keys(results).length
  
  for (const [test, result] of Object.entries(results)) {
    const status = result ? '✅' : '❌'
    console.log(`${status} ${test}`)
  }
  
  console.log('\n' + '='.repeat(50))
  console.log(`总计: ${passed}/${total} 项测试通过`)
  
  if (passed === total) {
    console.log('🎉 所有测试通过！项目准备就绪。')
  } else {
    console.log('⚠️  部分测试失败，请检查上述问题。')
  }
  
  return passed === total
}

// 主测试函数
function runTests() {
  const results = {
    '项目结构': testProjectStructure(),
    '依赖检查': testDependencies(),
    '类型检查': testTypeCheck(),
    '构建测试': testBuild()
  }
  
  const allPassed = generateTestReport(results)
  
  if (allPassed) {
    console.log('\n🚀 可以开始本地测试了！')
    console.log('运行以下命令启动开发服务器：')
    console.log('npm run dev')
  }
  
  return allPassed
}

// 运行测试
runTests()
