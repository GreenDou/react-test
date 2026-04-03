import { useEffect, useMemo, useState } from 'react'
import { Badge, CompareCard, DemoPanel, InfoCard, SectionDivider, SectionShell, StatusLine, StoryGrid } from '../components/ui'
import type { CompareCardData, StoryCardItem, LabSectionId } from '../types'

const metadataModes = [
  {
    key: 'lab',
    title: 'React 19 Lab · Metadata Demo',
    description: '在组件树里直接声明 title / meta，而不是手工写副作用。',
  },
  {
    key: 'optimistic',
    title: 'React 19 Lab · Optimistic UI',
    description: '标题和 description 跟着当前视图一起变化。',
  },
  {
    key: 'elements',
    title: 'React 19 Lab · Custom Elements',
    description: '自定义元素页也可以直接从组件里声明 metadata。',
  },
] as const

const story: StoryCardItem[] = [
  { title: '一句话理解', body: '现在 <title> 和 <meta> 也能像普通 UI 一样从组件里声明出来。' },
  { title: '它解决的真实问题', body: '以前 document.title、description meta 往往散落在 useEffect 里，页面一复杂就难维护。' },
  { title: '旧写法为什么麻烦', body: '要 query DOM、setAttribute、管覆盖顺序，还常常和路由切换耦合在一起。' },
  { title: 'React 19 写法为什么更顺', body: '头信息终于回到组件树里，状态一变，head 也跟着变。你不再需要把它当成 DOM 副作用单独维护。' },
  { title: '看这个 demo 时该注意什么', body: '一边切换当前视图，一边留意浏览器标签标题和右侧读取出来的 document.head 当前值。' },
  { title: '什么时候该用 / 不该用', body: '几乎所有页面级信息都适合这样声明；但如果是运行时埋点，不属于 metadata，就别混在一起。' },
  { title: '稍微深入一点的原理', body: '这件事在 SSR / streaming 里更有价值，因为服务端输出 head 时就能更自然地和组件树保持一致。' },
]

const legacyCard: CompareCardData = {
  eyebrow: '旧写法',
  title: 'useEffect 里手动改 document.title',
  summary: '能做，但像是在补 DOM，而不是声明 UI。',
  bullets: ['标题和 meta 容易分散在多个 effect。', '覆盖顺序要自己想。', '读代码时不容易一眼看出页面头信息。'],
  code: `useEffect(() => {
  document.title = title
  const meta = document.querySelector('meta[name="description"]')
  meta?.setAttribute('content', description)
}, [title, description])`,
}

const modernCard: CompareCardData = {
  eyebrow: 'React 19',
  title: '组件里直接 render <title> / <meta>',
  summary: '终于更像声明式 UI 了。',
  bullets: ['页面状态和 head 信息同源。', '更适合页面级组件。', 'SSR 场景收益尤其明显。'],
  code: `return (
  <>
    <title>{title}</title>
    <meta name="description" content={description} />
  </>
)`,
}

function MetadataPreview({ title, description }: { title: string; description: string }) {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
    </>
  )
}

export function MetadataSection({ onJump }: { onJump?: (sectionId: LabSectionId) => void }) {
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
      eyebrow="可直接体验 / 06"
      title="Document metadata：页面头信息也该回到组件树里"
      description="这一页最适合用一句人话来理解：原本散落在副作用里的 title 和 meta，现在终于能像普通 UI 一样声明。"
      stackClassName="feature-stack"
      badges={
        <>
          <Badge tone="demo">标签标题实时变化</Badge>
          <Badge tone="demo">head 内容同步读出</Badge>
        </>
      }
      actions={
        <button type="button" className="secondary-button" onClick={() => onJump?.('playground')}>
          返回试玩列表
        </button>
      }
    >
      <MetadataPreview title={current.title} description={current.description} />
      <StoryGrid items={story} />
      <DemoPanel title="直接试：切换视图，看 head 怎么跟着变" description="别只看页面里的文字，顺便看看浏览器标签标题和右侧实时读取出的 document.head。">
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
          <div className="grid-two">
            <InfoCard title="当前 document.head 实况" tone="accent">
              <div className="stack-gap">
                <StatusLine label="document.title" value={liveTitle} />
                <StatusLine label="meta[name=description]" value={liveDescription} />
              </div>
            </InfoCard>
            <InfoCard title="这页最值得记住的点">
              <ul className="bullet-list">
                <li>状态变化会自然带动 head 变化。</li>
                <li>再也不必把 title 当成“挂载后顺手补一下的副作用”。</li>
                <li>在 SSR / 路由场景里，这种声明式写法尤其省心。</li>
              </ul>
            </InfoCard>
          </div>
        </div>
      </DemoPanel>
      <SectionDivider title="代码层面对比" description="看这里主要是为了理解：metadata 不再是零散副作用。" />
      <div className="compare-grid">
        <CompareCard {...legacyCard} />
        <CompareCard {...modernCard} />
      </div>
    </SectionShell>
  )
}
