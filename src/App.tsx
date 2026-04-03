import { useMemo, useState } from 'react'
import './App.css'
import { labSections } from './data/catalog'
import type { LabSectionId } from './types'
import { HomeSection } from './features/HomeSection'
import { ActionsSection } from './features/ActionsSection'
import { OptimisticSection } from './features/OptimisticSection'
import { SuspenseSection } from './features/SuspenseSection'
import { RefSection } from './features/RefSection'
import { ContextSection } from './features/ContextSection'
import { MetadataSection } from './features/MetadataSection'
import { WebComponentsSection } from './features/WebComponentsSection'
import { OverviewSection } from './features/OverviewSection'
import { Badge } from './components/ui'

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

function App() {
  const [activeSection, setActiveSection] = useState<LabSectionId>('home')
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
                onClick={() => setActiveSection(section.id)}
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
                onClick={() => setActiveSection(section.id)}
              >
                <span>{section.icon}</span>
                <span>{section.shortLabel}</span>
              </button>
            ))}
          </div>
          {renderSection(activeSection, setActiveSection)}
        </main>
      </div>
    </>
  )
}

export default App
