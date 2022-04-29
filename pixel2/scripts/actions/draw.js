import { input, artboard, overlay, oCtx, aCtx }  from '../elements.js'
import { drawData } from '../drawData.js'
import { nearestN, resizeCanvas, calcX, calcY } from './utils.js'


const drawPos = (e, cellD) => {
  const { top, left } = artboard.getBoundingClientRect()
  return {
    x: nearestN(e.pageX - left, cellD),
    y: nearestN(e.pageY - top, cellD)
  }
}

const drawGrid = () => {
  const { width, height } = overlay.getBoundingClientRect()  
  const { column, row, cellD, gridWidth } = drawData

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
  if (drawData.draw) action(e) 
}

const drawSquare = e => {
  const { cellD, column } = drawData
  const { x, y } = drawPos(e, cellD)
  aCtx.fillStyle = '#000000' // TODO add colour
  aCtx.fillRect(x - cellD, y - cellD, cellD, cellD)
  //* add highlight state
  
  // TODO may split this out
  const index = ((y / cellD - 1) * column) + x / cellD - 1
  drawData.codes[0][index] = '#000000'
  input.codes[0].value = drawData.codes[0]
}

const paintCanvas = () =>{
  const { row, column, cellD } = drawData 
  const arr = new Array(row * column).fill('') // TODO this could be a new function?
  
  resizeCanvas({
    canvas: artboard, 
    w: column * cellD, h: row * cellD
  })
  arr.forEach((_ele, i)=>{
    const x = calcX(i) * cellD
    const y = calcY(i) * cellD
    aCtx.fillStyle = drawData.codes[0][i] === '' ? 'transparent' : drawData.codes[0][i]
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

