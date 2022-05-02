import { input, artboard, oCtx, aCtx }  from '../elements.js'
import { artData } from '../state.js'
import { nearestN, calcX, calcY } from './utils.js'
import { populatePalette } from './colors.js'
import { fillBucket } from './grid.js'
import { hex, rgbToHex } from './colors.js'


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

const paintFromColors = ({ arr, ctx, colors }) => {
  const { cellD } = artData
  arr.forEach((_ele, i)=>{
    const x = calcX(i) * cellD
    const y = calcY(i) * cellD
    ctx.fillStyle = colors[i] || 'transparent'
    ctx.fillRect(x, y, cellD, cellD)
  })
}

const paintCanvas = () => {
  const { row, column, cellD } = artData 
  const arr = new Array(row * column).fill('') // TODO this could be a new function?
  
  aCtx.clearRect(0, 0, column * cellD, row * cellD)
  paintFromColors({
    arr,
    ctx: aCtx,
    colors: artData.colors
  })
}

const updateColorsAndPaint = () => {
  artData.colors = input.colors.value.split(',')
  paintCanvas()
}

const arrayGroupedForFlipping = () => {
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

const copyColors = ({ w, h, ctx, data }) =>{
  data.length = 0
  const { cellD } = artData
  const offset = Math.floor(cellD / 2)
  for (let i = 0; i < w * h; i++) {
    const x = i % w * cellD
    const y = Math.floor(i / w) * cellD
    const c = ctx.getImageData(x + offset, y + offset, 1, 1).data //offset
    // this thing included here to prevent rendering black instead of transparent
    c[3] === 0
      ? data.push('transparent')
      : data.push(hex(rgbToHex(c[0], c[1], c[2])))
  }
}


export {
  drawPos,
  drawGrid,
  continuousDraw,
  colorCell,
  paintCanvas,
  flipImage,
  updateColorsAndPaint,
  copyColors,
  paintFromColors
}

