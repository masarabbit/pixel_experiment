import { calcX, calcY, setTargetSize, setTargetPos, cellWidthAndHeight, rounded } from '../actions/utils.js'
import { artData, drawData, copyData } from '../state.js'
import { copyGrid } from '../elements.js'



const setTargetParams = ({ left, width, top, height }) =>{
  const target = drawData.copyBox.style
  if (left) target.left = `${left}px`
  if (width) target.width = `${width}px`
  if (top) target.top = `${top}px`
  if (height) target.height = `${height}px`
}

const moveCopyGrid = e =>{
  if (drawData.copyState && !drawData.moveState) {
    const { defPos, top, left } = drawData.defaultPos
    const { column, cellD } = artData 
    const next = e.target.dataset.cell
    const newX = calcX(next)
    const newY = calcY(next)
    const defPosX = calcX(defPos)
    const defPosY = calcY(defPos)
    
    if (!drawData.copyBox) return
    if (newX !== drawData.prevX && newY === drawData.prevY) {
      if (defPosX > newX){
        setTargetParams({ left: left - (defPosX - newX) * cellD, width: (defPosX - newX + 1) * cellD })
      } else {
        copyData.width = newX - defPosX + 1
        setTargetParams({ left: left, width: copyData.width * cellD })
      }
      drawData.prevX = newX
    } else if (newY !== drawData.prevY) {
      if (defPosY > newY){ 
        setTargetParams({ top: top - (defPosY - newY) * cellD, height: (defPosY - newY + 1) * cellD })
      } else {
        copyData.height = newY - defPosY + 1
        setTargetParams({ top: top, height: copyData.height * cellD })
      }
      drawData.prevY = newY
    } 
    // copy selected area
    const { offsetTop, offsetLeft } = drawData.copyBox
    copyData.index = returnSelectedCells({
      firstCell: (offsetTop / cellD * column) + (offsetLeft / cellD)
    })
  }     
}


const returnSelectedCells = ({ firstCell, roundedX, roundedY }) =>{
  const { cellD, row, column } = artData 
  if (drawData.copyBox && !drawData.copied){
    Object.assign(drawData.copyBox.style, { 
      justifyContent: 'flex-end', alignItems: 'flex-end' 
    })
  }
  let w = drawData?.copyBox.style.width.replace('px','') / cellD || ''
  let h = drawData?.copyBox.style.height.replace('px','') / cellD || ''
  const selection = []

  if (roundedX < 0) w += roundedX // adjusts width if selection is beyond left edge of copyBox
  if (roundedY < 0) h += roundedY // adjusts height if selection is beyond top edge of copyBox 

  // adjusts width if selection is beyond right edge of copyBox
  if (roundedX + w > column) {
    if (!drawData.copied) drawData.copyBox.style.justifyContent = 'flex-start'
    w -= Math.abs((roundedX + w) - column) 
  }
  // adjust height if selection is beyond bottom edge of copyBox
  if (roundedY + h > row) {
    if (!drawData.copied) drawData.copyBox.style.alignItems = 'flex-start'
    h -= Math.abs((roundedY + h) - row) 
  }
  for (let a = firstCell; a < firstCell + (h * column); a += column){
    for (let b = a; b < (a + w); b++){
      selection.push(b) 
    }
  }
  if (!drawData.copied){
    const activeArea = document.querySelector('.active_area')
    if (!activeArea) {
      drawData.copyBox.innerHTML = `<div class="active_area" style="width:${w * cellD}px; height:${h * cellD}px;"></div>`
    } else {
      setTargetSize({
        target: activeArea,
        w: w * cellD, h: h * cellD
      })
    }
  }
  return selection
}


