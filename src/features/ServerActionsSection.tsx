import { Badge, InfoCard, ReferenceExplorer, SectionDivider, SectionShell, StoryGrid } from '../components/ui'
import { referenceCases } from '../data/referenceCode'
import type { StoryCardItem, LabSectionId } from '../types'

const story: StoryCardItem[] = [
  { title: '一句话理解', body: 'Server Actions 解决的是：表单和 mutation 不必再手写一层 API 胶水，动作本身就可以在服务端定义。' },
  { title: '它解决的真实问题', body: '以前做一个结账表单，经常要拆成前端表单、fetch 调用、后端接口、重定向、缓存刷新好几层。' },
  { title: '旧写法为什么麻烦', body: '业务动作被切得很碎：校验在一处、写库在一处、刷新缓存在一处、跳转又在一处。读代码很难顺着业务往下看。' },
  { title: 'React 19 写法为什么更顺', body: '有了 use server，动作可以直接贴着业务写；配合 useActionState / useFormStatus，前端状态和服务端动作能对上。' },
  { title: '看这个代码案例时该注意什么', body: '先看客户端表单怎么用 useActionState，再看 actions.ts 里一个动作如何同时完成校验、写入、revalidate、redirect。' },
  { title: '什么时候该用 / 不该用', body: '如果你就在支持 Server Actions 的框架里做真实业务，非常值得用；如果只是静态站或纯前端托管环境，就只能学心智，不能真跑。' },
  { title: '稍微深入一点的原理', body: '它本质上是把“服务端函数调用”接进 React 的表单和渲染模型里，而不是一个客户端单机能力。' },
]

export function ServerActionsSection({ onJump }: { onJump?: (sectionId: LabSectionId) => void }) {
  const example = referenceCases['server-actions']

  return (
    <SectionShell
      eyebrow="代码案例 / 02"
      title="Server Actions：把 mutation 贴着业务动作写，而不是先造一个 API 外壳"
      description="这页重点不在“神奇地省几行代码”，而在于它让表单、校验、写库、缓存刷新和跳转终于能按业务顺序排在一起。"
      badges={
        <>
          <Badge tone="reference">含 use server 示例</Badge>
          <Badge tone="limit">需要服务端动作运行时</Badge>
        </>
      }
      actions={
        <button type="button" className="secondary-button" onClick={() => onJump?.('reference')}>
          返回代码案例列表
        </button>
      }
    >
      <StoryGrid items={story} />
      <div className="grid-two">
        <InfoCard title="运行前提" tone="accent">
          <p>{example.environment}</p>
        </InfoCard>
        <InfoCard title="为什么静态 Pages 跑不了">
          <p>{example.whyNotOnPages}</p>
        </InfoCard>
      </div>
      <SectionDivider title="代码案例讲解" description={example.summary} />
      <ReferenceExplorer files={example.files} />
    </SectionShell>
  )
}
