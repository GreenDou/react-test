import { featureMapItems } from '../data/catalog'
import { Badge, JumpCard, MiniStat, SectionDivider, SectionShell } from '../components/ui'
import type { LabSectionId } from '../types'

const interactiveCount = featureMapItems.filter((item) => item.runMode === '可直接体验').length
const referenceCount = featureMapItems.filter((item) => item.runMode === '看代码讲解').length

export function HomeSection({ onJump }: { onJump: (sectionId: LabSectionId) => void }) {
  return (
    <SectionShell
      eyebrow="React 19 Feature Lab"
      title="把 React 19 的试玩能力和服务端能力分开看，会更容易真正看懂"
      description="React 19 Feature Lab 是一个面向 GitHub Pages 的实验站：能在浏览器里直接体验的能力放进可运行 demo，更依赖服务端与 SSR 的能力则用真实项目代码来讲。"
      badges={
        <>
          <Badge tone="demo">在线试玩</Badge>
          <Badge tone="reference">代码案例</Badge>
          <Badge tone="guide">完整特性地图</Badge>
        </>
      }
      actions={
        <>
          <button type="button" className="primary-button" onClick={() => onJump('playground')}>
            从试玩开始
          </button>
          <button type="button" className="secondary-button" onClick={() => onJump('reference')}>
            查看代码案例
          </button>
        </>
      }
    >
      <div className="grid-three">
        <MiniStat value={`${interactiveCount}`} label="可直接试玩" helper="保留了所有适合放在静态站里的 React 19 demo。" />
        <MiniStat value={`${referenceCount}`} label="代码案例" helper="服务端、SSR、hydration 等能力改用真实代码讲解。" />
        <MiniStat value="1 张" label="特性地图" helper="最后用总览页把运行边界和学习路线收束起来。" />
      </div>

      <SectionDivider title="适合怎么逛" description="第一次来看，按这条路线最省力。" />

      <div className="grid-three">
        <JumpCard
          title="先看：可直接体验"
          summary="从 Actions、useOptimistic、use() + Suspense 开始，先感受 React 19 在表单、异步和状态流上的变化。"
          meta="适合第一次接触 React 19，想先上手感受差异。"
          badge={<Badge tone="demo">推荐起点</Badge>}
          onClick={() => onJump('playground')}
        />
        <JumpCard
          title="再看：代码案例"
          summary="Server Components、Server Actions、服务端输出 API、资源编排、hydration 都放进真实文件里讲。"
          meta="适合关心 SSR、Next.js、服务端框架或大型应用的人。"
          badge={<Badge tone="reference">看真代码</Badge>}
          onClick={() => onJump('reference')}
        />
        <JumpCard
          title="最后看：完整特性地图"
          summary="用一张总览把哪些能直接玩、哪些更适合看代码、各自需要什么环境一次讲清楚。"
          meta="适合最后建立全貌与边界感。"
          badge={<Badge tone="guide">收束全貌</Badge>}
          onClick={() => onJump('map')}
        />
      </div>

      <SectionDivider title="这站包含什么" description="内容只围绕 React 19 Feature Lab 本身。" />

      <div className="grid-two">
        <JumpCard
          title="哪些能直接试玩"
          summary="Actions、useOptimistic、use() + Suspense、ref as prop、Context provider 简化、metadata、Web Components。"
          meta="这些都能在 GitHub Pages 上真实运行。"
          badge={<Badge tone="demo">浏览器内可体验</Badge>}
          onClick={() => onJump('playground')}
        />
        <JumpCard
          title="哪些更适合看代码和原理"
          summary="Server Components、Server Actions、prerender / stream / resume、preload / preinit / preconnect、hydration。"
          meta="这些页面会解释运行前提，并展示仓库里的真实代码片段。"
          badge={<Badge tone="reference">更依赖宿主</Badge>}
          onClick={() => onJump('reference')}
        />
      </div>
    </SectionShell>
  )
}
