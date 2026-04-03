type DraftInput = {
  email: string
  sku: string
  quantity: number
}

export async function updateCheckoutNote(input: { email: string; note: string }) {
  console.log('保存备注', input)
  await sleep(180)
}

export async function createOrderDraft(input: DraftInput) {
  console.log('创建草稿订单', input)
  await sleep(220)

  return {
    id: `draft_${Math.random().toString(36).slice(2, 8)}`,
  }
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms))
}
