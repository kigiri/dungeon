import { px, playerCardSize, mapSize } from './size.js'
import { create, prepare, replace } from './h.js'
import { colors } from './colors.js'
import { Bar } from './bar.js'
import { addToolTip } from './tooltip.js'
import { sub } from './store.js'

export const StatContainer = prepare.css('.container', `
  display: flex;
  flex-direction: row;
  align-items: baseline;
`)

export const StatText = prepare.css('.text', `
  display: flex;
  flex-direction: row;
  font-size: ${mapSize/25}vh;
  text-shadow: ${mapSize/250}vh ${mapSize/250}vh black;
  height: ${playerCardSize/4}vh;
  justify-content: space-between;
  flex: 1;
  padding-right: ${px(3)};
`)

const StatTitle = prepare.css('.title', `
  color: ${colors.fg};
  white-space: pre;
`)

const StatValue = prepare.css('.value', `
`)

const statsInfo = {
  tenacity: {
    color: 'red',
    bar: 'life',
    description: create.ul([
      create.li('Improve damage reduction'),
      create.li('Augment total life'),
    ])
  },
  power: {
    bar: 'mana',
    color: 'blue',
    description: create.ul([
      create.li('Improve actions efficacity'),
      create.li('Augment total mana'),
    ])
  },
  luck: {
    color: 'yellow',
    bar: 'experience',
    description: create.ul([
      create.li('Improve experience gain rate'),
      create.li('Improve items quality'),
      create.li('Improve skill proeficiency rate'),
    ])
  }
}

const cap = str => `${str[0].toUpperCase()}${str.slice(1)}`
export const Stat = ({ player, type }) => {
  const info = statsInfo[type]
  const color = info.color
  const value = StatValue.style({ color: colors[`${color}Light`] })
  const text = StatText([ StatTitle(`.${info.bar}`), value ])
  const statValueStateKey = `player${player}${cap(info.bar)}`
  const bar = Bar({
    color,
    text: info.bar,
    current: statValueStateKey,
    max: `${statValueStateKey}Max`
  })
  addToolTip(text, info.description)
  sub(statValueStateKey, n => replace(value, n || 0))
  sub(`player${player}${cap(type)}`, n => {
    // update tooltip with proper calculations about current stat
  })

  return StatContainer([ text, bar ])
}
