import { createContext, useContext, useMemo, useState } from 'react'
import { Badge, CompareCard, DemoPanel, InfoCard, SectionShell } from '../components/ui'
import type { CompareCardData } from '../types'

const ThemeContext = createContext({
  name: '深色实验舱',
  surface: '#101828',
  text: '#f8fafc',
})

const legacyCard: CompareCardData = {
  eyebrow: '传统写法',
  title: '<Context.Provider value={...}>',
  summary: '这是 React 开发者最熟悉的 Provider 语法，完全没问题，只是看起来比普通组件更“特殊”。',
  bullets: [
    'Provider 是 Context 对象上的一个属性。',
    '在层级很多时，JSX 噪音偏多。',
    '消费端 useContext(ThemeContext) 没变化。',
  ],
  code: `<ThemeContext.Provider value={theme}>\n  <Toolbar />\n</ThemeContext.Provider>`,
}

const modernCard: CompareCardData = {
  eyebrow: 'React 19 写法',
  title: '<Context value={...}>',
  summary: 'Context 自己就能当 provider component 用，Provider 语法因此更接近普通组件。',
  bullets: [
    '语法更短，层级更干净。',
    '消费方式完全不变。',
    '特别适合主题、密度、语言等基础全局状态。',
  ],
  code: `<ThemeContext value={theme}>\n  <Toolbar />\n</ThemeContext>`,
}

function ThemePreview({ title }: { title: string }) {
  const theme = useContext(ThemeContext)

  return (
    <div className="theme-preview" style={{ background: theme.surface, color: theme.text }}>
      <strong>{title}</strong>
      <p>{theme.name}</p>
      <span>{theme.surface}</span>
    </div>
  )
}

export function ContextSection() {
  const [mode, setMode] = useState<'dark' | 'mint'>('dark')

  const theme = useMemo(
    () =>
      mode === 'dark'
        ? { name: '深色实验舱', surface: '#111827', text: '#f8fafc' }
        : { name: '薄荷明亮版', surface: '#d1fae5', text: '#064e3b' },
    [mode],
  )

  return (
    <SectionShell
      eyebrow="Feature 05"
      title="Context provider 简化写法"
      description="这个变化不算颠覆，但非常实用：Provider 终于更像普通组件了。对于主题、国际化、权限上下文这种天天都在写的代码，阅读噪音会明显下降。"
      badges={
        <>
          <Badge tone="demo">Provider 语法对比</Badge>
          <Badge tone="demo">消费端不变</Badge>
        </>
      }
    >
      <div className="compare-grid">
        <CompareCard {...legacyCard} />
        <CompareCard {...modernCard} />
      </div>

      <DemoPanel title="两种 provider 写法，消费结果完全一致" description="切换主题后，左边仍然使用旧 Provider 语法，右边使用 React 19 简化语法；消费者组件 ThemePreview 完全同一份。">
        <div className="stack-gap">
          <div className="control-row">
            <button type="button" className={mode === 'dark' ? 'primary-button' : 'secondary-button'} onClick={() => setMode('dark')}>
              深色主题
            </button>
            <button type="button" className={mode === 'mint' ? 'primary-button' : 'secondary-button'} onClick={() => setMode('mint')}>
              薄荷主题
            </button>
          </div>
          <div className="content-grid two-column">
            <ThemeContext.Provider value={theme}>
              <ThemePreview title="传统 Provider" />
            </ThemeContext.Provider>
            <ThemeContext value={theme}>
              <ThemePreview title="React 19 简化 Provider" />
            </ThemeContext>
          </div>
        </div>
      </DemoPanel>

      <DemoPanel title="为什么这件事值得注意" description="它不改变 Context 本质，但会改变你每天看 JSX 的体验。">
        <div className="content-grid two-column">
          <InfoCard title="收益偏‘工程体验’">
            <ul className="ordered-list unordered-list">
              <li>Provider 套娃时，代码噪音更少。</li>
              <li>写法更像普通组件，学习门槛更低。</li>
              <li>Context 对象本身的角色更统一。</li>
            </ul>
          </InfoCard>
          <InfoCard title="不变的部分" tone="accent">
            <ul className="ordered-list unordered-list">
              <li>useContext 的使用方式不变。</li>
              <li>Context 分层、拆分、memo 化策略仍然重要。</li>
              <li>这不是性能特性，而是语义与可读性优化。</li>
            </ul>
          </InfoCard>
        </div>
      </DemoPanel>
    </SectionShell>
  )
}
