import { artData, copyData } from '../state.js'
import { elements, aCtx } from '../elements.js'
import { resizeCanvas, styleTarget, mouse, nearestN } from './utils.js'
import { drawPos, copyColors, paintFromColors } from './draw.js'

const client = (e, type) => e.type[0] === 'm' ? e[`client${type}`] : e.touches[0][`client${type}`]
const roundedClient = (e, type) => nearestN(client(e, type), artData.cellD)


const resizeBox = (e, box) =>{
  const { cellD, column, row, gridWidth } = artData
  const { defPos, xy } = copyData
  const { x, y } = drawPos(e, cellD)
  const newXy = {
    x: (x - cellD) / cellD + 1,
    y: (y - cellD) / cellD + 1,
  }
  const xIncreased = newXy.x >= xy.x
  const yIncreased = newXy.y >= xy.y 
  const xDiff = Math.abs(newXy.x, xy.x) * cellD
  const yDiff = Math.abs(newXy.y, xy.y) * cellD
  const adjustedXdiff = xDiff >= column * cellD ? column * cellD : xDiff
  const adjustedYdiff = yDiff >= row * cellD ? row * cellD : yDiff
  const w = xIncreased ? adjustedXdiff - defPos.x + gridWidth: defPos.x - xDiff + (2 * gridWidth)
  const h = yIncreased ? adjustedYdiff - defPos.y + gridWidth: defPos.y - yDiff + (2 * gridWidth)

  resizeCanvas({
    canvas: box,
    w, h
  })
  styleTarget({
    target: box,
    w, h,
    x: xIncreased ? defPos.x : xDiff - gridWidth,
    y: yIncreased ? defPos.y : yDiff - gridWidth,
  })
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
  
  const onGrab = e =>{
    pos.c = roundedClient(e, 'X')
    pos.d = roundedClient(e, 'Y')  
    mouse.up(document, 'add', onLetGo)
    mouse.move(document, 'add', onDrag)
  }
  const onDrag = e =>{
    const x = roundedClient(e, 'X')
    const y = roundedClient(e, 'Y')
    if (copyData.move) {
      drag(target, pos, x, y)
    } else {
      resizeBox(e, target, pos)
    }
    pos.c = x
    pos.d = y
  }
  const onLetGo = e => {
    mouse.up(document, 'remove', onLetGo)
    mouse.move(document,'remove', onDrag)
    if (!copyData.move) {
      const { cellD, gridWidth } = artData
      const { width, height } = target.getBoundingClientRect()
      const { x, y } = drawPos(e, cellD)
      Object.assign(copyData, {
        size: {
          w: width - gridWidth,
          h: height - gridWidth,
        },
        xy: {
          x: (x - cellD) / cellD + 1,
          y: (y - cellD) / cellD + 1,
        }
      })
    }
    copyData.defPos = {
      x: target.offsetLeft,
      y: target.offsetTop,
    }
  }
  mouse.down(target,'add', onGrab)
}

const createSelectBox = e =>{
  if (!elements.selectBox) {
    const { cellD, gridWidth } = artData
    const selectBox = document.createElement('canvas')
    selectBox.classList.add('select_box')
    const boxD = cellD - gridWidth
    elements.canvasWrapper.append(selectBox)
    resizeCanvas({
      canvas: selectBox,
      w: boxD
    })
    const { x, y } = drawPos(e, cellD)

    Object.assign(copyData, {
      defPos: {
        x: x - cellD,
        y: y - cellD,
      },
      xy: {
        x: (x - cellD) / cellD + 1,
        y: (y - cellD) / cellD + 1,
      },
      size: {
        w: cellD,
        h: cellD,
      },
    })
    styleTarget({
      target: selectBox,
      x: copyData.defPos.x,
      y: copyData.defPos.y
    })
    elements.selectBox = selectBox
    addTouchAction(selectBox)
    copyData.move = false
  }
}

// const returnSelectedIndex = () =>{
//   const { cellD, column } = artData
//   const { x, y } = drawPos(e, cellD)
//   const index = ((y / cellD - 1) * column) + x / cellD - 1
// }

const copySelection = cut =>{
  if (elements.selectBox) {
    copyData.ctx = elements.selectBox.getContext('2d')
    const { size: { w, h }, defPos: { x, y }, ctx } = copyData
    ctx.putImageData(aCtx.getImageData(x, y, w, h), 0, 0)
    if (cut) aCtx.clearRect(x, y, w, h) 
    copyData.move = true
    // copyData.colors = ctx.getImageData(0, 0, w, h)
    copyData.colors.length = 0
    copyColors({
      w: w / artData.cellD,
      h: h / artData.cellD,
      ctx, 
      data: copyData.colors
    })
    // copyData.index = 
    const { cellD, column } = artData
    const index = (((y + cellD) / cellD - 1) * column) + (x + cellD) / cellD - 1
    const width = w / cellD
    let rowCount = 0
    const test = []
    const arr = new Array(width * (h / cellD)).fill('').map((n, i) => {
      if (i && i % width === 0) rowCount++
      test.push(i - width) // TODO testing if this could be done without rowCount
      return index + i + (rowCount * (column - width))
    })  
    console.log(arr)
    console.log(test)

  }
}

const paste = () =>{
  if (copyData.colors.length){
    console.log('paste', copyData.colors)
    const { defPos: { x, y} } = copyData
    console.log(x, y)
    // aCtx.putImageData(copyData.colors, x, y)
    // paintFromColors({
    //   arr: copyData.colors,
    //   ctx: aCtx,
    //   colors: artData.colors
    // })
  }
}

export {
  createSelectBox,
  copySelection,
  paste
}
