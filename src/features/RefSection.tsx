import { forwardRef, useRef } from 'react'
import type { ComponentPropsWithoutRef, ForwardedRef, Ref } from 'react'
import { Badge, CompareCard, DemoPanel, InfoCard, SectionDivider, SectionShell, StoryGrid } from '../components/ui'
import type { CompareCardData, StoryCardItem, LabSectionId } from '../types'

const story: StoryCardItem[] = [
  { title: '一句话理解', body: '很多简单函数组件现在可以像接普通 prop 一样接收 ref，不必默认先包一层 forwardRef。' },
  { title: '它解决的真实问题', body: '设计系统里有大量 Input、Button、SearchField 之类的基础组件，它们经常只是想把 ref 透传下去，却要为此额外包壳。' },
  { title: '旧写法为什么麻烦', body: '不是说 forwardRef 难，而是简单场景也得多一层包装，组件定义和类型声明都更绕。' },
  { title: 'React 19 写法为什么更顺', body: 'ref 终于没那么“特殊”了。对很多基础组件来说，定义方式更接近日常 props。' },
  { title: '看这个 demo 时该注意什么', body: '左右两个输入框都能被 focus / select，区别只在于组件定义本身是不是还要额外包一层。' },
  { title: '什么时候该用 / 不该用', body: '简单透传 ref 的组件很适合；但如果你要兼容旧生态、明确表达 ref 边界，或者配合 useImperativeHandle，forwardRef 仍然合理。' },
  { title: '稍微深入一点的原理', body: '这更像一次“语义去特殊化”：很多 ref 场景不再需要额外 ceremony，但并不代表 forwardRef 被废弃。' },
]

const legacyCard: CompareCardData = {
  eyebrow: '旧写法',
  title: 'forwardRef 包一层',
  summary: '这是 React 很长时间的标准做法，完全没错。',
  bullets: ['定义更像“包装器组件”。', '类型和实现都多一层。', '复杂场景依然很有用。'],
  code: `const SearchInput = forwardRef(function SearchInput(props, ref) {
  return <input ref={ref} {...props} />
})`,
}

const modernCard: CompareCardData = {
  eyebrow: 'React 19',
  title: 'ref 直接作为 prop 接收',
  summary: '对简单组件最舒服。',
  bullets: ['基础组件更轻。', '定义更接近普通 props。', '读代码的人一眼就能懂。'],
  code: `function SearchInput({ ref, ...props }) {
  return <input ref={ref} {...props} />
}`,
}

type LegacyInputProps = ComponentPropsWithoutRef<'input'> & { label: string }

const LegacyInput = forwardRef(function LegacyInput(
  { label, ...props }: LegacyInputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  return (
    <label className="field-shell">
      <span>{label}</span>
      <input ref={ref} {...props} />
    </label>
  )
})

type ModernInputProps = ComponentPropsWithoutRef<'input'> & {
  label: string
  ref?: Ref<HTMLInputElement>
}

function ModernInput({ label, ref, ...props }: ModernInputProps) {
  return (
    <label className="field-shell">
      <span>{label}</span>
      <input ref={ref} {...props} />
    </label>
  )
}

function RefPlayground() {
  const legacyRef = useRef<HTMLInputElement>(null)
  const modernRef = useRef<HTMLInputElement>(null)

  return (
    <div className="grid-two">
      <InfoCard title="forwardRef 版本" eyebrow="旧写法">
        <div className="stack-gap">
          <LegacyInput ref={legacyRef} label="旧写法输入框" defaultValue="legacy ref" />
          <div className="control-row">
            <button type="button" className="secondary-button" onClick={() => legacyRef.current?.focus()}>
              focus
            </button>
            <button type="button" className="secondary-button" onClick={() => legacyRef.current?.select()}>
              select
            </button>
          </div>
        </div>
      </InfoCard>
      <InfoCard title="ref as prop 版本" eyebrow="React 19" tone="accent">
        <div className="stack-gap">
          <ModernInput ref={modernRef} label="React 19 输入框" defaultValue="modern ref" />
          <div className="control-row">
            <button type="button" className="primary-button" onClick={() => modernRef.current?.focus()}>
              focus
            </button>
            <button type="button" className="primary-button" onClick={() => modernRef.current?.select()}>
              select
            </button>
          </div>
        </div>
      </InfoCard>
    </div>
  )
}

export function RefSection({ onJump }: { onJump?: (sectionId: LabSectionId) => void }) {
  return (
    <SectionShell
      eyebrow="可直接体验 / 04"
      title="ref as prop：小组件少一层包装，读起来就更像人话"
      description="这不是最重磅的新特性，但它很容易在真实项目里立刻见效：尤其是设计系统和基础表单组件。"
      badges={
        <>
          <Badge tone="demo">可直接 focus / select</Badge>
          <Badge tone="demo">旧写法对照</Badge>
        </>
      }
      actions={
        <button type="button" className="secondary-button" onClick={() => onJump?.('playground')}>
          返回试玩列表
        </button>
      }
    >
      <StoryGrid items={story} />
      <DemoPanel title="直接试：两个输入框都能被 ref 控制" description="差别不在功能，而在组件定义是不是还要多一层 forwardRef 包装。">
        <RefPlayground />
      </DemoPanel>
      <SectionDivider title="代码层面对比" description="看这里主要是为了理解：React 19 是在降低基础组件的样板代码。" />
      <div className="compare-grid">
        <CompareCard {...legacyCard} />
        <CompareCard {...modernCard} />
      </div>
    </SectionShell>
  )
}
