const updatedKeys = new Set
const timedKeys = new Set
const watchers = []
const listenners = Object.create(null)
const state = Object.create(null)

const ifChanged = (fn, prev) => next => next !== prev && fn(prev = next)
const getTimedValue = key => state[key]
  || (state[key] = { keys: [], values: Object.create(null), key })

const timedMap = new Map
const isTimed = key => timedMap.has(key)
  ? timedMap.get(key)
  : timedMap
    .set(key, key.endsWith('Position')
      || key.endsWith('Life')
      || key.endsWith('Mana')
      || key.endsWith('Experience')
      || key.includes('Current'))
    .get(key)

const setTimed = (keys, values, key, value) => {
  const { levelCurrentTime } = state
  const prevKey = keys[keys.length - 1]
  if (prevKey && values[prevKey] === value) return
  values[levelCurrentTime] = value
  updatedKeys.add(key)
  keys.push(levelCurrentTime)

  if (!(prevKey < levelCurrentTime)) {
    keys.sort(descending)
  }
}

const getTimed = (keys, values, key) => {
  const { levelCurrentTime } = state
  let i = keys.length
  while (--i > -1) {
    const key = keys[i]
    if (key <= levelCurrentTime) return values[key]
  }
}

const get = key => state[key]
const set = (key, value) => {
  if (state[key] === value) return
  updatedKeys.add(key)
}

export const subscribe = (key, handler) => Array.isArray(key)
  ? key.forEach(k => subscribe(k, handler))
  : ((listenners[key] || (listenners[key] = [])).push(handler), handler(state))

export const sub = (key, handler) => {
  if (!isTimed(key)) return subscribe(key, () => handler(state[key]))
  timedKeys.add(key)
  const fn = ifChanged(handler)
  const getter = timedGetter(getTimedValue(key))
  return subscribe(key, () => fn(getter()))
}

export const getState = key => {
  if (!isTimed(key)) return state[key]
  const { keys, values } = getTimedValue(key)
  return getTimed(keys, values, key)
}

export const setState = (key, value) => {
  if (state[key] === value) return
  updatedKeys.add(key)
  if (!isTimed(key)) return state[key] = value
  const { keys, values } = getTimedValue(key)
  return setTimed(keys, values, key, value)
}

export const setDeep = (key, obj) => {
  if (obj && typeof obj === 'object') {
    for (const k of Object.keys(obj)) {
      setDeep(`${key}${cap(k)}`, obj[k])
    }
  } else {
    setState(key, obj)
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
  if (updatedKeys.has('levelCurrentTime')) {
    for (const key of timedKeys) {
      for (const handler of listenners[key]) {
        handler()
      }
    }
  }
  updatedKeys.clear()
  requestAnimationFrame(loop)
})

const timedGetter = ({ keys, values, key }) => () => getTimed(keys, values, key)
const descending = (a, b) => a - b
const timedSetter = ({ keys, values, key }) =>
  value => setTimed(keys, values, key, value)
const cap = str => `${str[0].toUpperCase()}${str.slice(1)}`
const decap = str => `${str[0].toLowerCase()}${str.slice(1)}`

const accessorsCache = Object.create(null)
const getAccessor = key => {
  if (key in accessorsCache) return accessorsCache[key]
  if (key in state) {
    if (isTimed(key)) {
      console.log('heyy', key)
      const T = getTimedValue(key)
      return accessorsCache[key] = { get: timedGetter(T), set: timedSetter(T) }
    }
    return accessorsCache[key] = {
      get: () => get(key),
      set: value => set(key, value)
    }
  }
  const reconstructed = accessorsCache[key] = {}
  for (const subKey of Object.keys(state)) {
    if (subKey.startsWith(key)) {
      reconstructed[decap(subKey.slice(key.length))] = getAccessor(subKey)
    }
  }
  return reconstructed
}

const proxyfi = stateKey => {
  const cache = Object.create(null)
  return new Proxy(() => new Proxy({}, {
    get: (_, key) => getAccessor(stateKey ? `${stateKey}${cap(key)}` : key)
  }), {
    get: (fn, key) => {
      if (key in fn) return fn[key]
      if (key in cache || typeof key !== 'string') return cache[key]
      return cache[key] = proxyfi(stateKey ? `${stateKey}${cap(key)}` : key)
    }
  })
}

const accessors = proxyfi()

export { accessors as state }

//*
window.sub = sub
window.state = state
window.setState = setState
//*/