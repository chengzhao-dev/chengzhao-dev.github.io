#!/usr/bin/env node
// Quarto does not emit <link rel="canonical"> from website.site-url.
// Post-render metadata: canonical, og:url, and clean sitemap URLs.
import { readFile, writeFile, readdir } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'

const root = process.cwd()
const outputDir = join(root, '_site')
const config = await readFile(join(root, '_quarto.yml'), 'utf8')
const siteUrl = /^\s*site-url:\s*["']?(https?:\/\/[^"'\s#]+)["']?/m.exec(config)?.[1]?.replace(/\/+$/, '')

if (!siteUrl) {
  console.error('[post-render] website.site-url is not configured; skipping')
  process.exit(0)
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) files.push(...(await walk(full)))
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(full)
  }
  return files
}

function pageUrl(file) {
  const path = relative(outputDir, file).split(sep).join('/')
  if (path === 'index.html') return `${siteUrl}/`
  if (path.endsWith('/index.html')) return `${siteUrl}/${path.slice(0, -'index.html'.length)}`
  return `${siteUrl}/${path}`
}

let changed = 0
for (const file of await walk(outputDir)) {
  const html = await readFile(file, 'utf8')
  if (!/<\/head>/i.test(html)) continue
  const url = pageUrl(file)
  const tags = []
  if (!/<link\b[^>]*\brel=["']canonical["']/i.test(html)) {
    tags.push(`<link rel="canonical" href="${url}">`)
  }
  if (!/<meta\b[^>]*\bproperty=["']og:url["']/i.test(html)) {
    tags.push(`<meta property="og:url" content="${url}">`)
  }
  if (tags.length === 0) continue
  await writeFile(file, html.replace(/<\/head>/i, `  ${tags.join('\n  ')}\n</head>`), 'utf8')
  changed += 1
}
// Quarto writes sitemap URLs as /index.html; canonical uses the clean route.
// Normalize only <loc> entries so sitemap and canonical agree.
try {
  const sitemapPath = join(outputDir, 'sitemap.xml')
  const sitemap = await readFile(sitemapPath, 'utf8')
  const normalized = sitemap.replace(/(<loc>[^<]*?)\/index\.html<\/loc>/g, '$1/</loc>')
  if (normalized !== sitemap) {
    await writeFile(sitemapPath, normalized, 'utf8')
    console.log('[post-render] normalized sitemap URLs')
  }
} catch {
  // No sitemap (site-url unset or a single-page render): nothing to normalize.
}

console.log(`[post-render] added ${changed} metadata tag set(s)`)
