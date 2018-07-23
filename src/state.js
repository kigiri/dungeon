import { setDeep } from './store.js'

const defaultSprite = 'data:image/png;base64,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'

// initial state
export const url = 'https://kigiri.github.io/'
export const docUrl = `${url}doc#`
Object.entries({
  level: {
    floor: 0,
    spawn: 15,
    exit: 166,
    currentTime: 0,
    computedTime: 100,
    events: [],
  },
  player0: {
    name: 'player0',
    life: 10,
    mana: 0,
    experience: 0,
    lifeMax: 100,
    manaMax: 100,
    experienceMax: 100,
    item1: null,
    item2: null,
    tenacity: ~~(Math.random() * 100) + 20,
    power: ~~(Math.random() * 100) + 20,
    luck: ~~(Math.random() * 100) + 20,
    sprite: defaultSprite,
  },
  player1: {
    name: 'player1',
    life: 0,
    mana: 0,
    experience: 0,
    lifeMax: 100,
    manaMax: 100,
    experienceMax: 100,
    item1: null,
    item2: null,
    tenacity: ~~(Math.random() * 100) + 20,
    power: ~~(Math.random() * 100) + 20,
    luck: ~~(Math.random() * 100) + 20,
    sprite: defaultSprite,
  },
  mouse: {
    x: 0,
    y: 0,
    l: null,
    r: null,
    m: null,
  }
}).forEach(args => setDeep(...args))

export const items = [
  { icon: 0, luck: 1, type: "sword" },
  { icon: 1, luck: 2, type: "sword" },
  { icon: 2, luck: 0, type: "sword" },
  { icon: 3, luck: 3, type: "saber" },
  { icon: 4, luck: 4, type: "saber" },
  { icon: 5, luck: 4, type: "sword" },
  { icon: 6, luck: 5, type: "sword" },
  { icon: 7, luck: 6, type: "sword" },
  { icon: 8, luck: 1, type: "spear" },
  { icon: 9, luck: 2, type: "spear" },
  { icon: 10, luck: 3, type: "spear" },
  { icon: 11, luck: 4, type: "sword" },
  { icon: 12, luck: 2, type: "axe" },
  { icon: 13, luck: 3, type: "axe" },
  { icon: 14, luck: 4, type: "axe" },
  { icon: 15, luck: 6, type: "axe" },
  { icon: 16, luck: 1, type: "bow" },
  { icon: 17, luck: 3, type: "bow" },
  { icon: 18, luck: 2, type: "bow" },
  { icon: 19, luck: 5, type: "bow" },
  { icon: 20, luck: 1, type: "staff" },
  { icon: 21, luck: 3, type: "staff" },
  { icon: 22, luck: 4, type: "staff" },
  { icon: 23, luck: 6, type: "staff" },
  { icon: 24, luck: 1, type: "shield" },
  { icon: 25, luck: 3, type: "shield" },
  { icon: 26, luck: 2, type: "shield" },
  { icon: 27, luck: 5, type: "shield" },
  { icon: 28, luck: 0, type: "health-potion" },
  { icon: 29, luck: 2, type: "health potion" },
  { icon: 30, luck: 1, type: "mana-potion" },
  { icon: 31, luck: 3, type: "mana-potion" },
  { icon: 32, luck: 3, type: "amulet" },
  { icon: 33, luck: 5, type: "amulet" },
  { icon: 34, luck: 3, type: "amulet" },
  { icon: 35, luck: 5, type: "amulet" },
  { icon: 36, luck: 3, type: "scroll" },
  { icon: 37, luck: 2, type: "scroll" },
  { icon: 38, luck: 0, type: "scroll" },
  { icon: 39, luck: 4, type: "rune" },
  { icon: 40, luck: 1, type: "ring" },
  { icon: 41, luck: 2, type: "ring" },
  { icon: 42, luck: 3, type: "ring" },
  { icon: 43, luck: 5, type: "ring" },
  { icon: 44, luck: 2, type: "helm" },
  { icon: 45, luck: 4, type: "helm" },
  { icon: 46, luck: 5, type: "helm" },
  { icon: 47, luck: 3, type: "helm" },
  { icon: 48, luck: 0, type: "boots" },
  { icon: 49, luck: 3, type: "boots" },
  { icon: 50, luck: 5, type: "boots" },
  { icon: 51, luck: 1, type: "boots" },
  { icon: 52, luck: 2, type: "hat" },
  { icon: 53, luck: 3, type: "hat" },
  { icon: 54, luck: 7, type: "hat" },
  { icon: 55, luck: 0, type: "helm" },
  { icon: 56, luck: 1, type: "armor" },
  { icon: 57, luck: 2, type: "armor" },
  { icon: 58, luck: 4, type: "armor" },
  { icon: 59, luck: 6, type: "armor" },
  { icon: 60, luck: 0, type: "gloves" },
  { icon: 61, luck: 1, type: "gloves" },
  { icon: 62, luck: 3, type: "gloves" },
  { icon: 63, luck: 4, type: "gloves" },
  { icon: 64, luck: 0, type: "food" },
  { icon: 65, luck: 2, type: "food" },
  { icon: 66, luck: 4, type: "food" },
  { icon: 67, luck: 5, type: "food" },
  { icon: 68, luck: 4, type: "key" },
  { icon: 69, luck: 0, type: "key" },
  { icon: 70, luck: 0, type: "candle" },
  { icon: 71, luck: 7, type: "artifact" }
]

