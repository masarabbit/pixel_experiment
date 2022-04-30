import { overlay, artboard, elements, input }  from '../elements.js'
import { styleTarget, resizeCanvas } from '../actions/utils.js'
import { artData } from '../state.js'
import { drawGrid, paintCanvas, updateColorsAndPaint } from '../actions/draw.js'

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
  drawGrid()
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
}