'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createOrderDraft, updateCheckoutNote } from './db'

export type CheckoutState = {
  status: 'idle' | 'error'
  message?: string
  fieldErrors?: {
    email?: string
    note?: string
  }
}

export async function saveCheckoutNote(
  _previousState: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const note = String(formData.get('note') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()

  if (!email.includes('@')) {
    return {
      status: 'error',
      message: '邮箱格式不正确。',
      fieldErrors: { email: '请填写可接收订单确认的邮箱。' },
    }
  }

  if (note.length > 140) {
    return {
      status: 'error',
      message: '备注太长。',
      fieldErrors: { note: '请把备注控制在 140 字以内。' },
    }
  }

  await updateCheckoutNote({ email, note })
  revalidatePath('/checkout')

  return {
    status: 'idle',
    message: '备注已保存，服务端缓存也同步刷新。',
  }
}

export async function submitCheckout(formData: FormData) {
  const draft = await createOrderDraft({
    email: String(formData.get('email') ?? ''),
    sku: String(formData.get('sku') ?? ''),
    quantity: Number(formData.get('quantity') ?? '1'),
  })

  redirect(`/checkout/${draft.id}/confirm`)
}
