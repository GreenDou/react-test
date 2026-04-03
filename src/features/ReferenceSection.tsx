import { labSections } from '../data/catalog'
import { Badge, InfoCard, JumpCard, SectionDivider, SectionShell } from '../components/ui'
import type { LabSectionId } from '../types'

const referenceIds = ['server-components', 'server-actions', 'server-rendering', 'resource-hints', 'hydration'] as const

export function ReferenceSection({ onJump }: { onJump: (sectionId: LabSectionId) => void }) {
  const items = labSections.filter((section) => referenceIds.includes(section.id as (typeof referenceIds)[number]))

  return (
    <SectionShell
      eyebrow="代码案例讲解区"
      title="这些 React 19 能力不适合假装做在线 demo，所以我把真代码放进仓库里了"
      description="这里专门讲那些更依赖服务端、SSR 或真实运行宿主的能力。每一页都不再只说“GitHub Pages 不能展示”，而是给出仓库里的真实项目片段，再解释用途、运行前提、为什么静态站跑不了。"
      badges={
        <>
          <Badge tone="reference">仓库已新增 reference-code/</Badge>
          <Badge tone="limit">明确说明为什么不能在线跑</Badge>
        </>
      }
    >
      <div className="grid-two">
        <InfoCard title="为什么单独做这一层" tone="accent">
          <ul className="bullet-list">
            <li>Server Components、Server Actions、SSR / hydration 这些东西，离开真实宿主讲就很容易变空话。</li>
            <li>如果强行在纯静态站里“伪演示”，反而会误导读者以为这些能力不需要服务端。</li>
            <li>所以更靠谱的方式是：仓库放真代码，页面负责把运行前提和边界讲清楚。</li>
          </ul>
        </InfoCard>
        <InfoCard title="你在每个代码案例页会看到什么" tone="soft">
          <ol className="ordered-list">
            <li>一句话理解：它解决什么问题。</li>
            <li>为什么静态 Pages 不能真跑。</li>
            <li>真实项目中大概会长什么样。</li>
            <li>仓库中对应文件的代码讲解。</li>
          </ol>
        </InfoCard>
      </div>

      <SectionDivider title="代码案例入口" description="建议先看 Server Components 和 Server Actions，再看服务端输出 API、资源编排、hydration。" />

      <div className="grid-three">
        {items.map((section) => (
          <JumpCard
            key={section.id}
            title={section.shortLabel}
            summary={section.description}
            meta={section.title}
            badge={<Badge tone="reference">看代码</Badge>}
            onClick={() => onJump(section.id)}
          />
        ))}
      </div>
    </SectionShell>
  )
}
