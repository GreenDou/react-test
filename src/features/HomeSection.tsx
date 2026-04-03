import { JumpCard, SectionDivider, SectionShell } from '../components/ui'
import type { LabSectionId } from '../types'

export function HomeSection({ onJump }: { onJump: (sectionId: LabSectionId) => void }) {
  return (
    <SectionShell
      eyebrow="React 19 Feature Lab"
      title="看清 React 19，从最值得上手的变化开始。"
      description="这个站把浏览器里能直接体验的能力，与需要服务端支持的能力分开整理。先建立直觉，再看真实代码和运行边界。"
      actions={
        <>
          <button type="button" className="primary-button" onClick={() => onJump('playground')}>
            先看可体验内容
          </button>
          <button type="button" className="secondary-button" onClick={() => onJump('reference')}>
            再看代码案例
          </button>
        </>
      }
    >
      <div className="grid-three">
        <JumpCard
          title="可直接体验"
          summary="Actions、useOptimistic、Suspense 等变化都可以直接动手试。"
          meta="适合先建立对 React 19 的第一手直觉。"
          onClick={() => onJump('playground')}
        />
        <JumpCard
          title="代码案例"
          summary="Server Components、Server Actions 和 hydration 更适合直接看实现边界。"
          meta="适合关心服务端、SSR 和框架落地的人。"
          onClick={() => onJump('reference')}
        />
        <JumpCard
          title="特性地图"
          summary="把哪些能直接试、哪些该看代码、各自需要什么运行时一次讲清。"
          meta="适合在最后收束全貌，快速建立边界感。"
          onClick={() => onJump('map')}
        />
      </div>

      <SectionDivider title="从哪里开始" description="第一次打开，通常先走这两步最顺。" />

      <div className="grid-two">
        <JumpCard
          title="起点一：Actions"
          summary="先看 React 19 如何把表单提交、pending 和结果收回到一条更自然的链路里。"
          meta="这是最容易马上感受到差异的一个页面。"
          onClick={() => onJump('actions')}
        />
        <JumpCard
          title="起点二：Server Components"
          summary="再切到服务端案例，理解哪些代码本来就不该进浏览器。"
          meta="看完这个，再回头看其它服务端能力会更有方向。"
          onClick={() => onJump('server-components')}
        />
      </div>
    </SectionShell>
  )
}
