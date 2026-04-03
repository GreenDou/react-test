import { useEffect, useMemo, useRef, useState } from 'react'
import { Badge, CompareCard, DemoPanel, InfoCard, SectionDivider, SectionShell, StatusLine, StoryGrid } from '../components/ui'
import type { CompareCardData, ReactionProfile, StoryCardItem, LabSectionId } from '../types'

const story: StoryCardItem[] = [
  { title: '一句话理解', body: 'React 19 接 Web Components 更像“接一个组件”，不再总得先回到 ref + effect 的手工桥接模式。' },
  { title: '它解决的真实问题', body: '很多团队会把地图、图表、设计系统、历史遗留组件做成 Web Component。React 项目接它们时，以前总有摩擦。' },
  { title: '旧写法为什么麻烦', body: '对象 prop 要自己塞到 DOM 实例上，自定义事件要手工 addEventListener，代码很快从声明式退回命令式。' },
  { title: 'React 19 写法为什么更顺', body: '对象 prop、自定义事件、实例属性的桥接更友好了。你终于更像在 JSX 里“直接使用它”。' },
  { title: '看这个 demo 时该注意什么', body: '这个 <reaction-meter> 不是 React 组件，而是真正的 custom element。你可以直接改评分、改强调色、看 profile 对象如何挂到实例上。' },
  { title: '什么时候该用 / 不该用', body: '当你需要渐进接入原生组件或跨框架设计系统时很适合；但如果本来就是纯 React 组件，不必为了新特性反向改成 Web Component。' },
  { title: '稍微深入一点的原理', body: '价值不在“React 也能用 Web Components”这句废话，而在桥接层终于变薄，跨技术栈协作成本开始下降。' },
]

const legacyCard: CompareCardData = {
  eyebrow: '旧写法',
  title: 'ref + addEventListener + 手工塞对象属性',
  summary: '能接，但桥接层厚。',
  bullets: ['事件监听回到 imperative。', '对象属性经常要靠 ref.current 赋值。', '使用体验不太像 React 组件。'],
  code: `const ref = useRef(null)
useEffect(() => {
  ref.current.profile = profile
  ref.current.addEventListener('rating-change', handler)
  return () => ref.current?.removeEventListener('rating-change', handler)
}, [profile])`,
}

const modernCard: CompareCardData = {
  eyebrow: 'React 19',
  title: '在 JSX 里直接传对象 prop、直接监听自定义事件',
  summary: '边界更自然了。',
  bullets: ['对象 prop 可以更自然地落到实例属性。', '自定义事件在 JSX 里可直接监听。', '很适合渐进接入外部组件体系。'],
  code: `<reaction-meter
  ref={meterRef}
  value={value}
  accent={accent}
  profile={profile}
  onrating-change={(event) => setValue(event.detail.value)}
/>`,
}

export function WebComponentsSection({ onJump }: { onJump?: (sectionId: LabSectionId) => void }) {
  const meterRef = useRef<HTMLElement | null>(null)
  const [rating, setRating] = useState(4)
  const [accent, setAccent] = useState('#8b5cf6')
  const [elementSnapshot, setElementSnapshot] = useState({
    profileType: '尚未挂载',
    profileTitle: '等待挂载',
  })

  const profile = useMemo<ReactionProfile>(
    () => ({
      title: 'React 19 对 Custom Elements 更友好了',
      hint: '这个 profile 对象是直接通过 JSX 传给自定义元素的。',
      moods: ['偏弱', '一般', '不错', '很顺手', '几乎无缝'],
    }),
    [],
  )

  useEffect(() => {
    if (!meterRef.current) {
      return
    }

    const profileValue = (meterRef.current as unknown as { profile?: ReactionProfile }).profile
    setElementSnapshot({
      profileType: typeof profileValue,
      profileTitle: profileValue?.title ?? '等待挂载',
    })
  }, [profile, rating, accent])

  return (
    <SectionShell
      eyebrow="可直接体验 / 07"
      title="Web Components 互操作：React 19 更像在接组件，不像在搭桥"
      description="这页的重点不是炫技，而是让你真切看到：一个 custom element 也能在 React 里用得更自然。"
      stackClassName="feature-stack"
      badges={
        <>
          <Badge tone="demo">真实 custom element</Badge>
          <Badge tone="demo">对象 prop + 自定义事件</Badge>
        </>
      }
      actions={
        <button type="button" className="secondary-button" onClick={() => onJump?.('playground')}>
          返回试玩列表
        </button>
      }
    >
      <StoryGrid items={story} />
      <DemoPanel title="直接试：这是一个真正的 <reaction-meter> 自定义元素" description="点星级、调颜色，再看右侧状态。重点观察 profile 对象如何挂到元素实例上。">
        <div className="grid-two">
          <div className="stack-gap">
            <div className="control-row wrap-row">
              <label>
                强调色
                <input type="color" value={accent} onChange={(event) => setAccent(event.target.value)} />
              </label>
            </div>
            <reaction-meter
              ref={meterRef}
              value={rating}
              accent={accent}
              profile={profile}
              label="React 19 × Web Components"
              onrating-change={(event: CustomEvent<{ value: number }>) => setRating(event.detail.value)}
            />
          </div>
          <InfoCard title="React ↔ Custom Element 当前状态" tone="accent">
            <div className="stack-gap">
              <StatusLine label="当前评分" value={`${rating} / 5`} />
              <StatusLine label="profile 属性类型" value={elementSnapshot.profileType} />
              <StatusLine label="profile.title" value={elementSnapshot.profileTitle} />
            </div>
          </InfoCard>
        </div>
      </DemoPanel>
      <SectionDivider title="代码层面对比" description="看完这个对比，你就能明白 React 19 真正减掉的是哪一层桥接代码。" />
      <div className="compare-grid">
        <CompareCard {...legacyCard} />
        <CompareCard {...modernCard} />
      </div>
    </SectionShell>
  )
}
