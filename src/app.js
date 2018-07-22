import { create, prepare, append, replace, injectCss } from './h.js'
import { items } from './items.js'
import { subscribe } from './store.js'
import { addToolTip } from './tooltip.js'
import { mapSize, tileSize, pixelSize, px, itemSize, playerCardSize } from './size.js'
import { color } from './color.js'

const tilesImages = [ 'dungeon', 'walls' ]
const getTileFromIndex = i => ({
  backgroundImage: `url(assets/tile-${tilesImages[Math.floor(i/256)]}.png)`,
  backgroundColor: i === 289 ? color.bg : '',
  backgroundPosition:
    `-${((i%256) % 16) * tileSize}vh -${Math.floor((i%256) / 16) * tileSize}vh`,
})

const tileClass = injectCss(`
  background-repeat: no-repeat;
  image-rendering: optimizeSpeed;
  image-rendering: -moz-crisp-edges;
  image-rendering: -o-crisp-edges;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: pixelated;
  image-rendering: optimize-contrast;
  -ms-interpolation-mode: nearest-neighbor;
`)

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
  background-position: 0vh -18.5vh;
  background-size: 60vh;
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

const StatContainer = prepare.css('.container', `
  display: flex;
  flex-direction: row;
  align-items: baseline;
`)

const StatText = prepare.css('.text', `
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

const Stat = type => {
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

  return StatContainer([
    text,
    bar,
  ])
}

const Items = prepare.css('.items', `
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: ${px(2)};
`)

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

const Item = slot => {
  const padding = pixelSize * 2
  const size = pixelSize * 15
  const content = ItemContent()
  const itemText = create.span('')

  const setItem = index => {
    const item = items[index]
    replace(itemText, `${item.type}-${item.luck} - slot ${slot}`)
    const x = index % 8
    const y = Math.floor(index / 8)
    content.style.backgroundPosition = `${-x*size + padding}vh ${-y*size + padding}vh`
  }
  addToolTip(content, itemText)
  setItem(Math.floor(Math.random() * items.length))
  return content
}

const PlayerCard = (props) => {
  const wrapper = create.css('.wrapper', `
    display: flex;
    height: ${playerCardSize}vh;
  `, [
    Portrait([
      PortraitIcon.style({ backgroundImage: `url(${props.sprite})` }),
      Items([ Item(0), Item(1) ]),
    ]),
    Stats([ StatContainer(StatText(props.name[0].toUpperCase()+props.name.slice(1))) ]
      .concat([ 'tenacity', 'power', 'luck' ].map(Stat))),
  ])

  return wrapper
}

const Tile = prepare.css(`.${tileClass}`, `
  height: ${tileSize}vh;
  width: ${tileSize}vh;
  background-size: ${mapSize}vh;
`)

const mapElem = create.css('#map', `
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

export const editorElem = create.css('#editor', `
  background: hsl(231, 15%, 18%);
  height: 100vh;
  width: calc(100vw - ${mapSize}vh);
`)

export const app = [
  create.css('#left-pane.pane.no-select', `width: ${mapSize}vh`, [
    mapElem,
    create('#party', [
      PlayerCard({
        name: 'francis',
        sprite: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAABgCAYAAADFNvbQAAAFZklEQVR4Xu2dsW4UMRCGNxIVJWgRkRAg2igN4hlS8xI0EQ/AI0CPaHgEmtQ8A6KJ0iJASCkQNEiUBPkkR453vbZn/vWM9+YqdLe2Z/9vZnbP++c4GOzVtQIHXUdvwQ8GsPMkMIAGsHMFOg/fKnBrAJ88fna1dE5fvn4y6Iqg34Dh4N27f2sYxzEZ4sX55WAQ9RDcAXTgjo4PBwfHAXSvFER3jD/WQMqDvK7AXOuMQzV48vBcBJMW+vrk9/D0+aNkdCenf6yF6mC3i8IAKoJBCcUAUlRTNCYJ8P3L012YL96+uw7Xvffh3xtroQZQkQKdh5KswM9n33anFt7QuPdefbxjFagIul0DFcGghGIAKaopGjMBeHdc3ur89fPKWqhmgA8e3l4M78f3vwbQACpSoPNQki3Utcrw5VurtVBdxGcBxpDcRrcDaPB0wZvdC3Vvxk8a/JMKewKhHKC+8CyinAJmj8gppPxzA6gcUC48A5hTSPnnBlA5oFx4BjCnkPLPJwBz5ib7KqGLKNwXKp0A0uu3xgv1hSKMwRwAiPVbA+CuB/GFoozBVACo9bliSoyHPdDNVU58cuG1FAGAs76E8Kg1YQBdQE5EqjEYAYCzPkrQ1vOoAchNAMT41uIj1oP6QrkVID0eIWjrOVYDSDEGIwFS1m8tPmI9qC80BEARUHo8QtDWc6x2DaQYg5EAKeu3Fh+x3moAU8Et/XlaCJACgNuCEYK2ngPqC+UKKD2+tfiI9SYAOb5Qb35aCmzJGIUAuG/GZDhA6QTgrI+oiNZzQH2hroI4AkqPby0+Yj2oLzRsoRRjMAJgaEAOBdqqMXkC0J001Rca7mfGm9VezKUHwqX7oak5uOsjKqL1HGapaK04eD0DCBa09XQGsLXi4PUMIFjQ1tPBAeZuRMzVhkUMtRVSPS3YU9qv2SC2QoSnxctuFVyXgDBbYU74OKy5Voqo4FwcW2vhEFthWD0UUxOqghEJUJf/8kereR6Yq5ylCkYlgDyO+gjUAHShcx4ncRKgXjY9I1YDyPXEpCQqfaJPGa8HS3kkm3WlGUDC74UiPS0SFVye93qOXM1WSKkApCuNkgB6sJRHsto1kAuQ60ozgAkCuZsIjqmIcxca38VSEqA87/UcCbcVcj0xlI0A7kaCHhz1kcBcaf57GBegZAXXyyc/AgIw9oPGhiZ/mjljEdLUlJJ2az/Yd2MvNOXocmIsie8BenAc0xG3gjnj5eupPoIJwLkMTbm9wmuP/zdlt7+kgnPV629i9hqgE4ECoD5vbo6I9zFTtsbcb5aG84TX0rilS5wjV6PUeLilYq1Ac10gXtcfn4O+Vryt5u0GYCtBelvHAPZGLIrXABrAzhXoPHyrwK0BzFkTcrfg0uM751EdPsQXGn6h5/w35vvoKkt9/UmRjAsI4gvlusK448OT5XaA6hKIBnDWpyQwzBeaCzwWJrXbUiqgRmMwBYDfAjw6Phwuzi8H18HcaxzHWSncMf5Yp4HaJ/IpkHMPlFEVLAEgvPyUJq87zifwJgD6LKYIwK0ALoC4/dc+0N4MQA+iVgBpAKsBpJiCpF1lSE9NTQsPk4CaQNQEVGvs5SZQLwBSFVh6/qv5QimusN6NwRIdaLPXwNIM5lbAWuNLC2CzAEsFkAYAv4nh2vqkx6NuIrgJ0OoaDLEVhndhHFMRwlaIAtgKQFyBtQWwOYC1AnBbGBdAPL62AJLWeuqvDXJ+LTC0F1LXrxVAGgAMYCze0mZzrXE33uqijs85zBAtmJsA3PG1BVBk7K3ZY1zr2BJboaYKpnaQuSQNne+zzwPDCsk9cV8LEGLeJcilCVASB7WD+Llz42t+r/U/lp9U6Mpx8a8AAAAASUVORK5CYII='
      }),
      PlayerCard({
        name: 'skullboy',
        sprite: 'data:image/png;base64,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'
      }),
    ]),
  ]),
  create.css('#right-pane.pane', ``, editorElem),
]