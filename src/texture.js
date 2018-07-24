import { injectCss } from './h.js'

export const tileClass = injectCss(`
  background-repeat: no-repeat;
  image-rendering: optimizeSpeed;
  image-rendering: -moz-crisp-edges;
  image-rendering: -o-crisp-edges;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: pixelated;
  image-rendering: optimize-contrast;
  -ms-interpolation-mode: nearest-neighbor;
`)

export const tilesImages = [ 'dungeon', 'walls' ]

