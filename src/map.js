import { create, prepare, injectCss } from './h.js'
import { color } from './color.js'
import { mapSize, tileSize, px } from './size.js'

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
  backgroundPosition:
    `-${((i%256) % 16) * tileSize}vh -${Math.floor((i%256) / 16) * tileSize}vh`,
})

const Tile = prepare.css(`.${tileClass}`, `
  height: ${tileSize}vh;
  width: ${tileSize}vh;
  background-size: ${mapSize}vh;
`)

const TileHighlight = prepare.css('.highlight', `
._ {
  height: 100%;
  width: 100%;
  font-size: ${px(8)};
  text-align: center;
  line-height: ${tileSize}vh;
  color: ${color.bgDark};
}
._:hover {
  outline: ${color.bgLight} ${px(1)} solid;
  outline-offset: -${px(1)};
  color: ${color.fgDark};
}
`)

export const mapElem = create.css('#map', `
  height: ${mapSize}vh;
  width: ${mapSize}vh;
  background: ${color.dark};
  display: flex;
  flex-wrap: wrap;
`, [
256,   0,   1,   1,  54,   1,   1,  74,  75,   1,   1,  54,   1,   1,   2, 258,
272,  16,  17,  17,  70,  17,  17,  92,  93,  17,  17,  70,  17,  17,  18, 274,
272,  32,  33,  34,  86,  33,  34, 108, 109,  32,  33,  86,  32,  33,  34, 274,
272,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50, 274,
272,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50, 274,
272,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50, 274,
272,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50, 274,
272,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50, 274,
272,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50, 274,
272,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50, 274,
272,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50, 274,
272,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50, 274,
272,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50, 274,
272,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50, 274,
272,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50,  50, 274,
100,  8,   23,  24,   8,  23,  24,  24,  23,  24,   8,   8,  24,   8,   8, 100,
].map((i, pos) => {
  const x = Math.floor(pos / 16) - 2
  const y = pos % 16 - 1
  const position = (x >= 0 && y >= 0 && x < 13 && y < 14) ? String(x * 14 + y) : undefined
  return Tile.style(getTileFromIndex(i), position && TileHighlight(position))
}))


// exit
// 386

// player area
//  96,  97,  98,  99,
// 112, 113, 114, 115,
// 128, 129, 130, 131,
