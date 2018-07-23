export const mapSize = 60
export const tileSize = mapSize / 16
export const pixelSize = tileSize / 16
export const px = n => `${n*pixelSize}vh`
export const controlSize = 5
export const playerCardSize = (100-(mapSize+controlSize)) / 2
export const itemSize = playerCardSize/2 - pixelSize*8
