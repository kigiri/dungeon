import { px, playerCardSize } from './size.js'
import { create, prepare, replace } from './h.js'
import { color } from './color.js'
import { addToolTip } from './tooltip.js'

export const StatContainer = prepare.css('.container', `
  display: flex;
  flex-direction: row;
  align-items: baseline;
`)

export const StatText = prepare.css('.text', `
  display: flex;
  flex-direction: row;
  font-size: ${playerCardSize/5}vh;
  text-shadow: ${playerCardSize/100}vh ${playerCardSize/100}vh rgba(0,0,0,0.5);
  height: ${playerCardSize/4}vh;
  justify-content: space-between;
  flex: 1;
  padding-right: ${px(3)};
`)

const StatTitle = prepare.css('.title', `
  color: ${color.fg};
  white-space: pre;
`)

const StatValue = prepare.css('.value', `
`)

const BarWrapper = prepare.css('.bar', `
  box-sizing: border-box;
  overflow: hidden;
  border: ${px(1)} solid ${color.dark}66;
  background: ${color.bgDark};
  height: ${px(7)};
  flex: 1.8;
  display: flex;
  box-shadow:
    inset 0 -${px(1)} 0 0 ${color.bg}66,
    0 0 0 ${px(1)} ${color.bgLight}66;
`)

const BarProgress = prepare.css('.progress', `
  height: ${px(5)};
  flex: 1;
  transform: translate(0, 0);
  transition: transform .2s ease-out;
`)

const statsInfo = {
  tenacity: {
    color: 'red',
    barText: 'life',
    description: create.ul([
      create.li('Improve damage reduction'),
      create.li('Augment total life'),
    ])
  },
  power: {
    barText: 'mana',
    color: 'blue',
    description: create.ul([
      create.li('Improve actions efficacity'),
      create.li('Augment total mana'),
    ])
  },
  luck: {
    color: 'yellow',
    barText: 'experience',
    description: create.ul([
      create.li('Improve experience gain rate'),
      create.li('Improve items quality'),
      create.li('Improve skill proeficiency rate'),
    ])
  }
}

export const Stat = type => {
  const info = statsInfo[type]
  const colorType = info.color
  const tooltipText = create.span(info.barText)
  const progress = BarProgress.style({
    background: color[colorType],
    boxShadow: `
      inset 0 ${px(1)} 0 0 ${color[`${colorType}Light`]},
      inset -${px(1)} 0 0 ${color[colorType]},
      inset 0 -${px(2)} 0 0 ${color[`${colorType}Dark`]}
    `
  })
  const bar = BarWrapper(progress)

  addToolTip(bar, tooltipText)

  const value = StatValue.style({
    color: color[`${colorType}Light`]
  }, '999')

  const text = StatText([ StatTitle(` .${type}`), value ])
  addToolTip(text, info.description)

  const setValue = n => replace(value, n)
  const setProgress = n => {
    progress.style.transform = `translate(-${(1-n) * 100}%)`
    replace(tooltipText, `${info.barText} - ${Math.floor((1-n)*100)} / 100`)
  }

  setInterval(() => {
    let rand = Math.random()
    setValue(Math.floor(rand * 1000))
    setProgress(rand) 
  }, 1000)

  return StatContainer([ text, bar ])
}
