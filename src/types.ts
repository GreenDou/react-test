export type LabSectionId =
  | 'home'
  | 'playground'
  | 'reference'
  | 'map'
  | 'actions'
  | 'optimistic'
  | 'suspense'
  | 'refs'
  | 'context'
  | 'metadata'
  | 'web-components'
  | 'server-components'
  | 'server-actions'
  | 'server-rendering'
  | 'resource-hints'
  | 'hydration'

export type StatusTone = 'guide' | 'demo' | 'reference' | 'limit'
export type SectionCluster = 'guide' | 'interactive' | 'reference'

export interface LabSectionMeta {
  id: LabSectionId
  icon: string
  label: string
  shortLabel: string
  title: string
  description: string
  tone: StatusTone
  cluster: SectionCluster
}

export interface NavGroup {
  title: string
  description: string
  items: LabSectionId[]
}

export interface FeatureMapItem {
  name: string
  sectionId: LabSectionId
  runMode: '可直接体验' | '看代码讲解'
  environment: string
  summary: string
  whyItMatters: string
}

export interface CompareCardData {
  eyebrow: string
  title: string
  summary: string
  bullets: string[]
  code: string
}

export interface StoryCardItem {
  title: string
  body: string
}

export interface ReferenceFile {
  label: string
  path: string
  summary?: string
  code: string
}

export interface ReferenceCase {
  title: string
  summary: string
  environment: string
  whyNotOnPages: string
  files: ReferenceFile[]
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
