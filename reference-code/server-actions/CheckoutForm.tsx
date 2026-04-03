import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { saveCheckoutNote, submitCheckout, type CheckoutState } from './actions'

const initialState: CheckoutState = { status: 'idle' }

export function CheckoutForm() {
  const [state, saveNoteAction] = useActionState(saveCheckoutNote, initialState)

  return (
    <form action={submitCheckout} className="checkout-form">
      <label>
        联系邮箱
        <input name="email" type="email" placeholder="you@example.com" />
        {state.fieldErrors?.email ? <span>{state.fieldErrors.email}</span> : null}
      </label>

      <label>
        配送备注
        <textarea name="note" rows={3} />
        {state.fieldErrors?.note ? <span>{state.fieldErrors.note}</span> : null}
      </label>

      <div className="form-actions">
        <button formAction={saveNoteAction} type="submit">
          只保存备注
        </button>
        <SubmitOrderButton />
      </div>

      {state.message ? <p>{state.message}</p> : null}
    </form>
  )
}

function SubmitOrderButton() {
  const status = useFormStatus()

  return (
    <button type="submit" disabled={status.pending}>
      {status.pending ? '正在创建订单…' : '提交订单'}
    </button>
  )
}
