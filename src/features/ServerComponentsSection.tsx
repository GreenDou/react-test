import { Badge, InfoCard, ReferenceExplorer, SectionDivider, SectionShell, StoryGrid } from '../components/ui'
import { referenceCases } from '../data/referenceCode'
import type { StoryCardItem, LabSectionId } from '../types'

const story: StoryCardItem[] = [
  { title: '一句话理解', body: 'Server Components 解决的是：有些组件根本不需要发到浏览器，那就别发。' },
  { title: '它解决的真实问题', body: '商品详情、文章正文、权限过滤后的列表这类内容，很多时候更适合在服务端拿好数据、拼好结构，再把结果发给客户端。' },
  { title: '旧写法为什么麻烦', body: '过去即使只是读数据，很多代码也不得不先发到浏览器，再在客户端拉一遍数据，既重又绕。' },
  { title: 'React 19 写法为什么更顺', body: 'Server Components 把“哪些逻辑留在服务端”这件事做成了正式边界，客户端只接它真正需要交互的那部分。' },
  { title: '看这个代码案例时该注意什么', body: '重点看 ProductPage.server.tsx 和 ProductGallery.client.tsx 的分工：页面主体在服务端，图片切换这种交互才留给客户端。' },
  { title: '什么时候该用 / 不该用', body: '服务端读数据、拼首屏、减少客户端 JS 时很适合；但纯静态托管、没有 RSC 运行时的站点，就别假装自己在用。' },
  { title: '稍微深入一点的原理', body: '它不是“一个新 hook”，而是新的模块边界和传输协议。也正因此，GitHub Pages 这种只托管静态文件的环境跑不了。' },
]

export function ServerComponentsSection({ onJump }: { onJump?: (sectionId: LabSectionId) => void }) {
  const example = referenceCases['server-components']

  return (
    <SectionShell
      eyebrow="代码案例 / 01"
      title="Server Components：真正该理解的，是哪些代码根本不该去浏览器"
      description="这页不做伪 demo。我们直接看仓库里的真实代码片段，再把运行前提和页面边界讲清楚。"
      badges={
        <>
          <Badge tone="reference">仓库真代码</Badge>
          <Badge tone="limit">GitHub Pages 不能真跑</Badge>
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
