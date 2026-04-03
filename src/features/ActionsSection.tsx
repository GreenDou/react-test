import { useActionState, useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useFormStatus } from 'react-dom'
import { submitLabSignup } from '../lib/fakeApi'
import { Badge, CompareCard, DemoPanel, InfoCard, SectionDivider, SectionShell, StatusLine, StoryGrid } from '../components/ui'
import type { CompareCardData, SignupResult, StoryCardItem, LabSectionId } from '../types'

const initialSignupState: SignupResult = {
  status: 'idle',
  message: '先提交一次试试。故意保留了邮箱校验，方便你观察失败时的回显。',
}

const story: StoryCardItem[] = [
  {
    title: '一句话理解',
    body: '它解决的是“表单提交流程总是散在很多 useState 里”这个问题。React 19 想把提交动作重新收回到 form 自己的语义里。',
  },
  {
    title: '它解决的真实问题',
    body: '真实业务里最烦的不是发请求本身，而是 pending、错误、成功结果、按钮禁用、提交数据回显经常分散在多个地方。',
  },
  {
    title: '旧写法为什么麻烦',
    body: 'onSubmit 里要手动阻止默认事件、组装 FormData、维护 pending、再把结果塞回不同状态。表单一多，就很像在手写小型状态机。',
  },
  {
    title: 'React 19 写法为什么更顺',
    body: 'Action 负责“做事”，useActionState 负责“拿结果”，useFormStatus 负责“读当前表单状态”。职责分开了，代码自然就顺。',
  },
  {
    title: '看这个 demo 时该注意什么',
    body: '先故意用错误邮箱提交一次，再改成 @react-lab.dev。你会看到同样是表单提交，React 19 写法更自然地表达了 pending 和结果。',
  },
  {
    title: '什么时候该用 / 不该用',
    body: '只要是表单提交流程，几乎都值得先考虑这套写法；但如果只是一个普通按钮触发的异步操作，不一定非得硬套 form action。',
  },
  {
    title: '稍微深入一点的原理',
    body: '这套模型的厉害之处在于它不只服务于纯客户端 demo，将来接入 Server Actions 时，心智模型几乎可以直接沿用。',
  },
]

const legacyCard: CompareCardData = {
  eyebrow: '旧写法',
  title: '事件处理器里自己拼完整提交流程',
  summary: '能用，但很容易越写越散。',
  bullets: ['pending、result、error 往往分成多段状态。', '按钮和结果提示通常要自己手动同步。', '表单越多，重复代码越明显。'],
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
  title: '把动作、结果、提交状态拆开表达',
  summary: '不是把事情搞复杂，而是把原本混在一起的职责拆清楚。',
  bullets: ['Action 只描述“怎么提交”。', 'useActionState 持有上一次动作结果。', 'useFormStatus 只关心当前 form 正在发生什么。'],
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
        {pending ? '旧写法提交中…' : '用旧写法提交'}
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
        {status.pending ? 'React 19 提交中…' : '用 React 19 提交'}
      </button>
      <p className="muted-text">useFormStatus 读到的提交人：{name || '—'}</p>
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
      title="Actions：表单终于不用每次都自己手搓提交流程"
      description="这页故意先讲人话：你平时最痛的不是表单能不能提交，而是提交前后那一串状态总是写得又散又重复。React 19 就是在收这笔债。"
      badges={
        <>
          <Badge tone="demo">可在线试错</Badge>
          <Badge tone="demo">错误回显清晰</Badge>
          <Badge tone="demo">同页对比旧写法</Badge>
        </>
      }
      actions={
        <button type="button" className="secondary-button" onClick={() => onJump?.('playground')}>
          返回试玩列表
        </button>
      }
    >
      <StoryGrid items={story} />

      <DemoPanel title="直接试：先提交失败，再提交成功" description="你可以先保持默认邮箱，看看失败如何回到 UI；再改成 @react-lab.dev，观察成功后的回执和表单状态。">
        <div className="compare-grid">
          <InfoCard title="旧写法 demo" eyebrow="对照组">
            <LegacyFormDemo />
          </InfoCard>
          <InfoCard title="React 19 demo" eyebrow="推荐写法" tone="accent">
            <ActionFormDemo />
          </InfoCard>
        </div>
      </DemoPanel>

      <SectionDivider title="代码层面对比" description="看完交互，再回头看代码，你会更容易明白“少的到底是什么”。" />

      <div className="compare-grid">
        <CompareCard {...legacyCard} />
        <CompareCard {...actionCard} />
      </div>
    </SectionShell>
  )
}
