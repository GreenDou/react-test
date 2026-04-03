import { forwardRef, useRef } from 'react'
import type { ComponentPropsWithoutRef, ForwardedRef } from 'react'
import { Badge, CompareCard, DemoPanel, InfoCard, SectionShell } from '../components/ui'
import type { CompareCardData } from '../types'

const legacyCard: CompareCardData = {
  eyebrow: '传统写法',
  title: 'forwardRef 包一层壳',
  summary: '过去函数组件要接收 ref，往往得把组件再包一层 forwardRef。写法没错，但包装层确实多。',
  bullets: [
    '需要额外的 forwardRef 包装。',
    '有些组件还会顺带暴露 useImperativeHandle。',
    '对简单输入框、按钮包装来说，仪式感偏重。',
  ],
  code: `const SearchInput = forwardRef(function SearchInput(props, ref) {\n  return <input ref={ref} {...props} />\n})`,
}

const modernCard: CompareCardData = {
  eyebrow: 'React 19 写法',
  title: 'ref 像普通 prop 一样接收',
  summary: '在很多简单组件里，ref 终于不再特殊得非要 forwardRef 才能经过函数组件。',
  bullets: [
    '少一层包装，组件定义更贴近日常 prop 心智。',
    '对 design system 的基础输入组件很友好。',
    '不是 forwardRef 被废弃，而是很多简单场景不必再用它。',
  ],
  code: `function SearchInput({ ref, ...props }) {\n  return <input ref={ref} {...props} />\n}`,
}

type LegacyInputProps = ComponentPropsWithoutRef<'input'> & {
  label: string
}

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
  ref?: React.Ref<HTMLInputElement>
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
    <div className="content-grid two-column">
      <div className="stack-gap">
        <LegacyInput ref={legacyRef} label="forwardRef 输入框" defaultValue="legacy ref" />
        <div className="control-row">
          <button type="button" className="secondary-button" onClick={() => legacyRef.current?.focus()}>
            focus
          </button>
          <button type="button" className="secondary-button" onClick={() => legacyRef.current?.select()}>
            select
          </button>
        </div>
      </div>
      <div className="stack-gap">
        <ModernInput ref={modernRef} label="ref as prop 输入框" defaultValue="modern ref" />
        <div className="control-row">
          <button type="button" className="secondary-button" onClick={() => modernRef.current?.focus()}>
            focus
          </button>
          <button type="button" className="secondary-button" onClick={() => modernRef.current?.select()}>
            select
          </button>
        </div>
      </div>
    </div>
  )
}

export function RefSection() {
  return (
    <SectionShell
      eyebrow="Feature 04"
      title="ref as prop"
      description="对简单函数组件来说，React 19 允许 ref 像普通 prop 一样被透传，终于不用每个基础输入框都为 forwardRef 单独包壳。"
      badges={
        <>
          <Badge tone="demo">forwardRef 对比</Badge>
          <Badge tone="demo">ref 直接透传</Badge>
        </>
      }
    >
      <div className="compare-grid">
        <CompareCard {...legacyCard} />
        <CompareCard {...modernCard} />
      </div>

      <DemoPanel
        title="直接试一下 focus / select"
        description="两个输入框都能被 ref 控制；区别在于现代写法少了一层 forwardRef 包装，定义更接近日常 props。"
      >
        <RefPlayground />
      </DemoPanel>

      <DemoPanel
        title="什么时候还会继续用 forwardRef"
        description="React 19 不是把 forwardRef 完全打入冷宫，而是把它从“默认必须”降成“需要时再用”。"
      >
        <div className="content-grid two-column">
          <InfoCard title="仍适合 forwardRef 的场景">
            <ul className="ordered-list unordered-list">
              <li>需要和旧代码或第三方库保持兼容。</li>
              <li>你想显式表达“这是一个转发 ref 的组件边界”。</li>
              <li>要配合 useImperativeHandle 暴露复杂实例方法。</li>
            </ul>
          </InfoCard>
          <InfoCard title="ref as prop 的直接收益" tone="accent">
            <ul className="ordered-list unordered-list">
              <li>基础组件更轻。</li>
              <li>类型定义更接近普通 props。</li>
              <li>组件阅读成本更低，尤其在 design system 里很明显。</li>
            </ul>
          </InfoCard>
        </div>
      </DemoPanel>
    </SectionShell>
  )
}
