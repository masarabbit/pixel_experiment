import { calcX, calcY, resizeCanvas } from '../scripts/utils.js'

const continuousDraw = (e, canDraw, action) => {
  if (canDraw) action(e) 
}

const updateCode = (input, artData) =>{
  const { row, column, cellD } = input 
  const lastPrev = artData.prev.length && artData.prev[artData.prev.length - 1]

  if (lastPrev &&
      lastPrev.data === input.codes[0].value &&
      lastPrev.row === +row.value &&
      lastPrev.column === +column.value
  ) return

  artData.prev.push({
    data: input.codes[0].value,
    row: +row.value,
    column: +column.value,
    cellD: +cellD.value,
  })

  // keep artData.prev under 10 steps
  if (artData.prev.length > 10) artData.prev = artData.prev.filter((d, i) =>{
    if(i !== 0) return d
  })
}

const downloadImage = (canvas, name) =>{
  const link = document.createElement('a')
  link.download = `${name}_${new Date().getTime()}.png`
  link.href = canvas.toDataURL()
  link.click()
}

const paintCanvas = (canvas, ctx, artData) =>{
  const { row, column, cellD } = artData 
  const arr = new Array(row * column).fill('')
  
  resizeCanvas({
    canvas: canvas[0], 
    w: column * cellD, h: row * cellD
  })

  arr.forEach((_ele,i)=>{
    const x = calcX(i, column) * cellD
    const y = calcY(i, column) * cellD
    ctx.fillStyle = artData.codes[0][i] === '' ? 'transparent' : artData.codes[0][i]
    ctx.fillRect(x, y, cellD, cellD)
  })
}

const paintCanvasTwo = (canvas, ctxTwo, artData) =>{
  const { cellD, row, column, calcWidth, calcHeight } = artData 
  const arr = new Array(row * column).fill('')
  
  calcWidth && calcHeight
    ? resizeCanvas({
      canvas: canvas[1], 
      w: calcWidth / cellD,  h: calcHeight - (calcHeight % cellD) / cellD
    })
    : resizeCanvas({
      canvas: canvas[1], 
      w: column, h: row
    })
  
  arr.forEach((_ele,i)=>{
    ctxTwo.fillStyle = artData.codes[0][i] === '' ? 'transparent' : artData.codes[0][i]
    ctxTwo.fillRect(calcX(i, column), calcX(i, column), 1, 1)
  })
}

const copyText = box =>{
  box.select()
  box.setSelectionRange(0, 99999) // For mobile devices 
  document.execCommand('copy')
}

const checkAreaToFill = ({ codeRef, i, valueToCheck, areaToFill, artData }) =>{
  const fillStack = []
  const { column } = artData 
  fillStack.push(i) // first cell to fill
  
  while (fillStack.length > 0){
    const cellToCheck = fillStack.pop() // removes from area to check
    
    if (codeRef[cellToCheck] !== valueToCheck) continue // is the cell value already valueToCheck?
    if (areaToFill.some(d => d === cellToCheck)) continue // is it in areaToFill already?
    areaToFill.push(cellToCheck) // if passed above check, include in areaToFill
  
    if (cellToCheck % column !== 0) fillStack.push(cellToCheck - 1) // check left
    if (cellToCheck % column !== column - 1) fillStack.push(cellToCheck + 1) // check right
    fillStack.push(cellToCheck + column) // check up
    fillStack.push(cellToCheck - column) // check down
  }
}

export {
  continuousDraw,
  updateCode,
  downloadImage,
  paintCanvas,
  paintCanvasTwo,
  copyText,
  checkAreaToFill
}