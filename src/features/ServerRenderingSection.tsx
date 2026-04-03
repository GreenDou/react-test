import { Badge, InfoCard, ReferenceExplorer, SectionDivider, SectionShell, StoryGrid } from '../components/ui'
import { referenceCases } from '../data/referenceCode'
import type { StoryCardItem, LabSectionId } from '../types'

const story: StoryCardItem[] = [
  { title: '一句话理解', body: 'React 19 的服务端输出不再只有一个 renderToString，而是按“静态预渲染”“流式输出”“恢复输出”分了更细的工具。' },
  { title: '它解决的真实问题', body: '不同页面、不同宿主、不同构建链路，需要的 HTML 产出方式并不一样。把它们全塞进一个老 API 里并不现实。' },
  { title: '旧写法为什么麻烦', body: 'renderToString 时代很多事情都像“先一次性吐完 HTML 再说”，对流式、恢复、渐进输出并不友好。' },
  { title: 'React 19 写法为什么更顺', body: '现在你可以区分：构建期 prerender、请求期 stream、已有 postponed state 时 resume。每个 API 都更像在解决一类具体链路。' },
  { title: '看这个代码案例时该注意什么', body: '先看 request-handler.tsx 里的 renderToPipeableStream / resumeToPipeableStream，再看 static-prerender.tsx 里的 prerender / resumeAndPrerender。' },
  { title: '什么时候该用 / 不该用', body: '只要你真的有服务端输出链路就该理解它们；但纯静态托管只消费结果，不生产结果，所以没必要假装在线 demo 能体现这些 API。' },
  { title: '稍微深入一点的原理', body: '这些 API 的重点不是名字多，而是 React 终于把“不同宿主 / 不同阶段的 HTML 产线”明确拆开了。' },
]

export function ServerRenderingSection({ onJump }: { onJump?: (sectionId: LabSectionId) => void }) {
  const example = referenceCases['server-rendering']

  return (
    <SectionShell
      eyebrow="代码案例 / 03"
      title="prerender / stream / resume：别再把所有服务端输出都想成 renderToString"
      description="如果你只记住一件事：React 19 不是给你一个更强的单一 API，而是把不同输出链路拆成了不同工具。"
      badges={
        <>
          <Badge tone="reference">含 prerender / resume / stream</Badge>
          <Badge tone="limit">需要 Node / Edge 宿主</Badge>
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
        <InfoCard title="为什么静态 Pages 跑不了">
          <p>{example.whyNotOnPages}</p>
        </InfoCard>
      </div>
      <SectionDivider title="代码案例讲解" description={example.summary} />
      <ReferenceExplorer files={example.files} />
    </SectionShell>
  )
}
