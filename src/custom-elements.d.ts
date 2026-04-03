import type * as React from 'react'
import type { ReactionProfile } from './types'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'reaction-meter': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        value?: number
        accent?: string
        label?: string
        profile?: ReactionProfile
        'onrating-change'?: (event: CustomEvent<{ value: number }>) => void
      }
    }
  }
}

export {}
