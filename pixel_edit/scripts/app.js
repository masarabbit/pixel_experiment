
import { rgbToHex, hex, updateColor } from '../scripts/colours.js'
import { continuousDraw } from '../scripts/draw.js'
import { artData, drawData, copyData } from '../scripts/state.js'
import traceSvg from '../scripts/traceSvg.js'
import { 
  setTargetPos, 
  calcX, 
  calcY, 
  rounded, 
  resizeCanvas, 
  setTargetSize, 
  cellWidthAndHeight,
  sortByFreqRemoveBlankAndDuplicates 
} from '../scripts/utils.js'


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

  // input
  const input = {
    cellD: document.querySelector('.cell_size'),
    row: document.querySelector('.row'),
    column: document.querySelector('.column'),
    codes: document.querySelectorAll('.codes'),
    upload: document.querySelector('#upload'),
    color: document.querySelector('#color'),
    colorLabel: document.querySelector('.color_label'),
    hex: document.querySelector('.hex')
  }


  const updateCode = () =>{
    const { row, column, cellD } = input 
    const lastPrev = artData.prev.length && artData.prev[artData.prev.length - 1]

    if (lastPrev &&
        lastPrev.data === input.codes[0].value &&
        lastPrev.row === +row.value &&
        lastPrev.column === +column.value
    ) return

    artData.prev.push({
      data: input.codes[0].value,
      row: +row.value,
      column: +column.value,
      cellD: +cellD.value,
    })

    // keep artData.prev under 10 steps
    if (artData.prev.length > 10) artData.prev = artData.prev.filter((d, i) =>{
      if(i !== 0) return d
    })
  }


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
        updateColor(input, filteredData[i])
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
    updateCode()
  }

  
  const paintCanvasTwo = () =>{
    const { cellD, row, column, calcWidth, calcHeight } = artData 
    const arr = new Array(row * column).fill('')
    
    calcWidth && calcHeight
      ? resizeCanvas({
        canvas: canvas[1], 
        w: calcWidth / cellD,  h: calcHeight - (calcHeight % cellD) / cellD
      })
      : resizeCanvas({
        canvas: canvas[1], 
        w: column, h: row
      })
    
    arr.forEach((_ele,i)=>{
      ctxTwo.fillStyle = artData.codes[0][i] === '' ? 'transparent' : artData.codes[0][i]
      ctxTwo.fillRect(calcX(i, column), calcX(i, column), 1, 1)
    })
  }

  const paintCanvas = () =>{
    const { row, column, cellD } = artData 
    const arr = new Array(row * column).fill('')
    
    resizeCanvas({
      canvas: canvas[0], 
      w: column * cellD, h: row * cellD
    })
  
    arr.forEach((_ele,i)=>{
      const x = calcX(i, column) * cellD
      const y = calcY(i, column) * cellD
      ctx.fillStyle = artData.codes[0][i] === '' ? 'transparent' : artData.codes[0][i]
      ctx.fillRect(x, y, cellD, cellD)
    })
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
      paintCanvasTwo()
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

    createCopyGrids({ copyGrid, drawData, cellStyle: 'copy_cell' })

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
    updateCode()
  }

  const downloadImage = (canvas,name) =>{
    const link = document.createElement('a')
    link.download = `${name}_${new Date().getTime()}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  const copyText = box =>{
    box.select()
    box.setSelectionRange(0, 99999) // For mobile devices 
    document.execCommand('copy')
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


  const createCopyGrids = ({ copyGrid, drawData, cellStyle }) =>{
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

  copyGrid.addEventListener('mousemove',(e)=>{       
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
        firstCell: (offsetTop / cellD * column) + (offsetLeft / cellD)
      })
    }     
  })


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

    paintCanvas()
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
    updateCode()

    moveSelection()
  }

  const paste = () =>{
    if (!copyData.data.length) return
    console.log('copydata', copyData.data)

    copyData.index.forEach((index, i)=> {
      if (copyData.data[i] !== 'transparent') artData.codes[0][index] = copyData.data[i] 
    })
    input.codes[0].value = artData.codes[0]

    paintCanvas()
    document.querySelectorAll('.cell').forEach((cell, i)=> cell.style.backgroundColor = artData.codes[0][i])

    if (drawData.isCut) handleSelect()
    updateCode()
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
          roundedY: rounded(pos.b, cellD)
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

    updateCode()
  }

  const crop = () =>{
    if (!copyData.index) return

    input.codes[0].value = input.codes[0].value.split(',').filter((_code,i)=>{
      return copyData.index.some(data=> +data === i)
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
    paintCanvas()
    generateFromColorCode()
  })
  
  // flip vertical
  flip[1].addEventListener('click',()=>{
    input.codes[0].value = arrayGroupedForFlipping().reverse().join(',')
    paintCanvas()
    generateFromColorCode()
  })

  // enable grid creation with buttons
  const triggerCreateGrid = (e) =>{
    const gridClass = e.target.dataset.grid_class  // cell
    const index = +e.target.dataset.index  // 0
    createGrid(index, gridClass)
  }


  const checkAreaToFill = ({ codeRef, i, valueToCheck, areaToFill }) =>{
    const fillStack = []
    // const column = +columnInput.value
    const { column } = artData 
    fillStack.push(i) // first cell to fill
    
    while (fillStack.length > 0){
      const cellToCheck = fillStack.pop() // removes from area to check
      
      if (codeRef[cellToCheck] !== valueToCheck) continue // is the cell value already valueToCheck?
      if (areaToFill.filter(d => d === cellToCheck).length) continue // is it in areaToFill already?
      areaToFill.push(cellToCheck) // if passed above check, include in areaToFill
    
      if (cellToCheck % column !== 0) fillStack.push(cellToCheck - 1) // check left
      if (cellToCheck % column !== column - 1) fillStack.push(cellToCheck + 1) // check right
      fillStack.push(cellToCheck + column) // check up
      fillStack.push(cellToCheck - column) // check down
    }
  }

  const fillBucket = index =>{
    const fillValue = drawData.erase ? 'transparent' : input.color.value  //! '' instead of transparent
    const areaToFillBucket = []
    const valueToSwap = artData.codes[0][index]

    checkAreaToFill({
      codeRef: artData.codes[0], 
      i: +index, 
      valueToCheck: valueToSwap, 
      areaToFill: areaToFillBucket
    })

    input.codes[0].value = input.codes[0].value.split(',').map((c,i)=>{
      if (areaToFillBucket.indexOf(i) === -1) return c
      return c === valueToSwap ? fillValue : c
    }).join(',')

    generateFromColorCode()
  }


  // trace perimeter
  const periButton = document.querySelector('.perimeter')

  periButton.addEventListener('click', ()=> traceSvg(artData, input, checkAreaToFill))

  const dataUrlButton = document.querySelector('.url')
  dataUrlButton.addEventListener('click',()=>{
    paintCanvas()
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
    createCopyGrids({ copyGrid, drawData, cellStyle: 'copy_cell' })
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

    createCopyGrids({ copyGrid, drawData, cellStyle: 'copy_cell' })
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

    paintCanvas()
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
    paintCanvas()
    generateFromColorCode()
  })
  
  downloadButtons[0].addEventListener('click',()=> {
    paintCanvas()
    downloadImage(canvas[0],'cell')
  })
  downloadButtons[1].addEventListener('click',()=> {
    paintCanvasTwo()
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

  input.color.addEventListener('change',()=> updateColor(input, input.color.value))
  input.hex.addEventListener('change', ()=> updateColor(input, input.hex.value))
  
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

    paintCanvas()
    generateFromColorCode()

    artData.prev = artData.prev.filter((_data,i)=>{
      return i !== artData.prev.length - 1
    })
    if (!artData.prev.length) updateCode()
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
  
  // copyGrid.addEventListener('click',()=>{

  //   indicator.innerHTML = ''
  // })
  // console.log('row',row,'column',column)

}

window.addEventListener('DOMContentLoaded', init)
