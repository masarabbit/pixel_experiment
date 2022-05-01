import { artData } from '../state.js'
import { artboard, elements, overlay } from '../elements.js'
import { resizeCanvas, styleTarget, mouse, nearestN } from './utils.js'
import { drawPos } from './draw.js'

const client = (e, type) => e.type[0] === 'm' ? e[`client${type}`] : e.touches[0][`client${type}`]
const roundedClient = (e, type) => nearestN(client(e, type), artData.cellD)


const resizeBox = (handle, box, pos) =>{
  // console.log('resize')
  const { width, height } = box.getBoundingClientRect()
  const { cellD, defPos, gridWidth } = artData

  // TODO defPos / calculation is different depending on handle
  
  const { offsetLeft:aLeft, offsetTop:aTop } = handle
  // console.log(handle.dataset.i)
  const { i } = handle.dataset

  // top: [1, 2].includes(+i) ? '0px' : null,
  // left: [1, 3].includes(+i) ? '0px' : null,
  // bottom: [3, 4].includes(+i) ? '0px' : null,
  // right: [2, 4].includes(+i) ? '0px' : null,
  // const corner = { 
  //   a: 
  //   b:
  //   c:
  //   d:
  // }
  // a -- b
  // |    |
  // c -- d
  
  if (+i === 4) {
    styleTarget({
      target: box,
      w: aLeft < -1 ? nearestN(aLeft * -1, cellD) : width - pos.a,
      h: aTop < -1 ? nearestN(aTop * -1, cellD) : height - pos.b,
      x: aLeft < -1 ? defPos.x + aLeft + (gridWidth * 2): defPos.x,
      y: aTop < -1 ? defPos.y + aTop + (gridWidth * 2): defPos.y
    })
  }

  if (+i === 2) {
    styleTarget({
      target: box,
      w: aLeft < -1 ? nearestN(aLeft * -1, cellD) : width - pos.a,
      h: aTop < -1 ? nearestN(artData.selectBoxSize.h + (aTop * -1), cellD) : height - pos.b, 
      x: aLeft < -1 ? defPos.x + aLeft + (gridWidth * 2): defPos.x,
      y: aTop < -1 ? defPos.y + aTop: defPos.y //TODO needs adjustment
    })
  }


}

const drag = (target, pos, x, y) =>{
  pos.a = pos.c - x
  pos.b = pos.d - y

  styleTarget({
    target, 
    x: target.offsetLeft - pos.a,
    y: target.offsetTop - pos.b,
  })
}



const addTouchAction = target =>{
  const pos = { a: 0, b: 0, c: 0, d: 0 }
  const handles = Array.from(target.childNodes).filter((_, i) => i !== 0)
  let activeHandle
  
  const onGrab = e =>{
    pos.c = roundedClient(e, 'X')
    pos.d = roundedClient(e, 'Y')  
    mouse.up(document, 'add', onLetGo)
    mouse.move(document, 'add', onDrag)
  }
  const onDrag = e =>{
    if (activeHandle) {
      const x = roundedClient(e, 'X')
      const y = roundedClient(e, 'Y')
      drag(activeHandle, pos, x, y)
      resizeBox(activeHandle, target, pos) // refactor
      pos.c = x
      pos.d = y
    }
  }
  const onLetGo = () => {
    mouse.up(document, 'remove', onLetGo)
    mouse.move(document,'remove', onDrag)
    artData.defPos = {
      x: target.offsetLeft,
      y: target.offsetTop,
    }

    const { width, height } = target.getBoundingClientRect()
    artData.selectBoxSize = {
      w: width,
      h: height,
    }
    
    // TODO reset handle pos
    const { i } = +activeHandle.dataset
    Object.assign(activeHandle.style, {
      top: [1, 2].includes(+i) ? '0px' : null,
      left: [1, 3].includes(+i) ? '0px' : null,
      bottom: [3, 4].includes(+i) ? '0px' : null,
      right: [2, 4].includes(+i) ? '0px' : null,
    })
  }
  
  handles.forEach(handle => {
    mouse.down(handle, 'add', ()=> activeHandle = handle)
    mouse.down(handle,'add', onGrab)
  })
}



const createSelectBox = e =>{
  if (!elements.selectBox) {
    const { cellD, gridWidth, column } = artData
    const selectBox = document.createElement('div')
    selectBox.classList.add('select_box')
    const boxD = cellD - gridWidth
    selectBox.innerHTML = `<canvas></canvas>${new Array(4).fill('').map((_, i)=> {
      return `<div class="handle_${i + 1}" data-i="${i + 1}" style="width: ${boxD}px; height: ${boxD}px;"></div>`
    }).join('')}`
    elements.canvasWrapper.append(selectBox)
    // console.log(selectBox.childNodes)
    resizeCanvas({
      canvas: selectBox.childNodes[0],
      w: boxD
    })
    const { x, y } = drawPos(e, cellD)
    
    // TODO might not need this
    // x -- x2
    // |    |
    // y -- y2
    // const index = ((y / cellD - 1) * column) + x / cellD - 1
    // input.svg.value = `index:${index} / x:${(x - cellD) / cellD + 1} / y:${(y - cellD) / cellD + 1}`

    artData.defPos = {
      x: x - cellD,
      x2: x,
      y: y - cellD,
      y2: y,
    }
    // artData.defPos = {
    //   x: (x - cellD) / cellD + 1,
    //   // x2: x,
    //   y: (y - cellD) / cellD + 1,
    //   // y2: y,
    // }
    // console.log(x, y)
    styleTarget({
      target: selectBox,
      w: cellD,
      x: artData.defPos.x,
      y: artData.defPos.y
    })

    artData.selectBoxSize = {
      w: cellD,
      h: cellD,
    }

    elements.selectBox = selectBox
    // overlay.classList.add('freeze')
    // artboard.classList.add('freeze')
    
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