import { hydrateRoot } from 'react-dom/client'
import { App } from './App'

declare global {
  interface Window {
    __BOOTSTRAP__?: {
      now: string
      locale: string
    }
  }
}

hydrateRoot(document, <App bootstrap={window.__BOOTSTRAP__!} />, {
  onRecoverableError(error, errorInfo) {
    console.error('Hydration recoverable error', {
      message: error.message,
      componentStack: errorInfo.componentStack,
    })
  },
})
