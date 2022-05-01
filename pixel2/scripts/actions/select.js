import { artData, copyData } from '../state.js'
import { artboard, elements, overlay } from '../elements.js'
import { resizeCanvas, styleTarget, mouse, nearestN } from './utils.js'
import { drawPos } from './draw.js'

const client = (e, type) => e.type[0] === 'm' ? e[`client${type}`] : e.touches[0][`client${type}`]
const roundedClient = (e, type) => nearestN(client(e, type), artData.cellD)


const resizeBox = (e, box) =>{
  const { cellD, gridWidth } = artData
  const { defPos, xy } = copyData

  const { x, y } = drawPos(e, cellD)

  const newXy = {
    x: (x - cellD) / cellD + 1,
    y: (y - cellD) / cellD + 1,
  }

  const xIncreased = newXy.x > xy.x
  const yIncreased = newXy.y > xy.y 
  const xDiff = Math.abs(newXy.x, xy.x) * cellD
  const yDiff = Math.abs(newXy.y, xy.y) * cellD

  // TODO how to limit selectBox size within artboard (currently it can be much larger)

  styleTarget({
    target: box,
    w: xIncreased ? xDiff - defPos.x + gridWidth : defPos.x - xDiff + (2 * gridWidth),
    h: yIncreased ? yDiff - defPos.y + gridWidth : defPos.y - yDiff + (2 * gridWidth),
    x: xIncreased ? defPos.x : xDiff - gridWidth,
    y: yIncreased ? defPos.y : yDiff - gridWidth,
  })



}

// const drag = (target, pos, x, y) =>{
//   pos.a = pos.c - x
//   pos.b = pos.d - y

//   styleTarget({
//     target, 
//     x: target.offsetLeft - pos.a,
//     y: target.offsetTop - pos.b,
//   })
// }



const addTouchAction = target =>{
  const pos = { a: 0, b: 0, c: 0, d: 0 }

  const onGrab = e =>{
    pos.c = roundedClient(e, 'X')
    pos.d = roundedClient(e, 'Y')  
    mouse.up(document, 'add', onLetGo)
    mouse.move(document, 'add', onDrag)
  }
  const onDrag = e =>{
    const x = roundedClient(e, 'X')
    const y = roundedClient(e, 'Y')
    resizeBox(e, target, pos)
    pos.c = x
    pos.d = y
  }
  const onLetGo = e => {
    mouse.up(document, 'remove', onLetGo)
    mouse.move(document,'remove', onDrag)
    const { cellD } = artData
    copyData.defPos = {
      x: target.offsetLeft,
      y: target.offsetTop,
    }
    const { width, height } = target.getBoundingClientRect()
    copyData.size = {
      w: width,
      h: height,
    }
    const { x, y } = drawPos(e, cellD)
    copyData.xy = {
      x: (x - cellD) / cellD + 1,
      y: (y - cellD) / cellD + 1,
    }
  }

  mouse.down(target,'add', onGrab)
}



const createSelectBox = e =>{
  if (!elements.selectBox) {
    const { cellD, gridWidth, column } = artData
    const selectBox = document.createElement('canvas')
    selectBox.classList.add('select_box')
    const boxD = cellD - gridWidth
    elements.canvasWrapper.append(selectBox)
    resizeCanvas({
      canvas: selectBox,
      w: boxD
    })
    const { x, y } = drawPos(e, cellD)
    
    copyData.defPos = {
      x: x - cellD,
      y: y - cellD,
    }
  
    copyData.xy = {
      x: (x - cellD) / cellD + 1,
      y: (y - cellD) / cellD + 1,
    }

    styleTarget({
      target: selectBox,
      w: cellD,
      x: copyData.defPos.x,
      y: copyData.defPos.y
    })

    elements.selectBox = selectBox
    
    addTouchAction(selectBox)
  }
}

export {
  createSelectBox
}

// const returnSelectedCells = ({ firstCell, roundedX, roundedY }) =>{
//   const { cellD, row, column } = artData 
//   if (drawData.copyBox && !drawData.copied){
//     Object.assign(drawData.copyBox.style, { 
//       justifyContent: 'flex-end', alignItems: 'flex-end' 
//     })
//   }
//   let w = drawData?.copyBox.style.width.replace('px','') / cellD || ''
//   let h = drawData?.copyBox.style.height.replace('px','') / cellD || ''
//   const selection = []

//   if (roundedX < 0) w += roundedX // adjusts width if selection is beyond left edge of copyBox
//   if (roundedY < 0) h += roundedY // adjusts height if selection is beyond top edge of copyBox 

//   // adjusts width if selection is beyond right edge of copyBox
//   if (roundedX + w > column) {
//     if (!drawData.copied) drawData.copyBox.style.justifyContent = 'flex-start'
//     w -= Math.abs((roundedX + w) - column) 
//   }
//   // adjust height if selection is beyond bottom edge of copyBox
//   if (roundedY + h > row) {
//     if (!drawData.copied) drawData.copyBox.style.alignItems = 'flex-start'
//     h -= Math.abs((roundedY + h) - row) 
//   }
//   for (let a = firstCell; a < firstCell + (h * column); a += column){
//     for (let b = a; b < (a + w); b++){
//       selection.push(b) 
//     }
//   }
//   if (!drawData.copied){
//     const activeArea = document.querySelector('.active_area')
//     if (!activeArea) {
//       drawData.copyBox.innerHTML = `<div class="active_area" style="width:${w * cellD}px; height:${h * cellD}px;"></div>`
//     } else {
//       setTargetSize({
//         target: activeArea,
//         w: w * cellD, h: h * cellD
//       })
//     }
//   }
//   return selection
// }

// const moveCopyGrid = e =>{
//   if (drawData.copyState && !drawData.moveState) {
//     const { defPos, top, left } = drawData.defaultPos
//     const { column, cellD } = artData 
//     const next = e.target.dataset.cell
//     const newX = calcX(next)
//     const newY = calcY(next)
//     const defPosX = calcX(defPos)
//     const defPosY = calcY(defPos)
    
//     if (!drawData.copyBox) return
//     if (newX !== drawData.prevX && newY === drawData.prevY) {
//       if (defPosX > newX){
//         styleTarget({ x: left - (defPosX - newX) * cellD, w: (defPosX - newX + 1) * cellD })
//       } else {
//         copyData.width = newX - defPosX + 1
//         styleTarget({ x: left, w: copyData.width * cellD })
//       }
//       drawData.prevX = newX
//     } else if (newY !== drawData.prevY) {
//       if (defPosY > newY){ 
//         styleTarget({ y: top - (defPosY - newY) * cellD, h: (defPosY - newY + 1) * cellD })
//       } else {
//         copyData.height = newY - defPosY + 1
//         styleTarget({ y: top, h: copyData.height * cellD })
//       }
//       drawData.prevY = newY
//     } 
//     // copy selected area
//     const { offsetTop, offsetLeft } = drawData.copyBox
//     copyData.index = returnSelectedCells({
//       firstCell: (offsetTop / cellD * column) + (offsetLeft / cellD)
//     })
//   }     
// }