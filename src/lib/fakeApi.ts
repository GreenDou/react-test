import type { CommentRecord, ProfileRecord, SignupResult } from '../types'

const BASE_DELAY = 950

const profileDatabase: Record<string, ProfileRecord> = {
  suspense: {
    id: 'suspense',
    role: 'Suspense 边界负责人',
    focus: '加载态切分、fallback 颗粒度、资源复用',
    latency: '980ms 模拟网络延迟',
    summary: 'use(promise) 让“读取异步资源”变成 render 阶段的一部分，但 Promise 必须稳定缓存。',
    bullets: [
      'Promise 在模块级 cache 中按 key 复用，避免每次 render 都重新发请求。',
      'Suspense fallback 只负责“正在等”，而不是自己维护一堆 loading state。',
      '一旦资源命中缓存，再次切回来几乎瞬时。',
    ],
  },
  actions: {
    id: 'actions',
    role: '表单动作设计师',
    focus: '提交状态、错误回填、表单语义化',
    latency: '1200ms 模拟校验与写入',
    summary: 'React 19 的 Actions 把“提交动作”变成第一等公民，form 不必自己维护整套状态机。',
    bullets: [
      'useActionState 用于持有动作结果。',
      'useFormStatus 用于读取当前 form 的 pending / data / method。',
      'form action 让提交路径保留原生 form 语义。',
    ],
  },
  elements: {
    id: 'elements',
    role: 'Web Components 互操作观察员',
    focus: '原生组件桥接、属性映射、自定义事件',
    latency: '760ms 模拟组件装载',
    summary: 'React 19 对 Custom Elements 更友好，复杂 prop 与事件监听都比旧版更顺。',
    bullets: [
      '对象 prop 更容易直接落到 DOM 实例属性。',
      '自定义事件可在 JSX 中直接绑定。',
      '更适合逐步引入设计系统或第三方 web component。',
    ],
  },
}

export async function sleep(ms: number) {
  await new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export async function submitLabSignup(values: {
  name: string
  email: string
  track: string
}): Promise<SignupResult> {
  await sleep(BASE_DELAY + 250)

  if (!values.name.trim()) {
    return {
      status: 'error',
      message: '请填写姓名，方便把实验记录关联到提交者。',
      values,
    }
  }

  if (!values.email.includes('@')) {
    return {
      status: 'error',
      message: '邮箱格式不对；这是为了演示 Action 的错误回显。',
      values,
    }
  }

  if (!values.email.endsWith('@react-lab.dev')) {
    return {
      status: 'error',
      message: 'Demo 里要求使用 @react-lab.dev 域名，用来模拟服务端校验。',
      values,
    }
  }

  return {
    status: 'success',
    message: `已把 ${values.name} 加入 ${values.track} 体验队列。`,
    receiptId: `LAB-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    values,
  }
}

export async function sendComment(text: string, shouldFail: boolean): Promise<CommentRecord> {
  await sleep(BASE_DELAY - 200)

  if (shouldFail) {
    throw new Error('模拟失败：网络写入被拒绝，方便观察回滚。')
  }

  return {
    id: `c-${crypto.randomUUID().slice(0, 8)}`,
    author: '你',
    text,
  }
}

export async function fetchProfileRecord(profileId: string): Promise<ProfileRecord> {
  await sleep(BASE_DELAY)
  return profileDatabase[profileId] ?? profileDatabase.suspense
}
