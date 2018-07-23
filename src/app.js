import { items } from './state.js'
import { create, prepare, replace, injectCss } from './h.js'
import { Item } from './item.js'
import { getState, setState, sub, state } from './store.js'
import { mapSize, px, playerCardSize } from './size.js'
import { color } from './color.js'
import { Bar } from './bar.js'
import { mapElem, tileClass } from './map.js'
import { Stat, StatText, StatContainer } from './stat.js'
import { initLevel, play } from './level.js'
import './entity.js'

const { mouse, level } = state()

console.log({ mouse, level })

const boxClass = injectCss(`
  box-sizing: border-box;
  padding: ${px(4)};
  background-color: ${color.bg};
  box-shadow:
    inset 0 0 0 ${px(1)} ${color.dark},
    inset 0 0 0 ${px(2)} ${color.bgDark};
`)

const Portrait = prepare.css(`.portrait.${boxClass}.${tileClass}`, `
  height: ${playerCardSize}vh;
  width: ${playerCardSize}vh;
  display: flex;
  align-item: center;
  background-image: url(assets/tile-dungeon.png);
  background-position: 0% 42%;
  background-size: 400%;
  box-shadow:
    inset 0 0 0 ${px(6)} ${color.dark},
    inset 0 0 0 ${px(7)} ${color.bgDark};
`)

const PortraitIcon = prepare.css(`.icon.${tileClass}`, `
  height: ${playerCardSize/50*24}vh;
  width: ${playerCardSize/50*16}vh;
  background-size: ${playerCardSize*2}vh;
  margin: auto 0 auto ${px(5)};
`)

const Stats = prepare.css(`.stats`, `
  height: ${playerCardSize}vh;
  width: calc(${mapSize}vh - ${playerCardSize *1.15}vh);
`)

const Items = prepare.css('.items', `
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: ${px(2)};
`)

const statsKeys = [ 'tenacity', 'power', 'luck' ]
const PlayerCard = index => {
  const iconElem = PortraitIcon()
  sub(`player${index}Sprite`, sprite =>
    iconElem.style.backgroundImage = `url(${sprite})`)

  const nameElem = StatText()
  sub(`player${index}Name`, (name = 'no-name') =>
    replace(nameElem, name[0].toUpperCase() + name.slice(1)))

  const wrapper = create.css('.wrapper', `
    display: flex;
    height: ${playerCardSize}vh;
  `, [
    Portrait([ iconElem, Items([ Item(index, 0), Item(index, 1) ]) ]),
    Stats([ StatContainer(nameElem) ]
      .concat(statsKeys.map(type => Stat({ player: index, type })))),
  ])

  return wrapper
}

export const editorElem = create.css('#editor', `
  background: hsl(231, 15%, 18%);
  height: 100vh;
  width: calc(100vw - ${mapSize}vh);
`)

export const app = [
  create.css('#left-pane.pane.no-select', `width: ${mapSize}vh`, [
    mapElem,
    create('#party', [ PlayerCard(0), PlayerCard(1) ]),
    create.css('#controls', `
      padding: ${px(3)} ${px(18)};
      display: flex;
      align-items: flex-end;
      font-size: ${px(8)};
    `, [
      'play',
      Bar({
        color: 'green',
        text: 'time',
        current: 'levelCurrentTime',
        max: 'levelComputedTime',
        onmousedown: event => {
          const { target, x } = event
          const { clientWidth, offsetLeft } = event.target
          const pos = Math.max(0, Math.min(clientWidth, x - offsetLeft)) / clientWidth

          level.currentTime.set(Math.round(pos * level.computedTime.get()))
        },
        onmousemove: event => {
          if (!getState('mouseL')) return
          const { target, x } = event
          const { clientWidth, offsetLeft } = event.target
          const pos = Math.min(clientWidth, x - offsetLeft) / clientWidth
          level.currentTime.set(Math.round(pos * level.computedTime.get()))
        },
      }),
      String(4545)
    ])
  ]),
  create.css('#right-pane.pane', ``, editorElem),
]
