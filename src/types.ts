export type LabSectionId =
  | 'home'
  | 'actions'
  | 'optimistic'
  | 'suspense'
  | 'refs'
  | 'context'
  | 'metadata'
  | 'web-components'
  | 'overview'

export type StatusTone = 'demo' | 'explain' | 'limit' | 'guide'

export interface LabSectionMeta {
  id: LabSectionId
  icon: string
  label: string
  shortLabel: string
  title: string
  description: string
  status: StatusTone
}

export interface OverviewItem {
  name: string
  status: Exclude<StatusTone, 'guide'>
  summary: string
  note: string
}

export interface CompareCardData {
  eyebrow: string
  title: string
  summary: string
  bullets: string[]
  code: string
}

export interface SignupResult {
  status: 'idle' | 'success' | 'error'
  message: string
  receiptId?: string
  values?: {
    name: string
    email: string
    track: string
  }
}

export interface CommentRecord {
  id: string
  author: string
  text: string
  pending?: boolean
}

export interface ProfileRecord {
  id: string
  role: string
  focus: string
  latency: string
  summary: string
  bullets: string[]
}

export interface ReactionProfile {
  title: string
  hint: string
  moods: string[]
}