/*
setState('player0MaxExperience', ~~(Math.random() * 1000))
setState('player0MaxLife', ~~(Math.random() * 1000))
setState('player0MaxMana', ~~(Math.random() * 1000))
// setState('player0CurrentExperience', ~~(Math.random() * state.player0MaxExperience))
// setState('player0CurrentLife', ~~(Math.random() * state.player0MaxLife))
// setState('player0CurrentMana', ~~(Math.random() * state.player0MaxMana))
setState('player0Name', 'francis')
setState('player0Sprite', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAABgCAYAAADFNvbQAAAFZklEQVR4Xu2dsW4UMRCGNxIVJWgRkRAg2igN4hlS8xI0EQ/AI0CPaHgEmtQ8A6KJ0iJASCkQNEiUBPkkR453vbZn/vWM9+YqdLe2Z/9vZnbP++c4GOzVtQIHXUdvwQ8GsPMkMIAGsHMFOg/fKnBrAJ88fna1dE5fvn4y6Iqg34Dh4N27f2sYxzEZ4sX55WAQ9RDcAXTgjo4PBwfHAXSvFER3jD/WQMqDvK7AXOuMQzV48vBcBJMW+vrk9/D0+aNkdCenf6yF6mC3i8IAKoJBCcUAUlRTNCYJ8P3L012YL96+uw7Xvffh3xtroQZQkQKdh5KswM9n33anFt7QuPdefbxjFagIul0DFcGghGIAKaopGjMBeHdc3ur89fPKWqhmgA8e3l4M78f3vwbQACpSoPNQki3Utcrw5VurtVBdxGcBxpDcRrcDaPB0wZvdC3Vvxk8a/JMKewKhHKC+8CyinAJmj8gppPxzA6gcUC48A5hTSPnnBlA5oFx4BjCnkPLPJwBz5ib7KqGLKNwXKp0A0uu3xgv1hSKMwRwAiPVbA+CuB/GFoozBVACo9bliSoyHPdDNVU58cuG1FAGAs76E8Kg1YQBdQE5EqjEYAYCzPkrQ1vOoAchNAMT41uIj1oP6QrkVID0eIWjrOVYDSDEGIwFS1m8tPmI9qC80BEARUHo8QtDWc6x2DaQYg5EAKeu3Fh+x3moAU8Et/XlaCJACgNuCEYK2ngPqC+UKKD2+tfiI9SYAOb5Qb35aCmzJGIUAuG/GZDhA6QTgrI+oiNZzQH2hroI4AkqPby0+Yj2oLzRsoRRjMAJgaEAOBdqqMXkC0J001Rca7mfGm9VezKUHwqX7oak5uOsjKqL1HGapaK04eD0DCBa09XQGsLXi4PUMIFjQ1tPBAeZuRMzVhkUMtRVSPS3YU9qv2SC2QoSnxctuFVyXgDBbYU74OKy5Voqo4FwcW2vhEFthWD0UUxOqghEJUJf/8kereR6Yq5ylCkYlgDyO+gjUAHShcx4ncRKgXjY9I1YDyPXEpCQqfaJPGa8HS3kkm3WlGUDC74UiPS0SFVye93qOXM1WSKkApCuNkgB6sJRHsto1kAuQ60ozgAkCuZsIjqmIcxca38VSEqA87/UcCbcVcj0xlI0A7kaCHhz1kcBcaf57GBegZAXXyyc/AgIw9oPGhiZ/mjljEdLUlJJ2az/Yd2MvNOXocmIsie8BenAc0xG3gjnj5eupPoIJwLkMTbm9wmuP/zdlt7+kgnPV629i9hqgE4ECoD5vbo6I9zFTtsbcb5aG84TX0rilS5wjV6PUeLilYq1Ac10gXtcfn4O+Vryt5u0GYCtBelvHAPZGLIrXABrAzhXoPHyrwK0BzFkTcrfg0uM751EdPsQXGn6h5/w35vvoKkt9/UmRjAsI4gvlusK448OT5XaA6hKIBnDWpyQwzBeaCzwWJrXbUiqgRmMwBYDfAjw6Phwuzi8H18HcaxzHWSncMf5Yp4HaJ/IpkHMPlFEVLAEgvPyUJq87zifwJgD6LKYIwK0ALoC4/dc+0N4MQA+iVgBpAKsBpJiCpF1lSE9NTQsPk4CaQNQEVGvs5SZQLwBSFVh6/qv5QimusN6NwRIdaLPXwNIM5lbAWuNLC2CzAEsFkAYAv4nh2vqkx6NuIrgJ0OoaDLEVhndhHFMRwlaIAtgKQFyBtQWwOYC1AnBbGBdAPL62AJLWeuqvDXJ+LTC0F1LXrxVAGgAMYCze0mZzrXE33uqijs85zBAtmJsA3PG1BVBk7K3ZY1zr2BJboaYKpnaQuSQNne+zzwPDCsk9cV8LEGLeJcilCVASB7WD+Llz42t+r/U/lp9U6Mpx8a8AAAAASUVORK5CYII=')
setState('player1MaxExperience', ~~(Math.random() * 1000))
setState('player1MaxLife', ~~(Math.random() * 1000))
setState('player1MaxMana', ~~(Math.random() * 1000))
// setState('player1CurrentExperience', ~~(Math.random() * state.player1MaxExperience))
// setState('player1CurrentLife', ~~(Math.random() * state.player1MaxLife))
// setState('player1CurrentMana', ~~(Math.random() * state.player1MaxMana))
setState('player1Tenacity', ~~(Math.random() * 100) + 20)
setState('player1Power', ~~(Math.random() * 100) + 20)
setState('player1Luck', ~~(Math.random() * 100) + 20)
setState('player1Name', 'skullboy')
setState('player1Sprite', )

//setInterval(() => {
  setState('player0Item0', { ...items[Math.floor(Math.random()*items.length)] })
  setState('player0Item1', { ...items[Math.floor(Math.random()*items.length)] })
  setState('player1Item0', { ...items[Math.floor(Math.random()*items.length)] })
  setState('player1Item1', { ...items[Math.floor(Math.random()*items.length)] })
//}, 1000)

initLevel({
  difficulty: 0,
  spawn: 15,
  exit: 166,
})

window.setState = setState

const level = {
  difficuty: Number,
  elapsedTime: Number,
  totalTime: Number,
  spawn: Number, // case players start from
  exit: Number, // case were the exit is
  events: [ Object ], // Events
}

const Event = {
  at: Number, // timestamp
  src: String, // unit-id
  type: String, // [ action, move, use ]
  params: Object // vary from type
}

//*/