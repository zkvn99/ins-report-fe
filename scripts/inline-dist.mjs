import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const dist = join(root, 'dist')
const indexPath = join(dist, 'index.html')
let html = await readFile(indexPath, 'utf8')

const cssMatches = [...html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["'][^>]*>/g)]
for (const match of cssMatches) {
  const assetPath = join(dist, match[1].replace(/^\//, ''))
  const css = await readFile(assetPath, 'utf8')
  html = html.replace(match[0], `<style>${css}</style>`)
}

const scriptMatches = [...html.matchAll(/<script([^>]*?)src=["']([^"']+)["']([^>]*)><\/script>/g)]
for (const match of scriptMatches) {
  const assetPath = join(dist, match[2].replace(/^\//, ''))
  const js = await readFile(assetPath, 'utf8')
  const attrs = `${match[1]} ${match[3]}`.replace(/\s*crossorigin(?:=["'][^"']*["'])?/g, '').trim()
  html = html.replace(match[0], `<script ${attrs}>${js}<\/script>`)
}

if (/\/(assets|src)\//.test(html)) {
  console.warn('주의: 단일 HTML에 외부 asset 경로가 남아 있을 수 있습니다.')
}

const output = join(dist, 'health-asset-report.html')
await writeFile(output, html, 'utf8')
console.log(`single-file build: ${output}`)
