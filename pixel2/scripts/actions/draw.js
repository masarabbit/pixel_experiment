import { input, artboard, oCtx, aCtx }  from '../elements.js'
import { artData } from '../state.js'
import { nearestN, calcX, calcY, resizeCanvas } from './utils.js'
import { populatePalette } from './colours.js'
import { fillBucket } from './grid.js'


const drawPos = (e, cellD) => {
  const { top, left } = artboard.getBoundingClientRect()
  return {
    x: nearestN(e.pageX - left, cellD),
    y: nearestN(e.pageY - top, cellD)
  }
}

const drawGrid = () => {
  const { column, row, cellD, gridWidth } = artData
  const { width, height } = artboard.getBoundingClientRect()
  // const width = column * cellD
  // const height = row * cellD

  oCtx.strokeStyle = artData.gridColor
  oCtx.beginPath()
  const pos = (n, type) => n === type ? n * cellD - gridWidth : n * cellD + gridWidth
  for (let x = 0; x <= column; x += 1) {
    oCtx.moveTo(pos(x, column), gridWidth)
    oCtx.lineTo(pos(x, column), height - gridWidth)
  }
  for (let y = 0; y <= row; y += 1) {
    oCtx.moveTo(gridWidth, pos(y, row))
    oCtx.lineTo(width - gridWidth, pos(y, row))
  }
  oCtx.stroke()
}

const continuousDraw = (e, action) => {
  if (artData.draw) action(e) 
}

const colorCell = e => {
  //TODO add highlight state
  
  const { cellD, column, hex } = artData
  const { x, y } = drawPos(e, cellD)

  aCtx.fillStyle = hex
  aCtx[artData.erase ? 'clearRect' : 'fillRect'](x - cellD, y - cellD, cellD, cellD)

  const value = artData.erase || hex === 'transparent' 
    ? 'transparent' 
    : hex  // transparent replaced with ''

  // TODO may split this out
  const index = ((y / cellD - 1) * column) + x / cellD - 1
  artData.fill 
    ? fillBucket(index)
    : artData.colors[index] = value
  input.colors.value = artData.colors

  populatePalette(artData.colors)
}

const paintCanvas = () =>{
  const { row, column, cellD } = artData 
  const arr = new Array(row * column).fill('') // TODO this could be a new function?
  
  aCtx.clearRect(0, 0, column * cellD, row * cellD)
  arr.forEach((_ele, i)=>{
    const x = calcX(i) * cellD
    const y = calcY(i) * cellD
    // aCtx.fillStyle = artData.colors[i] === '' ? 'transparent' : artData.colors[i]
    aCtx.fillStyle = artData.colors[i] || 'transparent'
    aCtx.fillRect(x, y, cellD, cellD)
  })
}

const updateColorsAndPaint = () =>{
  artData.colors = input.colors.value.split(',')
  paintCanvas()
}

const arrayGroupedForFlipping = () =>{
  const arr = new Array(+input.row.value).fill('')
  const mappedArr = arr.map(()=>[])
  input.colors.value.split(',').forEach((d, i)=>{
    mappedArr[Math.floor(i / input.column.value)].push(d)
  })
  return mappedArr
}

const flipImage = orientation => {
  input.colors.value = orientation === 'horizontal' 
    ? arrayGroupedForFlipping().map(a => a.reverse()).join(',')
    : arrayGroupedForFlipping().reverse().join(',')
  updateColorsAndPaint()
}

export {
  drawPos,
  drawGrid,
  continuousDraw,
  colorCell,
  paintCanvas,
  flipImage,
  updateColorsAndPaint
}

