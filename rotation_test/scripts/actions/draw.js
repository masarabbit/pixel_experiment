import { input, artboard, aCtx }  from '../elements.js'
import { artData } from '../state.js'
import { nearestN, calcX, calcY } from './utils.js'
import { hex, rgbToHex } from './colors.js'


const drawPos = (e, cellD) => {
  const { top, left } = artboard.getBoundingClientRect()
  return {
    x: nearestN(e.pageX - left, cellD),
    y: nearestN(e.pageY - top, cellD)
  }
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
  const arr = Array(row * column).fill('') // TODO this could be a new function?
  
  aCtx.clearRect(0, 0, column * cellD, row * cellD)
  paintFromColors({
    ctx: aCtx,
    colors: artData.colors
  })
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

// const recordState = () =>{
//   const { row, column, cellD } = input 
//   const lastPrev = artData.prev.length && artData.prev[artData.prev.length - 1]

//   if (lastPrev &&
//       lastPrev.colors === input.colors.value &&
//       lastPrev.row === +row.value &&
//       lastPrev.column === +column.value
//   ) return

//   artData.prev.push({
//     colors: input.colors.value,
//     row: +row.value,
//     column: +column.value,
//     cellD: +cellD.value,
//   })
//   // keep artData.prev under 5 steps
//   if (artData.prev.length > 5) artData.prev = artData.prev.filter((d, i) =>{
//     if(i !== 0) return d
//   })
// }


export {
  drawPos,
  paintCanvas,
  copyColors,
  paintFromColors,
  downloadImage,
}

