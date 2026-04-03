import { Badge, InfoCard, ReferenceExplorer, SectionDivider, SectionShell, StoryGrid } from '../components/ui'
import { referenceCases } from '../data/referenceCode'
import type { StoryCardItem, LabSectionId } from '../types'

const story: StoryCardItem[] = [
  { title: '一句话理解', body: 'preconnect、preload、preinit 解决的是“哪些资源应该先准备”这件事，并且能直接在组件层表达。' },
  { title: '它解决的真实问题', body: '以前性能 hint 常常藏在 HTML 模板、框架配置或一堆难追的工具链里，业务组件自己并不知道该优先准备什么。' },
  { title: '旧写法为什么麻烦', body: '资源提示和页面组件分家，最后常常出现“组件最懂优先级，但 hint 却写在离它最远的地方”。' },
  { title: 'React 19 写法为什么更顺', body: '现在组件本身就能说：先建连接、先准备脚本样式、先提示关键图片或数据。这让性能意图更贴近业务页面。' },
  { title: '看这个代码案例时该注意什么', body: '留意 ArticlePage.tsx 里 preconnect / preinit / preload 是怎么围绕文章 hero 图、评论区、分析脚本一起表达的。' },
  { title: '什么时候该用 / 不该用', body: '当你真的知道资源优先级，尤其在 SSR / streaming 页面里很适合；但不要什么都 preload，否则只会把优先级系统搞乱。' },
  { title: '稍微深入一点的原理', body: '它的核心价值是“把资源编排纳入渲染模型”，而不是多提供几个随手可调的性能开关。' },
]

export function ResourceHintsSection({ onJump }: { onJump?: (sectionId: LabSectionId) => void }) {
  const example = referenceCases['resource-hints']

  return (
    <SectionShell
      eyebrow="代码案例 / 04"
      title="资源编排：性能 hint 也该贴着页面组件写"
      description="这页不会拿 Lighthouse 分数作秀，而是专注讲清楚：资源 hint 最有价值的地方，是让最懂业务优先级的组件自己表达意图。"
      badges={
        <>
          <Badge tone="reference">含 preload / preinit / preconnect</Badge>
          <Badge tone="limit">静态站难做严谨对比</Badge>
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
        <InfoCard title="为什么这里改成看代码">
          <p>{example.whyNotOnPages}</p>
        </InfoCard>
      </div>
      <SectionDivider title="代码案例讲解" description={example.summary} />
      <ReferenceExplorer files={example.files} />
    </SectionShell>
  )
}
