import { createWriteStream } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { Readable } from 'node:stream'
import { prerender, resumeAndPrerenderToNodeStream } from 'react-dom/static'
import { App } from './App'
import { savePostponedState } from './storage'

export async function buildMarketingPage(url: string) {
  const { prelude, postponed } = await prerender(<App url={url} />, {
    bootstrapScripts: ['/assets/client-entry.js'],
    onError(error) {
      console.error('静态预渲染失败', error)
    },
  })

  const html = await streamToString(prelude)
  await writeFile(`./dist${url === '/' ? '/index' : url}.html`, html, 'utf8')

  if (postponed) {
    await savePostponedState(url, postponed)
  }
}

export async function rebuildWithFreshData(url: string, postponedState) {
  const { prelude } = await resumeAndPrerenderToNodeStream(<App url={url} />, postponedState)
  await new Promise((resolve, reject) => {
    const target = createWriteStream(`./dist${url}/index.html`)
    prelude.pipe(target)
    target.on('finish', resolve)
    target.on('error', reject)
  })
}

async function streamToString(stream) {
  const chunks: Buffer[] = []

  for await (const chunk of Readable.fromWeb(stream)) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }

  return Buffer.concat(chunks).toString('utf8')
}
