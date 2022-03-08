
import { rgbToHex, hex, updateColor } from '../scripts/actions/colours.js'
import { updateCode, downloadImage, paintCanvas, paintCanvasTwo, copyText, flipImage } from '../scripts/actions/draw.js'
import traceSvg from '../scripts/actions/traceSvg.js'
import { moveCopyGrid, createCopyGrids, moveSelection, handleSelect } from '../scripts/actions/copy.js'
import { setTargetPos, resizeCanvas, setTargetSize, cellWidthAndHeight } from '../scripts/actions/utils.js'
import { updateGrid, updateCodesDisplay, generateFromColorCode, createGrid, triggerCreateGrid } from '../scripts/actions/grids.js'

import { artData, drawData, copyData } from '../scripts/state.js'
import { input, canvas, ctx, grids, cursor, copyGrid } from '../scripts/elements.js'



function init() {

  //todo when to update?
  //todo crop has bug... seems to be one pixel off?
  // const indicator = document.querySelector('.indicator')
  
  // button
  const alts = document.querySelectorAll('.alt')
  const flip = document.querySelectorAll('.flip')
  const downloadButtons = document.querySelectorAll('.download')
  const copyButtons = document.querySelectorAll('.copy') 
  const generate = document.querySelectorAll('.generate')
  const gridToggleButtons = document.querySelectorAll('.grid_display')
  const buttons = document.querySelectorAll('.button')
  const dataUrlButton = document.querySelector('.url')


  const output = ()=>{
    const { cellD, row, column, calcWidth, calcHeight, uploadedFile } = artData 
    if (!uploadedFile) return
    const blobURL = window.URL.createObjectURL(uploadedFile)
    const imageTarget = new Image()
    
    imageTarget.onload = () => {
      const { naturalWidth: w, naturalHeight: h } = imageTarget
      calcHeight = (column * cellD) * (h / w)
      calcWidth = calcHeight * (w / h)
      resizeCanvas({
        canvas: canvas[0], 
        w: calcWidth, h: calcHeight - (calcHeight % cellD)
      })
      setTargetSize({
        target: grids[0],
        w: column * cellD, h: row * cellD
      })

      artData.codes[0].length = 0
      ctx.drawImage(imageTarget, 0, 0, calcWidth, calcHeight)
      const offset = Math.floor(cellD / 2)

      for (let i = 0; i < row * column; i++) {
        const x = i % column * cellD
        const y = Math.floor(i / column) * cellD
        const c = ctx.getImageData(x + offset, y + offset, 1, 1).data //!offset

        // this thing included here to prevent rendering black instead of transparent
        c[3] === 0
          ? artData.codes[0].push('transparent')
          : artData.codes[0].push(hex(rgbToHex(c[0], c[1], c[2])))
        // var hex = '#' + ('000000' + rgbToHex(c[0], c[1], c[2])).slice(-6)
        
      }
      // populate grid and make it reactive
      updateGrid()
      updateCodesDisplay(input.codes[0], artData.codes[0])
      paintCanvasTwo()
      generateFromColorCode()
    }
    imageTarget.src = blobURL
  }


  const copySelectionToCopyBox = cut =>{
    if (copyData.data.length) return
    const activeArea = document.querySelector('.active_area')
    if (!activeArea) return

    activeArea.innerHTML = copyData.index.map(index=>{
      return `<div style="${cellWidthAndHeight()} background-color:${artData.codes[0][index]};"></div>`
    }).join('')

    copyData.index.forEach((index,i)=>{
      copyData.data[i] = input.codes[0].value.split(',')[index]
    })
    
    if (cut){
      //* delete original
      artData.codes[0] = input.codes[0].value.split(',').map((grid, i) => {
        return copyData.index.some(data => data === i) ? 'transparent' : grid
      })
      input.codes[0].value = artData.codes[0]
      drawData.isCut = true
    } 
    drawData.copied = true

    paintCanvas()
    document.querySelectorAll('.cell').forEach((cell, i)=>{
      cell.style.backgroundColor = artData.codes[0][i]
    })
    setTargetPos({
      target: drawData.copyBox,
      x: drawData.copyBox.offsetLeft + activeArea.offsetTop, 
      y: drawData.copyBox.offsetTop + activeArea.offsetLeft
    })
    setTargetSize({
      target: drawData.copyBox,
      w: activeArea.style.width, h: activeArea.style.height
    })
    updateCode()
    moveSelection()
  }


  const paste = () =>{
    console.log('copydata', copyData.data)
    if (copyData.data.length) {

      copyData.index.forEach((index, i)=> {
        if (copyData.data[i] !== 'transparent') artData.codes[0][index] = copyData.data[i] 
      })
      input.codes[0].value = artData.codes[0]
  
      paintCanvas()
      document.querySelectorAll('.cell').forEach((cell, i)=> cell.style.backgroundColor = artData.codes[0][i])
  
      if (drawData.isCut) handleSelect()
      updateCode()
    }
  }

  const undo = () =>{
    // console.log('prev check', prev[prev.length - 1])
    if (!artData.prev[artData.prev.length - 1]) return
    const { data: newData, row: newRow, column: newColumn,  cellD: newcellD } = artData.prev[artData.prev.length - 1]
    // console.log('newData', newData)
    
    input.codes[0].value = newData
    input.row.value = newRow
    input.column.value = newColumn
    input.cellD.value = newcellD
    artData.codes[0] = newData

    Object.assign(artData, { 
      column: newColumn, row: newRow, cellD: newcellD 
    })
    paintCanvas()
    generateFromColorCode()

    artData.prev = artData.prev.filter((_data, i)=>{
      return i !== artData.prev.length - 1
    })
    if (!artData.prev.length) updateCode()
  }

  const crop = () =>{
    if (!copyData.index) return

    input.codes[0].value = input.codes[0].value.split(',').filter((_code, i)=>{
      return copyData.index.some(data => +data === i)
    }).join(',')

    artData.column = copyData.width
    artData.row = copyData.height
    paintCanvas()
    generateFromColorCode()
    input.column.value = artData.column
    input.row.value = artData.row
    handleSelect()
  }

  const deleteSelection = () =>{
    if (copyData.index) {
      input.codes[0].value = input.codes[0].value.split(',').map((code, i)=>{
        return copyData.index.some(data => +data === i) 
          ? 'transparent'
          : code
      }).join(',')
      generateFromColorCode()
      handleSelect()
    }
  }
  
  const toggleGrid = () =>{
    grids.forEach(grid => grid.classList.toggle('grid_hide'))
    copyGrid.classList.toggle('grid_hide')
  }
  

  // reads from url
  const query = window.location.hash
  if (query){
    const queryArray = query.split('#')
    input.column.value = queryArray[1] || 10
    input.row.value = queryArray[2] || 10
    input.cellD.value = queryArray[3] || 20

    Object.assign(artData, {
      column: +input.column.value, row: +input.row.value, cellD: +input.cellD.value
    })
    createGrid(0, 'cell')
    createCopyGrids('copy_cell')
  }

  const triggerFill = e =>{
    e.target.classList.toggle('active')
    drawData.fill = !drawData.fill
    drawData.cursorType = drawData.fill 
      ? 'bucket_cursor' 
      : drawData.moveState 
        ? 'motion_cursor' 
        : 'pen_cursor'
  }

  const triggerClear = e =>{
    e.target.classList.toggle('active')
    drawData.erase = !drawData.erase
    drawData.cursorType = drawData.erase 
      ? 'eraser_cursor' 
      : drawData.moveState 
        ? 'motion_cursor' 
        : 'pen_cursor'
  }
  

  const updateRow = () =>{
    const { row, column } = artData
    artData.codes[0] = input.codes[0].value.split(',') || Array(row * column).fill('transparent')
    const newRow = +input.row.value
    const diff = Math.abs(newRow - row) 

    input.codes[0].value = newRow > row
      ?  [...artData.codes[0], ...Array(diff * column).fill('transparent')]
      :  artData.codes[0].slice(0, artData.codes[0].length - (diff * column))
    artData.row = newRow
    artData.codes[0] = input.codes[0].value

    paintCanvas()
    generateFromColorCode()
  }


  const updateColumn = () =>{
    const { row, column } = artData 
    artData.codes[0] = input.codes[0].value.split(',') || Array(row * column).fill('transparent')
    const newColumn = +input.column.value
    const updatedCodes = [[]]
    let count = 0
    let index = 0
    artData.codes[0].forEach(code =>{
      if (count === +column) {
        count = 0
        index++
        updatedCodes.push([])
      }
      count++
      updatedCodes[index].push(code)
    })

    input.codes[0].value = updatedCodes.map(codes =>{
      const diff = Math.abs(newColumn - column)
      return newColumn > column
        ? [...codes, ...Array(diff).fill('transparent')]
        : codes.slice(0, codes.length - diff)
    }).join(',')

    artData.column = newColumn
    artData.codes[0] = input.codes[0].value
    paintCanvas()
    generateFromColorCode()
  }



  //* grids 

  copyGrid.addEventListener('mousedown', ()=> drawData.copyState = true)
  copyGrid.addEventListener('mouseup', ()=> {
    drawData.copyState = false
    if (drawData.copyBox){
      Object.assign(drawData.defaultPos, {
        top: drawData.copyBox.offsetTop,
        left: drawData.copyBox.offsetLeft
      })
    }
  })

  copyGrid.addEventListener('mousemove', moveCopyGrid)
  
  grids.forEach(grid => {
    grid.addEventListener('mousedown',()=> drawData.canDraw = true)
    grid.addEventListener('mouseup',()=> drawData.canDraw = false)
    grid.addEventListener('mouseleave',()=> drawData.canDraw = false)
  
    grid.addEventListener('mouseenter',()=> cursor.classList.add(drawData.cursorType))
    grid.addEventListener('mouseleave',()=> cursor.classList.remove(drawData.cursorType))
  })
  
  copyGrid.addEventListener('mouseenter',()=> cursor.classList.add(drawData.cursorType))
  copyGrid.addEventListener('mouseleave',()=> cursor.classList.remove(drawData.cursorType))


  //* inputs 

  input.color.addEventListener('change',()=> updateColor(input.color.value))
  input.hex.addEventListener('change', ()=> updateColor(input.hex.value))
  input.row.addEventListener('change', updateRow)
  input.column.addEventListener('change', updateColumn)
  input.cellD.addEventListener('change',()=>{
    // prev[0].cellD = cellD
    artData.cellD = +input.cellD.value
  })

  // display filename and pixelise button
  input.upload.addEventListener('change',()=>{
    artData.uploadedFile = input.upload.files[0]
    document.querySelector('.file_name').innerHTML = artData.uploadedFile.name
    document.querySelector('.draw').classList.remove('display_none')
    // draw.classList.remove('display_none')
  })



  //* buttons
  
  flip[0].addEventListener('click',()=> flipImage('horizontal'))
  flip[1].addEventListener('click',()=> flipImage('vertical'))
  generate[0].addEventListener('click',generateFromColorCode)
  gridToggleButtons.forEach(button => button.addEventListener('click', toggleGrid))

  downloadButtons[0].addEventListener('click',()=> {
    paintCanvas()
    downloadImage(canvas[0],'cell')
  })
  downloadButtons[1].addEventListener('click',()=> {
    paintCanvasTwo()
    downloadImage(canvas[1],'small_cell')
  })
  
  copyButtons.forEach((button, i) =>{
    button.addEventListener('click',()=>copyText(input.codes[i]))
  })

  dataUrlButton.addEventListener('click',()=>{
    paintCanvas()
    console.log(canvas[0].toDataURL())
  })
  

  buttons.forEach(b =>{
    const addClickEvent = (className, event) =>{
      if (b.classList.contains(className)) b.addEventListener('click', event)
    }
    addClickEvent('draw', output) //pixelise
    addClickEvent('fill', triggerFill)
    addClickEvent('select', handleSelect)
    addClickEvent('copy_selection', ()=>copySelectionToCopyBox(false))
    addClickEvent('cut_selection', ()=>copySelectionToCopyBox(true))
    // addClickEvent('move_selection', moveSelection)
    addClickEvent('crop_selection', crop)
    addClickEvent('paste_selection', paste)
    addClickEvent('delete_selection', deleteSelection)
    addClickEvent('clear', triggerClear)
    addClickEvent('create_grid', triggerCreateGrid)
    addClickEvent('undo', undo)
    addClickEvent('perimeter', traceSvg)
  })

  window.addEventListener('mousemove', e => 
    setTargetPos({
      target: cursor,
      x: e.pageX, y: e.pageY
    })
  )

  alts.forEach(button=>{
    button.addEventListener('mouseover', e =>{
      cursor.childNodes[0].innerHTML = e.target.dataset.alt
    })
    button.addEventListener('mouseleave',()=>{
      cursor.childNodes[0].innerHTML = ''
    })
  })

}

window.addEventListener('DOMContentLoaded', init)
