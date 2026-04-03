import { Badge, InfoCard, JumpCard, SectionDivider, SectionShell } from '../components/ui'
import { featureMapItems } from '../data/catalog'
import type { LabSectionId } from '../types'

export function OverviewSection({ onJump }: { onJump: (sectionId: LabSectionId) => void }) {
  return (
    <SectionShell
      eyebrow="特性地图"
      title="把能直接体验的、该看代码的和运行边界放在一张图里。"
      description="这页不是单纯列功能名，而是把每个特性适合怎么理解、需要什么环境一起标出来。"
    >
      <div className="grid-two">
        <InfoCard title="怎么读这张图" tone="accent">
          <ol className="ordered-list">
            <li>先看它是“可直接体验”还是“看代码讲解”。</li>
            <li>再看真正落地时需要什么运行环境。</li>
            <li>最后点进对应页面继续深入。</li>
          </ol>
        </InfoCard>
        <InfoCard title="先记住的边界" tone="soft">
          <ul className="bullet-list compact-list">
            <li>纯客户端能力：这个站里就能亲手试。</li>
            <li>服务端 / SSR 能力：这里给你真实代码，但不会假装能在线跑。</li>
            <li>React 19 的变化不只是一组新 API，也包括客户端和服务端职责的重新划分。</li>
          </ul>
        </InfoCard>
      </div>

      <SectionDivider title="特性总览" description="点任意一项都可以继续深入。" />

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
