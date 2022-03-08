
import { artData } from '../state.js'

const setTargetPos = ({ target, x, y }) =>{
  target.style.left = `${x}px`
  target.style.top = `${y}px`
}

const setTargetSize = ({ target, w, h }) =>{
  target.style.width = `${w}px`
  target.style.height = `${h}px`
}

const calcX = cell => cell % artData.column
  
const calcY = cell => Math.floor(cell / artData.column)

const rounded = i => ~~(i / artData.cellD) 

const cellWidthAndHeight = () => `width:${artData.cellD}px; height:${artData.cellD}px;`

const blankRemoved = arr => arr.filter(dot => dot)

const sortByFreqRemoveBlankAndDuplicates = arr =>{  
  const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0)
  const orderedByFrequency = blankRemoved(arr).map(ele =>[ele, countOccurrences(blankRemoved(arr), ele)]).sort((a, b) => b[1] - a[1])  
  return [...new Set(orderedByFrequency.map(ele => ele[0]))]
}

const resizeCanvas = ({ canvas, w, h }) =>{
  canvas.setAttribute('width', w)
  canvas.setAttribute('height', h)
}

export { 
  setTargetPos,
  setTargetSize,
  calcX,
  calcY,
  rounded,
  cellWidthAndHeight,
  sortByFreqRemoveBlankAndDuplicates,
  resizeCanvas 
}