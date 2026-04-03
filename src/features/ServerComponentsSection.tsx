import { Badge, InfoCard, ReferenceExplorer, SectionDivider, SectionShell } from '../components/ui'
import { referenceCases } from '../data/referenceCode'
import type { LabSectionId } from '../types'

export function ServerComponentsSection({ onJump }: { onJump?: (sectionId: LabSectionId) => void }) {
  const example = referenceCases['server-components']

  return (
    <SectionShell
      eyebrow="代码案例 / 01"
      title="Server Components：把页面主体留在服务端。"
      description="这里直接看真实文件。重点不是多学一个 hook，而是看清页面主体和交互组件该怎么分工。"
      stackClassName="reference-stack"
      badges={
        <>
          <Badge tone="reference">真实代码</Badge>
          <Badge tone="limit">静态站仅展示思路</Badge>
        </>
      }
      actions={
        <button type="button" className="secondary-button" onClick={() => onJump?.('reference')}>
          返回代码案例列表
        </button>
      }
    >
      <SectionDivider title="先看代码" description={example.summary} />

      <ReferenceExplorer files={example.files} />

      <div className="grid-three">
        <InfoCard title="核心边界" tone="soft">
          <p>页面主体、数据读取和权限过滤都可以留在服务端；真正需要浏览器状态的部分，再交给 client component 处理。</p>
        </InfoCard>
        <InfoCard title="运行前提" tone="accent">
          <p>{example.environment}</p>
        </InfoCard>
        <InfoCard title="为什么静态托管跑不了" tone="soft">
          <p>{example.whyNotOnPages}</p>
        </InfoCard>
      </div>

      <div className="grid-three">
        <InfoCard title="看这组文件时先盯住什么">
          <p>先看 ProductPage.server.tsx 如何拿数据和拼页面，再看 ProductGallery.client.tsx 为什么只保留图片切换这类交互。</p>
        </InfoCard>
        <InfoCard title="什么时候最值得用">
          <p>商品页、详情页、富内容页面和权限过滤列表，往往最能感受到“少发客户端 JS”的收益。</p>
        </InfoCard>
        <InfoCard title="什么时候不该硬上">
          <p>如果当前部署环境只有纯静态托管，没有支持 RSC 的框架与服务端入口，那就先把它当作架构边界来理解。</p>
        </InfoCard>
      </div>
    </SectionShell>
  )
}
