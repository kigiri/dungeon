import { sub, subscribe } from './store.js'
import { watch } from './events.js'
import { create, replace } from './h.js'
import { pixelSize, mapSize, px } from './size.js'
import { color } from './color.js'


const tooltips = []
export const addToolTip = (elem, content) => tooltips.push([ elem, content ])

const toolTipSize = mapSize/2
const toolTipElem = create.css('.tooltip.no-select', `
  position: fixed;
  z-index: 100;
  padding: ${px(2)} ${px(4)};
  border: ${px(1)} solid ${color.fg}66;
  background: ${color.bgDark}ee;
  font-size: ${px(7)};
  color: ${color.fgLight};
  opacity: 0;
  text-shadow: ${pixelSize*0.4}vh ${pixelSize*0.4}vh rgba(0,0,0,0.5);
  display: flex;
  max-width: ${toolTipSize}vh;
  transition: opacity 0.2s ease-in;
  box-shadow:
    0 0 0 ${px(1)} ${color.dark}ee;
`, 'heyyy')

watch(toolTipElem, 'clientHeight', 'tooltipHeight')
watch(toolTipElem, 'clientWidth', 'tooltipWidth')

sub('hover', hover => {
  for (const [ elem, content ] of tooltips) {
    if (hover === elem || elem.contains(hover)) {
      replace(toolTipElem, content)
      toolTipElem.style.opacity = 1
      return
    }
  }
  toolTipElem.style.opacity = 0
})

subscribe([
  'mouseX',
  'mouseY',
  'tooltipWidth',
  'tooltipHeight',
  'windowHeight',
  'windowWidth',
], state => {
    const {
      mouseX,
      mouseY,
      tooltipWidth,
      tooltipHeight,
      windowHeight,
      windowWidth
    } = state
    const x = ((mouseX + tooltipWidth + 20) > windowWidth) 
      ? mouseX - (20 + tooltipWidth)
      : mouseX + 20
    const y = ((mouseY + tooltipHeight + 15) > windowHeight) 
      ? mouseY - (15 + tooltipHeight)
      : mouseY + 15
    toolTipElem.style.transform = `translate(${x}px, ${y}px)`
  })

document.body.appendChild(toolTipElem)