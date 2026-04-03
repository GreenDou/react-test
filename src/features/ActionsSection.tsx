import { useActionState, useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useFormStatus } from 'react-dom'
import { submitLabSignup } from '../lib/fakeApi'
import { Badge, CompareCard, DemoPanel, InfoCard, SectionShell, StatusLine } from '../components/ui'
import type { CompareCardData, SignupResult } from '../types'

const initialSignupState: SignupResult = {
  status: 'idle',
  message: '等待提交。试试故意填错邮箱域名，看看错误如何回到 UI。',
}

const legacyCard: CompareCardData = {
  eyebrow: '传统写法',
  title: '事件处理器里手工拼状态机',
  summary: '常见做法是阻止默认提交、手动 new FormData、自己维护 pending / result / error 三段状态。',
  bullets: [
    '好处是完全显式，坏处是样板代码会迅速堆起来。',
    '提交按钮、表单结果、输入回填通常分散在不同 useState 里。',
    '如果表单很多，状态更新路径容易散。',
  ],
  code: `const [pending, setPending] = useState(false)\nconst [result, setResult] = useState(null)\n\nasync function handleSubmit(event) {\n  event.preventDefault()\n  setPending(true)\n  const formData = new FormData(event.currentTarget)\n  const next = await submit(formData)\n  setResult(next)\n  setPending(false)\n}`,
}

const actionCard: CompareCardData = {
  eyebrow: 'React 19 写法',
  title: '把 form action 交给 React 管理',
  summary: 'Action 本身就是异步提交逻辑，useActionState 持有结果，useFormStatus 读取当前 form 的提交状态。',
  bullets: [
    'form 继续保留原生语义，而不是全靠 onSubmit 劫持。',
    '提交中的 FormData 可以在 useFormStatus 里直接读到。',
    '同一套 Action 语义也能平滑迁移到 Server Actions。',
  ],
  code: `const [state, formAction, isPending] = useActionState(async (_, formData) => {\n  return submit(formData)\n}, initialState)\n\n<form action={formAction}>\n  <SubmitButton />\n</form>`,
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
      track: String(formData.get('track') ?? 'Actions'),
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
        Track
        <select name="track" defaultValue="Actions 深度体验">
          <option>Actions 深度体验</option>
          <option>Suspense 快速体验</option>
          <option>Web Components 互操作</option>
        </select>
      </label>
      <button type="submit" className="primary-button" disabled={pending}>
        {pending ? '提交中…' : '传统提交'}
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
    <div className="action-submit-wrap">
      <button type="submit" className="primary-button" disabled={status.pending}>
        {status.pending ? 'Action 提交中…' : 'React 19 Action 提交'}
      </button>
      <p className="muted-text">useFormStatus 捕获的提交者：{name || '—'}</p>
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
        track: String(formData.get('track') ?? 'Actions'),
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
        Track
        <select name="track" defaultValue="Actions 深度体验">
          <option>Actions 深度体验</option>
          <option>Suspense 快速体验</option>
          <option>Web Components 互操作</option>
        </select>
      </label>
      <ActionSubmitButton />
      <div className={`result-box result-box-${tone}`}>
        <StatusLine label="Action 状态" value={isPending ? 'pending' : state.status} />
        <StatusLine label="反馈" value={state.message} />
        <StatusLine label="回执" value={state.receiptId ?? '尚未生成'} />
      </div>
    </form>
  )
}

export function ActionsSection() {
  return (
    <SectionShell
      eyebrow="Feature 01"
      title="Actions + useActionState + useFormStatus"
      description="React 19 把 form action、提交状态和异步结果收拢成一套统一语义。这个 demo 故意保留了‘错误邮箱域名’的场景，好让你直观看到旧写法和新写法分别怎么表达提交过程。"
      badges={
        <>
          <Badge tone="demo">客户端异步表单 demo</Badge>
          <Badge tone="demo">useActionState</Badge>
          <Badge tone="demo">useFormStatus</Badge>
        </>
      }
    >
      <div className="compare-grid">
        <CompareCard {...legacyCard}>
          <LegacyFormDemo />
        </CompareCard>
        <CompareCard {...actionCard}>
          <ActionFormDemo />
        </CompareCard>
      </div>

      <DemoPanel
        title="怎么理解这组 API"
        description="如果把表单提交看成一条状态流，React 19 的重点不是‘少写几行代码’，而是把提交这个行为重新放回表单语义中心。"
      >
        <div className="content-grid two-column">
          <InfoCard title="旧模型的问题">
            <ul className="ordered-list unordered-list">
              <li>提交动作和组件状态搅在一起，UI 事件处理器越来越臃肿。</li>
              <li>按钮 pending、结果提示、错误提示各有一套状态同步逻辑。</li>
              <li>迁移到服务端动作时，心智模型往往要重写一遍。</li>
            </ul>
          </InfoCard>
          <InfoCard title="React 19 带来的变化" tone="accent">
            <ul className="ordered-list unordered-list">
              <li>Action 负责“做什么”，useActionState 负责“结果是什么”。</li>
              <li>useFormStatus 只关心当前 form 的实时状态，按钮组件因此能写得非常局部。</li>
              <li>纯静态页面也能先学会这套语义，将来接入 Server Actions 时迁移成本更小。</li>
            </ul>
          </InfoCard>
        </div>
      </DemoPanel>
    </SectionShell>
  )
}
