import { calcX, calcY, setTargetSize, setTargetPos, cellWidthAndHeight } from '../scripts/utils.js'

const moveCopyGrid = (e, drawData, copyData, artData) =>{
  if (drawData.copyState && !drawData.moveState) {
    const { defPos, top, left } = drawData.defaultPos
    const { column, cellD } = artData 

    const next = e.target.dataset.cell
    const newX = calcX(next, column)
    const newY = calcY(next, column)
    const defPosX = calcX(defPos, column)
    const defPosY = calcY(defPos, column)
    
    if (!drawData.copyBox) return
    if (newX !== drawData.prevX && newY === drawData.prevY) {
      if (defPosX > newX){
        Object.assign(drawData.copyBox.style, {
          left: `${left - (defPosX - newX) * cellD}px`,
          width: `${(defPosX - newX + 1) * cellD}px`
        })
      } else {
        copyData.width = newX - defPosX + 1
        Object.assign(drawData.copyBox.style, {
          left: `${left}px`,
          width: `${copyData.width * cellD}px`
        })
      }
      drawData.prevX = newX
    } else if (newY !== drawData.prevY) {
      if (defPosY > newY){ 
        Object.assign(drawData.copyBox.style, {
          top: `${top - (defPosY - newY) * cellD}px`,
          height: `${(defPosY - newY + 1) * cellD}px`
        })
      } else {
        copyData.height = newY - defPosY + 1
        Object.assign(drawData.copyBox.style, {
          top: `${top}px`,
          height: `${copyData.height * cellD}px`
        })
      }
      drawData.prevY = newY
    } 
    
    // copy selected area
    const { offsetTop, offsetLeft } = drawData.copyBox
    copyData.index = returnSelectedCells({
      firstCell: (offsetTop / cellD * column) + (offsetLeft / cellD), artData, drawData
    })
  }     
}

const returnSelectedCells = ({ firstCell, roundedX, roundedY, artData, drawData }) =>{
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

const createCopyGrids = ({ copyGrid, drawData, cellStyle, artData }) =>{
  const { row, column, cellD } = artData
  const arr = new Array(row * column).fill('')

  setTargetSize({
    target: copyGrid,
    w: column * cellD, h: row * cellD
  })

  copyGrid.style.marginTop = '100px'
  copyGrid.style.marginBottom = `-${(row * cellD) + 100}px`
  copyGrid.innerHTML = arr.map((_ele,i)=>{
    return `<div class="${cellStyle}" style="${cellWidthAndHeight(cellD)}" data-cell=${i}></div>`
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
      drawData.prevX = i % column * cellD
      drawData.prevY = Math.floor(i / column)

      setTargetPos({
        target: drawData.copyBox,
        x:drawData.defaultPos.left, y: drawData.defaultPos.top
      })
    }
  })
}

export {
  moveCopyGrid,
  returnSelectedCells,
  createCopyGrids
}