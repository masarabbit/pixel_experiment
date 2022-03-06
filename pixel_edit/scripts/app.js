import { 
  setTargetPos, calcX, calcY, rounded, 
  resizeCanvas, setTargetSize, cellWidthAndHeight,
  sortByFreqRemoveBlankAndDuplicates 
} from '../scripts/utils.js'
import { rgbToHex, hex, updateColor } from '../scripts/colours.js'
import { continuousDraw } from '../scripts/draw.js'

import { artData, drawData, copyData } from '../scripts/state.js'


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
    cellSize: document.querySelector('.cell_size'),
    row: document.querySelector('.row'),
    column: document.querySelector('.column'),
    codes: document.querySelectorAll('.codes'),
    upload: document.querySelector('#upload'),
    color: document.querySelector('#color'),
    colorLabel: document.querySelector('.color_label'),
    hex: document.querySelector('.hex')
  }


  const updateCode = () =>{
    const { row, column, cellSize } = input 
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
      cellSize: +cellSize.value,
    })

    // keep artData.prev under 10 steps
    if (artData.prev.length > 10) artData.prev = artData.prev.filter((d, i) =>{
      if(i !== 0) return d
    })
  }

  

  const updateGrid = () =>{
    grids[0].innerHTML = artData.codes[0].map((dot, i) => {
      return `<div class="cell" index="${i}" data-cell=${i} style="background-color:${dot}; ${cellWidthAndHeight(artData.cellSize)}"></div>`
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
        // console.log('color3', filteredData[i] === 'transparent')
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
    const { cellSize, row, column, calcWidth, calcHeight } = artData 
    const arr = new Array(row * column).fill('')
    
    calcWidth && calcHeight
      ? resizeCanvas(canvas[1], calcWidth / cellSize,  calcHeight - (calcHeight % cellSize) / cellSize)
      : resizeCanvas(canvas[1], column, row)
    
    arr.forEach((_ele,i)=>{
      const x = i % column
      const y = Math.floor(i / column)
      ctxTwo.fillStyle = artData.codes[0][i] === '' ? 'transparent' : artData.codes[0][i]
      ctxTwo.fillRect(x, y, 1, 1)
    })
  }

  const paintCanvas = () =>{
    const { row, column, cellSize } = artData 
    const arr = new Array(row * column).fill('')
    
    
    resizeCanvas(canvas[0], column * cellSize, row * cellSize)
  
    arr.forEach((_ele,i)=>{
      const x = calcX(i, column) * cellSize
      const y = calcY(i, column) * cellSize
      ctx.fillStyle = artData.codes[0][i] === '' ? 'transparent' : artData.codes[0][i]
      ctx.fillRect(x, y, cellSize, cellSize)
    })
  }

  const output = ()=>{
    const { cellSize, row, column, calcWidth, calcHeight, uploadedFile } = artData 
    if (!uploadedFile) return
    const blobURL = window.URL.createObjectURL(uploadedFile)
    const imageTarget = new Image()
    

    imageTarget.onload = () => {
      const maxWidth = column * cellSize 
      const { naturalWidth: w, naturalHeight: h } = imageTarget
      calcHeight = maxWidth * (h / w)
      calcWidth = calcHeight * (w / h)
      resizeCanvas(canvas[0], calcWidth, calcHeight - (calcHeight % cellSize))
      
      setTargetSize({
        target: grids[0],
        w: column * cellSize, h: row * cellSize
      })

      artData.codes[0].length = 0

      ctx.drawImage(imageTarget, 0, 0, calcWidth, calcHeight)

      const offset = Math.floor(cellSize / 2)

      for (let i = 0; i < row * column; i++) {
        const x = i % column * cellSize
        const y = Math.floor(i / column) * cellSize
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
      // updateCode()
      paintCanvasTwo()
      generateFromColorCode()
    }
    imageTarget.src = blobURL
  }

  const generateFromColorCode = () =>{
    const { cellSize, row, column } = artData 

    createGridCells({
      row,
      column,
      cellSize,
      index: 0,
      cellStyle: 'cell'
    })

    createCopyGrids({
      row,
      column,
      cellSize,
      cellStyle: 'copy_cell'
    })

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

  const createGridCells = ({ row, column, cellSize, index, cellStyle }) =>{
    const arr = new Array(row * column).fill('')
    grids[index].style.width = `${column * cellSize}px`
    grids[index].style.height = `${row * cellSize}px`
    grids[index].innerHTML = arr.map((_ele,i)=>{
      return `
        <div 
          class="${cellStyle}"
          style="${cellWidthAndHeight(cellSize)}"
          index="${i}"
          data-cell=${i}
        >
        </div>
        `
    }).join('')

    grids[index].addEventListener('click', (e)=> colorCell(e))
    grids[index].addEventListener('mousemove', (e)=> continuousDraw(e, drawData.canDraw, colorCell))
  }


  const createCopyGrids = ({ row, column, cellSize, cellStyle }) =>{
    const arr = new Array(row * column).fill('')

    setTargetSize({
      target: copyGrid,
      w: column * cellSize, h: row * cellSize
    })

    copyGrid.style.marginTop = '100px'
    copyGrid.style.marginBottom = `-${(row * cellSize) + 100}px`
    copyGrid.innerHTML = arr.map((_ele,i)=>{
      return `<div class="${cellStyle}" style="${cellWidthAndHeight(cellSize)}" data-cell=${i}></div>`
    }).join('')

    copyGrid.addEventListener('click', e =>{
      if (!drawData.copyBoxCreated){
        drawData.copyBox = document.createElement('div')
        drawData.copyBox.classList.add('copy_box')
        copyGrid.append(drawData.copyBox)
        drawData.copyBoxCreated = true
        setTargetSize({
          target: drawData.copyBox,
          w: cellSize, h: cellSize
        })
        const i = e.target.dataset.cell
        Object.assign(drawData.defaultPos,{
          top: e.target.offsetTop,
          left: e.target.offsetLeft,
          defPos: i
        })
        drawData.prevX = i % column * cellSize
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
      drawData.defaultPos.top = drawData.copyBox.offsetTop
      drawData.defaultPos.left = drawData.copyBox.offsetLeft
    }
  })

  copyGrid.addEventListener('mousemove',(e)=>{     
    const { column } = artData 
    if (drawData.copyState && !drawData.moveState) {
      const next = e.target.dataset.cell
      const newX = calcX(next, column)
      const newY = calcY(next, column)
      const { defPos, top, left } = drawData.defaultPos
      const { cellSize } = artData 
      
      if (!drawData.copyBox) return
      if (newX !== drawData.prevX && newY === drawData.prevY) {
        if (calcX(defPos, column) > newX){
          const newLeft = left - ((calcX(defPos, column) - newX) * cellSize)
          drawData.copyBox.style.left = `${newLeft}px`
          const newWidth = (calcX(defPos, column) - newX + 1) 
          drawData.copyBox.style.width = `${newWidth * cellSize}px`
        } else {
          const newWidth = (newX - calcX(defPos, column) + 1)
          copyData.width = newWidth
          drawData.copyBox.style.width = `${newWidth * cellSize}px`
          drawData.copyBox.style.left = `${left}px`
        }
        drawData.prevX = newX
      } else if (newY !== drawData.prevY) {
        if (calcY(defPos, column) > newY){ 
          const newTop = top - ((calcY(defPos, column) - newY) * cellSize)
          drawData.copyBox.style.top = `${newTop}px`
          const newHeight = (calcY(defPos, column) - newY + 1)
          drawData.copyBox.style.height = `${newHeight * cellSize}px`
        } else {
          const newHeight = (newY - calcY(defPos, column) + 1)
          copyData.height = newHeight
          drawData.copyBox.style.height = `${newHeight * cellSize}px`
          drawData.copyBox.style.top = `${top}px`
        }
        drawData.prevY = newY
      } 
      
      // copy selected area
      const x = drawData.copyBox.offsetLeft / cellSize
      const y = drawData.copyBox.offsetTop / cellSize
      copyData.index = returnSelectedCells((y * column) + x)

    }     
  })


  const returnSelectedCells = (firstCell, roundedX, roundedY) =>{
    const { cellSize, row, column } = artData 
    if (drawData.copyBox && !drawData.copied){
      drawData.copyBox.style.justifyContent = 'flex-end'
      drawData.copyBox.style.alignItems = 'flex-end'
    }
    let w = drawData.copyBox ? drawData.copyBox.style.width.replace('px','') / cellSize : ''
    let h = drawData.copyBox ? drawData.copyBox.style.height.replace('px','') / cellSize : ''
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

    for (let a = firstCell; a < firstCell + (h * column); a += +column){
      for (let b = a; b < (a + w); b++){
        selection.push(b) 
      }
    }
    
    if (!drawData.copied){
      const activeArea = document.querySelector('.active_area')
      if (!activeArea) {
        drawData.copyBox.innerHTML = `<div class="active_area" style="width:${w * cellSize}px; height:${h * cellSize}px;"></div>`
      } else {
        setTargetSize({
          target: activeArea,
          w: w * cellSize, h: h * cellSize
        })
      }
      // copyData.activeArea = selection
    }
    
    return selection
  }

  const copySelectionToCopyBox = cut =>{
    if (copyData.data.length) return
    const activeArea = document.querySelector('.active_area')
    if (!activeArea) return
    const { cellSize } = artData 

    activeArea.innerHTML = copyData.index.map(index=>{
      return `<div style="${cellWidthAndHeight(cellSize)} background-color:${artData.codes[0][index]};"></div>`
    }).join('')

    copyData.index.forEach((index,i)=>{
      copyData.data[i] = input.codes[0].value.split(',')[index]
    })
    
    if (cut){
      //* delete original
      artData.codes[0] = input.codes[0].value.split(',').map((grid, i)=> copyData.index.some(data => data === i) ? 'transparent' : grid)
      input.codes[0].value = artData.codes[0]
      drawData.isCut = true
    } 
    drawData.copied = true

    paintCanvas()
    document.querySelectorAll('.cell').forEach((cell,i)=>{
      cell.style.backgroundColor = artData.codes[0][i]
    })
    
    drawData.copyBox.style.top = `${drawData.copyBox.offsetTop + activeArea.offsetTop}px`
    drawData.copyBox.style.left = `${drawData.copyBox.offsetLeft + activeArea.offsetLeft}px`
    drawData.copyBox.style.width = activeArea.style.width
    drawData.copyBox.style.height = activeArea.style.height
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
      const { cellSize, column } = artData 
      // adjustments made here to ensure 'firstcell' is within selection.
      // this needs to be done because numbers continue to next row.
      const roundedX = rounded(pos.a, cellSize) > 0 ? rounded(pos.a, cellSize) : 0
      const roundedY = rounded(pos.b, cellSize) > 0 ? rounded(pos.b, cellSize) : 0
  
      Object.assign(copyData,{
        width: drawData.copyBox.style.width.replace('px','') / cellSize,
        height: drawData.copyBox.style.height.replace('px','') / cellSize,
        index: returnSelectedCells((roundedY * column) + roundedX, rounded(pos.a, cellSize), rounded(pos.b, cellSize))
      })
      // codesBox[1].value = copyData.index.join(',')
      // if (copyData.data.length) codesBox[1].value = copyData.index.join(',') + '-' + copyData.data.join(',')
      setTargetPos({
        target: drawData.copyBox, 
        x: rounded(pos.a, cellSize) * cellSize, y:rounded(pos.b, cellSize) * cellSize 
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

  const createGrid = (index,cellStyle) =>{
    const { cellSize, row, column } = artData 
   
    createGridCells({row, column, cellSize, index, cellStyle})
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


  const checkAreaToFill = (codeRef, i, valueToCheck, areaToFill) =>{
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
    // console.log('fillStack last',fillStack)
    // console.log('areaToFill',areaToFill)
  }

  const fillBucket = index =>{
    const fillValue = drawData.erase ? 'transparent' : input.color.value  //! '' instead of transparent
    const areaToFillBucket = []
    const valueToSwap = artData.codes[0][index]
    // console.log(codes[0], areaToFillBucket)
    
    checkAreaToFill(artData.codes[0], +index, valueToSwap, areaToFillBucket)

    input.codes[0].value = input.codes[0].value.split(',').map((c,i)=>{
      if (areaToFillBucket.indexOf(i) === -1) return c
      return c === valueToSwap ? fillValue : c
    }).join(',')

    generateFromColorCode()
  }


  // trace perimeter
  const periButton = document.querySelector('.perimeter')

  periButton.addEventListener('click',()=>{
    const pathData = []
    const areaToTrace = []
    // const column = columnInput.value
    const { column } = artData 
    // const w = 100 / column
    const w = 1
    const direction = [ 1, +column, -1, -column ] // move right, down, left, up
    const checkDirection = [ -column, +1, +column, -1 ] // check up, left, down, left of current cell

    // switches distance to move depending on which way the line is going.
    // corresponds to right, down, left, up
    const directionFactor = [ 1, 1, -1, -1 ] 
    const indexPattern = [0, 1, 2, 3, 0, 1, 2, 3]

    //? values which needs reset for each trace
    let arr
    let first
    let x
    let y
    let d
    let letter
    let dirIndex
    const checkedIndex = []
    let initialX
    let initialY
    let stop

    const recordTraceData = (dirIndexToCheck, index) =>{
      //TODO since transparent is converted to '', perhaps no longer need to check for it.
      if (stop) return 
      if (dirIndex === dirIndexToCheck && 
        (arr[index + checkDirection[dirIndex]] === 'transparent' || // cell in the  check direction is not filled
        !arr[index + checkDirection[dirIndex]] || // cell in the check direction is the edge

        // below added to ensure trace don't continue on from right edge to left edge
        ((dirIndex === 1) && arr[index + 1] !== 'transparent' && index % column === column - 1) || 
        ((dirIndex === 3) && arr[index - 1] !== 'transparent' && index % column === 0)
        )){

        // prevents same direction being checked twice.
        if (checkedIndex.filter(d=>d === dirIndexToCheck).length) return
        checkedIndex.push(dirIndexToCheck)

        const distance = 1
        const distanceToMove = distance * directionFactor[dirIndex]
        if (d[d.length - 1].split(' ')[0] === letter){
          //* this increases distance to move if previous letter was the same (ie combines 'h1 h1' to 'h2')
          d[d.length - 1] = `${letter} ${+d[d.length - 1].split(' ')[1] + distanceToMove}`
        } else {
          d.push(`${letter} ${distanceToMove}`)
        }
        
        if (letter === 'h') initialX += distanceToMove
        if (letter === 'v') initialY += distanceToMove
        if (initialX === x * w && initialY === y * w) stop = true
        dirIndex = dirIndex === 3 ? 0 : dirIndex + 1
        letter = letter === 'h' ? 'v' : 'h'
      }
    }

    const trace = index =>{
      let traceIndex = index
      
      while (!stop){
        indexPattern.forEach(i => recordTraceData(i, traceIndex))

        checkedIndex.length = 0
        dirIndex = dirIndex === 0 ? 3 : dirIndex - 1
        letter = letter === 'h' ? 'v' : 'h'
        traceIndex = traceIndex += direction[dirIndex] // moves to next cell to trace
      }
    }

    const convertToSvg = (processedCodes) =>{  

      //* changed this to while loop to avoid exceeding maximum call limit
      while (processedCodes.filter(code => code !== '').length) {
        //first index
        const currentColor = processedCodes.find(cell => cell !== '')
        first = processedCodes.indexOf(currentColor) 

        //* isolating area to trace (area with same color, but connected)
        areaToTrace.length = 0
        checkAreaToFill(processedCodes, first, currentColor, areaToTrace)
        arr = processedCodes.map((code, i) => areaToTrace.some(a => a === i) ? code : '')

        x = first % column
        y = Math.floor(first / column)
        d = [`M ${x * w} ${y * w}`]   
        initialX = x * w
        initialY = y * w
        letter = 'h'
        dirIndex = 0
        checkedIndex.length = 0
        stop = false
        trace(first)
        //* recording traced area

        pathData.push(`<path fill="${currentColor}" d="${d.join(' ')}"/>`)

        //* removing traced area
        // when only one square is being traced, area to be traced doesn't get overwritten, so needed to reset it to [], and check below if it has been updated
        //TODO may not need this workaround when the areaToTrace/fill bucket logic is changed
        processedCodes = areaToTrace.length 
          ? processedCodes.map((code,i)=> areaToTrace.indexOf(i) === -1 ? code : '')
          : processedCodes.map((code,i)=> i === first ? '' : code )
      }
    }

    const processedCodes = input.codes[0].value.split(',').map(code =>{
      return code === 'transparent' ? '' : code
    })
    // console.log('processedCodes',processedCodes)
    convertToSvg(processedCodes)

    // put in to compress
    // codesBox[1].value = pathData.join(' ').replaceAll('<path d="M','D').replaceAll('<path fill="#ffffff" d="M','F').replaceAll('/>','/').replaceAll('-1','N').replaceAll('-2','T').replaceAll(' v ','v').replaceAll(' h ','h').replaceAll('<path fill="#000000" d="M','D')

    input.codes[1].value = pathData.join(' ').replaceAll('ffffff','fff').replaceAll('000000','000')
  })

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
    input.cellSize.value = queryArray[3] || 20
    artData.column = +input.column.value
    artData.row = +input.row.value
    artData.cellSize = +input.cellSize.value

    const { cellSize, row, column } = artData 

    createGrid(0,'cell')
    createCopyGrids({
      row,
      column,
      cellSize,
      cellStyle: 'copy_cell'
    })

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

    const { cellSize, row, column } = artData

    createCopyGrids({
      row,
      column,
      cellSize,
      cellStyle: 'copy_cell'
    })
    copyGrid.classList.toggle('active')
    copyGrid.classList.remove('fix')
    // copyBox = null
    drawData.copyBoxCreated = false
    drawData.moveState = false
    drawData.copied = false
    drawData.isCut = false
    drawData.cursorType = 'pen_cursor'
    // document.querySelector('.move_selection').classList.remove('display_none')
  }
  
  // eventlistener
  input.cellSize.addEventListener('change',()=>{
    // prev[0].cellSize = cellSize
    artData.cellSize = +input.cellSize.value
  })


  input.row.addEventListener('change',()=>{
    const { row, column } = artData
    artData.codes[0] = input.codes[0].value.split(',').length < 1 || Array(row * column).fill('transparent')
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
    artData.codes[0] = input.codes[0].value.split(',').length < 1 || Array(row * column).fill('transparent')
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
      const diff = Math.abs(newColumn - column) //TODO adjust arrays
      // console.log('diff', diff)
      if (newColumn > column){
        return [...codes, ...Array(diff).fill('transparent')]
      } else {
        return codes.slice(0, codes.length - diff)
      }
    }).join(',')

    // prev[0].column = column
    column = newColumn
    artData.codes[0] = input.codes[0].value
    // console.log('codes[0]', codes[0].split(',').length)
    paintCanvas()
    generateFromColorCode()
    // console.log('column',column)
  })
  
  downloadButtons[0].addEventListener('click',()=>{
    paintCanvas()
    downloadImage(canvas[0],'cell')
  })
  downloadButtons[1].addEventListener('click',()=>{
    paintCanvasTwo()
    downloadImage(canvas[1],'small_cell')
  })
  
  generate[0].addEventListener('click',generateFromColorCode)
  copyButtons.forEach((button, i) =>{
    button.addEventListener('click',()=>copyText(input.codes[i]))
  })
  
  gridToggleButtons.forEach(button=>button.addEventListener('click',toggleGrid))
  
  grids.forEach(grid=>{
    grid.addEventListener('mousedown',()=> drawData.canDraw = true)
    grid.addEventListener('mouseup',()=> drawData.canDraw = false)
    grid.addEventListener('mouseleave',()=> drawData.canDraw = false)
  
    grid.addEventListener('mouseenter',()=>cursor.classList.add(drawData.cursorType))
    grid.addEventListener('mouseleave',()=>cursor.classList.remove(drawData.cursorType))
  })
  
  copyGrid.addEventListener('mouseenter',()=>cursor.classList.add(drawData.cursorType))
  copyGrid.addEventListener('mouseleave',()=>cursor.classList.remove(drawData.cursorType))

  input.color.addEventListener('change',()=>updateColor(input, input.color.value))
  input.hex.addEventListener('change', ()=>updateColor(input, input.hex.value))
  
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
    const { data: newData, row: newRow, column: newColumn,  cellSize: newCellSize } = artData.prev[artData.prev.length - 1]
    // console.log('newData', newData)
    
    artData.codes[0] = newData
    artData.column = newColumn
    artData.row = newRow
    artData.cellSize = newCellSize
    input.codes[0].value = newData
    input.row.value = newRow
    input.column.value = newColumn
    input.cellSize.value = newCellSize

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
    addClickEvent('move_selection', moveSelection)
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
