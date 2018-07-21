const classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/
const notClassId = RegExp.prototype.test.bind(/^\.|#/)

export const parseTag = (tag, props) => {
  if (!tag) return 'div'
  
  const tagParts = tag.split(classIdSplit)
  let tagName
  
  if (notClassId(tagParts[1])) {
    tagName = 'div'
  }
  
  let classes, part, type, i
  
  for (i = 0; i < tagParts.length; i++) {
    part = tagParts[i]

    if (!part) continue

    type = part[0]

    if (!tagName) {
      tagName = part
    } else if (type === '.') {
      (classes || (classes = [])).push(part.slice(1))
    } else if (type === '#') {
      props.id || (props.id = part.slice(1))
    }
  }
  
  if (classes) {
    if (props.className) {
      classes.push(props.className)
    }
    props.className = classes.join(' ')
  }
  
  return props.namespace ? tagName : tagName
}

const isStr = str => typeof str === 'string'
const isTag = tag => isStr(tag) && !tag.includes(' ')
const isChildren = child => child
  && isStr(child)
  || Array.isArray(child)
  || child instanceof Element

function appendChild(child) {
  if (child === undefined) return
  if (child instanceof Element) return this.appendChild(child)
  if (Array.isArray(child)) return child.forEach(appendChild, this)
  return this.appendChild(document.createTextNode(String(child)))
}

export const append = (elem, child) => appendChild.call(elem, child)

const mergePropsDefault = (a, b) => {
  if (!b) return a
  const keys = Object.keys(b)
  let i = -1
  while (++i < keys.length) {
    if (!a[keys[i]]) {
      a[keys[i]] = b[keys[i]]
    } else if (typeof a[keys[i]] === 'object') {
      mergePropsDefault(a[keys[i]], b[keys[i]])
    } else {
      a[keys[i]] = b[keys[i]]
    }
  }
  return a
}

const setAttr = (elem, val, key) => elem.setAttribute(key, val)
const assignAttr = (elem, val, key) => elem[key] = val
const deepAssignAttr = (elem, val, key) => Object.assign(elem[key], val)
const mergeCssClass = (elem, val) =>
  elem.classList.add.apply(elem.classList, val.split(' '))
const cssMap = new Map
export const injectCss = value => {
  const style = document.createElement('style')
  const className = `h-${Math.random().toString(36).slice(2)}`
  style.innerHTML = value.includes('_')
    ? value.replace(/_/g, className)
    : `.${className} {${value}}`
  document.head.appendChild(style)
  cssMap.set(value, className)
  return className
}

const mergeCss = (elem, value) =>
  elem.classList.add(cssMap.get(value) || injectCss(value))

// TODO: create handlers for aria
export const getHandler = key => {
  switch (key) {
    case 'class':
    case 'className': return mergeCssClass
    case 'css': return mergeCss
    case 'data':
    case 'dataset':
    case 'style': return deepAssignAttr
    default: {
      if (key.indexOf('-') !== -1) return setAttr
      return assignAttr
    }
  }
}

function merger([ key, value ], index, props) {
  return value !== undefined && getHandler(key)(this, value, key, props)
}

function updateElement(props) {
  props && Object.entries(props).forEach(merger, this)
}

export const update = (elem, props) => updateElement.call(elem, props)

const createElement = (args, props, child) => {
  if (isChildren(props)) {
    child = props
    props = undefined
  }

  const elem = document.createElement(args.tag)
  elem.hUpdate = updateElement
  elem.hAppend = appendChild
  elem.hUpdate(args.props)
  elem.hUpdate(props)
  elem.hAppend(child)
  return elem
}

const prepareArgs = (tag, props, key) => {
  if (isTag(tag)) {
    props = key ? { [key]: props } : (props || {})
    tag = parseTag(tag, props).toLowerCase()
  } else {
    props = key ? { [key]: tag } : tag
    tag = 'div'
  }
  Object.keys(props).length || (props = undefined)
  return { tag, props }
}

const extend = (args, props) => preparedH(mergePropsDefault(args, args))

const knownProps = [
  'class',
  'className',
  'data',
  'dataset',
  'css',
  'style'
]

const curryMap = new WeakMap
const curryProxyGet = (fn, key) => fn[key] || (fn[key] = curryMap.get(fn)(key))
const curryProxy = (fn, curry) => {
  curryMap.set(fn, curry)
  return new Proxy(fn, { get: curryProxyGet })
}

const preparedH = args => {
  const create = (props, child) => createElement(args, props, child)

  create.extend = curryProxy(
    (tag, props) => extend(args, prepareArgs(tag, props)),
    key => (tag, value) => extend(args, prepareArgs(tag, value, key))
  )

  return curryProxy(create,
    key => (value, child) => createElement(args, { [key]: value }, child)
  )
}

export const prepare = curryProxy(
  (tag, props) => preparedH(prepareArgs(tag, props)),
  key => knownProps.includes(key)
    ? (tag, props) => preparedH(prepareArgs(tag, props, key))
    : props => preparedH(prepareArgs(key, props))
)
export const create = curryProxy((tag, props, child) =>
  createElement(prepareArgs(tag), props, child),
  key => knownProps.includes(key)
    ? (tag, props, child) => createElement(prepareArgs(tag, props, key), child)
    : (props, child) => createElement(prepareArgs(key), props, child)
)

export const empty = el => {
  if (!el) return
  while (el.lastChild && el.lastChild !== el) {
    el.removeChild(el.lastChild)
  }
}

export const replace = (el, content) => {
  empty(el),
  append(el, content)
}
