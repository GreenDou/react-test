import { labSections } from '../data/catalog'
import { Badge, InfoCard, JumpCard, SectionDivider, SectionShell } from '../components/ui'
import type { LabSectionId } from '../types'

const mustSee = ['actions', 'optimistic', 'suspense'] as const
const quickWins = ['refs', 'context', 'metadata', 'web-components'] as const

export function PlaygroundSection({ onJump }: { onJump: (sectionId: LabSectionId) => void }) {
  const mustSeeSections = labSections.filter((section) => mustSee.includes(section.id as (typeof mustSee)[number]))
  const quickWinSections = labSections.filter((section) => quickWins.includes(section.id as (typeof quickWins)[number]))

  return (
    <SectionShell
      eyebrow="可直接体验的能力"
      title="这些 React 19 能力，你现在就可以在 GitHub Pages 上点着看"
      description="这一层只放真正能在线跑起来的内容。这样你不会在页面里分不清：眼前看到的是可靠 demo，还是只是概念说明。"
      badges={
        <>
          <Badge tone="demo">全部可在线体验</Badge>
          <Badge tone="guide">已按推荐顺序排序</Badge>
        </>
      }
    >
      <div className="grid-two">
        <InfoCard title="推荐顺序：先看这 3 个" tone="accent">
          <ol className="ordered-list">
            <li>
              <strong>Actions：</strong>先理解 React 19 如何把表单提交收回到表单语义里。
            </li>
            <li>
              <strong>useOptimistic：</strong>再理解“临时反馈层”和“真实数据层”如何分开。
            </li>
            <li>
              <strong>use() + Suspense：</strong>最后理解 React 19 如何处理“等资源”这件事。
            </li>
          </ol>
        </InfoCard>
        <InfoCard title="再看这 4 个轻量升级" tone="soft">
          <ul className="bullet-list">
            <li>ref as prop：基础组件更轻。</li>
            <li>Context provider 简化：JSX 更清爽。</li>
            <li>Document metadata：头信息回到组件树里。</li>
            <li>Web Components：接原生自定义元素更顺。</li>
          </ul>
        </InfoCard>
      </div>

      <SectionDivider title="第一组：最值得先上手的 3 个 demo" description="先学这些，你会最快理解 React 19 不是“多几个 API 名字”，而是把常见问题写顺了。" />

      <div className="grid-three">
        {mustSeeSections.map((section) => (
          <JumpCard
            key={section.id}
            title={section.shortLabel}
            summary={section.description}
            meta={section.title}
            badge={<Badge tone="demo">先看这个</Badge>}
            onClick={() => onJump(section.id)}
          />
        ))}
      </div>

      <SectionDivider title="第二组：工程体验类升级" description="它们不是最炸裂，但几乎都是你会在真实项目里马上受益的改动。" />

      <div className="grid-three">
        {quickWinSections.map((section) => (
          <JumpCard
            key={section.id}
            title={section.shortLabel}
            summary={section.description}
            meta={section.title}
            badge={<Badge tone="demo">轻量但常用</Badge>}
            onClick={() => onJump(section.id)}
          />
        ))}
      </div>
    </SectionShell>
  )
}
