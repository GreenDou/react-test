import { useActionState, useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useFormStatus } from 'react-dom'
import { Badge, CompareCard, DemoPanel, InfoCard, SectionDivider, SectionShell, StatusLine } from '../components/ui'
import { submitLabSignup } from '../lib/fakeApi'
import type { CompareCardData, SignupResult, LabSectionId } from '../types'

const initialSignupState: SignupResult = {
  status: 'idle',
  message: '提交一次看看状态如何回到界面里。',
}

const legacyCard: CompareCardData = {
  eyebrow: '旧写法',
  title: '在事件处理器里手动拼完整提交流程',
  summary: '能用，但 pending、结果和错误很容易越写越散。',
  bullets: ['需要手动阻止默认提交。', '表单状态往往拆成多段 useState。', '按钮禁用、结果提示和错误回显都要自己同步。'],
  code: `const [pending, setPending] = useState(false)
const [result, setResult] = useState(null)

async function handleSubmit(event) {
  event.preventDefault()
  setPending(true)
  const formData = new FormData(event.currentTarget)
  const next = await submit(formData)
  setResult(next)
  setPending(false)
}`,
}

const actionCard: CompareCardData = {
  eyebrow: 'React 19',
  title: '把动作、结果和提交状态拆开表达',
  summary: '逻辑没有变少很多，但职责更清楚了。',
  bullets: ['Action 只描述“怎么提交”。', 'useActionState 持有上一次提交结果。', 'useFormStatus 只关心当前 form 正在发生什么。'],
  code: `const [state, formAction] = useActionState(async (_, formData) => {
  return submit(formData)
}, initialState)

<form action={formAction}>
  <SubmitButton />
</form>`,
}

function LegacyFormDemo() {
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<SignupResult>(initialSignupState)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)

    const formData = new FormData(event.currentTarget)
    const nextResult = await submitLabSignup({
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      track: String(formData.get('track') ?? 'Action 入门演示'),
    })

    setResult(nextResult)
    setPending(false)
  }

  return (
    <form className="lab-form" onSubmit={handleSubmit}>
      <label>
        姓名
        <input name="name" placeholder="Ada Lovelace" defaultValue="Ada" />
      </label>
      <label>
        邮箱
        <input name="email" placeholder="ada@react-lab.dev" defaultValue="ada@example.com" />
      </label>
      <label>
        你最想先看什么
        <select name="track" defaultValue="Action 入门演示">
          <option>Action 入门演示</option>
          <option>乐观更新</option>
          <option>Suspense</option>
        </select>
      </label>
      <button type="submit" className="secondary-button" disabled={pending}>
        {pending ? '提交中…' : '旧写法提交'}
      </button>
      <div className="result-box">
        <StatusLine label="当前状态" value={pending ? 'pending' : result.status} />
        <StatusLine label="反馈" value={result.message} />
      </div>
    </form>
  )
}

function ActionSubmitButton() {
  const status = useFormStatus()
  const name = status.pending ? String(status.data?.get('name') ?? '') : '—'

  return (
    <div className="action-row align-left">
      <button type="submit" className="primary-button" disabled={status.pending}>
        {status.pending ? '提交中…' : 'React 19 提交'}
      </button>
      <p className="muted-text">当前提交人：{name || '—'}</p>
    </div>
  )
}

function ActionFormDemo() {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction, isPending] = useActionState(
    async (_previousState: SignupResult, formData: FormData) => {
      return submitLabSignup({
        name: String(formData.get('name') ?? ''),
        email: String(formData.get('email') ?? ''),
        track: String(formData.get('track') ?? 'Action 入门演示'),
      })
    },
    initialSignupState,
  )

  useEffect(() => {
    if (state.status === 'success') {
      formRef.current?.reset()
    }
  }, [state])

  const tone = useMemo(() => (state.status === 'error' ? 'error' : state.status === 'success' ? 'success' : 'idle'), [state.status])

  return (
    <form className="lab-form" action={formAction} ref={formRef}>
      <label>
        姓名
        <input name="name" placeholder="Ada Lovelace" defaultValue="Ada" />
      </label>
      <label>
        邮箱
        <input name="email" placeholder="ada@react-lab.dev" defaultValue="ada@example.com" />
      </label>
      <label>
        你最想先看什么
        <select name="track" defaultValue="Action 入门演示">
          <option>Action 入门演示</option>
          <option>乐观更新</option>
          <option>Suspense</option>
        </select>
      </label>
      <ActionSubmitButton />
      <div className={`result-box result-box-${tone}`}>
        <StatusLine label="Action 状态" value={isPending ? 'pending' : state.status} />
        <StatusLine label="反馈" value={state.message} />
        <StatusLine label="回执号" value={state.receiptId ?? '尚未生成'} />
      </div>
    </form>
  )
}

export function ActionsSection({ onJump }: { onJump?: (sectionId: LabSectionId) => void }) {
  return (
    <SectionShell
      eyebrow="可直接体验 / 01"
      title="Actions：让表单提交回到 form 语义。"
      description="React 19 没有重新发明表单，它只是把原本散落在事件处理器里的那一串状态，重新放回一条更自然的提交流程。"
      stackClassName="feature-stack"
      badges={<Badge tone="demo">可直接体验</Badge>}
      actions={
        <button type="button" className="secondary-button" onClick={() => onJump?.('playground')}>
          返回试玩列表
        </button>
      }
    >
      <DemoPanel title="直接试一遍" description="默认邮箱会失败；改成 @react-lab.dev 会成功返回回执号。先看界面状态怎么变化，再回头看代码。">
        <div className="compare-grid">
          <InfoCard title="旧写法" eyebrow="对照组">
            <LegacyFormDemo />
          </InfoCard>
          <InfoCard title="React 19" eyebrow="推荐写法" tone="accent">
            <ActionFormDemo />
          </InfoCard>
        </div>
      </DemoPanel>

      <div className="grid-three">
        <InfoCard title="表单还是 form" tone="soft">
          <p>动作挂回 action 之后，提交链路仍然保留原生表单的语义，不必从一开始就把它拆成纯事件处理器。</p>
        </InfoCard>
        <InfoCard title="结果贴着动作返回" tone="soft">
          <p>上一次提交结果由 useActionState 持有，成功、失败和回执可以自然回到当前表单，而不是分散在多个状态里。</p>
        </InfoCard>
        <InfoCard title="pending 单独读取" tone="soft">
          <p>useFormStatus 只管当前 form 的提交状态。按钮禁用、文案变化和提交中的附加信息都能贴着按钮表达。</p>
        </InfoCard>
      </div>

      <SectionDivider title="代码层面对比" description="看完交互，再看少掉的到底是什么。" />

      <div className="compare-grid">
        <CompareCard {...legacyCard} />
        <CompareCard {...actionCard} />
      </div>
    </SectionShell>
  )
}
