import { Suspense, lazy, useEffect, useMemo, useState } from 'react'
import './App.css'
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    const syncSectionFromLocation = () => {
      setActiveSection(readSectionFromHash())
      setMobileNavOpen(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    window.addEventListener('hashchange', syncSectionFromLocation)
    window.addEventListener('popstate', syncSectionFromLocation)

    return () => {
      window.removeEventListener('hashchange', syncSectionFromLocation)
      window.removeEventListener('popstate', syncSectionFromLocation)
    }
  }, [])

  useEffect(() => {
    if (!mobileNavOpen) {
      return
    }

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileNavOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [mobileNavOpen])

  const handleSectionChange = (sectionId: LabSectionId) => {
    setActiveSection(sectionId)
    setMobileNavOpen(false)

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
          <title>{`${activeMeta.title} · React 19 Feature Lab`}</title>
          <meta name="description" content={activeMeta.description} />
        </>
      ) : null}

      <div className="app-shell">
        <aside className="sidebar-shell">
          <button type="button" className="brand-block brand-link" onClick={() => handleSectionChange('home')}>
            <p className="brand-kicker">React 19</p>
            <h2>Feature Lab</h2>
            <p>把可直接体验的能力、代码案例和运行边界分开整理。</p>
          </button>

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
            <span>当前页面</span>
            <strong>{activeMeta.title}</strong>
            <p>{activeMeta.description}</p>
          </div>
        </aside>

        <main className="main-shell">
          <div className="mobile-header">
            <button type="button" className="mobile-brand" onClick={() => handleSectionChange('home')}>
              <span className="brand-kicker">React 19</span>
              <strong>Feature Lab</strong>
            </button>
            <button
              type="button"
              className={mobileNavOpen ? 'mobile-menu-button mobile-menu-button-open' : 'mobile-menu-button'}
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMobileNavOpen((open) => !open)}
            >
              {mobileNavOpen ? '关闭' : '菜单'}
            </button>
          </div>

          {mobileNavOpen ? <button type="button" className="mobile-nav-backdrop" aria-label="关闭菜单" onClick={() => setMobileNavOpen(false)} /> : null}

          {mobileNavOpen ? (
            <div id="mobile-navigation" className="mobile-nav-sheet" aria-label="Mobile navigation">
              <div className="mobile-nav-sheet-head">
                <p>{activeGroup.title}</p>
                <strong>{activeMeta.shortLabel}</strong>
              </div>

              {navGroups.map((group) => (
                <section key={group.title} className="mobile-nav-group">
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
          ) : null}

          <Suspense fallback={<SectionFallback />}>{renderSection(activeSection, handleSectionChange)}</Suspense>
        </main>
      </div>
    </>
  )
}

export default App
