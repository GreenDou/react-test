import type { PropsWithChildren, ReactNode } from 'react'
import type { CompareCardData, StatusTone } from '../types'

const toneClassMap: Record<StatusTone, string> = {
  demo: 'badge badge-demo',
  explain: 'badge badge-explain',
  guide: 'badge badge-guide',
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
  children,
}: PropsWithChildren<{
  eyebrow: string
  title: string
  description: string
  badges?: ReactNode
}>) {
  return (
    <section className="section-shell">
      <header className="section-header">
        <p className="section-eyebrow">{eyebrow}</p>
        <div className="section-header-row">
          <div>
            <h1>{title}</h1>
            <p className="section-description">{description}</p>
          </div>
          {badges ? <div className="section-badges">{badges}</div> : null}
        </div>
      </header>
      {children}
    </section>
  )
}

export function InfoCard({
  title,
  children,
  tone,
}: PropsWithChildren<{ title: string; tone?: 'soft' | 'accent' | 'strong' }>) {
  return (
    <article className={`info-card ${tone ? `info-card-${tone}` : ''}`}>
      <h3>{title}</h3>
      <div className="info-card-body">{children}</div>
    </article>
  )
}

export function MetricCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <article className="metric-card">
      <p className="metric-label">{label}</p>
      <strong>{value}</strong>
      <span>{helper}</span>
    </article>
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
    <article className="compare-card">
      <p className="card-eyebrow">{eyebrow}</p>
      <h3>{title}</h3>
      <p className="card-summary">{summary}</p>
      <ul className="card-bullets">
        {bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
      {children ? <div className="card-demo-slot">{children}</div> : null}
      <CodeBlock code={code} />
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

export function DemoPanel({
  title,
  description,
  children,
}: PropsWithChildren<{ title: string; description: string }>) {
  return (
    <section className="demo-panel">
      <div className="demo-panel-header">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
      {children}
    </section>
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
