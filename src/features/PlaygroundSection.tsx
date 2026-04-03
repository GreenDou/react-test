import { JumpCard, SectionDivider, SectionShell } from '../components/ui'
import { labSections } from '../data/catalog'
import type { LabSectionId } from '../types'

const mustSee = ['actions', 'optimistic', 'suspense'] as const
const quickWins = ['refs', 'context', 'metadata', 'web-components'] as const

export function PlaygroundSection({ onJump }: { onJump: (sectionId: LabSectionId) => void }) {
  const mustSeeSections = labSections.filter((section) => mustSee.includes(section.id as (typeof mustSee)[number]))
  const quickWinSections = labSections.filter((section) => quickWins.includes(section.id as (typeof quickWins)[number]))

  return (
    <SectionShell
      eyebrow="可直接体验"
      title="先从能亲手试出来的变化开始。"
      description="这一层只放真正能在浏览器里跑起来的内容。你看到的不是概念图，而是可以点、可以提交、可以观察状态变化的 React 19 页面。"
    >
      <SectionDivider title="推荐起点" description="先看这 3 个，最容易快速建立直觉。" />

      <div className="grid-three">
        {mustSeeSections.map((section) => (
          <JumpCard
            key={section.id}
            title={section.shortLabel}
            summary={section.description}
            meta={section.title}
            onClick={() => onJump(section.id)}
          />
        ))}
      </div>

      <SectionDivider title="再往下看" description="剩下这 4 个更轻，但几乎都会在真实项目里用到。" />

      <div className="grid-three">
        {quickWinSections.map((section) => (
          <JumpCard
            key={section.id}
            title={section.shortLabel}
            summary={section.description}
            meta={section.title}
            onClick={() => onJump(section.id)}
          />
        ))}
      </div>
    </SectionShell>
  )
}
