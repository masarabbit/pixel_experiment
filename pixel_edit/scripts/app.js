
import { rgbToHex, hex, updateColor } from '../scripts/colours.js'
import { continuousDraw, updateCode, downloadImage, paintCanvas, paintCanvasTwo, copyText, checkAreaToFill } from '../scripts/draw.js'
import { artData, drawData, copyData, input } from '../scripts/state.js'
import traceSvg from '../scripts/traceSvg.js'
import { moveCopyGrid, returnSelectedCells, createCopyGrids } from './copy.js'
import { 
  setTargetPos, 
  rounded, 
  resizeCanvas, 
  setTargetSize, 
  cellWidthAndHeight,
  sortByFreqRemoveBlankAndDuplicates 
} from '../scripts/utils.js'

// TODO to separate out more, need to move more things to parameter.

function init() {

  //todo when to update?
  //todo crop has bug... seems to be one pixel off
  
  const canvas = document.querySelectorAll('.canvas')
  const ctx = canvas[0].getContext('2d')
  const ctxTwo = canvas[1].getContext('2d')
  const grids = document.querySelectorAll('.grid')
  const palettes = document.querySelectorAll('.palette')
  const cursor = document.querySelector('.cursor')
  const copyGrid = document.querySelector('.copy_grid')
  // const indicator = document.querySelector('.indicator')
  
  // button
  const alts = document.querySelectorAll('.alt')
  const flip = document.querySelectorAll('.flip')
  const downloadButtons = document.querySelectorAll('.download')
  const copyButtons = document.querySelectorAll('.copy') 
  const generate = document.querySelectorAll('.generate')
  const gridToggleButtons = document.querySelectorAll('.grid_display')
  const buttons = document.querySelectorAll('.button')



  const updateGrid = () =>{
    grids[0].innerHTML = artData.codes[0].map((dot, i) => {
      return `<div class="cell" index="${i}" data-cell=${i} style="background-color:${dot}; ${cellWidthAndHeight(artData.cellD)}"></div>`
    }).join('')
  }

  const populatePalette = (index, arr) =>{
    const filteredData = sortByFreqRemoveBlankAndDuplicates(arr)
    palettes[index].innerHTML = filteredData.map(d=>{
      if (index === 0 && filteredData[0][0] !== '#' && filteredData[0][0] !== 't') return
      const background = `background-color:${d}`
      return `
        <div class="palette_cell">
          <div class="palette_color" style="${background};">
          </div>
        </div>`
    }).join('')

    const paletteColors = document.querySelectorAll('.palette_color')
    paletteColors.forEach((cell, i)=>{
      cell.addEventListener('click',()=>{
        updateColor(filteredData[i])
      })
    })
  }

  const updateCodesDisplay = (box, arr) =>{
    box.value = `${arr.map(ele => ele).join(',')}`
    // const index = box === codesBox[0] ? 0 : 1 
    populatePalette(0, arr)
  }

  
  //draw
  const colorCell = e =>{
    if (drawData.selectCopy || e.target.classList.contains('grid')) return
    const index = e.target.dataset.cell
    if (drawData.fill) {
      fillBucket(index)
      return
    }
    const value = drawData.erase || input.hex.value === 'transparent' 
      ? 'transparent' 
      : input.color.value  //! transparent replaced with ''
    artData.codes[0][index] = value
    e.target.style.backgroundColor = value
    updateCodesDisplay(input.codes[0], artData.codes[0])
    updateCode(input, artData)
  }

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
      paintCanvasTwo(canvas, ctxTwo, artData)
      generateFromColorCode()
    }
    imageTarget.src = blobURL
  }

  const generateFromColorCode = () =>{
    const { row, column } = artData 

    createGridCells({
      index: 0,
      cellStyle: 'cell'
    })

    createCopyGrids({ copyGrid, drawData, cellStyle: 'copy_cell', artData })

    if (!input.codes[0].value) {
      artData.codes[0] = new Array(row * column).fill('transparent')
      input.codes[0].value = artData.codes[0]
    }

    // remove \n
    artData.codes[0] = input.codes[0].value.replace(/(\r\n|\n|\r)/gm,'').split(',')
    input.codes[0].value = artData.codes[0]

    const cells = document.querySelectorAll('.cell')
    input.codes[0].value.split(',').forEach((ele,i)=>{
      if (cells[i]) cells[i].style.backgroundColor = ele
    })
    // addDraw()
    populatePalette(0, artData.codes[0])
    updateCode(input, artData)
  }


  const createGridCells = ({ index, cellStyle }) =>{
    const { cellD, row, column } = artData 
    const arr = new Array(row * column).fill('')
    setTargetSize({
      target: grids[index],
      w: column * cellD, h: row * cellD
    })
    grids[index].innerHTML = arr.map((_ele, i)=>{
      return `
        <div 
          class="${cellStyle}"
          style="${cellWidthAndHeight(cellD)}"
          index="${i}"
          data-cell=${i}
        >
        </div>
        `
    }).join('')

    grids[index].addEventListener('click', (e)=> colorCell(e))
    grids[index].addEventListener('mousemove', (e)=> continuousDraw(e, drawData.canDraw, colorCell))
  }


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


  copyGrid.addEventListener('mousemove', (e) => moveCopyGrid(e, drawData, copyData, artData))

  const copySelectionToCopyBox = cut =>{
    if (copyData.data.length) return
    const activeArea = document.querySelector('.active_area')
    if (!activeArea) return
    const { cellD } = artData 

    activeArea.innerHTML = copyData.index.map(index=>{
      return `<div style="${cellWidthAndHeight(cellD)} background-color:${artData.codes[0][index]};"></div>`
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

    paintCanvas(canvas, ctx, artData)
    document.querySelectorAll('.cell').forEach((cell,i)=>{
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
    updateCode(input, artData)

    moveSelection()
  }

  const paste = () =>{
    if (!copyData.data.length) return
    console.log('copydata', copyData.data)

    copyData.index.forEach((index, i)=> {
      if (copyData.data[i] !== 'transparent') artData.codes[0][index] = copyData.data[i] 
    })
    input.codes[0].value = artData.codes[0]

    paintCanvas(canvas, ctx, artData)
    document.querySelectorAll('.cell').forEach((cell, i)=> cell.style.backgroundColor = artData.codes[0][i])

    if (drawData.isCut) handleSelect()
    updateCode(input, artData)
  }


  //TODO move
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
      const roundedX = rounded(pos.a, cellD) > 0 ? rounded(pos.a, cellD) : 0
      const roundedY = rounded(pos.b, cellD) > 0 ? rounded(pos.b, cellD) : 0
  
      Object.assign(copyData,{
        width: drawData.copyBox.style.width.replace('px','') / cellD,
        height: drawData.copyBox.style.height.replace('px','') / cellD,
        index: returnSelectedCells({
          firstCell: (roundedY * column) + roundedX, 
          roundedX: rounded(pos.a, cellD), 
          roundedY: rounded(pos.b, cellD),
          drawData, artData
        })
      })
      // codesBox[1].value = copyData.index.join(',')
      // if (copyData.data.length) codesBox[1].value = copyData.index.join(',') + '-' + copyData.data.join(',')
      setTargetPos({
        target: drawData.copyBox, 
        x: rounded(pos.a, cellD) * cellD, y:rounded(pos.b, cellD) * cellD 
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

  const createGrid = (index, cellStyle) =>{
    const { row, column } = artData 
    createGridCells({ index, cellStyle })
    artData.codes[0] = new Array(row * column).fill('transparent')
    input.codes[0].value = artData.codes[0]

    updateCode(input, artData)
  }

  const crop = () =>{
    if (!copyData.index) return

    input.codes[0].value = input.codes[0].value.split(',').filter((_code,i)=>{
      return copyData.index.some(data=> +data === i)
    }).join(',')

    artData.column = copyData.width
    artData.row = copyData.height
    paintCanvas(canvas, ctx, artData)
    generateFromColorCode()
    input.column.value = artData.column
    input.row.value = artData.row
    handleSelect()
  }

  const deleteSelection = () =>{
    if (!copyData.index) return
    input.codes[0].value = input.codes[0].value.split(',').map((code, i)=>{
      return copyData.index.some(data => +data === i) 
        ? 'transparent'
        : code
    }).join(',')
    generateFromColorCode()
    handleSelect()
  }
  
  const toggleGrid = () =>{
    grids.forEach(grid => grid.classList.toggle('grid_hide'))
    copyGrid.classList.toggle('grid_hide')
  }
  
  const arrayGroupedForFlipping = () =>{
    const arr = new Array(+input.column.value).fill('')
    const mappedArr = arr.map(()=>[])
    input.codes[0].value.split(',').forEach((d,i)=>{
      mappedArr[Math.floor(i / input.column.value)].push(d)
    })
    return mappedArr
  }
  
  // flip horizontal
  flip[0].addEventListener('click',()=>{
    input.codes[0].value = arrayGroupedForFlipping().map(a => a.reverse()).join(',')
    paintCanvas(canvas, ctx, artData)
    generateFromColorCode()
  })
  
  // flip vertical
  flip[1].addEventListener('click',()=>{
    input.codes[0].value = arrayGroupedForFlipping().reverse().join(',')
    paintCanvas(canvas, ctx, artData)
    generateFromColorCode()
  })

  // enable grid creation with buttons
  const triggerCreateGrid = (e) =>{
    const gridClass = e.target.dataset.grid_class  // cell
    const index = +e.target.dataset.index  // 0
    createGrid(index, gridClass)
  }


  const fillBucket = index =>{
    const fillValue = drawData.erase ? 'transparent' : input.color.value  //! '' instead of transparent
    const areaToFillBucket = []
    const valueToSwap = artData.codes[0][index]

    checkAreaToFill({
      codeRef: artData.codes[0], 
      i: +index, 
      valueToCheck: valueToSwap, 
      areaToFill: areaToFillBucket,
      artData
    })

    input.codes[0].value = input.codes[0].value.split(',').map((c,i)=>{
      if (areaToFillBucket.indexOf(i) === -1) return c
      return c === valueToSwap ? fillValue : c
    }).join(',')

    generateFromColorCode()
  }


  // trace perimeter
  const periButton = document.querySelector('.perimeter')

  periButton.addEventListener('click', traceSvg)

  const dataUrlButton = document.querySelector('.url')
  dataUrlButton.addEventListener('click',()=>{
    paintCanvas(canvas, ctx, artData)
    console.log(canvas[0].toDataURL())
  })

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
    createCopyGrids({ copyGrid, drawData, cellStyle: 'copy_cell', artData })
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
  
  const handleSelect = () =>{ //TODO needs refactor since it doesn't work when copyBox has been made once
    drawData.selectCopy = !drawData.selectCopy
    copyData.data.length = 0
    if (drawData.copyBox) drawData.copyBox.classList.remove('move')

    createCopyGrids({ copyGrid, drawData, cellStyle: 'copy_cell', artData })
    copyGrid.classList.toggle('active')
    copyGrid.classList.remove('fix')
    Object.assign(drawData, { 
      copyBoxCreated: false, moveState: false, copied: false, isCut: false, cursorType: 'pen_cursor'
    })
    // document.querySelector('.move_selection').classList.remove('display_none')
  }
  
  // eventlistener
  input.cellD.addEventListener('change',()=>{
    // prev[0].cellD = cellD
    artData.cellD = +input.cellD.value
  })


  input.row.addEventListener('change',()=>{
    const { row, column } = artData
    artData.codes[0] = input.codes[0].value.split(',') || Array(row * column).fill('transparent')
    const newRow = +input.row.value
    const diff = Math.abs(newRow - row) 

    input.codes[0].value = newRow > row
      ?  [...artData.codes[0], ...Array(diff * column).fill('transparent')]
      :  artData.codes[0].slice(0, artData.codes[0].length - (diff * column))
    artData.row = newRow
    artData.codes[0] = input.codes[0].value

    paintCanvas(canvas, ctx, artData)
    generateFromColorCode()
  })


  input.column.addEventListener('change',()=>{
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

    input.codes[0].value = updatedCodes.map(codes=>{
      const diff = Math.abs(newColumn - column)
      return newColumn > column
        ? [...codes, ...Array(diff).fill('transparent')]
        : codes.slice(0, codes.length - diff)
    }).join(',')

    artData.column = newColumn
    artData.codes[0] = input.codes[0].value
    paintCanvas(canvas, ctx, artData)
    generateFromColorCode()
  })
  
  downloadButtons[0].addEventListener('click',()=> {
    paintCanvas(canvas, ctx, artData)
    downloadImage(canvas[0],'cell')
  })
  downloadButtons[1].addEventListener('click',()=> {
    paintCanvasTwo(canvas, ctxTwo, artData)
    downloadImage(canvas[1],'small_cell')
  })
  
  generate[0].addEventListener('click',generateFromColorCode)
  copyButtons.forEach((button, i) =>{
    button.addEventListener('click',()=>copyText(input.codes[i]))
  })
  
  gridToggleButtons.forEach(button => button.addEventListener('click',toggleGrid))
  
  grids.forEach(grid => {
    grid.addEventListener('mousedown',()=> drawData.canDraw = true)
    grid.addEventListener('mouseup',()=> drawData.canDraw = false)
    grid.addEventListener('mouseleave',()=> drawData.canDraw = false)
  
    grid.addEventListener('mouseenter',()=> cursor.classList.add(drawData.cursorType))
    grid.addEventListener('mouseleave',()=> cursor.classList.remove(drawData.cursorType))
  })
  
  copyGrid.addEventListener('mouseenter',()=> cursor.classList.add(drawData.cursorType))
  copyGrid.addEventListener('mouseleave',()=> cursor.classList.remove(drawData.cursorType))

  input.color.addEventListener('change',()=> updateColor(input.color.value))
  input.hex.addEventListener('change', ()=> updateColor(input.hex.value))
  
  // display filename and pixelise button
  input.upload.addEventListener('change',()=>{
    artData.uploadedFile = input.upload.files[0]
    document.querySelector('.file_name').innerHTML = artData.uploadedFile.name
    document.querySelector('.draw').classList.remove('display_none')
    // draw.classList.remove('display_none')
  })


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

    paintCanvas(canvas, ctx, artData)
    generateFromColorCode()

    artData.prev = artData.prev.filter((_data,i)=>{
      return i !== artData.prev.length - 1
    })
    if (!artData.prev.length) updateCode(input, artData)
  }
  
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
  })

  window.addEventListener('mousemove', e => 
    setTargetPos({
      target: cursor,
      x: e.pageX, y: e.pageY
    })
  )


  alts.forEach(button=>{
    button.addEventListener('mouseover',(e)=>{
      cursor.childNodes[0].innerHTML = e.target.dataset.alt
    })
    button.addEventListener('mouseleave',()=>{
      cursor.childNodes[0].innerHTML = ''
    })
  })

}

window.addEventListener('DOMContentLoaded', init)
