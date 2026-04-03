'use client'

import { useMemo, useState } from 'react'

type ProductGalleryProps = {
  productId: string
  images: Array<{ id: string; alt: string; url: string }>
}

export function ProductGallery({ productId, images }: ProductGalleryProps) {
  const [activeId, setActiveId] = useState(images[0]?.id ?? '')

  const activeImage = useMemo(
    () => images.find((image) => image.id === activeId) ?? images[0],
    [activeId, images],
  )

  return (
    <section aria-label={`商品 ${productId} 图片库`}>
      <figure>
        <img src={activeImage.url} alt={activeImage.alt} />
        <figcaption>{activeImage.alt}</figcaption>
      </figure>

      <div className="thumbnail-row">
        {images.map((image) => (
          <button key={image.id} type="button" onClick={() => setActiveId(image.id)}>
            {image.alt}
          </button>
        ))}
      </div>
    </section>
  )
}
