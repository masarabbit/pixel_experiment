import { input, artboard, aCtx }  from '../elements.js'
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
  
  if (!artData.palette.includes(value)) {
    artData.palette.push(value)
    populatePalette(artData.palette)
  }

  // populatePalette(artData.colors) // TODO this slows down the drawing a lot when grid is large
  recordState()
}

const paintFromColors = ({ ctx, colors }) => {
  const { cellD } = artData
  colors.forEach((_ele, i)=>{
    const x = calcX(i) * cellD
    const y = calcY(i) * cellD
    ctx.fillStyle = colors[i] || 'transparent'
    ctx.fillRect(x, y, cellD, cellD)
  })
}

const paintCanvas = () => {
  const { row, column, cellD } = artData 
  // const arr = Array(row * column).fill('')
  
  aCtx.clearRect(0, 0, column * cellD, row * cellD)
  paintFromColors({
    ctx: aCtx,
    colors: artData.colors
  })
  // populatePalette(artData.colors)
  recordState()
}

const updateColorsAndPaint = () => {
  artData.colors = input.colors.value.split(',')
  paintCanvas()
}

const arrayGroupedForFlipping = () => {
  const arr = Array(+input.row.value).fill('')
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

const downloadImage = () =>{
  const link = document.createElement('a')
  link.download = `${input.fileName.value || 'art'}_${new Date().getTime()}.png`
  link.href = artboard.toDataURL()
  link.click()
}

const recordState = () =>{
  const { row, column, cellD } = input 
  const lastPrev = artData.prev.length && artData.prev[artData.prev.length - 1]

  if (lastPrev &&
      lastPrev.colors === input.colors.value &&
      lastPrev.row === +row.value &&
      lastPrev.column === +column.value
  ) return

  artData.prev.push({
    colors: input.colors.value,
    row: +row.value,
    column: +column.value,
    cellD: +cellD.value,
  })
  // keep artData.prev under 5 steps
  if (artData.prev.length > 5) artData.prev = artData.prev.filter((d, i) =>{
    if(i !== 0) return d
  })
}


export {
  drawPos,
  continuousDraw,
  colorCell,
  paintCanvas,
  flipImage,
  updateColorsAndPaint,
  copyColors,
  paintFromColors,
  downloadImage,
  recordState,
}

