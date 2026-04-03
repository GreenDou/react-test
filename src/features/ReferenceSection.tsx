import { JumpCard, SectionDivider, SectionShell } from '../components/ui'
import { labSections } from '../data/catalog'
import type { LabSectionId } from '../types'

const referenceIds = ['server-components', 'server-actions', 'server-rendering', 'resource-hints', 'hydration'] as const

export function ReferenceSection({ onJump }: { onJump: (sectionId: LabSectionId) => void }) {
  const items = labSections.filter((section) => referenceIds.includes(section.id as (typeof referenceIds)[number]))

  return (
    <SectionShell
      eyebrow="代码案例"
      title="这些能力更适合直接看实现边界。"
      description="Server Components、Server Actions、服务端输出和 hydration 都依赖真实宿主。这里不做伪 demo，而是给出仓库里的文件、运行前提和使用边界。"
    >
      <SectionDivider title="先看这些" description="通常从 Server Components 和 Server Actions 开始会更顺。" />

      <div className="grid-three">
        {items.map((section) => (
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
