import { overviewItems } from '../data/catalog'
import { Badge, InfoCard, SectionShell } from '../components/ui'

const toneLabelMap = {
  demo: '已做交互 demo',
  explain: '仅原理说明',
  limit: '不适合纯静态 Pages',
} as const

export function OverviewSection() {
  return (
    <SectionShell
      eyebrow="全量关注点"
      title="React 19 值得关注的发布点"
      description="这里把本项目覆盖的点和没覆盖到的点都摊开说。对于 GitHub Pages 这种纯静态宿主，真正能完整演示的是客户端新 API；凡是需要服务器运行时的能力，都应该单独标明边界。"
      badges={
        <>
          <Badge tone="demo">已做交互 demo</Badge>
          <Badge tone="explain">仅原理说明</Badge>
          <Badge tone="limit">静态环境受限</Badge>
        </>
      }
    >
      <div className="overview-list">
        {overviewItems.map((item) => (
          <article key={item.name} className="overview-item">
            <div className="overview-item-header">
              <h3>{item.name}</h3>
              <Badge tone={item.status}>{toneLabelMap[item.status]}</Badge>
            </div>
            <p className="overview-summary">{item.summary}</p>
            <p className="overview-note">{item.note}</p>
          </article>
        ))}
      </div>

      <div className="content-grid two-column">
        <InfoCard title="哪些最适合在静态页学？" tone="soft">
          <p>
            最适合做 playground 的，是 <strong>表单动作</strong>、<strong>乐观更新</strong>、<strong>Suspense + use()</strong>、<strong>ref / Context / metadata / custom elements</strong> 这类纯客户端语义升级。它们不需要后端配合，就能准确体现 React 19 的 API 变化。
          </p>
        </InfoCard>
        <InfoCard title="哪些必须区分‘能讲’和‘能跑’？" tone="accent">
          <p>
            Server Components、Server Actions、streaming / static prerender / resume 这一组，必须有 Node / Edge / 框架 runtime 才能成立。纯静态站点可以介绍理念，但不能假装真实执行。
          </p>
        </InfoCard>
      </div>
    </SectionShell>
  )
}
