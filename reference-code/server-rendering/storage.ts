import { readFile, writeFile } from 'node:fs/promises'

export async function savePostponedState(url: string, postponedState: unknown) {
  await writeFile(getFileName(url), JSON.stringify(postponedState), 'utf8')
}

export async function readPostponedState(url: string) {
  try {
    const raw = await readFile(getFileName(url), 'utf8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function getFileName(url: string) {
  return `.cache${url.replace(/\//g, '_') || '_root'}.postponed.json`
}
