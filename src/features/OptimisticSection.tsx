import { useOptimistic, useState } from 'react'
import { sendComment } from '../lib/fakeApi'
import { Badge, CompareCard, DemoPanel, InfoCard, SectionShell, StatusLine } from '../components/ui'
import type { CommentRecord, CompareCardData } from '../types'

const initialComments: CommentRecord[] = [
  { id: '1', author: 'Mia', text: '旧写法通常要自己维护 temp id 和回滚。' },
  { id: '2', author: 'Leon', text: 'React 19 终于把 optimistic UI 拉成正式 API。' },
]

const legacyCard: CompareCardData = {
  eyebrow: '传统写法',
  title: '手工维护临时项、成功替换、失败回滚',
  summary: '最常见方案是自己往数组里塞一个 pending comment，再根据网络结果 replace / rollback。',
  bullets: [
    '临时 id、pending 标记、失败清理都要自己写。',
    '一旦多个并发提交叠在一起，逻辑很快变复杂。',
    '“视觉上立刻反馈”与“最终真实数据”混成一套状态。',
  ],
  code: `const temp = { id: crypto.randomUUID(), text, pending: true }\nsetComments((current) => [temp, ...current])\n\ntry {\n  const saved = await sendComment(text)\n  setComments((current) => current.map((item) => item.id === temp.id ? saved : item))\n} catch {\n  setComments((current) => current.filter((item) => item.id !== temp.id))\n}`,
}

const optimisticCard: CompareCardData = {
  eyebrow: 'React 19 写法',
  title: '真实数据一份，乐观层一份',
  summary: 'useOptimistic 会基于真实状态“临时投影”出一个乐观视图，网络落地后再更新真实状态。',
  bullets: [
    '把 optimistic UI 明确成“派生层”，而不是污染真实数据源。',
    '失败时不用手工回滚临时数组，真实状态没改就会自动恢复。',
    '对点赞、消息、评论这类交互特别合适。',
  ],
  code: `const [optimisticComments, addOptimistic] = useOptimistic(\n  comments,\n  (current, text) => [{ id: 'temp', text, pending: true }, ...current],\n)\n\naddOptimistic(text)\nconst saved = await sendComment(text)\nsetComments((current) => [saved, ...current])`,
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
  const [input, setInput] = useState('我想先看到 UI，再等接口回来。')
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
    setMessage('已经手工插入临时 comment，等待接口结果…')

    try {
      const saved = await sendComment(input, shouldFail)
      setComments((current) => current.map((item) => (item.id === tempComment.id ? saved : item)))
      setMessage('发送成功：手工把 temp comment 替换成真实 comment。')
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
        模拟失败，观察手工回滚
      </label>
      <textarea value={input} onChange={(event) => setInput(event.target.value)} rows={4} />
      <button type="button" className="primary-button" disabled={pending} onClick={handleSubmit}>
        {pending ? '发送中…' : '传统 optimistic 发送'}
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
  const [input, setInput] = useState('useOptimistic 把临时 UI 抽成了专门的一层。')
  const [shouldFail, setShouldFail] = useState(false)
  const [message, setMessage] = useState('等待发送')
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (currentComments, nextText: string) => [
      {
        id: `optimistic-${nextText}`,
        author: '你',
        text: nextText,
        pending: true,
      },
      ...currentComments,
    ],
  )

  async function handleSubmit() {
    if (!input.trim()) return

    const nextText = input
    addOptimisticComment(nextText)
    setMessage('optimistic layer 已生成，真实 comments 还没更新。')

    try {
      const saved = await sendComment(nextText, shouldFail)
      setComments((current) => [saved, ...current])
      setMessage('发送成功：现在才更新真实 comments。')
      setInput('')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '发送失败：因为真实数据没变，乐观层会自动消失。')
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
        React 19 optimistic 发送
      </button>
      <div className="result-box result-box-success">
        <StatusLine label="真实评论数" value={comments.length} />
        <StatusLine label="当前说明" value={message} />
      </div>
      <CommentList comments={optimisticComments} />
    </div>
  )
}

export function OptimisticSection() {
  return (
    <SectionShell
      eyebrow="Feature 02"
      title="useOptimistic"
      description="乐观 UI 的关键不是“先渲染出来”这么简单，而是把‘临时乐观层’和‘真正持久层’分开。React 19 的 useOptimistic 就是在做这件事。"
      badges={
        <>
          <Badge tone="demo">评论 optimistic demo</Badge>
          <Badge tone="demo">成功 / 失败可切换</Badge>
        </>
      }
    >
      <div className="compare-grid">
        <CompareCard {...legacyCard}>
          <LegacyOptimisticDemo />
        </CompareCard>
        <CompareCard {...optimisticCard}>
          <ModernOptimisticDemo />
        </CompareCard>
      </div>

      <DemoPanel
        title="为什么 useOptimistic 更干净"
        description="在真实业务里，最难受的不是‘先显示一个临时结果’，而是多个异步提交交叉时，临时状态和真实状态经常互相污染。"
      >
        <div className="content-grid two-column">
          <InfoCard title="传统方案的隐患">
            <ul className="ordered-list unordered-list">
              <li>真实数组里混进临时项，后续排序、分页、撤销都更麻烦。</li>
              <li>失败时需要自己删 temp item，成功时需要自己替换 temp item。</li>
              <li>多个请求并发成功/失败时，容易出现状态对不上号。</li>
            </ul>
          </InfoCard>
          <InfoCard title="useOptimistic 的心智模型" tone="accent">
            <ul className="ordered-list unordered-list">
              <li>真实 state 仍然只有一份。</li>
              <li>乐观 UI 是临时投影，不是永久写入。</li>
              <li>成功时更新真实 state；失败时因为真实 state 没变，UI 自动回到原状。</li>
            </ul>
          </InfoCard>
        </div>
      </DemoPanel>
    </SectionShell>
  )
}
