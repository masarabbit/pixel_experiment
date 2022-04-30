import { input, artboard, oCtx, aCtx }  from '../elements.js'
import { artData } from '../state.js'
import { nearestN, resizeCanvas, calcX, calcY } from './utils.js'
import { populatePalette } from './colours.js'


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

  oCtx.strokeStyle = 'lightgrey'
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

const drawSquare = e => {
  const { cellD, column, hex } = artData
  const { x, y } = drawPos(e, cellD)
  aCtx.fillStyle = hex
  aCtx.fillRect(x - cellD, y - cellD, cellD, cellD)
  //* add highlight state
  
  // TODO may split this out
  const index = ((y / cellD - 1) * column) + x / cellD - 1
  artData.codes[0][index] = hex
  input.codes[0].value = artData.codes[0]
  
  populatePalette(artData.codes[0])
}

const paintCanvas = () =>{
  const { row, column, cellD } = artData 
  const arr = new Array(row * column).fill('') // TODO this could be a new function?
  
  resizeCanvas({
    canvas: artboard, 
    w: column * cellD, h: row * cellD
  })
  arr.forEach((_ele, i)=>{
    const x = calcX(i) * cellD
    const y = calcY(i) * cellD
    aCtx.fillStyle = artData.codes[0][i] === '' ? 'transparent' : artData.codes[0][i]
    aCtx.fillRect(x, y, cellD, cellD)
  })
}

export {
  drawPos,
  drawGrid,
  continuousDraw,
  drawSquare,
  paintCanvas
}

