import { Suspense, lazy, useEffect, useMemo, useState } from 'react'
import './App.css'
import { Badge } from './components/ui'
import { labSections, navGroups } from './data/catalog'
import type { LabSectionId, LabSectionMeta } from './types'

const HomeSection = lazy(() => import('./features/HomeSection').then((module) => ({ default: module.HomeSection })))
const PlaygroundSection = lazy(() => import('./features/PlaygroundSection').then((module) => ({ default: module.PlaygroundSection })))
const ReferenceSection = lazy(() => import('./features/ReferenceSection').then((module) => ({ default: module.ReferenceSection })))
const MapSection = lazy(() => import('./features/OverviewSection').then((module) => ({ default: module.OverviewSection })))
const ActionsSection = lazy(() => import('./features/ActionsSection').then((module) => ({ default: module.ActionsSection })))
const OptimisticSection = lazy(() => import('./features/OptimisticSection').then((module) => ({ default: module.OptimisticSection })))
const SuspenseSection = lazy(() => import('./features/SuspenseSection').then((module) => ({ default: module.SuspenseSection })))
const RefSection = lazy(() => import('./features/RefSection').then((module) => ({ default: module.RefSection })))
const ContextSection = lazy(() => import('./features/ContextSection').then((module) => ({ default: module.ContextSection })))
const MetadataSection = lazy(() => import('./features/MetadataSection').then((module) => ({ default: module.MetadataSection })))
const WebComponentsSection = lazy(() =>
  import('./features/WebComponentsSection').then((module) => ({ default: module.WebComponentsSection })),
)
const ServerComponentsSection = lazy(() =>
  import('./features/ServerComponentsSection').then((module) => ({ default: module.ServerComponentsSection })),
)
const ServerActionsSection = lazy(() =>
  import('./features/ServerActionsSection').then((module) => ({ default: module.ServerActionsSection })),
)
const ServerRenderingSection = lazy(() =>
  import('./features/ServerRenderingSection').then((module) => ({ default: module.ServerRenderingSection })),
)
const ResourceHintsSection = lazy(() =>
  import('./features/ResourceHintsSection').then((module) => ({ default: module.ResourceHintsSection })),
)
const HydrationSection = lazy(() =>
  import('./features/HydrationSection').then((module) => ({ default: module.HydrationSection })),
)

const sectionIds = new Set<LabSectionId>(labSections.map((section) => section.id))
const topLevelMobileItems = navGroups[0]?.items ?? []

function normalizeSectionId(sectionId?: string | null): LabSectionId {
  return sectionId && sectionIds.has(sectionId as LabSectionId) ? (sectionId as LabSectionId) : 'home'
}

