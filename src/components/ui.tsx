import { useState } from 'react'
import type { PropsWithChildren, ReactNode } from 'react'
import type { CompareCardData, ReferenceFile, StatusTone, StoryCardItem } from '../types'

const toneClassMap: Record<StatusTone, string> = {
  guide: 'badge badge-guide',
  demo: 'badge badge-demo',
  reference: 'badge badge-reference',
  limit: 'badge badge-limit',
}

export function Badge({ tone, children }: PropsWithChildren<{ tone: StatusTone }>) {
  return <span className={toneClassMap[tone]}>{children}</span>
}

export function SectionShell({
  eyebrow,
  title,
  description,
  badges,
  actions,
  shellClassName,
  stackClassName,
  children,
}: PropsWithChildren<{
  eyebrow: string
  title: string
  description: string
  badges?: ReactNode
  actions?: ReactNode
  shellClassName?: string
  stackClassName?: string
}>) {
  return (
    <section className={shellClassName ? `page-shell ${shellClassName}` : 'page-shell'}>
      <header className="page-hero">
        <div className="page-hero-main">
          <p className="page-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="page-description">{description}</p>
        </div>
        {(badges || actions) && (
          <div className="page-hero-side">
            {badges ? <div className="badge-row">{badges}</div> : null}
            {actions ? <div className="action-row">{actions}</div> : null}
          </div>
        )}
      </header>
      <div className={stackClassName ? `page-stack ${stackClassName}` : 'page-stack'}>{children}</div>
    </section>
  )
}

export function InfoCard({
  title,
  eyebrow,
  tone,
  children,
}: PropsWithChildren<{ title: string; eyebrow?: string; tone?: 'soft' | 'accent' | 'strong' }>) {
  return (
    <article className={`card info-card ${tone ? `info-card-${tone}` : ''}`}>
      {eyebrow ? <p className="card-eyebrow">{eyebrow}</p> : null}
      <h3>{title}</h3>
      <div className="card-body">{children}</div>
    </article>
  )
}

export function JumpCard({
  title,
  summary,
  meta,
  onClick,
  badge,
}: {
  title: string
  summary: string
  meta: string
  onClick?: () => void
  badge?: ReactNode
}) {
  return (
    <button type="button" className="feature-card" onClick={onClick}>
      <div className="feature-card-head">
        <div>
          <strong>{title}</strong>
          <p>{summary}</p>
        </div>
        {badge}
      </div>
      <span className="feature-meta">{meta}</span>
    </button>
  )
}

export function MiniStat({ value, label, helper }: { value: string; label: string; helper: string }) {
  return (
    <article className="card stat-card">
      <strong>{value}</strong>
      <span>{label}</span>
      <p>{helper}</p>
    </article>
  )
}

export function StoryGrid({ items }: { items: StoryCardItem[] }) {
  return (
    <div className="story-grid">
      {items.map((item, index) => (
        <article key={item.title} className="card story-card">
          <span className="story-index">{index + 1}</span>
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </article>
      ))}
    </div>
  )
}

export function CompareCard({
  eyebrow,
  title,
  summary,
  bullets,
  code,
  children,
}: CompareCardData & { children?: ReactNode }) {
  return (
    <article className="card compare-card">
      <p className="card-eyebrow">{eyebrow}</p>
      <h3>{title}</h3>
      <p className="compare-summary">{summary}</p>
      <ul className="bullet-list compact-list">
        {bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
      {children ? <div className="compare-demo-slot">{children}</div> : null}
      <CodeBlock code={code} />
    </article>
  )
}

export function DemoPanel({
  title,
  description,
  children,
}: PropsWithChildren<{ title: string; description: string }>) {
  return (
    <section className="card demo-panel">
      <div className="demo-panel-header">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {children}
    </section>
  )
}

export function ReferenceExplorer({ files }: { files: ReferenceFile[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeFile = files[activeIndex] ?? files[0]

  if (!activeFile) {
    return null
  }

  return (
    <section className="reference-explorer">
      <aside className="card reference-sidebar">
        <div className="reference-sidebar-head">
          <h3>代码文件</h3>
          <p>按文件拆开看，先看职责，再看细节。</p>
        </div>
        <div className="reference-file-list" role="tablist" aria-label="Reference files">
          {files.map((file, index) => (
            <button
              key={file.path}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              className={index === activeIndex ? 'reference-file-tab reference-file-tab-active' : 'reference-file-tab'}
              onClick={() => setActiveIndex(index)}
            >
              <strong>{file.label}</strong>
              <span>{file.summary ?? file.path}</span>
            </button>
          ))}
        </div>
      </aside>

      <article className="card reference-viewer" role="tabpanel">
        <div className="file-card-head">
          <div>
            <h3>{activeFile.label}</h3>
            <p>{activeFile.path}</p>
          </div>
          {activeFile.summary ? <p className="file-summary">{activeFile.summary}</p> : null}
        </div>
        <CodeBlock code={activeFile.code} />
      </article>
    </section>
  )
}

export function CodeFileCard({ file }: { file: ReferenceFile }) {
  return (
    <article className="card file-card">
      <div className="file-card-head">
        <div>
          <h3>{file.label}</h3>
          <p>{file.path}</p>
        </div>
        {file.summary ? <p className="file-summary">{file.summary}</p> : null}
      </div>
      <CodeBlock code={file.code} />
    </article>
  )
}

export function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="code-block">
      <code>{code}</code>
    </pre>
  )
}

export function StatusLine({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="status-line">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

export function SectionDivider({ title, description }: { title: string; description: string }) {
  return (
    <div className="section-divider">
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  )
}
