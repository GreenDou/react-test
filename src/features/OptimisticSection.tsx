import { useOptimistic, useState } from 'react'
import { sendComment } from '../lib/fakeApi'
import { Badge, CompareCard, DemoPanel, InfoCard, SectionDivider, SectionShell, StatusLine, StoryGrid } from '../components/ui'
import type { CommentRecord, CompareCardData, StoryCardItem, LabSectionId } from '../types'

const initialComments: CommentRecord[] = [
  { id: '1', author: 'Mia', text: '老写法最麻烦的是手工插临时项、手工回滚。' },
  { id: '2', author: 'Leon', text: 'useOptimistic 最大价值是把“临时层”说清楚。' },
]

const story: StoryCardItem[] = [
  {
    title: '一句话理解',
    body: '当用户点了发送，你想先让界面动起来，再等网络结果回来。useOptimistic 就是把这层“先反馈”的 UI 正式化。',
  },
  {
    title: '它解决的真实问题',
    body: '评论、点赞、消息、任务拖拽这类交互，如果每次都等服务器回完再动，页面会显得很钝。',
  },
  {
    title: '旧写法为什么麻烦',
    body: '你得手工塞一个 temp item，成功再替换，失败再删掉。并发一多，逻辑和 bug 一起长。',
  },
  {
    title: 'React 19 写法为什么更顺',
    body: '真实数据还是一份，乐观层只是临时投影。成功时更新真实数据；失败时因为真实数据没变，界面自然回去。',
  },
  {
    title: '看这个 demo 时该注意什么',
    body: '切换“模拟失败”，然后分别试旧写法和 React 19 写法。你会看到老写法在做手工回滚，useOptimistic 更像在声明“先这样看”。',
  },
  {
    title: '什么时候该用 / 不该用',
    body: '当用户很在意操作反馈速度时值得用；但如果操作失败成本极高，或者必须等服务端确认后才能展示，就别硬上乐观更新。',
  },
  {
    title: '稍微深入一点的原理',
    body: 'useOptimistic 的关键不是“更快渲染”，而是帮你把真实状态和临时视图分层。这对后续排序、分页、撤销都更健康。',
  },
]

const legacyCard: CompareCardData = {
  eyebrow: '旧写法',
  title: '自己插临时项，自己回滚',
  summary: '完全能做，但容易把“临时 UI”和“真实数据”搅成一锅。',
  bullets: ['需要 temp id。', '需要成功替换与失败删除。', '多个请求同时进行时更容易乱。'],
  code: `const temp = { id: crypto.randomUUID(), text, pending: true }
setComments((current) => [temp, ...current])

try {
  const saved = await sendComment(text)
  setComments((current) => current.map((item) => item.id === temp.id ? saved : item))
} catch {
  setComments((current) => current.filter((item) => item.id !== temp.id))
}`,
}

const optimisticCard: CompareCardData = {
  eyebrow: 'React 19',
  title: '真实状态一份，乐观视图一份',
  summary: '重点不是“少几行代码”，而是把临时层从数据源里分离出来。',
  bullets: ['真实 comments 只在成功后更新。', '失败时不用手工恢复真实列表。', '特别适合评论、点赞、消息。'],
  code: `const [optimisticComments, addOptimistic] = useOptimistic(
  comments,
  (current, text) => [{ id: 'temp', text, pending: true }, ...current],
)

addOptimistic(text)
const saved = await sendComment(text)
setComments((current) => [saved, ...current])`,
}

function CommentList({ comments }: { comments: CommentRecord[] }) {
  return (
    <ul className="comment-list">
      {comments.map((comment) => (
        <li key={comment.id} className={comment.pending ? 'comment-item comment-item-pending' : 'comment-item'}>
          <div>
            <strong>{comment.author}</strong>
            <p>{comment.text}</p>
          </div>
          {comment.pending ? <span>sending…</span> : null}
        </li>
      ))}
    </ul>
  )
}

