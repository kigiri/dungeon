import { prepare, injectCss } from './h.js'
import { tileSize, mapSize } from './size.js'
import { tilesImages, tileClass } from './texture.js'
import { sub, getState, getTime } from './store.js'

const getY = cell => Math.floor(cell / 14)
const getX = cell => cell % 14

const yPad = tileSize * 2
const xPad = tileSize
const findNextPlace = cellStart => {
  while (!isCellFree(cellStart)) {
    cellStart = (cellStart + 1) % CELL_MAX
  }
  return cellStart
}

const fxClass = injectCss(`
  z-index: 200;
  background-size: cover;
  pointer-events: none;
`)

const steps = {}
const fxSprite = ({ classList, style }, { name, frames, duration, height = 1 }) => {
  classList.add(fxClass)
  style.backgroundImage = `url(assets/${name}.png)`
  style.backgroundSize = `cover`
  style.height = `${height*tileSize}vh`
  const start = getTime()
  const end = start + duration
  console.log({ end, start, duration })
  sub('levelCurrentTime', time => {
    if (time < start || time > end) return style.display = 'none'
    style.display = ''
    const timeSpend = time - start
    const progress = Math.floor(timeSpend / duration * frames)
    console.log({ progress }, timeSpend / duration)
    style.backgroundPosition = `${progress/frames*100}%`
  })
}

const playerSprite = ({ dataUrl }) => {
  // const jump
  // const run
  // const idle
}

const setTile = ({ style, classList }, i) => {
  const realIndex = i % 256
  const x = realIndex % 16
  const y = Math.floor(realIndex / 16)
  const tileName = tilesImages[Math.floor(i/256)]
  style.backgroundImage = `url(assets/tile-${tileName}.png)`
  style.backgroundSize = `${mapSize}vh`
  style.backgroundPosition = `-${x*tileSize}vh -${y*tileSize}vh`
}

const placeTile = ({ style }, cell) => {
  const y = getY(cell)
  const x = getX(cell)
  style.transform = `translate(${xPad + x*tileSize}vh, ${yPad + y*tileSize}vh)`
}

const defaultSprite = (element, { index }) => setTile(element, index)
const itemSprite = () => {

}

const sprites = {
  default: defaultSprite,
  player: playerSprite,
  item: itemSprite,
  fx: fxSprite,
}

const Entity = prepare.css(`
  height: ${tileSize}vh;
  width: ${tileSize}vh;
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
`)

const entities = []
const movingEntities = new Set
const entity = ({ cell, sprite }) => {
  const elem = Entity()
  elem.classList.add(tileClass)
  sprites[sprite.type || 'default'](elem, sprite)
  placeTile(elem, cell)
  const id = `entity${entities.length}`
  const cellKey = `${id}Cell`
  sub(cellKey, value => placeTile(elem, value))
  setState(cellKey, cell)

  const ent = {
    id,
    elem,
    cellKey,
    place: cell => {
      if (cell < 0 || cell > 181) return false
      setState(cellKey, cell)
      return true
    },
  }
  entities.push(ent)
  document.body.appendChild(elem)
  return ent
}

const moveLog = []
const MOVE_SPEED = 20
sub('levelCurrentTime', time => {
  for (const move of moveLog) {
    if (move.start < time && move.end > time) {
      const elapsed = time - move.start
      const percent = elapsed / MOVE_SPEED
      const movement = percent * tileSize
      const x = move.x + movement * move.dirX
      const y = move.y + movement * move.dirY
      move.entity.elem.style.transform = `translate(${x}vh, ${y}vh)`
    }
  }
})

const getMove = entity => {
  const time = getTime()
  for (const move of moveLog) {
    if (move.entity === entity && move.start < time && move.end > time) {
      return move
    }
  }
}

const isMoving = entity => Boolean(getMove(entity))

const startMove = (entity, cell) => {
  if (isMoving(entity)) return
  const entityCell = getState(entity.cellKey)
  const y = getY(entityCell)
  const x = getX(entityCell)
  const dirY = getY(cell) - y
  const dirX = getX(cell) - x
  if ((dirX && dirY) || Math.abs(dirX) > 1 || Math.abs(dirY) > 1) return
  const start = getTime()
  moveLog.push({
    entity,
    start,
    dirY,
    dirX,
    end: start + MOVE_SPEED,
    x: x * tileSize + xPad,
    y: y * tileSize + yPad,
  })
  console.log(moveLog[0])
}

const bboy = entity({
  cell: 76,
  sprite: { index: 145 }
})

entity({
  cell: 62,
  sprite: { type: 'fx', height: 2, name: 'fire0', frames: 7, duration: MOVE_SPEED * 2 }
})

startMove(bboy, 77)
