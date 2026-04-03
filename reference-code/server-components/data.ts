const products = [
  {
    id: 'p-1',
    name: 'React 19 Explorer T-Shirt',
    description: '商品详情在服务器拼好再发给浏览器，客户端只负责交互。',
    stock: 12,
    categoryId: 'merch',
    images: [
      { id: 'front', alt: '正面图', url: '/images/shirt-front.jpg' },
      { id: 'back', alt: '背面图', url: '/images/shirt-back.jpg' },
    ],
  },
]

const accessories = [
  { id: 'a-1', categoryId: 'merch', name: '贴纸套装', price: 39 },
  { id: 'a-2', categoryId: 'merch', name: '桌垫', price: 89 },
]

export async function getProduct(productId: string) {
  await sleep(120)
  return products.find((product) => product.id === productId) ?? null
}

export async function getRecommendations(categoryId: string) {
  await sleep(240)
  return accessories.filter((item) => item.categoryId === categoryId)
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms))
}
