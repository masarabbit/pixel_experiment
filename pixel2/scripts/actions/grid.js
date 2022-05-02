import { overlay, artboard, elements, input, oCtx }  from '../elements.js'
import { styleTarget, resizeCanvas } from '../actions/utils.js'
import { artData } from '../state.js'
import { paintCanvas, updateColorsAndPaint } from '../actions/draw.js'

// const drawGrid = () => {
//   const { column, row, cellD, gridWidth } = artData
//   const { width, height } = artboard.getBoundingClientRect()

//   oCtx.strokeStyle = artData.gridColor
//   oCtx.beginPath()
//   const pos = (n, type) => n === type ? n * cellD - gridWidth : n * cellD + gridWidth
//   for (let x = 0; x <= column; x += 1) {
//     oCtx.moveTo(pos(x, column), gridWidth)
//     oCtx.lineTo(pos(x, column), height - gridWidth)
//   }
//   for (let y = 0; y <= row; y += 1) {
//     oCtx.moveTo(gridWidth, pos(y, row))
//     oCtx.lineTo(width - gridWidth, pos(y, row))
//   }
//   oCtx.stroke()
// }

const grid = {
  draw: () => {
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
  },
  clear: () => {
    const { width, height } = artboard.getBoundingClientRect()
    oCtx.clearRect(0, 0, width, height)
  }
}

const resize = () =>{
  const { column, row, cellD } = artData
  const boards = [overlay, artboard]
  boards.forEach(b =>{
    resizeCanvas({
      canvas: b,
      w: column * cellD,
      h: row * cellD
    })
  })
  styleTarget({
    target: elements.canvasWrapper,
    w: column * cellD,
    h: row * cellD
  })
  grid.draw()
  paintCanvas()
}

const checkAreaToFill = ({ codeRef, i, valueToCheck, areaToFill }) =>{
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

const fillBucket = index =>{
  const fillValue = artData.erase ? 'transparent' : input.color.value  //! '' instead of transparent
  const areaToFillBucket = []
  const valueToSwap = artData.colors[index]

  checkAreaToFill({
    codeRef: artData.colors, 
    i: +index, 
    valueToCheck: valueToSwap, 
    areaToFill: areaToFillBucket,
  })
  input.colors.value = input.colors.value.split(',').map((c, i)=>{
    if (!areaToFillBucket.includes(i)) return c
    return c === valueToSwap ? fillValue : c
  }).join(',')

  updateColorsAndPaint()
}

export {
  resize,
  fillBucket,
  grid,
}