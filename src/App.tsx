import { Suspense, lazy, useEffect, useMemo, useState } from 'react'
import './App.css'
import { labSections } from './data/catalog'
import type { LabSectionId } from './types'
import { Badge } from './components/ui'

const HomeSection = lazy(() => import('./features/HomeSection').then((module) => ({ default: module.HomeSection })))
const ActionsSection = lazy(() => import('./features/ActionsSection').then((module) => ({ default: module.ActionsSection })))
const OptimisticSection = lazy(() =>
  import('./features/OptimisticSection').then((module) => ({ default: module.OptimisticSection })),
)
const SuspenseSection = lazy(() => import('./features/SuspenseSection').then((module) => ({ default: module.SuspenseSection })))
const RefSection = lazy(() => import('./features/RefSection').then((module) => ({ default: module.RefSection })))
const ContextSection = lazy(() => import('./features/ContextSection').then((module) => ({ default: module.ContextSection })))
const MetadataSection = lazy(() => import('./features/MetadataSection').then((module) => ({ default: module.MetadataSection })))
const WebComponentsSection = lazy(() =>
  import('./features/WebComponentsSection').then((module) => ({ default: module.WebComponentsSection })),
)
const OverviewSection = lazy(() => import('./features/OverviewSection').then((module) => ({ default: module.OverviewSection })))

const sectionIds = new Set<LabSectionId>(labSections.map((section) => section.id))

function normalizeSectionId(sectionId?: string | null): LabSectionId {
  return sectionId && sectionIds.has(sectionId as LabSectionId) ? (sectionId as LabSectionId) : 'home'
}

function readSectionFromHash(): LabSectionId {
  if (typeof window === 'undefined') {
    return 'home'
  }

  return normalizeSectionId(window.location.hash.replace(/^#/, ''))
}

function renderSection(activeSection: LabSectionId, onJump: (sectionId: LabSectionId) => void) {
  switch (activeSection) {
    case 'home':
      return <HomeSection onJump={onJump} />
    case 'actions':
      return <ActionsSection />
    case 'optimistic':
      return <OptimisticSection />
    case 'suspense':
      return <SuspenseSection />
    case 'refs':
      return <RefSection />
    case 'context':
      return <ContextSection />
    case 'metadata':
      return <MetadataSection />
    case 'web-components':
      return <WebComponentsSection />
    case 'overview':
      return <OverviewSection />
    default:
      return <HomeSection onJump={onJump} />
  }
}

function SectionFallback() {
  return (
    <section className="section-shell section-loading-shell">
      <div className="section-header">
        <p className="section-eyebrow">Loading section</p>
        <h1>正在加载这个特性 demo…</h1>
        <p className="section-description">已改为按需加载，这样首屏更轻，也更适合后续继续往里加更多 React 19 实验。</p>
      </div>
      <div className="content-grid two-column">
        <div className="demo-panel section-loading-card">
          <div className="loading-line loading-line-lg"></div>
          <div className="loading-line"></div>
          <div className="loading-line"></div>
          <div className="loading-line loading-line-sm"></div>
        </div>
        <div className="demo-panel section-loading-card">
          <div className="loading-line loading-line-lg"></div>
          <div className="loading-line"></div>
          <div className="loading-line"></div>
          <div className="loading-line loading-line-sm"></div>
        </div>
      </div>
    </section>
  )
}

function App() {
  const [activeSection, setActiveSection] = useState<LabSectionId>(() => readSectionFromHash())

  useEffect(() => {
    const syncSectionFromLocation = () => {
      setActiveSection(readSectionFromHash())
    }

    window.addEventListener('hashchange', syncSectionFromLocation)
    window.addEventListener('popstate', syncSectionFromLocation)

    return () => {
      window.removeEventListener('hashchange', syncSectionFromLocation)
      window.removeEventListener('popstate', syncSectionFromLocation)
    }
  }, [])

  const handleSectionChange = (sectionId: LabSectionId) => {
    setActiveSection(sectionId)

    if (typeof window === 'undefined') {
      return
    }

    const nextUrl =
      sectionId === 'home'
        ? `${window.location.pathname}${window.location.search}`
        : `${window.location.pathname}${window.location.search}#${sectionId}`

    window.history.pushState(null, '', nextUrl)
  }

  const activeMeta = useMemo(
    () => labSections.find((section) => section.id === activeSection) ?? labSections[0],
    [activeSection],
  )

  return (
    <>
      {activeSection !== 'metadata' ? (
        <>
          <title>{`React 19 Feature Lab · ${activeMeta.shortLabel}`}</title>
          <meta name="description" content={activeMeta.description} />
        </>
      ) : null}

      <div className="app-shell">
        <aside className="sidebar-shell">
          <div className="brand-block">
            <p className="brand-kicker">React 19 Playground</p>
            <h2>Feature Lab</h2>
            <p>
              一页式实验台，专门验证 React 19 在 <strong>纯静态 GitHub Pages</strong> 里的真实可演示边界。
            </p>
          </div>

          <div className="sidebar-tags">
            <Badge tone="guide">Vite + React 19 + TypeScript</Badge>
            <Badge tone="demo">静态部署友好</Badge>
            <Badge tone="explain">中文说明为主</Badge>
          </div>

          <nav className="nav-list" aria-label="Feature navigation">
            {labSections.map((section) => (
              <button
                key={section.id}
                type="button"
                className={section.id === activeSection ? 'nav-item nav-item-active' : 'nav-item'}
                onClick={() => handleSectionChange(section.id)}
              >
                <span className="nav-icon">{section.icon}</span>
                <span>
                  <strong>{section.shortLabel}</strong>
                  <small>{section.description}</small>
                </span>
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <p>当前查看</p>
            <strong>{activeMeta.title}</strong>
            <span>{activeMeta.description}</span>
          </div>
        </aside>

        <main className="main-shell">
          <div className="top-nav" aria-label="Mobile feature navigation">
            {labSections.map((section) => (
              <button
                key={section.id}
                type="button"
                className={section.id === activeSection ? 'top-nav-item top-nav-item-active' : 'top-nav-item'}
                onClick={() => handleSectionChange(section.id)}
              >
                <span>{section.icon}</span>
                <span>{section.shortLabel}</span>
              </button>
            ))}
          </div>
          <Suspense fallback={<SectionFallback />}>{renderSection(activeSection, handleSectionChange)}</Suspense>
        </main>
      </div>
    </>
  )
}

export default App
