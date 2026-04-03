import { useEffect, useMemo, useState } from 'react'
import { Badge, CompareCard, DemoPanel, InfoCard, SectionShell, StatusLine } from '../components/ui'
import type { CompareCardData } from '../types'

const metadataModes = [
  {
    key: 'lab',
    title: 'React 19 Lab · Metadata Demo',
    description: '在组件树里直接声明 title / meta，而不是手工写副作用。',
  },
  {
    key: 'optimistic',
    title: 'React 19 Lab · Optimistic UI',
    description: '标题和 description 跟着当前功能视图一起变化。',
  },
  {
    key: 'elements',
    title: 'React 19 Lab · Custom Elements',
    description: '自定义元素与 metadata 一样，都是 React 19 提升 DOM 语义的一部分。',
  },
] as const

const legacyCard: CompareCardData = {
  eyebrow: '传统写法',
  title: 'useEffect 里手动改 document.title',
  summary: '以前最常见的做法是：组件挂载后自己去写 document.title，meta 还得额外 query / create / patch。',
  bullets: [
    'title、meta、link 往往散落在多个 useEffect。',
    '切换路由、嵌套组件时需要自己管覆盖顺序。',
    '更像 imperative DOM patch，而不是组件输出。',
  ],
  code: `useEffect(() => {\n  document.title = title\n  const meta = document.querySelector('meta[name="description"]')\n  meta?.setAttribute('content', description)\n}, [title, description])`,
}

const modernCard: CompareCardData = {
  eyebrow: 'React 19 写法',
  title: '组件直接 render <title> / <meta>',
  summary: '把页面头信息也纳入组件声明式输出。你切换视图时，head 会跟着组件树一起变化。',
  bullets: [
    '更符合“UI = state 的映射”。',
    '多层组件都能声明 metadata，React 负责收敛。',
    '对路由页面、嵌套路由、局部功能页尤其舒服。',
  ],
  code: `return (\n  <>\n    <title>{title}</title>\n    <meta name="description" content={description} />\n  </>\n)`,
}

function MetadataPreview({ title, description }: { title: string; description: string }) {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
    </>
  )
}

export function MetadataSection() {
  const [activeKey, setActiveKey] = useState<(typeof metadataModes)[number]['key']>('lab')
  const [liveTitle, setLiveTitle] = useState('')
  const [liveDescription, setLiveDescription] = useState('')

  const current = useMemo(() => metadataModes.find((item) => item.key === activeKey) ?? metadataModes[0], [activeKey])

  useEffect(() => {
    const sync = () => {
      setLiveTitle(document.title)
      setLiveDescription(document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '未找到 description meta')
    }

    sync()
    const observer = new MutationObserver(sync)
    observer.observe(document.head, { childList: true, subtree: true, attributes: true })
    return () => observer.disconnect()
  }, [])

  return (
    <SectionShell
      eyebrow="Feature 06"
      title="Document metadata"
      description="React 19 把 head 信息也带回了声明式世界。这个 demo 直接在组件里输出 <title> 和 <meta name=description>，然后实时把 document.head 当前值读出来。"
      badges={
        <>
          <Badge tone="demo">title / meta 即时变化</Badge>
          <Badge tone="demo">组件声明式 metadata</Badge>
        </>
      }
    >
      <MetadataPreview title={current.title} description={current.description} />

      <div className="compare-grid">
        <CompareCard {...legacyCard} />
        <CompareCard {...modernCard} />
      </div>

      <DemoPanel title="切换当前视图的 metadata" description="按钮切换的是组件状态，但最终变化体现在 document.head 里。你可以顺便看看浏览器标签标题是否跟着变化。">
        <div className="stack-gap">
          <div className="control-row wrap-row">
            {metadataModes.map((mode) => (
              <button
                key={mode.key}
                type="button"
                className={mode.key === activeKey ? 'primary-button' : 'secondary-button'}
                onClick={() => setActiveKey(mode.key)}
              >
                {mode.title.replace('React 19 Lab · ', '')}
              </button>
            ))}
          </div>
          <div className="content-grid two-column">
            <InfoCard title="当前 document.head 实况" tone="accent">
              <div className="stack-gap">
                <StatusLine label="document.title" value={liveTitle} />
                <StatusLine label="meta[name=description]" value={liveDescription} />
              </div>
            </InfoCard>
            <InfoCard title="为什么这事很实用">
              <ul className="ordered-list unordered-list">
                <li>路由页面切换时不必每页手写副作用。</li>
                <li>metadata 终于和组件树同源，覆盖关系更可控。</li>
                <li>在 SSR / streaming 场景里收益更明显；静态页也能先学这套声明方式。</li>
              </ul>
            </InfoCard>
          </div>
        </div>
      </DemoPanel>
    </SectionShell>
  )
}
