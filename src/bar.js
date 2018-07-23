import { create, prepare, replace } from './h.js'
import { colors } from './colors.js'
import { addToolTip } from './tooltip.js'
import { sub, getState } from './store.js'
import { px } from './size.js'

const BarWrapper = prepare.css('.bar', `
  box-sizing: border-box;
  overflow: hidden;
  border: ${px(1)} solid ${colors.dark}66;
  background: ${colors.bgDark};
  height: ${px(7)};
  flex: 1.8;
  display: flex;
  box-shadow:
    inset 0 -${px(1)} 0 0 ${colors.bg}66,
    0 0 0 ${px(1)} ${colors.bgLight}66;
`)

const BarProgress = prepare.css('.progress', `
  height: ${px(5)};
  flex: 1;
  transform: translate(0, 0);
  transition: transform .2s cubic-bezier(0, 0.75, 0.15, 1);
`)

export const Bar = ({ color, text, current, max, ...rest }) => {
  const tooltipText = create.span(text)
  const progress = BarProgress.style({
    background: colors[color],
    boxShadow: `
      inset 0 ${px(1)} 0 0 ${colors[`${color}Light`]},
      inset -${px(1)} 0 0 ${colors[color]},
      inset 0 -${px(2)} 0 0 ${colors[`${color}Dark`]}
    `
  })

  const bar = BarWrapper(rest, progress)

  sub(current, value => {
    const maxValue = getState(max)
    const percent = (1-(value / maxValue)) * 100
    progress.style.transform = `translate(-${percent}%)`
    replace(tooltipText, `${text} - ${value} / ${maxValue} (${~~(percent)}%)`)
  })

  addToolTip(bar, tooltipText)
  return bar
}