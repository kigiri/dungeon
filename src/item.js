import { create, prepare, replace } from './h.js'
import { pixelSize, px, itemSize } from './size.js'
import { addToolTip } from './tooltip.js'
import { subscribeValue } from './store.js'
import { color } from './color.js'

const ItemContent = prepare.css('.item', `
  height: ${itemSize}vh;
  width: ${itemSize}vh;
  outline: ${px(1)} solid ${color.fgDark};
  outline-offset: -${px(2)};
  background-image: url(assets/tile-items.png);
  background-size: ${px(120)};
  background-repeat: no-repeat;
  background-position: 100vh;
  box-shadow:
    inset 0 0 0 ${px(2)} ${color.bgDark},
    inset 0 0 ${px(3)} ${px(4)} rgba(0,0,0,0.5);
`)

export const Item = (player, slot) => {
  const padding = pixelSize * 2
  const size = pixelSize * 15
  const content = ItemContent()
  const itemText = create.span('')

  const key = `player${player}Item${slot}`
  subscribeValue(key, item => {
    if (!item) {
      content.style.backgroundPosition = `-1000vh`
      return replace(itemText, `no items - slot ${slot}`)
    }
    const { icon, type, luck } = item
    replace(itemText, `${type}-${luck} - slot ${slot}`)
    const x = icon % 8
    const y = Math.floor(icon / 8)
    content.style.backgroundPosition = `${-x*size + padding}vh ${-y*size + padding}vh`
  })

  addToolTip(content, itemText)
  return content
}