#!/usr/bin/env node
/* Recense les TODO, FIXME, HACK, XXX et BUG laissés dans le code, par type et par fichier. */
import { readFileSync } from 'node:fs'
import { walkFiles } from '../lib/walk.mjs'
import { isMain, parseArgs, usage, fail } from '../lib/cli.mjs'

const TAGS = ['TODO', 'FIXME', 'HACK', 'XXX', 'BUG']
const BINARY = /\.(png|jpe?g|gif|webp|avif|ico|pdf|zip|gz|tgz|mp4|mov|woff2?|ttf|eot|lock|enc|map)$/i
const RE = new RegExp(`\\b(${TAGS.join('|')})\\b[:(\\s-]*(.*)$`)

export function scanText(text, file = '') {
  const found = []
  text.split(/\r?\n/).forEach((line, i) => {
    if (line.length > 1000) return
    const m = line.match(RE)
    if (m && /(\/\/|\/\*|#|<!--|--|\*|;)\s*\S*.*\b(TODO|FIXME|HACK|XXX|BUG)\b/.test(line)) found.push({ file, ligne: i + 1, tag: m[1], texte: m[2].replace(/\*\/|-->/g, '').trim() })
  })
  return found
}

export function scanDir(dir) {
  return walkFiles(dir, { filter: (f) => !BINARY.test(f) }).filter((f) => f.size < 1_000_000).flatMap((f) => scanText(readFileSync(f.path, 'utf8'), f.path))
}

export function summary(items) {
  const byTag = Object.fromEntries(TAGS.map((t) => [t, items.filter((i) => i.tag === t).length]))
  const byFile = new Map()
  for (const i of items) byFile.set(i.file, (byFile.get(i.file) ?? 0) + 1)
  return { total: items.length, byTag, topFiles: [...byFile].sort((a, b) => b[1] - a[1]).slice(0, 5) }
}

if (isMain(import.meta.url)) {
  const args = parseArgs(process.argv.slice(2), ['help', 'json'])
  usage(`
Usage : node src/todo-scan.mjs dossier [--max 50] [--json]
Ne retient que les marqueurs situés dans un commentaire. Code de sortie 2 si le total dépasse --max (défaut : pas de limite).`, args, 1)
  let items
  try { items = scanDir(args._[0]) } catch (e) { fail(e.message) }
  const s = summary(items)
  if (args.json) console.log(JSON.stringify({ ...s, items }, null, 2))
  else {
    for (const tag of TAGS) for (const i of items.filter((x) => x.tag === tag)) console.log(`${tag.padEnd(5)} ${i.file}:${i.ligne}  ${i.texte}`)
    console.log(`\n${s.total} marqueur(s) — ${TAGS.map((t) => `${t}=${s.byTag[t]}`).join('  ')}`)
    if (s.topFiles.length) console.log('Fichiers les plus chargés :', s.topFiles.map(([f, n]) => `${f} (${n})`).join(', '))
  }
  process.exit(args.max !== undefined && s.total > Number(args.max) ? 2 : 0)
}
