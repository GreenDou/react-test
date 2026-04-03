import type { ReactionProfile } from '../types'

class ReactionMeterElement extends HTMLElement {
  static get observedAttributes() {
    return ['label']
  }

  #value = 4
  #accent = '#8b5cf6'
  #profile: ReactionProfile = {
    title: '未传入 profile',
    hint: 'React 19 会把 JSX prop 直接桥接到自定义元素实例属性。',
    moods: ['弱', '一般', '还行', '很好', '满分'],
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    this.render()
  }

  attributeChangedCallback() {
    this.render()
  }

  get value() {
    return this.#value
  }

  set value(nextValue: number) {
    this.#value = Number(nextValue) || 0
    this.render()
  }

  get accent() {
    return this.#accent
  }

  set accent(nextValue: string) {
    this.#accent = nextValue || '#8b5cf6'
    this.render()
  }

  get profile() {
    return this.#profile
  }

  set profile(nextProfile: ReactionProfile) {
    this.#profile = nextProfile
    this.render()
  }

  handleRate(nextValue: number) {
    this.#value = nextValue
    this.dispatchEvent(
      new CustomEvent('rating-change', {
        bubbles: true,
        composed: true,
        detail: { value: nextValue },
      }),
    )
    this.render()
  }

  render() {
    if (!this.shadowRoot) return

    const moods = this.#profile.moods.length ? this.#profile.moods : ['弱', '一般', '还行', '很好', '满分']
    const mood = moods[Math.max(0, Math.min(this.#value - 1, moods.length - 1))] ?? moods[0]

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: Inter, system-ui, sans-serif;
        }
        .shell {
          border: 1px solid rgba(148, 163, 184, 0.25);
          border-radius: 24px;
          padding: 18px;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.96), rgba(30, 41, 59, 0.96));
          color: #f8fafc;
          box-shadow: 0 18px 38px rgba(15, 23, 42, 0.28);
        }
        .label {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          margin-bottom: 10px;
        }
        .label strong {
          font-size: 15px;
        }
        .label span {
          color: ${this.#accent};
          font-weight: 700;
        }
        .title {
          margin: 0 0 8px;
          font-size: 17px;
          font-weight: 700;
        }
        .hint {
          margin: 0;
          color: rgba(226, 232, 240, 0.88);
          line-height: 1.5;
          font-size: 14px;
        }
        .actions {
          display: flex;
          gap: 8px;
          margin-top: 16px;
          flex-wrap: wrap;
        }
        button {
          border: 0;
          cursor: pointer;
          padding: 10px 12px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.08);
          color: inherit;
          transition: transform 0.16s ease, background 0.16s ease;
        }
        button:hover {
          transform: translateY(-1px);
          background: rgba(255, 255, 255, 0.14);
        }
        button[data-active='true'] {
          background: ${this.#accent};
          color: #0f172a;
          font-weight: 700;
        }
        .mood {
          margin-top: 12px;
          font-size: 14px;
          color: rgba(226, 232, 240, 0.88);
        }
      </style>
      <div class="shell">
        <div class="label">
          <strong>${this.getAttribute('label') ?? 'reaction-meter'}</strong>
          <span>${this.#value}/5</span>
        </div>
        <p class="title">${this.#profile.title}</p>
        <p class="hint">${this.#profile.hint}</p>
        <div class="actions">
          ${[1, 2, 3, 4, 5]
            .map(
              (value) => `<button type="button" data-value="${value}" data-active="${value === this.#value}">${value}</button>`,
            )
            .join('')}
        </div>
        <div class="mood">当前语义：${mood}</div>
      </div>
    `

    this.shadowRoot.querySelectorAll<HTMLButtonElement>('button[data-value]').forEach((button) => {
      button.onclick = () => {
        const value = Number(button.dataset.value ?? 0)
        this.handleRate(value)
      }
    })
  }
}

if (!customElements.get('reaction-meter')) {
  customElements.define('reaction-meter', ReactionMeterElement)
}

export {}
