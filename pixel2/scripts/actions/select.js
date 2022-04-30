import { artData } from '../state.js'
import { elements } from '../elements.js'
import { resizeCanvas, styleTarget } from './utils.js'
import { drawPos } from './draw.js'


const createSelectBox = e =>{
  if (!elements.selectBox) {
    const { cellD, gridWidth } = artData
    const selectBox = document.createElement('canvas')
    selectBox.classList.add('select_box')
    elements.canvasWrapper.append(selectBox)
    resizeCanvas({
      canvas: selectBox,
      w: cellD - gridWidth
    })
    const { x, y } = drawPos(e, cellD)
    console.log(x, y)
    styleTarget({
      target: selectBox,
      x: x - cellD,
      y: y - cellD
    })
    elements.selectBox = selectBox
    // selectBox.addEventListener()
  }
}

export {
  createSelectBox
}