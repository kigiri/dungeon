const updatedKeys = new Set
const listenners = Object.create(null)
const watchers = []
export const state = Object.create(null)

export const subscribe = (key, handler) => Array.isArray(key)
  ? key.forEach(k => subscribe(k, handler))
  : ((listenners[key] || (listenners[key] = [])).push(handler), handler(state))

export const subscribeValue = (key, handler) =>
  subscribe(key, () => handler(state[key]))

export const setState = (key, value) => {
  if (state[key] !== value) {
    state[key] = value
    updatedKeys.add(key)
  }
}

export const addWatcher = watcher => watchers.push(watcher)

requestAnimationFrame(function loop() {
  for (const watcher of watchers) {
    watcher(state)
  }
  if (updatedKeys.size) {
    for (const key of updatedKeys) {
      const handlers = listenners[key]
      if (handlers) {
        for (const handler of handlers) {
          handler(state)
        }
      }
    }
  }
  updatedKeys.clear()
  requestAnimationFrame(loop)
})