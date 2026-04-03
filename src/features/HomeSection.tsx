import { labSections, overviewItems } from '../data/catalog'
import { Badge, InfoCard, MetricCard, SectionShell } from '../components/ui'

const demoCount = overviewItems.filter((item) => item.status === 'demo').length
const explainCount = overviewItems.filter((item) => item.status === 'explain').length
const limitCount = overviewItems.filter((item) => item.status === 'limit').length

import type { LabSectionId } from '../types'

export function HomeSection({ onJump }: { onJump: (sectionId: LabSectionId) => void }) {
  return (
    <SectionShell
      eyebrow="React 19 实验台"
      title="React 19 Playground / Feature Lab"
      description="这个页面不是普通 landing page，而是一块可部署到 GitHub Pages 的 React 19 试验板：每个条目都围绕“传统写法 vs React 19 写法”展开，并尽量给出能在纯静态环境里跑起来的交互 demo。"
      badges={
        <>
          <Badge tone="guide">纯静态 Pages 可运行</Badge>
          <Badge tone="demo">7 个交互 demo</Badge>
          <Badge tone="explain">补齐原理说明</Badge>
        </>
      }
    >
      <div className="hero-grid">
        <InfoCard title="你会在这里看到什么" tone="accent">
          <p>
            左侧导航用于切换实验主题。每个主题都尽量把 <strong>旧时代手工状态写法</strong> 与{' '}
            <strong>React 19 提供的第一等 API</strong> 摆在一起，看清楚“少了哪些胶水代码、换来了哪些语义提升”。
          </p>
        </InfoCard>
        <InfoCard title="为什么强调 GitHub Pages" tone="soft">
          <p>
            这会逼我们把服务端依赖和客户端能力分开：能在纯静态环境演示的，我都做成交互；必须依赖服务器的，就明确标成静态受限，而不是假装能跑。
          </p>
        </InfoCard>
      </div>

      <div className="metric-grid">
        <MetricCard label="交互 demo" value={`${demoCount}`} helper="核心 API 都能直接点、直接看结果" />
        <MetricCard label="原理说明" value={`${explainCount}`} helper="偏 SSR / 性能语义的点做说明补位" />
        <MetricCard label="静态受限" value={`${limitCount}`} helper="需要 server runtime 的能力单独标记" />
      </div>

      <div className="content-grid two-column">
        <InfoCard title="建议浏览顺序">
          <ol className="ordered-list">
            <li>先看 Actions / useActionState，理解 React 19 如何接管提交状态。</li>
            <li>再看 useOptimistic，理解“临时 UI”与“真实数据”如何分层。</li>
            <li>之后看 use(promise) + Suspense，注意 Promise 缓存策略。</li>
            <li>最后扫一遍 Overview，把适合静态页 / 不适合静态页的边界一起建立起来。</li>
          </ol>
        </InfoCard>

        <InfoCard title="本项目的设计原则">
          <ul className="ordered-list unordered-list">
            <li>文案以中文为主，但术语尽量和 React 官方心智对齐。</li>
            <li>所有 demo 都不依赖服务端；异步效果用本地 Promise 模拟。</li>
            <li>对“没法在 Pages 真演”的能力，直接讲清限制，不做伪演示。</li>
          </ul>
        </InfoCard>
      </div>

      <div className="section-list">
        {labSections
          .filter((section) => section.id !== 'home')
          .map((section) => (
            <button key={section.id} type="button" className="section-list-card" onClick={() => onJump(section.id)}>
              <div>
                <span className="section-list-icon">{section.icon}</span>
                <div>
                  <strong>{section.shortLabel}</strong>
                  <p>{section.title}</p>
                </div>
              </div>
              <Badge tone={section.status}>{section.status === 'demo' ? '已做 demo' : section.status === 'guide' ? '导航页' : '查看说明'}</Badge>
            </button>
          ))}
      </div>
    </SectionShell>
  )
}
