import { featureMapItems } from '../data/catalog'
import { Badge, InfoCard, JumpCard, SectionDivider, SectionShell } from '../components/ui'
import type { LabSectionId } from '../types'

export function OverviewSection({ onJump }: { onJump: (sectionId: LabSectionId) => void }) {
  return (
    <SectionShell
      eyebrow="完整特性地图"
      title="最后用一张图，把 React 19 这次到底该关注什么讲清楚"
      description="这张地图的重点不是‘列全’，而是把运行方式一起列全：哪些是纯静态 Pages 也能演的，哪些应该看代码，哪些又更适合在 SSR / 服务端框架里理解。"
      badges={
        <>
          <Badge tone="demo">可直接体验</Badge>
          <Badge tone="reference">看代码讲解</Badge>
        </>
      }
    >
      <div className="grid-two">
        <InfoCard title="怎么读这张地图" tone="accent">
          <ol className="ordered-list">
            <li>先看 run mode：它告诉你当前站里是“可玩”还是“可看代码”。</li>
            <li>再看 environment：它告诉你真正落地时需要什么宿主。</li>
            <li>最后点进对应页面，看详细解释或 demo。</li>
          </ol>
        </InfoCard>
        <InfoCard title="一眼记住的边界" tone="soft">
          <ul className="bullet-list">
            <li>纯客户端能力：这里就能跑。</li>
            <li>服务端 / SSR 能力：这里给你真代码，但不伪装成在线 demo。</li>
            <li>React 19 的价值不只是一批 hooks，而是把客户端与服务端的职责划分得更清楚。</li>
          </ul>
        </InfoCard>
      </div>

      <SectionDivider title="特性总览" description="点击任一条都可以继续深入。" />

      <div className="map-list">
        {featureMapItems.map((item) => (
          <JumpCard
            key={item.name}
            title={item.name}
            summary={item.summary}
            meta={`${item.runMode} · ${item.environment} · ${item.whyItMatters}`}
            badge={<Badge tone={item.runMode === '可直接体验' ? 'demo' : 'reference'}>{item.runMode}</Badge>}
            onClick={() => onJump(item.sectionId)}
          />
        ))}
      </div>
    </SectionShell>
  )
}
