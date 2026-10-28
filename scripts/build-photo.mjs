// Finishes the photo.bhasanth.com build: after `BUILD_TARGET=photo vite build`,
// renames photo.html to index.html and copies in the favicon. admin/index.html is already in place.
// Upload the contents of dist-photo/ to the subdomain's folder on Hostinger.

import { cpSync, renameSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const out = resolve(root, 'dist-photo')

renameSync(resolve(out, 'photo.html'), resolve(out, 'index.html'))
cpSync(resolve(root, 'public/bl.png'), resolve(out, 'bl.png'))

console.log('photo gallery ready in dist-photo/')
