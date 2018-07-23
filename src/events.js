import { getState, setState, addWatcher } from './store.js'

const mouseKeys = Object.create(null)
mouseKeys[1] = 'mouseL'
mouseKeys[2] = 'mouseM'
mouseKeys[3] = 'mouseR'

const handleMousePosition = e => {
  setState('mouseX', e.pageX || 0)
  setState('mouseY', e.pageY || 0)
  setState('hover', e.target)
  if (!e.which) {
    setState('mouseL', null)
    setState('mouseM', null)
    setState('mouseR', null)
  }
}

window.addEventListener('mousemove', handleMousePosition, false)
window.addEventListener('mouseleave', e => setState('hover', null), false)

window.addEventListener('mouseup', e => {
  setState(mouseKeys[e.which], null)
  handleMousePosition(e)
}, false)

window.addEventListener('mousedown', e => {
  setState(mouseKeys[e.which], Date.now())
  handleMousePosition(e)
}, false)

export const watch = (elem, key, stateKey = key) => {
  const watcher = () => setState(stateKey, elem[key])
  watcher()
  addWatcher(watcher)
}

watch(window, 'innerHeight', 'windowHeight')
watch(window, 'innerWidth', 'windowWidth')

// window.addEventListener('keyup', e => setState(`key${e.key}`, null), false)
// window.addEventListener('keydown', e => setState(`key${e.key}`, Date.now()), false)