const createCopyGrids = cellStyle =>{
  const { row, column, cellD } = artData
  const arr = new Array(row * column).fill('')

  setTargetSize({
    target: copyGrid,
    w: column * cellD, h: row * cellD
  })
  copyGrid.style.marginTop = '100px'
  copyGrid.style.marginBottom = `-${(row * cellD) + 100}px`
  copyGrid.innerHTML = arr.map((_ele,i)=>{
    return `<div class="${cellStyle}" style="${cellWidthAndHeight()}" data-cell=${i}></div>`
  }).join('')

  copyGrid.addEventListener('click', e =>{
    if (!drawData.copyBoxCreated){
      drawData.copyBox = document.createElement('div')
      drawData.copyBox.classList.add('copy_box')
      copyGrid.append(drawData.copyBox)
      drawData.copyBoxCreated = true

      setTargetSize({
        target: drawData.copyBox,
        w: cellD, h: cellD
      })

      const i = e.target.dataset.cell
      Object.assign(drawData.defaultPos,{
        top: e.target.offsetTop,
        left: e.target.offsetLeft,
        defPos: i
      })
      drawData.prevX = calcX(i) * cellD
      drawData.prevY = calcY(i)

      setTargetPos({
        target: drawData.copyBox,
        x:drawData.defaultPos.left, y: drawData.defaultPos.top
      })
    }
  })
}


const moveSelection = () =>{
  // document.querySelector('.move_selection').classList.add('display_none')
  drawData.moveState = true
  drawData.cursorType = 'motion_cursor'
  drawData.copyBox.classList.toggle('move')
  copyGrid.classList.toggle('fix')
  const pos = { a: 0, b: 0, c: 0, d: 0 }

  const onDrag = e => {
    drawData.copyBox.style.transtion = '0s'
    pos.a = drawData.copyBox.offsetLeft - (pos.c - e.clientX)
    pos.b = drawData.copyBox.offsetTop - (pos.d - e.clientY)
    pos.c = e.clientX
    pos.d = e.clientY
    setTargetPos({
      target: drawData.copyBox, 
      x: pos.a, y: pos.b
    })
  }
  const onLetGo = () => {
    const { cellD, column } = artData 
    // adjustments made here to ensure 'firstcell' is within selection.
    // this needs to be done because numbers continue to next row.
    const roundedX = rounded(pos.a) > 0 ? rounded(pos.a) : 0
    const roundedY = rounded(pos.b) > 0 ? rounded(pos.b) : 0

    Object.assign(copyData,{
      width: drawData.copyBox.style.width.replace('px','') / cellD,
      height: drawData.copyBox.style.height.replace('px','') / cellD,
      index: returnSelectedCells({
        firstCell: (roundedY * column) + roundedX, 
        roundedX: rounded(pos.a), 
        roundedY: rounded(pos.b),
      })
    })
    // codesBox[1].value = copyData.index.join(',')
    // if (copyData.data.length) codesBox[1].value = copyData.index.join(',') + '-' + copyData.data.join(',')
    setTargetPos({
      target: drawData.copyBox, 
      x: rounded(pos.a) * cellD, y:rounded(pos.b) * cellD 
    })
    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('mouseup', onLetGo)
  }
  const onGrab = e => {
    pos.c = e.clientX
    pos.d = e.clientY
    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', onLetGo)
  }
  drawData.copyBox.addEventListener('mousedown', onGrab)
}

const handleSelect = () =>{ //TODO needs refactor since it doesn't work when copyBox has been made once
  drawData.selectCopy = !drawData.selectCopy
  copyData.data.length = 0
  if (drawData.copyBox) drawData.copyBox.classList.remove('move')

  createCopyGrids('copy_cell')
  copyGrid.classList.toggle('active')
  copyGrid.classList.remove('fix')
  Object.assign(drawData, { 
    copyBoxCreated: false, moveState: false, copied: false, isCut: false, cursorType: 'pen_cursor'
  })
  // document.querySelector('.move_selection').classList.remove('display_none')
}



export {
  moveCopyGrid,
  returnSelectedCells,
  createCopyGrids,
  moveSelection,
  handleSelect
}