function LegacyOptimisticDemo() {
  const [comments, setComments] = useState(initialComments)
  const [input, setInput] = useState('我想先看到界面反馈，再等接口回来。')
  const [pending, setPending] = useState(false)
  const [shouldFail, setShouldFail] = useState(false)
  const [message, setMessage] = useState('等待发送')

  async function handleSubmit() {
    if (!input.trim()) return

    const tempComment: CommentRecord = {
      id: `temp-${crypto.randomUUID().slice(0, 6)}`,
      author: '你',
      text: input,
      pending: true,
    }

    setComments((current) => [tempComment, ...current])
    setPending(true)
    setMessage('旧写法：我先手工塞了一个临时 comment。')

    try {
      const saved = await sendComment(input, shouldFail)
      setComments((current) => current.map((item) => (item.id === tempComment.id ? saved : item)))
      setMessage('发送成功：现在再手工把临时 comment 替换掉。')
      setInput('')
    } catch (error) {
      setComments((current) => current.filter((item) => item.id !== tempComment.id))
      setMessage(error instanceof Error ? error.message : '发送失败，已手工回滚。')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="stack-gap">
      <label className="checkbox-row">
        <input type="checkbox" checked={shouldFail} onChange={(event) => setShouldFail(event.target.checked)} />
        模拟失败，观察旧写法如何回滚
      </label>
      <textarea value={input} onChange={(event) => setInput(event.target.value)} rows={4} />
      <button type="button" className="secondary-button" disabled={pending} onClick={handleSubmit}>
        {pending ? '旧写法发送中…' : '用旧写法发送'}
      </button>
      <div className="result-box">
        <StatusLine label="状态" value={pending ? 'pending' : 'idle'} />
        <StatusLine label="说明" value={message} />
      </div>
      <CommentList comments={comments} />
    </div>
  )
}

function ModernOptimisticDemo() {
  const [comments, setComments] = useState(initialComments)
  const [input, setInput] = useState('useOptimistic 把临时 UI 单独抽成一层。')
  const [shouldFail, setShouldFail] = useState(false)
  const [message, setMessage] = useState('等待发送')
  const [optimisticComments, addOptimisticComment] = useOptimistic(comments, (currentComments, nextText: string) => [
    {
      id: `optimistic-${nextText}`,
      author: '你',
      text: nextText,
      pending: true,
    },
    ...currentComments,
  ])

  async function handleSubmit() {
    if (!input.trim()) return

    const nextText = input
    addOptimisticComment(nextText)
    setMessage('React 19：先生成一层乐观视图，但真实 comments 还没动。')

    try {
      const saved = await sendComment(nextText, shouldFail)
      setComments((current) => [saved, ...current])
      setMessage('发送成功：这时才更新真实 comments。')
      setInput('')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '发送失败：真实数据没变，所以 UI 自动回到原样。')
    }
  }

  return (
    <div className="stack-gap">
      <label className="checkbox-row">
        <input type="checkbox" checked={shouldFail} onChange={(event) => setShouldFail(event.target.checked)} />
        模拟失败，观察自动恢复
      </label>
      <textarea value={input} onChange={(event) => setInput(event.target.value)} rows={4} />
      <button type="button" className="primary-button" onClick={handleSubmit}>
        用 React 19 发送
      </button>
      <div className="result-box result-box-success">
        <StatusLine label="真实评论数" value={comments.length} />
        <StatusLine label="当前说明" value={message} />
      </div>
      <CommentList comments={optimisticComments} />
    </div>
  )
}

export function OptimisticSection({ onJump }: { onJump?: (sectionId: LabSectionId) => void }) {
  return (
    <SectionShell
      eyebrow="可直接体验 / 02"
      title="useOptimistic：先让界面动起来，但别把真实数据搞脏"
      description="如果你以前做过评论区、点赞、消息发送，你一定知道最烦的不是‘先显示’，而是成功和失败回来以后该怎么收场。useOptimistic 正在处理这件事。"
      stackClassName="feature-stack"
      badges={
        <>
          <Badge tone="demo">成功 / 失败都可试</Badge>
          <Badge tone="demo">自动恢复更直观</Badge>
        </>
      }
      actions={
        <button type="button" className="secondary-button" onClick={() => onJump?.('playground')}>
          返回试玩列表
        </button>
      }
    >
      <StoryGrid items={story} />

      <DemoPanel title="直接试：切换“模拟失败”后分别发一次" description="看重点：旧写法在手工维护临时 comment；React 19 写法更像在声明“先投影一个乐观视图”。">
        <div className="compare-grid">
          <InfoCard title="旧写法 demo" eyebrow="对照组">
            <LegacyOptimisticDemo />
          </InfoCard>
          <InfoCard title="React 19 demo" eyebrow="推荐写法" tone="accent">
            <ModernOptimisticDemo />
          </InfoCard>
        </div>
      </DemoPanel>

      <SectionDivider title="代码层面对比" description="看完交互以后，再看代码差异会特别明显。" />

      <div className="compare-grid">
        <CompareCard {...legacyCard} />
        <CompareCard {...optimisticCard} />
      </div>
    </SectionShell>
  )
}
