import { createContext, useContext, useMemo, useState } from 'react'
import { Badge, CompareCard, DemoPanel, SectionDivider, SectionShell, StoryGrid } from '../components/ui'
import type { CompareCardData, StoryCardItem, LabSectionId } from '../types'

const ThemeContext = createContext({
  name: '深色实验舱',
  surface: '#101828',
  text: '#f8fafc',
})

const story: StoryCardItem[] = [
  { title: '一句话理解', body: 'Context provider 写法更短了：从 <Context.Provider> 变成 <Context value={...}>。' },
  { title: '它解决的真实问题', body: '当页面里套了很多 Provider，JSX 会越来越像仪式现场，可读性持续下降。' },
  { title: '旧写法为什么麻烦', body: '不是功能麻烦，而是语法噪音大。你每天都在看它，久了就会觉得臃肿。' },
  { title: 'React 19 写法为什么更顺', body: 'Provider 终于更像一个普通组件。消费端完全不变，主要提升的是代码可读性。' },
  { title: '看这个 demo 时该注意什么', body: '左右两边消费的是同一个 ThemePreview，变化的只有 provider 写法，不是消费逻辑。' },
  { title: '什么时候该用 / 不该用', body: '只要是 React 19 项目就直接用简化写法；但别把它误解成性能优化，它解决的是代码表达问题。' },
  { title: '稍微深入一点的原理', body: '这类变化看起来小，但它会持续改善你每天读 JSX 的体验，尤其是多层 Provider 的应用。' },
]

const legacyCard: CompareCardData = {
  eyebrow: '旧写法',
  title: '<Context.Provider value={...}>',
  summary: '经典、稳定、大家都熟。',
  bullets: ['消费端不变。', '语法更“特殊”。', '层级深时会有噪音。'],
  code: `<ThemeContext.Provider value={theme}>
  <Toolbar />
</ThemeContext.Provider>`,
}

const modernCard: CompareCardData = {
  eyebrow: 'React 19',
  title: '<Context value={...}>',
  summary: '更接近普通组件心智。',
  bullets: ['更短。', '更顺眼。', '消费方式完全不改。'],
  code: `<ThemeContext value={theme}>
  <Toolbar />
</ThemeContext>`,
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

export function ContextSection({ onJump }: { onJump?: (sectionId: LabSectionId) => void }) {
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
      eyebrow="可直接体验 / 05"
      title="Context provider 简化：变化不大，但每天都更顺眼了"
      description="这类特性不该被讲成革命，它更像是 React 19 在帮你清理长期积累的语法噪音。"
      badges={
        <>
          <Badge tone="demo">同一消费者对比</Badge>
          <Badge tone="demo">主题切换可视化</Badge>
        </>
      }
      actions={
        <button type="button" className="secondary-button" onClick={() => onJump?.('playground')}>
          返回试玩列表
        </button>
      }
    >
      <StoryGrid items={story} />
      <DemoPanel title="直接试：左右只是 provider 写法不同" description="切换主题后你会看到两边效果完全一致，区别只在代码是不是更干净。">
        <div className="stack-gap">
          <div className="control-row">
            <button type="button" className={mode === 'dark' ? 'primary-button' : 'secondary-button'} onClick={() => setMode('dark')}>
              深色主题
            </button>
            <button type="button" className={mode === 'mint' ? 'primary-button' : 'secondary-button'} onClick={() => setMode('mint')}>
              薄荷主题
            </button>
          </div>
          <div className="grid-two">
            <ThemeContext.Provider value={theme}>
              <ThemePreview title="传统 Provider" />
            </ThemeContext.Provider>
            <ThemeContext value={theme}>
              <ThemePreview title="React 19 简化 Provider" />
            </ThemeContext>
          </div>
        </div>
      </DemoPanel>
      <SectionDivider title="代码层面对比" description="这页重点不是功能差异，而是可读性差异。" />
      <div className="compare-grid">
        <CompareCard {...legacyCard} />
        <CompareCard {...modernCard} />
      </div>
    </SectionShell>
  )
}