function readSectionFromHash(): LabSectionId {
  if (typeof window === 'undefined') {
    return 'home'
  }

  return normalizeSectionId(window.location.hash.replace(/^#/, ''))
}

function SectionFallback() {
  return (
    <section className="page-shell">
      <header className="page-hero page-hero-loading">
        <div className="loading-line loading-line-lg" />
        <div className="loading-line" />
        <div className="loading-line loading-line-sm" />
      </header>
      <div className="loading-grid">
        <div className="card loading-card">
          <div className="loading-line loading-line-lg" />
          <div className="loading-line" />
          <div className="loading-line" />
        </div>
        <div className="card loading-card">
          <div className="loading-line loading-line-lg" />
          <div className="loading-line" />
          <div className="loading-line" />
        </div>
      </div>
    </section>
  )
}

function renderSection(activeSection: LabSectionId, onJump: (sectionId: LabSectionId) => void) {
  switch (activeSection) {
    case 'home':
      return <HomeSection onJump={onJump} />
    case 'playground':
      return <PlaygroundSection onJump={onJump} />
    case 'reference':
      return <ReferenceSection onJump={onJump} />
    case 'map':
      return <MapSection onJump={onJump} />
    case 'actions':
      return <ActionsSection onJump={onJump} />
    case 'optimistic':
      return <OptimisticSection onJump={onJump} />
    case 'suspense':
      return <SuspenseSection onJump={onJump} />
    case 'refs':
      return <RefSection onJump={onJump} />
    case 'context':
      return <ContextSection onJump={onJump} />
    case 'metadata':
      return <MetadataSection onJump={onJump} />
    case 'web-components':
      return <WebComponentsSection onJump={onJump} />
    case 'server-components':
      return <ServerComponentsSection onJump={onJump} />
    case 'server-actions':
      return <ServerActionsSection onJump={onJump} />
    case 'server-rendering':
      return <ServerRenderingSection onJump={onJump} />
    case 'resource-hints':
      return <ResourceHintsSection onJump={onJump} />
    case 'hydration':
      return <HydrationSection onJump={onJump} />
    default:
      return <HomeSection onJump={onJump} />
  }
}

function NavButton({
  section,
  active,
  onClick,
}: {
  section: LabSectionMeta
  active: boolean
  onClick: () => void
}) {
  return (
    <button type="button" className={active ? 'nav-item nav-item-active' : 'nav-item'} onClick={onClick}>
      <span className="nav-icon">{section.icon}</span>
      <span>
        <strong>{section.shortLabel}</strong>
        <small>{section.description}</small>
      </span>
    </button>
  )
}

function App() {
  const [activeSection, setActiveSection] = useState<LabSectionId>(() => readSectionFromHash())

  useEffect(() => {
    const syncSectionFromLocation = () => {
      setActiveSection(readSectionFromHash())
      window.scrollTo({ top: 0, behavior: 'smooth' })
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
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const activeMeta = useMemo(
    () => labSections.find((section) => section.id === activeSection) ?? labSections[0],
    [activeSection],
  )

  const activeGroup = useMemo(
    () => navGroups.find((group) => group.items.includes(activeSection)) ?? navGroups[0],
    [activeSection],
  )

  return (
    <>
      {activeSection !== 'metadata' ? (
        <>
          <title>{`${activeMeta.title} · React 19 导览站`}</title>
          <meta name="description" content={activeMeta.description} />
        </>
      ) : null}

      <div className="app-shell">
        <aside className="sidebar-shell">
          <div className="brand-block">
            <p className="brand-kicker">React 19 Feature Lab</p>
            <h2>先理解场景，再进入 API</h2>
            <p>
              一个面向 GitHub Pages 的 React 19 实验站：把可在线体验的能力和更适合看代码理解的能力分开整理。
            </p>
          </div>

          <div className="sidebar-tags">
            <Badge tone="guide">清晰导览</Badge>
            <Badge tone="demo">在线试玩</Badge>
            <Badge tone="reference">代码案例</Badge>
          </div>

          <div className="sidebar-groups">
            {navGroups.map((group) => (
              <section key={group.title} className="nav-group">
                <div className="nav-group-head">
                  <strong>{group.title}</strong>
                  <p>{group.description}</p>
                </div>
                <div className="nav-list">
                  {group.items.map((sectionId) => {
                    const section = labSections.find((item) => item.id === sectionId)
                    if (!section) return null
                    return (
                      <NavButton
                        key={section.id}
                        section={section}
                        active={section.id === activeSection}
                        onClick={() => handleSectionChange(section.id)}
                      />
                    )
                  })}
                </div>
              </section>
            ))}
          </div>

          <div className="sidebar-footer">
            <span>当前查看</span>
            <strong>{activeMeta.title}</strong>
            <p>{activeMeta.description}</p>
          </div>
        </aside>

        <main className="main-shell">
          <div className="mobile-nav-shell" aria-label="Mobile navigation">
            <div className="mobile-nav-brand card">
              <strong>React 19 Feature Lab</strong>
              <span>试玩与代码案例分层浏览</span>
            </div>

            <div className="mobile-nav-surface card">
              <div className="mobile-nav-group">
                <p>主导航</p>
                <div className="mobile-nav-row mobile-nav-row-primary">
                  {topLevelMobileItems.map((sectionId) => {
                    const section = labSections.find((item) => item.id === sectionId)
                    if (!section) return null
                    return (
                      <button
                        key={section.id}
                        type="button"
                        className={section.id === activeSection ? 'mobile-nav-item mobile-nav-item-active' : 'mobile-nav-item'}
                        onClick={() => handleSectionChange(section.id)}
                      >
                        <span>{section.icon}</span>
                        <span>{section.shortLabel}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="mobile-nav-group">
                <p>{activeGroup.title}</p>
                <div className="mobile-nav-row">
                  {activeGroup.items.map((sectionId) => {
                    const section = labSections.find((item) => item.id === sectionId)
                    if (!section) return null
                    return (
                      <button
                        key={section.id}
                        type="button"
                        className={section.id === activeSection ? 'mobile-nav-item mobile-nav-item-active' : 'mobile-nav-item'}
                        onClick={() => handleSectionChange(section.id)}
                      >
                        <span>{section.icon}</span>
                        <span>{section.shortLabel}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          <Suspense fallback={<SectionFallback />}>{renderSection(activeSection, handleSectionChange)}</Suspense>
        </main>
      </div>
    </>
  )
}

export default App
