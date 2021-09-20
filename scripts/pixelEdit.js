function init() {

  //todo copy and move to different area.

  let cursorType = 'pen_cursor'
  let canDraw = false
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
    data: null,
    width: null,
    height: null,
  }
  
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
  const draw = document.querySelector('.draw')
  const downloadButtons = document.querySelectorAll('.download')
  const copyButtons = document.querySelectorAll('.copy') 
  const createGridButtons = document.querySelectorAll('.create_grid')
  const generate = document.querySelectorAll('.generate')
  const gridToggleButtons = document.querySelectorAll('.grid_display')
  const clearButtons = document.querySelectorAll('.clear')
  const fillButtons = document.querySelector('.fill')
  const copySelectionButton = document.querySelector('.copy_selection')
  const moveSelectionButton = document.querySelector('.move_selection')
  const cropButton = document.querySelector('.crop_selection')
  const deleteSelectionButton = document.querySelector('.delete_selection')

  // input
  const upload = document.querySelector('#upload')
  const cellSizeInputs = document.querySelectorAll('.cell_size')
  const rowInputs = document.querySelectorAll('.row')
  const columnInputs = document.querySelectorAll('.column')
  const colorInput = document.querySelector('#color')
  const letterInput = document.querySelector('.letter')
  const colorLabel = document.querySelector('.color_label')
  const codesBox = document.querySelectorAll('.codes')
  
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

  const hex = rgb =>{
    return '#' + ('000000' + rgb).slice(-6)
  }

  const calcX = cell =>{
    return cell % column
  } 
  
  const calcY = cell =>{
    return Math.floor(cell / column)
  }

  const rounded = i =>{
    return ~~(i / cellSize) 
  }


  const sortedByFrequencyDuplicatesAndBlankRemoved = array =>{  
    const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0)
    const blankRemoved = array.filter(dot=> dot !== '' && dot)
    const orderedByFrequency = blankRemoved.map(ele=>{  
      return `${ele}_${countOccurrences(blankRemoved,ele)}`
    }).sort((a, b) => b.split('_')[1] - a.split('_')[1])  
    return [...new Set(orderedByFrequency.map(ele=>ele.split('_')[0]))]
  }


  const updateGrid = () =>{
    grids[0].innerHTML = codes[0].map(dot=>{
      return `
        <div class="cell" style="background-color:${dot};">
        </div>
      `
    }).join('')
  }

  const populatePalette = (index,arr) =>{
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
    paletteColors.forEach((cell,i)=>{
      cell.addEventListener('click',()=>{
        console.log('color3', filteredData[i] === 'transparent')
        //! some logic required for transparency
        colorInput.value = filteredData[i]
        colorLabel.style.backgroundColor = filteredData[i]
      })
    })
  }

  const updateCodesDisplay = (box,arr) =>{
    box.value = `${arr.map(ele=>ele).join(',')}`
    const index = box === codesBox[0] ? 0 : 1 
    populatePalette(index,arr)
  }

  
  //draw
  const colorCell = e =>{
    if (selectCopy) return
    const index = e.target.dataset.cell
    if (fill) {
      fillBucket(index)
      return
    }
    const value = erase ? 'transparent' : colorInput.value  //! transparent replaced with ''
    codes[0][index] = value
    e.target.style.backgroundColor = value
    updateCodesDisplay(codesBox[0],codes[0])
  }

  const drawMap = e =>{
    const index = e.target.dataset.cell
    const value = erase ? '' : letterInput.value
    codes[1][index] = value
    e.target.innerHTML = value
    updateCodesDisplay(codesBox[1],codes[1])
  }


  const continuousDraw = (e,action) =>{
    if (!canDraw) return
    action(e)
  }
  
  

  const paintCanvasTwo = () =>{
    const arr = new Array(row * column).fill('')
    
    if (calcWidth && calcHeight) {
      canvas[1].setAttribute('width', (calcWidth / cellSize))
      canvas[1].setAttribute('height', (calcHeight - (calcHeight % cellSize)) / cellSize)
    } else {
      canvas[1].setAttribute('width', column)
      canvas[1].setAttribute('height', row)
    }
    
    arr.forEach((_ele,i)=>{
      const x = i % column
      const y = Math.floor(i / column)
      ctxTwo.fillStyle = codes[0][i] === '' ? 'transparent' : codes[0][i]
      ctxTwo.fillRect(x, y, 1, 1)
    })
  }

  const paintCanvas = () =>{
    const arr = new Array(row * column).fill('')
    
    canvas[0].setAttribute('width', column * cellSize)
    canvas[0].setAttribute('height', row * cellSize)
  
    arr.forEach((_ele,i)=>{
      const x = calcX(i) * cellSize
      const y = calcY(i) * cellSize
      ctx.fillStyle = codes[0][i] === '' ? 'transparent' : codes[0][i]
      ctx.fillRect(x, y, cellSize, cellSize)
    })
  }


  //! maybe add selectCopy here?
  const addDraw = () =>{
    const cells = document.querySelectorAll('.cell')
    cells.forEach((c,i)=>{
      c.style.height = `${cellSize}px`
      c.style.width = `${cellSize}px`
      c.dataset.cell = i
      c.addEventListener('click',(e)=>colorCell(e))
      c.addEventListener('mousemove',(e)=>continuousDraw(e,colorCell))
    })
  }

  const addCodeDraw = clear =>{
    const mapCells = document.querySelectorAll('.map_cell')
    mapCells.forEach(mapCell=>{
      mapCell.addEventListener('click',(e)=>drawMap(e))
      mapCell.addEventListener('mousemove',(e)=>continuousDraw(e,drawMap))
    })
    if (clear) updateCodesDisplay(codesBox[1],codes[1])
  }

  const drawFunctions = [
    addDraw,
    addCodeDraw
  ]

  const output = ()=>{
    if (!uploadedFile) return
    const blobURL = window.URL.createObjectURL(uploadedFile)
    const imageTarget = new Image()
    let iHeight
    let iWidth

    imageTarget.onload = () => {
      const maxWidth = column * cellSize 
      iWidth = imageTarget.naturalWidth 
      iHeight = imageTarget.naturalHeight 
      calcHeight = maxWidth * (iHeight / iWidth)
      calcWidth = calcHeight * (iWidth / iHeight)
      canvas[0].setAttribute('width', calcWidth)
      canvas[0].setAttribute('height', calcHeight - (calcHeight % cellSize))
      
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
      paintCanvasTwo()
      addDraw()
    }
    imageTarget.src = blobURL
  }

  const generateFromColorCode = () =>{
    createGridCells(
      row,
      column,
      cellSize,
      0,
      'cell',
      false
    )

    createCopyGrids(
      row,
      column,
      cellSize,
      'copy_cell'
    )

    if (!codesBox[0].value) {
      codes[0] = new Array(row * column).fill('transparent')
      codesBox[0].value = new Array(row * column).fill('transparent')
    }

    // remove \n
    codes[0] = codesBox[0].value.replace(/(\r\n|\n|\r)/gm,'').split(',')
    codesBox[0].value = codes[0]

    const cells = document.querySelectorAll('.cell')
    codesBox[0].value.split(',').forEach((ele,i)=>{
      if (!cells[i]) return
      cells[i].style.backgroundColor = ele
    })
    addDraw()
    populatePalette(0,codes[0])
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

  const createGridCells = (row,column,cellSize,index,cellStyle,clear) =>{
    const arr = new Array(row * column).fill('')
    grids[index].style.width = `${column * cellSize}px`
    grids[index].style.height = `${row * cellSize}px`
    grids[index].innerHTML = arr.map((_ele,i)=>{
      return `
        <div 
          class="${cellStyle}"
          style="
            width:${cellSize}px;
            height:${cellSize}px;
            font-size:${cellSize}px;
            line-height:${cellSize}px;
          "
          index="${i}"
          data-cell=${i}
        >
        </div>
        `
    }).join('')
    drawFunctions[index](clear)
  }
  
  let copyState
  let copyBoxCreated
  let copyBox
  let copyGrids
  let prevX
  let prevY
  const defaultPos = {
    top: null,
    left: null,
    cell: null
  }

  const createCopyGrids = (row,column,cellSize,cellStyle) =>{
    const arr = new Array(row * column).fill('')
    copyGrid.style.width = `${column * cellSize}px`
    copyGrid.style.height = `${row * cellSize}px`
    copyGrid.style.marginTop = '100px'
    copyGrid.style.marginBottom = `-${(row * cellSize) + 100}px`
    copyGrid.innerHTML = arr.map((_ele,i)=>{
      return `
        <div 
          class="${cellStyle}"
          style="
            width:${cellSize}px;
            height:${cellSize}px;
          "
          data-cell=${i}
        >
        </div>
        `
    }).join('')
    copyGrids = document.querySelectorAll(`.${cellStyle}`)


    copyGrids.forEach((grid,i)=>{
      
      grid.addEventListener('click',(e)=>{
        if (!copyBoxCreated){
          copyBox = document.createElement('div')
          copyBox.classList.add('copy_box')
          copyGrid.append(copyBox)
          copyBoxCreated = true
          copyBox.style.width = `${cellSize}px`
          copyBox.style.height = `${cellSize}px`
          
          defaultPos.top = e.target.offsetTop
          defaultPos.left = e.target.offsetLeft
          defaultPos.defPos = i
          prevX = i % column * cellSize
          prevY = Math.floor(i / column)
          // defaultPos.defX = prevX

          copyBox.style.top = `${defaultPos.top}px`
          copyBox.style.left = `${defaultPos.left}px`

          const handle = document.createElement('div')
          handle.classList.add('handle')
          handle.style.width = `${cellSize}px`
          handle.style.height = `${cellSize}px`
          const moveHandle = document.createElement('div')  //? maybe don't need this?
          moveHandle.classList.add('move_handle')
          moveHandle.style.width = `${cellSize}px`
          moveHandle.style.height = `${cellSize}px`

          copyBox.append(handle)
          copyBox.append(moveHandle)        
        }
      })
    })
  }

  copyGrid.addEventListener('mousedown', ()=> copyState = true)
  copyGrid.addEventListener('mouseup', ()=> copyState = false)

  //TODO add way to confirm selected area
  copyGrid.addEventListener('mousemove',(e)=>{     
    if (copyState) {
      const next = e.target.dataset.cell
      const newX = calcX(next)
      const newY = calcY(next)
      const { defPos } = defaultPos
      
      if (!copyBox) return
      if (newX !== prevX && newY === prevY) {
        const newWidth = (newX - calcX(defPos) + 1)
        copyData.width = newWidth
        copyBox.style.width = `${newWidth * cellSize}px`
      } else if (newY !== prevY) {
        const newHeight = (newY - calcY(defPos) + 1)
        copyData.height = newHeight
        copyBox.style.height = `${newHeight * cellSize}px`
      } 
      prevX = newX
      prevY = newY
      copySelection()
    }     
  })

  const returnSelectedCells = (firstCell, roundedX, roundedY) =>{
    let width = copyBox ? copyBox.style.width.replace('px','') / cellSize : ''
    let height = copyBox ? copyBox.style.height.replace('px','') / cellSize : ''
    const selection = []

    if (roundedX < 0) width += roundedX // adjusts width if selection is beyond left edge of copyBox
    if (roundedY < 0) height += roundedY // adjusts height if selection is beyond top edge of copyBox 

    // adjusts width if selection is beyond right edge of copyBox
    if (roundedX + width > column) width -= Math.abs((roundedX + width) - column) 

    for (let a = firstCell; a < firstCell + (height * column); a += +column){
      for (
        let b = a; 
        b < (a + width) && // stops at box edge
            calcY(a) < row; // ignores selection outside bottom of copyBox
        b++
      ){
        selection.push(b)
      }
    }
    return selection
  }

  const copySelection = () =>{
    const { defPos } = defaultPos
    copyData.data = returnSelectedCells(defPos)
  }

  copySelectionButton.addEventListener('click', copySelection)
  

  //TODO move
  moveSelectionButton.addEventListener('click', ()=>{

    copyBox.classList.toggle('move')
    copyGrid.classList.toggle('fix')
    let newX
    let newY
    const onDrag = e => {
      copyBox.style.transtion = '0s'
      const originalStyles = window.getComputedStyle(copyBox)
      newX = parseInt(originalStyles.left) + e.movementX
      newY = parseInt(originalStyles.top) + e.movementY
      copyBox.style.left = `${newX}px`
      copyBox.style.top = `${newY}px`
    }

    const onLetGo = () => {
      // adjustments made here to ensure 'firstcell' is within selection.
      // this needs to be done because numbers continue to next row.
      const roundedY = rounded(newY) > 0 ? rounded(newY) : 0
      const roundedX = rounded(newX) > 0 ? rounded(newX) : 0

      
      // copyData = returnSelectedCells( (roundedY * column) + roundedX, rounded(newX), rounded(newY))
  
      copyData.width= copyBox.style.width.replace('px','') / cellSize,
      copyData.height= copyBox.style.height.replace('px','') / cellSize,
      copyData.data= returnSelectedCells( (roundedY * column) + roundedX, rounded(newX), rounded(newY))

      console.log('new selection', copyData )

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
  })

  const createGrid = (index,cellStyle) =>{
    createGridCells(row,column,cellSize,index,cellStyle,true)
    if (index === 0) {
      codes[0] = new Array(row * column).fill('transparent')
      codesBox[0].value = new Array(row * column).fill('transparent')
      console.log('selectCopy',selectCopy)
    } else {
      codes[1] = new Array(row * column).fill('')
      codesBox[1].value = new Array(row * column).fill('')
    }
  }

  const crop = () =>{
    if (!copyData.data) return
    codesBox[0].value = codesBox[0].value = codesBox[0].value.split(',').filter((_code,i)=>{
      return copyData.data.find(data=> +data === i)
    }).join(',')
    column = copyData.width
    row = copyData.height
    paintCanvas()
    generateFromColorCode()
  }


  const deleteSelection = () =>{
    if (!copyData.data) return
    codesBox[0].value = codesBox[0].value = codesBox[0].value.split(',').map((code,i)=>{
      return copyData.data.find(data=> +data === i) 
        ? ''
        : code
    }).join(',')
    generateFromColorCode()
  }
  
  cropButton.addEventListener('click', crop)
  deleteSelectionButton.addEventListener('click', deleteSelection)

  // eventlistener

  const toggleGrid = () =>{
    grids.forEach(grid=>grid.classList.toggle('grid_hide'))
    // gridToggleButtons.forEach(button=>button.innerHTML = button.innerHTML === 'hide grid'?'show grid':'hide grid')
  }
  
  
  cellSizeInputs[0].addEventListener('change',()=>cellSize = cellSizeInputs[0].value)
  rowInputs[0].addEventListener('change',()=>row = rowInputs[0].value)
  columnInputs[0].addEventListener('change',()=>column = columnInputs[0].value)

  
  downloadButtons[0].addEventListener('click',()=>{
    paintCanvas()
    downloadImage(canvas[0],'cell')
  })
  downloadButtons[1].addEventListener('click',()=>{
    paintCanvasTwo()
    downloadImage(canvas[1],'small_cell')
  })
  draw.addEventListener('click',output)
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

  colorInput.addEventListener('change',()=>{
    colorLabel.style.backgroundColor = colorInput.value
  })

  // display filename and pixelise button
  upload.addEventListener('change',()=>{
    uploadedFile = upload.files[0]
    document.querySelector('.file_name').innerHTML = uploadedFile.name
    draw.classList.remove('display_none')
  })


  const arrayGroupedForFlipping = () =>{
    const arr = new Array(+columnInputs[0].value).fill('')
    const mappedArr = arr.map(()=>[])
    codesBox[0].value.split(',').forEach((d,i)=>{
      mappedArr[Math.floor(i / columnInputs[0].value)].push(d)
    })
    return mappedArr
  }
  
  // flip horizontal
  flip[0].addEventListener('click',()=>{
    const flippedArr = arrayGroupedForFlipping().map(a=>a.reverse())
    codesBox[0].value = flippedArr.join(',')
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
  createGridButtons.forEach(button=>{
    button.addEventListener('click',(e)=>{
      const gridClass = e.target.dataset.grid_class
      const index = +e.target.dataset.index
      createGrid(index,gridClass)
    })
  })
  
  clearButtons.forEach(button=>{
    button.addEventListener('click',()=>{
      erase = !erase
      clearButtons.forEach(button=>button.classList.toggle('active'))
      cursorType = erase ? 'eraser_cursor' : 'pen_cursor'
    })
  })

  const checkAreaToFill = (codeRef, i, valueToCheck, areaToFill) =>{
    const fillStack = []
    const column = +columnInputs[0].value
    fillStack.push(i) // first cell to fill
    
    while (fillStack.length > 0){
      const cellToCheck = fillStack.pop() // removes from area to check
      
      if (codeRef[cellToCheck] !== valueToCheck) continue // is the cell value already valueToCheck?
      if (areaToFill.filter(d=>d === cellToCheck).length) continue // is it in areaToFill already?
      areaToFill.push(cellToCheck) // if passed above check, include in areaToFill
    
      if (cellToCheck % column !== 0) fillStack.push(cellToCheck - 1) // check left
      if (cellToCheck % column !== column - 1) fillStack.push(cellToCheck + 1) // check right
      fillStack.push(cellToCheck + column) // check up
      fillStack.push(cellToCheck - column) // check down
    }
    // console.log('fillStack last',fillStack)
    console.log('areaToFill',areaToFill)
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

  fillButtons.addEventListener('click',()=>{
    fillButtons.classList.toggle('active')
    fill = !fill
    cursorType = fill ? 'bucket_cursor' : 'pen_cursor'
  })


  // trace perimeter
  const periButton = document.querySelector('.perimeter')

  periButton.addEventListener('click',()=>{
    console.log('trigger')
    const pathData = []
    const areaToTrace = []
    const column = columnInputs[0].value
    // const w = 100 / column
    const w = 1
    const direction = [ 1, +column, -1, -column ] // move right, down, left, up
    const checkDirection = [ -column, +1, +column, -1 ] // check up, left, down, left of current cell

    // switches distance to move depending on which way the line is going.
    // corresponds to right, down, left, up
    const directionFactor = [ 1, 1, -1, -1 ] 
    const indexPattern = [0,1,2,3,0,1,2,3]

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

        //// const distance = 100 / column
        const distance = 1
        const distanceToMove = distance * directionFactor[dirIndex]
        if (d[d.length - 1].split(' ')[0] === letter){
          ////console.log('trigger')
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
        indexPattern.forEach(i=>recordTraceData(i,traceIndex))

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
        const currentColor = processedCodes.find(cell=>cell !== '')
        first = processedCodes.indexOf(currentColor) 

        //* isolating area to trace (area with same color, but connected)
        areaToTrace.length = 0
        checkAreaToFill(processedCodes, first, currentColor, areaToTrace)
        arr = processedCodes.map((code,i)=>{
          return areaToTrace.indexOf(i) !== -1 ? code : ''
        })

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
    codesBox[1].value = pathData.join(' ').replaceAll('<path d="M','D').replaceAll('<path fill="#ffffff" d="M','F').replaceAll('/>','/').replaceAll('-1','N').replaceAll('-2','T').replaceAll(' v ','v').replaceAll(' h ','h').replaceAll('<path fill="#000000" d="M','D')


  })

  const dataUrlButton = document.querySelector('.url')
  dataUrlButton.addEventListener('click',()=>{
    paintCanvas()
    console.log(canvas[0].toDataURL())
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

  const selectCopyButton = document.querySelector('.select_copy')

  selectCopyButton.addEventListener('click',()=>{
    selectCopy = !selectCopy
    copyGrid.classList.toggle('active')
  })

  // reads from url
  const query = window.location.hash
  if (query){
    const queryArray = query.split('#')
    columnInputs[0].value = queryArray[1] || 10
    rowInputs[0].value = queryArray[2] || 10
    cellSizeInputs[0].value = queryArray[3] || 20
    column = columnInputs[0].value
    row = rowInputs[0].value
    cellSize = cellSizeInputs[0].value

    createGrid(0,'cell')
    createCopyGrids(
      row,
      column,
      cellSize,
      'copy_cell'
    )

  }


  // copyGrid.addEventListener('click',()=>{

  //   indicator.innerHTML = ''
  // })

}

window.addEventListener('DOMContentLoaded', init)
