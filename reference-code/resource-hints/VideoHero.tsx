import { preload, preconnect } from 'react-dom'

export function VideoHero() {
  preconnect('https://video-cdn.example.com', { crossOrigin: 'anonymous' })
  preload('https://video-cdn.example.com/homepage/hero-poster.avif', {
    as: 'image',
    fetchPriority: 'high',
  })
  preload('https://video-cdn.example.com/homepage/hero-track.vtt', {
    as: 'track',
    crossOrigin: 'anonymous',
  })

  return (
    <section>
      <h2>首页视频头图</h2>
      <video poster="https://video-cdn.example.com/homepage/hero-poster.avif" muted autoPlay loop playsInline>
        <source src="https://video-cdn.example.com/homepage/hero.webm" type="video/webm" />
      </video>
    </section>
  )
}
