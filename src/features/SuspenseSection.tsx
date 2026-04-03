import { Suspense, use, useState } from 'react'
import { getProfileCacheKeys, getProfileResource } from '../lib/resources'
import { Badge, CompareCard, DemoPanel, InfoCard, SectionShell } from '../components/ui'
import type { CompareCardData } from '../types'

const legacyCard: CompareCardData = {
  eyebrow: '传统写法',
  title: 'useEffect + loading + error + data 三件套',
  summary: '经典方案完全可用，但异步状态会在组件里越长越大，尤其是多个资源并发时。',
  bullets: [
    '通常要先 render 一次空态，再在 effect 里发请求。',
    'loading / error / data 经常成对出现，而且容易在不同组件重复。',
    '如果 Promise 生命周期不清晰，很容易出现竞态和状态闪烁。',
  ],
  code: `useEffect(() => {\n  let cancelled = false\n  setLoading(true)\n  fetchProfile(id).then((data) => {\n    if (!cancelled) setData(data)\n  })\n  return () => { cancelled = true }\n}, [id])`,
}

const modernCard: CompareCardData = {
  eyebrow: 'React 19 写法',
  title: 'use(promise) 直接在 render 中读取资源',
  summary: '用 Suspense 负责“等一下”，用 cache 负责“别重复造 Promise”。这才是 use() 在客户端可稳定运行的关键。',
  bullets: [
    'Promise 必须在模块级 cache 中复用，不能每次 render 都 new。',
    'Suspense fallback 只描述等待中的 UI。',
    '切换 key 时可以重新生成资源；不切换 key 时则命中缓存。',
  ],
  code: `const profile = use(getProfileResource(profileId, revision))\n\n<Suspense fallback={<Skeleton />}>\n  <ProfileCard profileId={profileId} revision={revision} />\n</Suspense>`,
}

function ProfileCard({ profileId, revision }: { profileId: string; revision: number }) {
  const profile = use(getProfileResource(profileId, revision))

  return (
    <article className="profile-card">
      <div className="profile-card-head">
        <strong>{profile.role}</strong>
        <span>{profile.latency}</span>
      </div>
      <p>{profile.summary}</p>
      <ul className="ordered-list unordered-list compact-list">
        {profile.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
      <div className="profile-tags">
        <span>{profile.id}</span>
        <span>{profile.focus}</span>
      </div>
    </article>
  )
}

function LoadingProfileCard() {
  return (
    <article className="profile-card profile-card-loading">
      <div className="loading-line loading-line-lg" />
      <div className="loading-line" />
      <div className="loading-line" />
      <div className="loading-line loading-line-sm" />
    </article>
  )
}

export function SuspenseSection() {
  const [profileId, setProfileId] = useState('suspense')
  const [revision, setRevision] = useState(0)

  return (
    <SectionShell
      eyebrow="Feature 03"
      title="use(promise) + Suspense"
      description="这个 demo 专门展示客户端用法：资源 Promise 被缓存在模块级 Map 中，只有 key 变化时才会重新创建。这样 use() 才不会因为每次 render 都拿到新 Promise 而陷入无限等待。"
      badges={
        <>
          <Badge tone="demo">客户端可运行</Badge>
          <Badge tone="demo">缓存 Promise / Resource</Badge>
          <Badge tone="explain">强调边界：不是随便在 render 里写 fetch()</Badge>
        </>
      }
    >
      <div className="compare-grid">
        <CompareCard {...legacyCard} />
        <CompareCard {...modernCard}>
          <div className="stack-gap">
            <div className="control-row wrap-row">
              <label>
                资源 key
                <select value={profileId} onChange={(event) => setProfileId(event.target.value)}>
                  <option value="suspense">Suspense</option>
                  <option value="actions">Actions</option>
                  <option value="elements">Custom Elements</option>
                </select>
              </label>
              <button type="button" className="secondary-button" onClick={() => setRevision((current) => current + 1)}>
                强制新建资源
              </button>
            </div>
            <p className="muted-text">当前缓存键：{getProfileCacheKeys().join(' / ') || '尚无缓存'}</p>
            <Suspense fallback={<LoadingProfileCard />}>
              <ProfileCard profileId={profileId} revision={revision} />
            </Suspense>
          </div>
        </CompareCard>
      </div>

      <DemoPanel
        title="客户端 use() 的重点不是‘炫’，而是缓存 discipline"
        description="如果你在 render 里直接 fetch()，那几乎等于每次 render 都造一个新 Promise，Suspense 永远也等不到稳定结果。"
      >
        <div className="content-grid two-column">
          <InfoCard title="正确姿势" tone="accent">
            <ul className="ordered-list unordered-list">
              <li>把资源创建放到模块级 cache 或稳定的 resource factory 里。</li>
              <li>用 key 管理“什么时候应该重新请求”。</li>
              <li>把 fallback 当作边界 UI，而不是替代业务状态机。</li>
            </ul>
          </InfoCard>
          <InfoCard title="什么时候不该硬上 use()">
            <ul className="ordered-list unordered-list">
              <li>如果资源生命周期很复杂、还没设计好缓存层，先用传统 data layer 也完全合理。</li>
              <li>在仅客户端应用里，use() 更适合教学、局部资源、或已经明确缓存策略的场景。</li>
              <li>在 SSR / RSC 场景里，use() 的价值通常更大。静态 Pages 里要注意边界。</li>
            </ul>
          </InfoCard>
        </div>
      </DemoPanel>
    </SectionShell>
  )
}
