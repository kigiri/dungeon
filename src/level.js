import { state } from './store.js'

const { level } = state

const TICK = 100
let speed = 1
let levelLastTick = 0
let timeout
let isPlaying

const defaultDistribution = { tenacity: 1, power: 1, luck: 1 }
const defaultDistributer = () => defaultDistribution
const getStatRatio = (distributeStats = defaultDistribution) => {
  const stats = distributeStats(level.floor)
  if (!stats) {
    throw Error(`wrong stat output ${state.docUrl}player-distribute-stats`)
  }
  const values = [ stats.tenacity || 0, stats.power || 0, stats.luck || 0 ]

}
export const getPlayer = (ai, index) => {
  const {
    name,
    think,
    trade,
    distributeStats = defaultDistribution,
  } = ai
  try {
    getStatRatio(distributeStats)
  } catch (err) {
    console.error(`failing to distribute stats ${state.docUrl}player-distribute-stats`)
  }
}

export const initLevel = ({ floor, spawn, exit }) => {
  level.floor.set(floor)
  level.spawn.set(spawn)
  level.exit.set(exit)
  level.currentTime.set(10)
  level.computedTime.set(100)
  level.events.set([])
  level.lastTick.set(0)
  // spawn game objects
  // spawn npcs
  // spawn players
}


const applyAction = (entity, params) => {
  const { type, target, area, power, charge, duration } = params
  

/*
  - type **(magical | physical)**
  - target **(player | cell)**
  - area **(amount of cells to spread the action to, default is 0)**
  - power **(amount of power to use, up to 1/3 of current mana)**
  - charge **(amount of time to prepare)**
  - duration **(0 === instant, up to 10 sec)**
*/
}

export const update = delta => {
  const end = state.levelCurrentTime + delta
  level.currentTime = end
  if (end < levelLastTick) {
    for (const event of state.levelEvents) {
      if (event.at > end) {
        // no more actions for this state
        return
      }
      switch (event.type) {
        case 'action':
          state[event.src].position = event.param.target
          break
        case 'move':
          state[event.src].position = event.param.target
          break
        case 'use':
          break
        default: break
      }
    }
    // backward
  } else {
    let nextTick = levelLastTick + TICK
    while (nextTick < end) {
      
      /*
      switch (game.tick(state)) {
        case 'LEVEL_CLEAR':
        case 'PLAYER_DEAD':
        case 'TIMEOUT': {
          // handle game over
        }
        break;
      }
      */
      level.currentTime = levelLastTick
      nextTick = (levelLastTick = nextTick) + TICK
    }
  }
}

export const setSpeed = n => speed = 1 / n
export const next = () => update(TICK)
export const prev = () => update(-TICK)
export const pause = () => {
  isPlaying = false
  clearTimeout(timeout)
}

export const play = () => {
  isPlaying = true
  timeout = setTimeout(play, TICK * speed)
}

export const seek = time => {
  update(time)
  if (isPlaying) {
    timeout = setTimeout(play, TICK * speed)
  }
}

