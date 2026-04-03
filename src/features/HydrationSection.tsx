import { Badge, InfoCard, ReferenceExplorer, SectionDivider, SectionShell, StoryGrid } from '../components/ui'
import { referenceCases } from '../data/referenceCode'
import type { StoryCardItem, LabSectionId } from '../types'

const story: StoryCardItem[] = [
  { title: '一句话理解', body: 'Hydration 错误改进真正解决的是：当服务端 HTML 和客户端第一次渲染对不上时，你终于更容易知道到底哪里错了。' },
  { title: '它解决的真实问题', body: 'SSR 接入期最烦的 bug 之一就是 mismatch：明明页面看起来差不多，但客户端接管时就是报错，而且以前很难定位。' },
  { title: '旧写法为什么麻烦', body: '很多错误只告诉你“对不上了”，却不太告诉你具体是谁、在哪一层、为什么会不同。排查成本很高。' },
  { title: 'React 19 写法为什么更顺', body: 'React 19 对 hydration 错误信息做了改进；再配合更规范的写法和 onRecoverableError，你能更快把问题压缩到具体组件。' },
  { title: '看这个代码案例时该注意什么', body: '先看 ClockThatMismatches.tsx 里为什么直接在 render 里 new Date() 会出事，再看 HydrationSafeClock.tsx 如何用服务端提供的初始值对齐首屏。' },
  { title: '什么时候该用 / 不该用', body: '只要有 SSR + hydrateRoot 就得理解；但纯客户端挂载的静态站没有 hydration 这一步，所以不需要伪造一个没意义的在线事故现场。' },
  { title: '稍微深入一点的原理', body: 'Hydration 本质上是在“接管既有 HTML”，所以第一帧必须对齐。React 19 的价值，是让 mismatch 更容易暴露具体上下文。' },
]

export function HydrationSection({ onJump }: { onJump?: (sectionId: LabSectionId) => void }) {
  const example = referenceCases.hydration

  return (
    <SectionShell
      eyebrow="代码案例 / 05"
      title="Hydration 错误改进：真正的价值在 SSR 排障，而不是在纯客户端页面里看报错"
      description="这页重点是建立判断力：哪些写法天然容易 mismatch，为什么 React 19 的错误信息改进很重要，以及为什么当前静态站不该假装自己能在线演示这件事。"
      badges={
        <>
          <Badge tone="reference">含 hydrateRoot 入口</Badge>
          <Badge tone="limit">需要 SSR 才有代表性</Badge>
        </>
      }
      actions={
        <button type="button" className="secondary-button" onClick={() => onJump?.('reference')}>
          返回代码案例列表
        </button>
      }
    >
      <StoryGrid items={story} />
      <div className="grid-two">
        <InfoCard title="运行前提" tone="accent">
          <p>{example.environment}</p>
        </InfoCard>
        <InfoCard title="为什么当前站不做在线事故演示">
          <p>{example.whyNotOnPages}</p>
        </InfoCard>
      </div>
      <SectionDivider title="代码案例讲解" description={example.summary} />
      <ReferenceExplorer files={example.files} />
    </SectionShell>
  )
}
