import { overlay, artboard, elements }  from '../elements.js'
import { styleTarget, resizeCanvas } from '../actions/utils.js'
import { drawData } from '../drawData.js'
import { drawGrid, paintCanvas } from '../actions/draw.js'

const resize = () =>{
  const { column, row, cellD } = drawData
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

  // TODO code needs to be updated based on column and row
  paintCanvas()
}

export {
  resize
}