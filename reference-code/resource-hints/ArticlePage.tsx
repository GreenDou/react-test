import { preconnect, preload, preinit, preinitModule } from 'react-dom'

export function ArticlePage({ article, commentsApi }: ArticlePageProps) {
  preconnect('https://cdn.example.com', { crossOrigin: '' })
  preconnect(commentsApi.origin)

  preinit('/assets/article.css', { as: 'style', precedence: 'high' })
  preinit('https://analytics.example.com/sdk.js', { as: 'script', crossOrigin: '' })
  preinitModule('/assets/CommentsPanel.js', { as: 'script' })

  preload(article.hero.src, {
    as: 'image',
    imageSrcSet: article.hero.srcSet,
    imageSizes: '(min-width: 1024px) 960px, 100vw',
    fetchPriority: 'high',
  })

  preload(`/api/articles/${article.slug}/summary`, {
    as: 'fetch',
    crossOrigin: '',
  })

  return (
    <main>
      <article>
        <h1>{article.title}</h1>
        <img src={article.hero.src} alt={article.hero.alt} />
        <p>{article.excerpt}</p>
      </article>
      <div id="comments-root" />
    </main>
  )
}

type ArticlePageProps = {
  article: {
    slug: string
    title: string
    excerpt: string
    hero: {
      src: string
      srcSet: string
      alt: string
    }
  }
  commentsApi: URL
}
