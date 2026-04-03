import { createReadStream } from 'node:fs'
import { renderToPipeableStream, resumeToPipeableStream } from 'react-dom/server'
import { App } from './App'
import { readPostponedState } from './storage'

export async function handleRequest(req, res) {
  const postponedState = await readPostponedState(req.url)

  if (postponedState) {
    const resumed = await resumeToPipeableStream(<App url={req.url} />, postponedState, {
      bootstrapScripts: ['/assets/client-entry.js'],
      onError(error) {
        console.error('恢复流式渲染失败', error)
      },
    })

    res.setHeader('content-type', 'text/html; charset=utf-8')
    resumed.pipe(res)
    return
  }

  const stream = renderToPipeableStream(<App url={req.url} />, {
    bootstrapScripts: ['/assets/client-entry.js'],
    onShellReady() {
      res.setHeader('content-type', 'text/html; charset=utf-8')
      stream.pipe(res)
    },
    onShellError(error) {
      res.statusCode = 500
      res.end(`<pre>${String(error)}</pre>`)
    },
    onError(error) {
      console.error('SSR 流式输出错误', error)
    },
  })
}

export function streamCachedPrelude(res, htmlFilePath: string) {
  createReadStream(htmlFilePath).pipe(res)
}
