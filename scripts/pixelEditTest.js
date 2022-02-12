function init() {

  //todo when to update?
  //todo crop has bug... seems to be one pixel off


  let cursorType = 'pen_cursor'
  let canDraw = false

  let prev = []
  let cellSize = 20
  let row = 10
  let column = 10
  let uploadedFile
  let calcWidth
  let calcHeight
  let erase = false
  let fill = false
  let selectCopy = false
  const copyData = {
    index: null,
    data: [],
    width: null,
    height: null,
  }
  
  // copy selection box
  let copyState
  let moveState
  let copyBoxCreated
  let copyBox
  let copied
  let isCut
  let prevX
  let prevY
  const defaultPos = {}
  
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
  const cellSizeInput = document.querySelector('.cell_size')
  const rowInput = document.querySelector('.row')
  const columnInput = document.querySelector('.column')
  const codesBox = document.querySelectorAll('.codes')
  const upload = document.querySelector('#upload')
  const colorInput = document.querySelector('#color')
  const hexInput = document.querySelector('.hex')
  // const letterInput = document.querySelector('.letter')
  const colorLabel = document.querySelector('.color_label')
  
  const codes = {
    0: [],
    1: []
  }

  const rgbToHex = (r, g, b) => {
    if (r > 255 || g > 255 || b > 255)
      throw 'Invalid color component'
    return ((r << 16) | (g << 8) | b).toString(16)
  }

  // const hexToRgb = hex => {
  //   const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  //   return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : null
  // }

  const hex = rgb => '#' + ('000000' + rgb).slice(-6)

  const calcX = cell => cell % column
  
  const calcY = cell => Math.floor(cell / column)

  const rounded = i => ~~(i / cellSize) 

  const sortedByFrequencyDuplicatesAndBlankRemoved = array =>{  
    const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0)
    const blankRemoved = array.filter(dot=> dot)
    const orderedByFrequency = blankRemoved.map(ele=>[ele, countOccurrences(blankRemoved,ele)]).sort((a, b) => b[1] - a[1])  
    return [...new Set(orderedByFrequency.map(ele=>ele[0]))]
  }

  const updateColor = color =>{
    console.log('color', color)
    colorLabel.style.backgroundColor = color
    hexInput.value = color
    colorInput.value = color
  }

  const updateCode = () =>{
    const lastPrev = prev[prev.length - 1]
    if (lastPrev && 
        lastPrev.data === codesBox[0].value &&
        lastPrev.row === +rowInput.value &&
        lastPrev.column === +columnInput.value
    ) return
    const latestData = {
      data: codesBox[0].value,
      row: +rowInput.value,
      column: +columnInput.value,
      cellSize: +cellSizeInput.value,
    }
    prev.push(latestData)
  }

  const cellWidthAndHeight = () => `width:${cellSize}px; height:${cellSize}px;`

  const updateGrid = () =>{
    grids[0].innerHTML = codes[0].map((dot, i) => {
      return `<div class="cell" index="${i}" data-cell=${i} style="background-color:${dot}; ${cellWidthAndHeight()}"></div>`
    }).join('')
  }


  const populatePalette = (index, arr) =>{
    const filteredData = sortedByFrequencyDuplicatesAndBlankRemoved(arr)
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
    if (selectCopy || e.target.classList.contains('grid')) return
    const index = e.target.dataset.cell
    if (fill) {
      fillBucket(index)
      return
    }
    const value = erase || hexInput.value === 'transparent' 
      ? 'transparent' 
      : colorInput.value  //! transparent replaced with ''
    codes[0][index] = value
    e.target.style.backgroundColor = value
    updateCodesDisplay(codesBox[0],codes[0])
    updateCode()
  }

  const continuousDraw = (e, action) => {
    if (canDraw) action(e) 
  }

  const resizeCanvas = (canvas, w, h) =>{
    canvas.setAttribute('width', w)
    canvas.setAttribute('height', h)
  }
  
  const paintCanvasTwo = () =>{
    const arr = new Array(row * column).fill('')

    calcWidth && calcHeight
      ? resizeCanvas(canvas[1], calcWidth / cellSize,  calcHeight - (calcHeight % cellSize) / cellSize)
      : resizeCanvas(canvas[1], column, row)
    
    arr.forEach((_ele,i)=>{
      const x = i % column
      const y = Math.floor(i / column)
      ctxTwo.fillStyle = codes[0][i] === '' ? 'transparent' : codes[0][i]
      ctxTwo.fillRect(x, y, 1, 1)
    })
  }

  const paintCanvas = () =>{
    const arr = new Array(row * column).fill('')
    
    resizeCanvas(canvas[0], column * cellSize, row * cellSize)
  
    arr.forEach((_ele,i)=>{
      const x = calcX(i) * cellSize
      const y = calcY(i) * cellSize
      ctx.fillStyle = codes[0][i] === '' ? 'transparent' : codes[0][i]
      ctx.fillRect(x, y, cellSize, cellSize)
    })
  }

  const output = ()=>{
    if (!uploadedFile) return
    const blobURL = window.URL.createObjectURL(uploadedFile)
    const imageTarget = new Image()

    imageTarget.onload = () => {
      const maxWidth = column * cellSize 
      const { naturalWidth: w, naturalHeight: h } = imageTarget
      calcHeight = maxWidth * (h / w)
      calcWidth = calcHeight * (w / h)
      resizeCanvas(canvas[0], calcWidth, calcHeight - (calcHeight % cellSize))
      
      grids[0].style.height = `${row * cellSize}px`
      grids[0].style.width = `${column * cellSize}px` 

      codes[0].length = 0

      ctx.drawImage(imageTarget, 0, 0, calcWidth, calcHeight)

      const offset = Math.floor(cellSize / 2)

      for (let i = 0; i < row * column; i++) {
        const x = i % column * cellSize
        const y = Math.floor(i / column) * cellSize
        const c = ctx.getImageData(x + offset, y + offset, 1, 1).data //!offset

        // this thing included here to prevent rendering black instead of transparent
        c[3] === 0
          ? codes[0].push('transparent')
          : codes[0].push(hex(rgbToHex(c[0], c[1], c[2])))
        // var hex = '#' + ('000000' + rgbToHex(c[0], c[1], c[2])).slice(-6)
        
      }
      // populate grid and make it reactive
      updateGrid()
      updateCodesDisplay(codesBox[0],codes[0])
      // updateCode()
      paintCanvasTwo()
      // addDraw()
      // createCopyGrids(
      //   row,
      //   column,
      //   cellSize,
      //   'copy_cell'
      // )
      generateFromColorCode()
    }
    imageTarget.src = blobURL
  }

  const generateFromColorCode = () =>{
    createGridCells(
      row,
      column,
      cellSize,
      0,
      'cell'
    )

    createCopyGrids(
      row,
      column,
      cellSize,
      'copy_cell'
    )

    if (!codesBox[0].value) {
      codes[0] = new Array(row * column).fill('transparent')
      codesBox[0].value = codes[0]
    }

    // remove \n
    codes[0] = codesBox[0].value.replace(/(\r\n|\n|\r)/gm,'').split(',')
    codesBox[0].value = codes[0]

    const cells = document.querySelectorAll('.cell')
    codesBox[0].value.split(',').forEach((ele,i)=>{
      if (cells[i]) cells[i].style.backgroundColor = ele
    })
    // addDraw()
    populatePalette(0, codes[0])
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

  const createGridCells = (row, column, cellSize, index, cellStyle) =>{
    const arr = new Array(row * column).fill('')
    grids[index].style.width = `${column * cellSize}px`
    grids[index].style.height = `${row * cellSize}px`
    grids[index].innerHTML = arr.map((_ele,i)=>{
      return `
        <div 
          class="${cellStyle}"
          style="${cellWidthAndHeight()}"
          index="${i}"
          data-cell=${i}
        >
        </div>
        `
    }).join('')

    grids[index].addEventListener('click', (e)=> colorCell(e))
    grids[index].addEventListener('mousemove', (e)=> continuousDraw(e,colorCell))
  }


  const createCopyGrids = (row, column, cellSize, cellStyle) =>{
    const arr = new Array(row * column).fill('')
    copyGrid.style.width = `${column * cellSize}px`
    copyGrid.style.height = `${row * cellSize}px`
    copyGrid.style.marginTop = '100px'
    copyGrid.style.marginBottom = `-${(row * cellSize) + 100}px`
    copyGrid.innerHTML = arr.map((_ele,i)=>{
      return `<div class="${cellStyle}" style="${cellWidthAndHeight()}" data-cell=${i}></div>`
    }).join('')

    copyGrid.addEventListener('click',(e)=>{
      if (!copyBoxCreated){
        copyBox = document.createElement('div')
        copyBox.classList.add('copy_box')
        copyGrid.append(copyBox)
        copyBoxCreated = true
        copyBox.style.width = `${cellSize}px`
        copyBox.style.height = `${cellSize}px`
        const i = e.target.dataset.cell
        defaultPos.top = e.target.offsetTop
        defaultPos.left = e.target.offsetLeft
        defaultPos.defPos = i
        prevX = i % column * cellSize
        prevY = Math.floor(i / column)

        copyBox.style.top = `${defaultPos.top}px`
        copyBox.style.left = `${defaultPos.left}px`
      }
    })
  }

  copyGrid.addEventListener('mousedown', ()=> copyState = true)
  copyGrid.addEventListener('mouseup', ()=> {
    copyState = false
    if (copyBox){
      defaultPos.top = copyBox.offsetTop
      defaultPos.left = copyBox.offsetLeft
    }
  })

  copyGrid.addEventListener('mousemove',(e)=>{     
    if (copyState && !moveState) {
      const next = e.target.dataset.cell
      const newX = calcX(next)
      const newY = calcY(next)
      const { defPos, top, left } = defaultPos
      
      if (!copyBox) return
      if (newX !== prevX && newY === prevY) {
        if (calcX(defPos) > newX){
          const newLeft = left - ((calcX(defPos) - newX) * cellSize)
          copyBox.style.left = `${newLeft}px`
          const newWidth = (calcX(defPos) - newX + 1) 
          copyBox.style.width = `${newWidth * cellSize}px`
        } else {
          const newWidth = (newX - calcX(defPos) + 1)
          copyData.width = newWidth
          copyBox.style.width = `${newWidth * cellSize}px`
          copyBox.style.left = `${left}px`
        }
        prevX = newX
      } else if (newY !== prevY) {
        if (calcY(defPos) > newY){ 
          const newTop = top - ((calcY(defPos) - newY) * cellSize)
          copyBox.style.top = `${newTop}px`
          const newHeight = (calcY(defPos) - newY + 1)
          copyBox.style.height = `${newHeight * cellSize}px`
        } else {
          const newHeight = (newY - calcY(defPos) + 1)
          copyData.height = newHeight
          copyBox.style.height = `${newHeight * cellSize}px`
          copyBox.style.top = `${top}px`
        }
        prevY = newY
      } 
      
      // copy selected area
      const x = copyBox.offsetLeft / cellSize
      const y = copyBox.offsetTop / cellSize
      copyData.index = returnSelectedCells((y * column) + x)

      // console.log('copyData index', copyData.index)
      // console.log('index', copyData.index, 'prevY',prevY, 'prevX', prevX)
      // copySelection()
    }     
  })


  const returnSelectedCells = (firstCell, roundedX, roundedY) =>{
    if (copyBox && !copied){
      copyBox.style.justifyContent = 'flex-end'
      copyBox.style.alignItems = 'flex-end'
    }
    let w = copyBox ? copyBox.style.width.replace('px','') / cellSize : ''
    let h = copyBox ? copyBox.style.height.replace('px','') / cellSize : ''
    const selection = []

    if (roundedX < 0) w += roundedX // adjusts width if selection is beyond left edge of copyBox
    if (roundedY < 0) h += roundedY // adjusts height if selection is beyond top edge of copyBox 

    // adjusts width if selection is beyond right edge of copyBox
    if (roundedX + w > column) {
      if (!copied) copyBox.style.justifyContent = 'flex-start'
      w -= Math.abs((roundedX + w) - column) 
    }
    // adjust height if selection is beyond bottom edge of copyBox
    if (roundedY + h > row) {
      if (!copied) copyBox.style.alignItems = 'flex-start'
      h -= Math.abs((roundedY + h) - row) 
    }

    for (let a = firstCell; a < firstCell + (h * column); a += +column){
      for (let b = a; b < (a + w); b++){
        selection.push(b) 
      }
    }
    
    if (!copied){
      const activeArea = document.querySelector('.active_area')
      if (!activeArea) {
        copyBox.innerHTML = `<div class="active_area" style="width:${w * cellSize}px; height:${h * cellSize}px;"></div>`
      } else {
        activeArea.style.width = `${w * cellSize}px`
        activeArea.style.height = `${h * cellSize}px`
      }
      // copyData.activeArea = selection
    }
    
    return selection
  }

  const copySelectionToCopyBox = cut =>{
    if (copyData.data.length) return
    const activeArea = document.querySelector('.active_area')
    if (!activeArea) return
    activeArea.innerHTML = copyData.index.map(index=>{
      return `<div style="${cellWidthAndHeight()} background-color:${codes[0][index]};"></div>`
    }).join('')

    copyData.index.forEach((index,i)=>{
      copyData.data[i] = codesBox[0].value.split(',')[index]
    })
    
    if (cut){
      //* delete original
      codes[0] = codesBox[0].value.split(',').map((grid, i)=> copyData.index.some(data => data === i) ? 'transparent' : grid)
      codesBox[0].value = codes[0]
      isCut = true
    } 
    copied = true

    paintCanvas()
    document.querySelectorAll('.cell').forEach((cell,i)=>{
      cell.style.backgroundColor = codes[0][i]
    })
  
    copyBox.style.top = `${copyBox.offsetTop + activeArea.offsetTop}px`
    copyBox.style.left = `${copyBox.offsetLeft + activeArea.offsetLeft}px`
    copyBox.style.width = activeArea.style.width
    copyBox.style.height = activeArea.style.height
    updateCode()

    moveSelection()
  }

  const paste = () =>{
    if (!copyData.data.length) return
    console.log('copydata', copyData.data)

    copyData.index.forEach((index, i)=> {
      if (copyData.data[i] !== 'transparent') codes[0][index] = copyData.data[i] 
    })
    codesBox[0].value = codes[0]

    paintCanvas()
    document.querySelectorAll('.cell').forEach((cell, i)=> cell.style.backgroundColor = codes[0][i])

    if (isCut) handleSelect()
    updateCode()
  }


  //TODO move
  const moveSelection = () =>{
    // document.querySelector('.move_selection').classList.add('display_none')
    moveState = true
    cursorType = 'motion_cursor'
    copyBox.classList.toggle('move')
    copyGrid.classList.toggle('fix')
    let newX
    let newY
    const onDrag = e => {
      copyBox.style.transtion = '0s'
      newX = copyBox.offsetLeft + e.movementX
      newY = copyBox.offsetTop + e.movementY
      copyBox.style.left = `${newX}px`
      copyBox.style.top = `${newY}px`
    }

    const onLetGo = () => {
      // adjustments made here to ensure 'firstcell' is within selection.
      // this needs to be done because numbers continue to next row.
      const roundedY = rounded(newY) > 0 ? rounded(newY) : 0
      const roundedX = rounded(newX) > 0 ? rounded(newX) : 0
  
      copyData.width = copyBox.style.width.replace('px','') / cellSize,
      copyData.height = copyBox.style.height.replace('px','') / cellSize,
      copyData.index = returnSelectedCells((roundedY * column) + roundedX, rounded(newX), rounded(newY))

      // codesBox[1].value = copyData.index.join(',')
      // if (copyData.data.length) codesBox[1].value = copyData.index.join(',') + '-' + copyData.data.join(',')

      copyBox.style.left = `${rounded(newX) * cellSize}px`
      copyBox.style.top = `${rounded(newY) * cellSize}px`

      document.removeEventListener('mousemove', onDrag)
      document.removeEventListener('mouseup', onLetGo)
    }
    const onGrab = () => {
      document.addEventListener('mousemove', onDrag)
      document.addEventListener('mouseup', onLetGo)
    }
    copyBox.addEventListener('mousedown', onGrab)
  }

  const createGrid = (index,cellStyle) =>{
    createGridCells(row, column, cellSize, index, cellStyle)
    codes[0] = new Array(row * column).fill('transparent')
    codesBox[0].value = codes[0]

    updateCode()
  }

  const crop = () =>{
    if (!copyData.index) return

    codesBox[0].value = codesBox[0].value.split(',').filter((_code,i)=>{
      return copyData.index.some(data=> +data === i)
    }).join(',')

    column = copyData.width
    row = copyData.height
    paintCanvas()
    generateFromColorCode()
    columnInput.value = column
    rowInput.value = row
    handleSelect()
  }

  const deleteSelection = () =>{
    if (!copyData.index) return
    codesBox[0].value = codesBox[0].value.split(',').map((code, i)=>{
      return copyData.index.find(data=> +data === i) 
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
    const arr = new Array(+columnInput.value).fill('')
    const mappedArr = arr.map(()=>[])
    codesBox[0].value.split(',').forEach((d,i)=>{
      mappedArr[Math.floor(i / columnInput.value)].push(d)
    })
    return mappedArr
  }
  
  // flip horizontal
  flip[0].addEventListener('click',()=>{
    codesBox[0].value = arrayGroupedForFlipping().map(a => a.reverse()).join(',')
    paintCanvas()
    generateFromColorCode()
  })
  
  // flip vertical
  flip[1].addEventListener('click',()=>{
    codesBox[0].value = arrayGroupedForFlipping().reverse().join(',')
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
    const column = +columnInput.value
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
    const fillValue = erase ? 'transparent' : colorInput.value  //! '' instead of transparent
    const areaToFillBucket = []
    const valueToSwap = codes[0][index]
    
    checkAreaToFill(codes[0], +index, valueToSwap, areaToFillBucket)

    codesBox[0].value = codesBox[0].value.split(',').map((c,i)=>{
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
    const column = columnInput.value
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
        //// console.log('processedCodes before last',processedCodes)
        // when only one square is being traced, area to be traced doesn't get overwritten, so needed to reset it to [], and check below if it has been updated
        //TODO may not need this workaround when the areaToTrace/fill bucket logic is changed
        processedCodes = areaToTrace.length 
          ? processedCodes.map((code,i)=> areaToTrace.indexOf(i) === -1 ? code : '')
          : processedCodes.map((code,i)=> i === first ? '' : code )
        //// console.log('processedCodes last',processedCodes)
        //// console.log('areaToTrace',areaToTrace)
      }
    }

    const processedCodes = codesBox[0].value.split(',').map(code =>{
      return code === 'transparent' ? '' : code
    })
    // console.log('processedCodes',processedCodes)
    convertToSvg(processedCodes)

    // put in to compress
    // codesBox[1].value = pathData.join(' ').replaceAll('<path d="M','D').replaceAll('<path fill="#ffffff" d="M','F').replaceAll('/>','/').replaceAll('-1','N').replaceAll('-2','T').replaceAll(' v ','v').replaceAll(' h ','h').replaceAll('<path fill="#000000" d="M','D')

    codesBox[1].value = pathData.join(' ').replaceAll('ffffff','fff').replaceAll('000000','000')
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
    columnInput.value = queryArray[1] || 10
    rowInput.value = queryArray[2] || 10
    cellSizeInput.value = queryArray[3] || 20
    column = +columnInput.value
    row = +rowInput.value
    cellSize = +cellSizeInput.value

    createGrid(0,'cell')
    createCopyGrids(
      row,
      column,
      cellSize,
      'copy_cell'
    )

  }

  const triggerFill = e =>{
    e.target.classList.toggle('active')
    fill = !fill
    cursorType = fill 
      ? 'bucket_cursor' 
      : moveState 
        ? 'motion_cursor' 
        : 'pen_cursor'
  }

  const triggerClear = e =>{
    e.target.classList.toggle('active')
    erase = !erase
    cursorType = erase 
      ? 'eraser_cursor' 
      : moveState 
        ? 'motion_cursor' 
        : 'pen_cursor'
  }
  
  const handleSelect = () =>{ //TODO needs refactor since it doesn't work when copyBox has been made once
    selectCopy = !selectCopy
    copyData.data.length = 0
    if (copyBox) copyBox.classList.remove('move')
    createCopyGrids(
      row,
      column,
      cellSize,
      'copy_cell'
    )
    copyGrid.classList.toggle('active')
    copyGrid.classList.remove('fix')
    // copyBox = null
    copyBoxCreated = false
    moveState = false
    copied = false
    isCut = false
    cursorType = 'pen_cursor'
    // document.querySelector('.move_selection').classList.remove('display_none')
  }
  
  // eventlistener
  cellSizeInput.addEventListener('change',()=>{
    // prev[0].cellSize = cellSize
    cellSize = +cellSizeInput.value
  })


  rowInput.addEventListener('change',()=>{
    const newRow = +rowInput.value
    const diff = Math.abs(newRow - row) 
    codesBox[0].value = newRow > row
      ?  [...codes[0], ...Array(diff * column).fill('transparent')]
      :  codes[0].slice(0, codes[0].length - (diff * column))
    row = newRow
    codes[0] = codesBox[0].value
    paintCanvas()
    generateFromColorCode()
    // console.log('row', row)
  })


  columnInput.addEventListener('change',()=>{
    const newColumn = +columnInput.value
    const updatedCodes = [[]]
    let count = 0
    let index = 0
    codes[0].forEach(code =>{
      if (count === +column) {
        count = 0
        index++
        updatedCodes.push([])
      }
      count++
      updatedCodes[index].push(code)
    })

    codesBox[0].value = updatedCodes.map(codes=>{
      const diff = Math.abs(newColumn - column) //TODO adjust arrays
      if (newColumn > column){
        return [...codes, ...Array(diff).fill('transparent')]
      } else {
        return codes.slice(0, codes.length - diff)
      }
    }).join(',')

    // prev[0].column = column
    column = newColumn
    codes[0] = codesBox[0].value
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
    button.addEventListener('click',()=>copyText(codesBox[i]))
  })
  
  gridToggleButtons.forEach(button=>button.addEventListener('click',toggleGrid))
  
  grids.forEach(grid=>{
    grid.addEventListener('mousedown',()=>canDraw = true)
    grid.addEventListener('mouseup',()=>canDraw = false)
    grid.addEventListener('mouseleave',()=>canDraw = false)
  
    grid.addEventListener('mouseenter',()=>cursor.classList.add(cursorType))
    grid.addEventListener('mouseleave',()=>cursor.classList.remove(cursorType))
  })
  
  copyGrid.addEventListener('mouseenter',()=>cursor.classList.add(cursorType))
  copyGrid.addEventListener('mouseleave',()=>cursor.classList.remove(cursorType))

  colorInput.addEventListener('change',()=>updateColor(colorInput.value))
  hexInput.addEventListener('change', ()=>updateColor(hexInput.value))
  
  // display filename and pixelise button
  upload.addEventListener('change',()=>{
    uploadedFile = upload.files[0]
    document.querySelector('.file_name').innerHTML = uploadedFile.name
    document.querySelector('.draw').classList.remove('display_none')
    // draw.classList.remove('display_none')
  })


  const undo = () =>{
    // console.log('prev check', prev[prev.length - 1])
    if (!prev[prev.length - 1]) return
    const { data: newData, row: newRow, column: newColumn,  cellSize: newCellSize } = prev[prev.length - 1]
    // console.log('newData', newData)
    
    codes[0] = newData
    column = newColumn
    row = newRow
    cellSize = newCellSize
    codesBox[0].value = newData
    rowInput.value = newRow
    columnInput.value = newColumn
    cellSizeInput.value = newCellSize

    paintCanvas()
    generateFromColorCode()

    prev = prev.filter((_data,i)=>{
      return i !== prev.length - 1
    })
    if (!prev.length) updateCode()
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

  const handleCursor = e =>{
    cursor.style.top = `${e.pageY}px`
    cursor.style.left = `${e.pageX}px`
  }
  window.addEventListener('mousemove', handleCursor)


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
