import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, mkdtempSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const sample = (n) => readFileSync(new URL(`../samples/${n}`, import.meta.url), 'utf8')
const mod = (n) => import(`../src/${n}.mjs`)
const run = (n, args = []) => spawnSync(process.execPath, [fileURLToPath(new URL(`../src/${n}.mjs`, import.meta.url)), ...args], { encoding: 'utf8' })
const samplePath = (n) => fileURLToPath(new URL(`../samples/${n}`, import.meta.url))

test('20 TODO : seulement dans les commentaires, résumé par type', async () => {
  const { scanText, summary, scanDir } = await mod('todo-scan')
  const items = scanText(sample('code/app.js'), 'app.js')
  assert.deepEqual(items.map((i) => [i.tag, i.ligne]), [['TODO', 1], ['FIXME', 5], ['HACK', 8]])
  assert.equal(items[0].texte, 'remplacer le stockage en mémoire par une vraie base')
  const s = summary(items); assert.equal(s.total, 3); assert.equal(s.byTag.TODO, 1)
  const dir = mkdtempSync(join(tmpdir(), 'todo-')); writeFileSync(join(dir, 'a.js'), '// TODO: un\n// TODO: deux\n'); mkdirSync(join(dir, 'node_modules')); writeFileSync(join(dir, 'node_modules', 'x.js'), '// TODO: ignoré\n')
  assert.equal(scanDir(dir).length, 2)
  assert.equal(run('todo-scan', [dir, '--max', '1']).status, 2); assert.equal(run('todo-scan', [dir, '--max', '2']).status, 0)
})
