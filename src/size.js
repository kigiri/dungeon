export const mapSize = 70
export const tileSize = mapSize / 16
export const pixelSize = tileSize / 16
export const px = n => `${n*pixelSize}vh`
export const playerCardSize = (100-mapSize) / 2
export const itemSize = playerCardSize/2 - pixelSize*8
