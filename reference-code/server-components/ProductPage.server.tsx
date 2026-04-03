import { cache, Suspense } from 'react'
import { notFound } from 'next/navigation'
import { ProductGallery } from './ProductGallery.client'
import { getProduct, getRecommendations } from './data'

const loadProduct = cache(getProduct)

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>
}) {
  const { productId } = await params
  const product = await loadProduct(productId)

  if (!product) {
    notFound()
  }

  return (
    <main className="product-page">
      <header>
        <p>这个页面组件只在服务器执行。</p>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <small>库存：{product.stock} 件</small>
      </header>

      <ProductGallery productId={product.id} images={product.images} />

      <Suspense fallback={<p>相关推荐正在从服务端补流…</p>}>
        <Recommendations categoryId={product.categoryId} />
      </Suspense>
    </main>
  )
}

async function Recommendations({ categoryId }: { categoryId: string }) {
  const items = await getRecommendations(categoryId)

  return (
    <aside>
      <h2>搭配购买</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <strong>{item.name}</strong>
            <span>¥{item.price}</span>
          </li>
        ))}
      </ul>
    </aside>
  )
}
