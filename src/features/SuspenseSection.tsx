import { Suspense, use, useState } from 'react'
import { getProfileCacheKeys, getProfileResource } from '../lib/resources'
import { Badge, CompareCard, DemoPanel, InfoCard, SectionDivider, SectionShell, StoryGrid } from '../components/ui'
import type { CompareCardData, StoryCardItem, LabSectionId } from '../types'

const story: StoryCardItem[] = [
  {
    title: '一句话理解',
    body: 'use() + Suspense 解决的是“等异步资源”这件事怎么声明式地写，而不是每个组件都自己维护 loading / error / data 三件套。',
  },
  {
    title: '它解决的真实问题',
    body: '一旦页面上有多个异步资源，传统写法就很容易把组件写成状态堆。你还得额外考虑竞态、闪烁、取消请求。',
  },
  {
    title: '旧写法为什么麻烦',
    body: '通常要先 render 空态，再在 useEffect 里发请求，然后手动切 loading、塞 data、处理 error。这样的模板代码会反复出现。',
  },
  {
    title: 'React 19 写法为什么更顺',
    body: 'Suspense 负责“等一下”，use() 负责“读取这个资源”。只要 Promise 是稳定缓存的，你就能把等待逻辑从组件状态里拿出去。',
  },
  {
    title: '看这个 demo 时该注意什么',
    body: '切换资源 key，再点“强制新建资源”。重点观察：同一个 key 再次读取会命中缓存，不会每次都重新等。',
  },
  {
    title: '什么时候该用 / 不该用',
    body: '如果你已经有稳定的资源缓存层，它会很好用；如果缓存策略还没想清楚，先用普通数据层并不丢人。',
  },
  {
    title: '稍微深入一点的原理',
    body: '客户端 use() 真正的难点不是 API 本身，而是 Promise 生命周期。每次 render 都 new 一个 Promise，Suspense 就永远等不到稳定结果。',
  },
]

const legacyCard: CompareCardData = {
  eyebrow: '旧写法',
  title: 'useEffect + loading + data + error',
  summary: '不是错，而是容易模板化、碎片化。',
  bullets: ['先渲染空态，再在 effect 里发请求。', 'loading / data / error 很容易成套复制。', '多个资源一起出现时复杂度上涨很快。'],
  code: `useEffect(() => {
  let cancelled = false
  setLoading(true)
  fetchProfile(id).then((data) => {
    if (!cancelled) setData(data)
  })
  return () => { cancelled = true }
}, [id])`,
}

const modernCard: CompareCardData = {
  eyebrow: 'React 19',
  title: 'use(promise) 直接读资源，但要缓存稳定',
  summary: '这套写法的门槛不在 use()，而在“你有没有把资源设计成可复用的”。',
  bullets: ['Suspense 管等待中的 UI。', 'use() 负责读取资源。', '稳定 cache 决定它能不能跑稳。'],
  code: `const profile = use(getProfileResource(profileId, revision))

<Suspense fallback={<Skeleton />}>
  <ProfileCard profileId={profileId} revision={revision} />
</Suspense>`,
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
      <ul className="bullet-list compact-list">
        {profile.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
      <div className="tag-row">
        <span className="mini-tag">{profile.id}</span>
        <span className="mini-tag">{profile.focus}</span>
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

export function SuspenseSection({ onJump }: { onJump?: (sectionId: LabSectionId) => void }) {
  const [profileId, setProfileId] = useState('suspense')
  const [revision, setRevision] = useState(0)

  return (
    <SectionShell
      eyebrow="可直接体验 / 03"
      title="use() + Suspense：不是“在 render 里乱 fetch”，而是“稳定地读资源”"
      description="这一页最容易被讲玄学，所以我特意把重点落在缓存纪律上：use() 真正值钱的前提，是你先把 Promise 生命周期设计对。"
      stackClassName="feature-stack"
      badges={
        <>
          <Badge tone="demo">可切换缓存 key</Badge>
          <Badge tone="demo">可强制新建资源</Badge>
          <Badge tone="reference">SSR 场景价值更大</Badge>
        </>
      }
      actions={
        <button type="button" className="secondary-button" onClick={() => onJump?.('playground')}>
          返回试玩列表
        </button>
      }
    >
      <StoryGrid items={story} />

      <DemoPanel title="直接试：切换 key，看缓存怎么命中" description="同一个 key 时会复用缓存；点“强制新建资源”则会重新走一次等待。这个 demo 就是为了把 Promise 生命周期讲清楚。">
        <div className="grid-two">
          <InfoCard title="交互区" tone="accent">
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
              <p className="muted-text">当前缓存键：{getProfileCacheKeys().join(' / ') || '还没有缓存'}</p>
              <Suspense fallback={<LoadingProfileCard />}>
                <ProfileCard profileId={profileId} revision={revision} />
              </Suspense>
            </div>
          </InfoCard>
          <InfoCard title="看 demo 时建议盯住这三点">
            <ol className="ordered-list">
              <li>不是每次 render 都会重新等，关键看 key 是否复用。</li>
              <li>fallback 只负责“等一下”，不再由业务组件自己维护 loading 细节。</li>
              <li>这个模式在 SSR / RSC 里通常更有价值，静态页这里只是把心智练熟。</li>
            </ol>
          </InfoCard>
        </div>
      </DemoPanel>

      <SectionDivider title="代码层面对比" description="真正的差异不只是少几个 useState，而是“谁来负责等待”。" />

      <div className="compare-grid">
        <CompareCard {...legacyCard} />
        <CompareCard {...modernCard} />
      </div>
    </SectionShell>
  )
}
