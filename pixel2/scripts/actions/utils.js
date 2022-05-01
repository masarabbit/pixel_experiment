import { artData } from '../state.js'

const styleTarget = ({ target, w, h, x, y }) =>{
  const t = target.style
  if (w) t.width = `${w}px`
  if (w && !h) t.height = `${w}px`
  if (h) t.height = `${h}px`
  if (x) t.left = `${x}px`
  if (y) t.top = `${y}px`
}

const calcX = cell => cell % artData.column
const calcY = cell => Math.floor(cell / artData.column)

const resizeCanvas = ({ canvas, w, h }) =>{
  canvas.setAttribute('width', w)
  canvas.setAttribute('height', h || w)
}

const addEvents = (target, action, event, array) =>{
  array.forEach(a => event === 'remove' ? target.removeEventListener(a, action) : target.addEventListener(a, action))
}

const mouse = {
  up: (t, e, a) => addEvents(t, a, e, ['mouseup', 'touchend']),
  move: (t, e, a) => addEvents(t, a, e, ['mousemove', 'touchmove']),
  down: (t, e, a) => addEvents(t, a, e, ['mousedown', 'touchstart']),
  enter: (t, e, a) => addEvents(t, a, e, ['mouseenter', 'touchstart']),
  leave: (t, e, a) => addEvents(t, a, e, ['mouseleave', 'touchmove'])
}

const nearestN = (x, n) => x === 0 ? 0 : (x - 1) + Math.abs(((x - 1) % n) - n)

const blankRemoved = arr => arr.filter(dot => dot)

const sortByFreqRemoveBlankAndDuplicates = arr =>{  
  const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0)
  const orderedByFrequency = blankRemoved(arr).map(ele =>[ele, countOccurrences(blankRemoved(arr), ele)]).sort((a, b) => b[1] - a[1])  
  return [...new Set(orderedByFrequency.map(ele => ele[0]))]
}

const copyText = box =>{
  box.select()
  box.setSelectionRange(0, 99999) // For mobile devices 
  document.execCommand('copy')
}

export {
  styleTarget,
  resizeCanvas,
  mouse,
  nearestN,
  calcX,
  calcY,
  sortByFreqRemoveBlankAndDuplicates,
  copyText,
}