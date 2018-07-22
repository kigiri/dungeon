import { create, prepare, injectCss } from './h.js'
import { color } from './color.js'
import { mapSize, tileSize } from './size.js'

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

const tilesImages = [ 'dungeon', 'walls' ]
const getTileFromIndex = i => ({
  backgroundImage: `url(assets/tile-${tilesImages[Math.floor(i/256)]}.png)`,
  backgroundColor: i === 289 ? color.bg : '',
  backgroundPosition:
    `-${((i%256) % 16) * tileSize}vh -${Math.floor((i%256) / 16) * tileSize}vh`,
})

const Tile = prepare.css(`.${tileClass}`, `
  height: ${tileSize}vh;
  width: ${tileSize}vh;
  background-size: ${mapSize}vh;
`)

export const mapElem = create.css('#map', `
  height: ${mapSize}vh;
  background: ${color.dark};
  flex: 2 1 auto;
  display: flex;
  flex-wrap: wrap;
`, [
256,   0,   1,   1,  54,   1,   1,  74,  75,   1,   1,  54,   1,   1,   2, 258,
272,  16,  17,  17,  70,  17,  17,  92,  93,  17,  17,  70,  17,  17,  18, 274,
272,  32,  33,  34,  86,  33,  34, 108, 109,  32,  33,  86,  32,  33,  34, 274,
272,  96,  97,  98,  99,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50, 274,
272, 112, 113, 114, 115,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50, 274,
272, 128, 129, 130, 131,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50, 274,
272,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50, 274,
272,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50, 274,
272,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50, 274,
272,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50, 274,
272,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50, 274,
272,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50, 274,
272,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50, 274,
272,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50, 386,  50, 274,
272,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50, 274,
100,  8,   23,  24,   8,  23,  24,  24,  23,  24,   8,   8,  24,   8,   8, 100,
].map(i => Tile.style(getTileFromIndex(i))))
