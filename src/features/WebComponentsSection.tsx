import { useEffect, useMemo, useRef, useState } from 'react'
import { Badge, CompareCard, DemoPanel, InfoCard, SectionShell, StatusLine } from '../components/ui'
import type { CompareCardData, ReactionProfile } from '../types'

const legacyCard: CompareCardData = {
  eyebrow: '传统写法',
  title: 'ref + addEventListener + 手工塞属性',
  summary: '旧时代接 web component 经常要先拿 DOM ref，再手工赋值对象属性、手工监听 custom event。',
  bullets: [
    '事件监听容易回到 imperative 风格。',
    '复杂对象 prop 经常要自己塞到 element 实例上。',
    '和 React 组件的使用体验差了一截。',
  ],
  code: `const ref = useRef(null)\nuseEffect(() => {\n  ref.current.profile = profile\n  ref.current.addEventListener('rating-change', handler)\n  return () => ref.current?.removeEventListener('rating-change', handler)\n}, [profile])`,
}

const modernCard: CompareCardData = {
  eyebrow: 'React 19 写法',
  title: '在 JSX 里直接传对象 prop、直接绑自定义事件',
  summary: 'React 19 对 Custom Elements 更友好：prop / property 与 custom event 的桥接都顺手很多。',
  bullets: [
    '自定义事件可以直接用 JSX 风格监听。',
    '对象型 prop 会更自然地落到 element 实例属性。',
    'React 组件与 web component 的边界更平滑。',
  ],
  code: `<reaction-meter\n  ref={meterRef}\n  value={value}\n  accent={accent}\n  profile={profile}\n  onrating-change={(event) => setValue(event.detail.value)}\n/>`,
}

export function WebComponentsSection() {
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
      eyebrow="Feature 07"
      title="Web Components / Custom Elements 兼容性"
      description="这个 demo 注册了一个原生自定义元素 <reaction-meter>。你可以直接在 JSX 里把对象 profile、数值 value、自定义事件 onrating-change 一起传进去。"
      badges={
        <>
          <Badge tone="demo">对象 prop</Badge>
          <Badge tone="demo">自定义事件</Badge>
          <Badge tone="demo">Custom Element 实例互操作</Badge>
        </>
      }
    >
      <div className="compare-grid">
        <CompareCard {...legacyCard} />
        <CompareCard {...modernCard} />
      </div>

      <DemoPanel title="直接操作自定义元素" description="点击星级后，事件会从 custom element dispatch 出来，React 状态会同步更新；同时 profile 对象会以实例属性形式挂到元素上。">
        <div className="content-grid two-column">
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
          <InfoCard title="读取 React ↔ Custom Element 互操作结果" tone="accent">
            <div className="stack-gap">
              <StatusLine label="当前评分" value={`${rating} / 5`} />
              <StatusLine label="profile 属性类型" value={elementSnapshot.profileType} />
              <StatusLine label="profile.title" value={elementSnapshot.profileTitle} />
            </div>
          </InfoCard>
        </div>
      </DemoPanel>

      <DemoPanel title="为什么 React 19 的这一步很重要" description="很多团队都会在 React 应用里逐步接入 design system、地图组件、图表组件，或者历史上已经存在的 web component。">
        <div className="content-grid two-column">
          <InfoCard title="过去的 friction">
            <ul className="ordered-list unordered-list">
              <li>要反复写 ref + effect + addEventListener。</li>
              <li>复杂 prop 不是天然就能走属性通道。</li>
              <li>一旦桥接层变厚，React 里用起来很不像 React 组件。</li>
            </ul>
          </InfoCard>
          <InfoCard title="React 19 的收益" tone="accent">
            <ul className="ordered-list unordered-list">
              <li>桥接代码更薄，组件边界更自然。</li>
              <li>更适合渐进式技术栈整合。</li>
              <li>对‘React 只负责壳，底层组件来自别处’的架构特别友好。</li>
            </ul>
          </InfoCard>
        </div>
      </DemoPanel>
    </SectionShell>
  )
}
