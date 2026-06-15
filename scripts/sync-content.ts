// scripts/sync-content.ts
import { execSync } from 'child_process'
import { existsSync, mkdirSync, readdirSync, copyFileSync, statSync } from 'fs'
import { join, resolve } from 'path'

const SOURCE_REPO = process.argv[2] || join(process.env.HOME || process.env.USERPROFILE || '', 'learn-claude-code')
const PROJECT_ROOT = resolve(import.meta.dirname, '..')
const PUBLIC_DIR = join(PROJECT_ROOT, 'public')
const CONTENT_DIR = join(PUBLIC_DIR, 'content')
const ASSETS_DIR = join(PUBLIC_DIR, 'course-assets')

// Chapter directories in order
const CHAPTERS = Array.from({ length: 20 }, (_, i) => {
  const num = String(i + 1).padStart(2, '0')
  const dirs = readdirSync(SOURCE_REPO).filter(d => d.startsWith(`s${num}_`))
  return dirs[0]
}).filter(Boolean)

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
}

function copyRecursive(src: string, dest: string) {
  ensureDir(dest)
  for (const entry of readdirSync(src)) {
    const srcPath = join(src, entry)
    const destPath = join(dest, entry)
    if (statSync(srcPath).isDirectory()) {
      copyRecursive(srcPath, destPath)
    } else {
      copyFileSync(srcPath, destPath)
    }
  }
}

console.log(`Syncing from: ${SOURCE_REPO}`)

// 1. Copy README.md (Chinese) for each chapter → public/content/
ensureDir(CONTENT_DIR)
for (const chapter of CHAPTERS) {
  const srcReadme = join(SOURCE_REPO, chapter, 'README.md')
  const destDir = join(CONTENT_DIR, chapter)
  ensureDir(destDir)
  if (existsSync(srcReadme)) {
    copyFileSync(srcReadme, join(destDir, 'README.md'))
    console.log(`  ✓ ${chapter}/README.md`)
  }
}

// 2. Copy SVG images → public/course-assets/
ensureDir(ASSETS_DIR)
for (const chapter of CHAPTERS) {
  const imgDir = join(SOURCE_REPO, chapter, 'images')
  if (existsSync(imgDir)) {
    const destDir = join(ASSETS_DIR, chapter)
    ensureDir(destDir)
    for (const file of readdirSync(imgDir)) {
      if (file.endsWith('.svg') && !file.includes('.en.') && !file.includes('.ja.')) {
        copyFileSync(join(imgDir, file), join(destDir, file))
      }
    }
    console.log(`  ✓ ${chapter}/images/`)
  }
}

console.log(`\nDone! Synced ${CHAPTERS.length} chapters.`)
