function init() {
  

  // convert rgb(xxx,xxx,xxx) to hex
  // const c = cell.style.backgroundColor.replace('rgb(','').replace(')','').split(', ')
  // console.log(hex(rgbToHex(c[0], c[1], c[2])))
  
  // cell_1624118130397.png
  // cell_1624118654510.png


  let cursorType = 'pen_cursor'
  let canDraw = false
  let cellSize = 10
  let row = 10
  let column = 10
  let uploadedFile
  let calcWidth
  let calcHeight
  let erase = false
  let fill = false
  
  const canvas = document.querySelectorAll('.canvas')
  const ctx = canvas[0].getContext('2d')
  const ctxTwo = canvas[1].getContext('2d')
  const ctxThree = canvas[2].getContext('2d')
  const grids = document.querySelectorAll('.grid')
  const palettes = document.querySelectorAll('.palette')
  const cursor = document.querySelector('.cursor')
  
  // button
  const flip = document.querySelectorAll('.flip')
  const draw = document.querySelector('.draw')
  const downloadButtons = document.querySelectorAll('.download')
  const copyButtons = document.querySelectorAll('.copy') 
  const createGridButtons = document.querySelectorAll('.create_grid')
  const add = document.querySelector('.add')
  const generate = document.querySelectorAll('.generate')
  const gridToggleButtons = document.querySelectorAll('.grid_display')
  const clearButtons = document.querySelectorAll('.clear')
  const fillButtons = document.querySelector('.fill')

  // input
  const upload = document.querySelector('#upload')
  const uploadTwo = document.querySelector('#upload_two')
  const cellSizeInputs = document.querySelectorAll('.cell_size')
  const rowInputs = document.querySelectorAll('.row')
  const columnInputs = document.querySelectorAll('.column')
  const colorInput = document.querySelector('#color')
  const letterInput = document.querySelector('.letter')
  const colorLabel = document.querySelector('.color_label')
  // const codesBox[0] = document.querySelector('.dots')
  const codesBox = document.querySelectorAll('.codes')
  const inputAssignWrapper = document.querySelector('.input_assign_wrapper')
  const assignedCodes = {
    't':'tree.svg'
  }

  const codes = {
    0: [],
    1: []
  }

  const rgbToHex = (r, g, b) => {
    if (r > 255 || g > 255 || b > 255)
      throw 'Invalid color component'
    return ((r << 16) | (g << 8) | b).toString(16)
  }

  const hex = rgb =>{
    return '#' + ('000000' + rgb).slice(-6)
  }

  const sortedByFrequencyDuplicatesAndBlankRemoved = array =>{  
    const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0)
    const blankRemoved = array.filter(dot=> dot !== '' && dot)
    const orderedByFrequency = blankRemoved.map(ele=>{  
      return `${ele}_${countOccurrences(blankRemoved,ele)}`
    }).sort((a, b) => b.split('_')[1] - a.split('_')[1])  
    return [ ...new Set(orderedByFrequency.map(ele=>ele.split('_')[0]))]
  }


  const updateGrid = () =>{
    grids[0].innerHTML=codes[0].map(dot=>{
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
      if (index === 1 && !assignedCodes[d]) return
      const background = index === 0 ? `background-color:${d}` : `background-image:url(./assets/${assignedCodes[d]})`
      return `
        <div class="palette_cell">
          <div class="palette_color" style="${background};">
          </div>
        </div>`
    }).join('')

    const paletteColors = document.querySelectorAll('.palette_color')
    paletteColors.forEach((cell,i)=>{
      cell.addEventListener('click',()=>{
        if (filteredData[0][0] === '#'){
          colorInput.value = filteredData[i]
          colorLabel.style.backgroundColor = filteredData[i]
        } else {
          letterInput.value = Object.keys(assignedCodes).find(k => {
            return assignedCodes[k] === assignedCodes[filteredData[i]]
          })
        }
      })
    })
  }

  const updateCodesDisplay = (box,arr) =>{
    // box.value = `[${arr.map(ele=>ele).join(',')}]`
    box.value = `${arr.map(ele=>ele).join(',')}`
    const index = box === codesBox[0]? 0 : 1 
    populatePalette(index,arr)
  }

  
  //draw
  const colorCell = e =>{
    const index = e.target.dataset.cell
    if (fill) {
      fillBucket(index)
      return
    }
    const value = erase ? 'transparent' : colorInput.value
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

  const drawWithImage = e =>{
    const index = e.target.dataset.cell
    codes[1][index] = letterInput.value
    const background = codes[1][index] === '' ? '' : assignedCodes[codes[1][index]]
    if (background )e.target.style.backgroundImage = `url(./assets/${background})`
    updateCodesDisplay(codesBox[1],codes[1])
    // drawMap(e) //* draws letters
  }

  const continuousDraw = (e,action) =>{
    if (!canDraw) return
    action(e)
    e.target.classList.add('enlarge')
    setTimeout(()=>e.target.classList.remove('enlarge'),200)
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
      const x = i % column * cellSize
      const y = Math.floor(i / column) * cellSize
      // const y = i / column * cellSize
      ctx.fillStyle = codes[0][i] === '' ? 'transparent' : codes[0][i]
      ctx.fillRect(x, y, cellSize, cellSize)
    })
  }

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

  const generateMap = clear =>{
    const mapGenCells = document.querySelectorAll('.map_gen_cell')
    mapGenCells.forEach((mapGenCell,i)=>{
      const background = codes[1][i] === '' ? '' : assignedCodes[codes[1][i]]

      if (background) mapGenCell.style.backgroundImage = `url(./assets/${background})`
      mapGenCell.addEventListener('click',(e)=>drawWithImage(e))
      mapGenCell.addEventListener('mousemove',(e)=>continuousDraw(e,drawWithImage))
    })
    if (clear) updateCodesDisplay(codesBox[1],codes[1])  
  }

  const drawFunctions = [
    addDraw,
    addCodeDraw,
    generateMap
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
      // row = rowInputs[0].value ? rowInputs[0].value : (calcHeight - (calcHeight % cellSize)) / cellSize
      // rowInputs[0].value = row
      row = rowInputs[0].value
      column = columnInputs[0].value
      grids[0].style.height = `${row * cellSize}px`
      grids[0].style.width = `${column * cellSize}px` 

      // grids[0].style.height = `${calcHeight - (calcHeight % cellSize)}px`
      // grids[0].style.width = `${calcWidth}px` 
      codes[0].length = 0

      ctx.drawImage(imageTarget, 0, 0, calcWidth, calcHeight)

      const offset = Math.floor(cellSize / 2)

      for (let i = 0; i < row * column; i++) {
        const x = i % column * cellSize
        const y = Math.floor(i / column) * cellSize
        const c = ctx.getImageData(x + offset, y + offset, 1, 1).data //!offset
        // var hex = '#' + ('000000' + rgbToHex(c[0], c[1], c[2])).slice(-6)
        codes[0].push(hex(rgbToHex(c[0], c[1], c[2])))
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
      rowInputs[0].value,
      columnInputs[0].value,
      cellSizeInputs[0].value,
      0,
      'cell',
      false
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
      if(!cells[i]) return
      cells[i].style.backgroundColor = ele
    })
    addDraw()
    populatePalette(0,codes[0])
  }

  const generateFromCode = () =>{
    createGridCells(
      rowInputs[1].value,
      columnInputs[1].value,
      cellSizeInputs[1].value,
      1,
      'map_cell',
      false
    )
    createGridCells(
      rowInputs[2].value,
      columnInputs[2].value,
      cellSizeInputs[2].value,
      2,
      'map_gen_cell',
      false
    ) 
    codes[1] = codesBox[1].value.split(',')
    const mapCells = document.querySelectorAll('.map_cell')
    codesBox[1].value.split(',').forEach((ele,i)=>{
      if(!mapCells[i]) return
      mapCells[i].innerHTML = ele
    })
    generateMap(false)
    populatePalette(1,codes[1])
  }


  const downloadImage = (canvas,name) =>{
    const link = document.createElement('a')
    link.download = `${name}_${new Date().getTime()}.png`;
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
          data-cell=${i}
        >
        </div>
        `
    }).join('')
    drawFunctions[index](clear)
  }
  

  const createGrid = (index,cellStyle) =>{
    const row = rowInputs[index].value ? rowInputs[index].value : 50
    const column = columnInputs[index].value ? columnInputs[index].value : 50
    const cellSize = cellSizeInputs[index].value ? cellSizeInputs[index].value : 10
    createGridCells(row,column,cellSize,index,cellStyle,true)
    if (index === 0) {
      codes[0] = new Array(row * column).fill('transparent')
      codesBox[0].value = new Array(row * column).fill('transparent')
    } else {
      codes[1] = new Array(row * column).fill('')
      codesBox[1].value = new Array(row * column).fill('')
    }
  }
  
  // eventlistener
  add.addEventListener('click',()=>{

    const input = document.createElement('input')
    input.classList.add('key')
    const assign = document.createElement('textarea')
    assign.classList.add('assign') 
    
    //* option to add thumbnail... doesn't work because the image would not be defined yet.
    // const thumb = document.createElement('div')
    // thumb.classList.add('image_thumb')
    // thumb.style.backgroundImage = `url(./assets/${assign.value})`
    // thumb.addEventListener('click',()=>{
    //   letterInput.value = input.value
    // })

    const inputAssign = document.createElement('div')
    // inputAssign.appendChild(thumb)
    inputAssign.appendChild(input)
    inputAssign.appendChild(assign)
    inputAssign.classList.add('input_assign')
    inputAssignWrapper.appendChild(inputAssign)

    const updateAssignedCodes = () =>{
      assignedCodes[input.value]=assign.value
      console.log(assignedCodes)
    }

    // assign button
    input.addEventListener('change',updateAssignedCodes)
    assign.addEventListener('change',updateAssignedCodes)
    
    // remove button
    const remove = document.createElement('button')
    remove.innerHTML = '-'
    inputAssign.appendChild(remove)
    remove.addEventListener('click',()=>{
      delete assignedCodes[input.value]
      inputAssignWrapper.removeChild(inputAssign)
      console.log(assignedCodes)
    })
  })

  const toggleGrid = () =>{
    grids.forEach(grid=>grid.classList.toggle('grid_hide'))
    // gridToggleButtons.forEach(button=>button.innerHTML = button.innerHTML === 'hide grid'?'show grid':'hide grid')
  }
  
  
  cellSizeInputs[0].addEventListener('change',()=>cellSize = cellSizeInputs[0].value)
  rowInputs[0].addEventListener('change',()=>row = rowInputs[0].value)
  columnInputs[0].addEventListener('change',()=>column = columnInputs[0].value)

  rowInputs[1].addEventListener('change',()=>rowInputs[2].value = rowInputs[1].value)
  columnInputs[1].addEventListener('change',()=>columnInputs[2].value = columnInputs[1].value)
  
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
  generate[1].addEventListener('click',generateFromCode)
  copyButtons[0].addEventListener('click',()=>copyText(codesBox[0]))
  copyButtons[1].addEventListener('click',()=>copyText(codesBox[1]))
  gridToggleButtons.forEach(button=>button.addEventListener('click',toggleGrid))

  grids.forEach(grid=>{
    grid.addEventListener('mousedown',()=>canDraw = true)
    grid.addEventListener('mouseup',()=>canDraw = false)
    grid.addEventListener('mouseleave',()=>canDraw = false)

    grid.addEventListener('mouseenter',()=>cursor.classList.add(cursorType))
    grid.addEventListener('mouseleave',()=>cursor.classList.remove(cursorType))
  })

  colorInput.addEventListener('change',()=>{
    colorLabel.style.backgroundColor = colorInput.value
  })

  // display filename and pixelise button
  upload.addEventListener('change',()=>{
    uploadedFile = upload.files[0]
    document.querySelector('.file_name').innerHTML = uploadedFile.name
    draw.classList.remove('display_none')
  })

  uploadTwo.addEventListener('change',()=>{
    const firstImage = new Image()
    firstImage.onload = () => {
      const w = firstImage.naturalWidth
      const h = firstImage.naturalHeight
      canvas[0].setAttribute('width', w * uploadTwo.files.length)
      canvas[0].setAttribute('height', h)

      const w2 = 50
      const h2 = w2 * (w / h)
      canvas[2].setAttribute('width', w2 * uploadTwo.files.length)
      canvas[2].setAttribute('height', h2)
      
      Array.from(uploadTwo.files).forEach((upload,i)=>{
        const blobURL = window.URL.createObjectURL(upload)
        const eachImage = new Image()   
        eachImage.onload = () => {
          // console.log(w,h,eachImage)  
          ctx.drawImage(eachImage,i*w,0,w,h)
          ctxThree.drawImage(eachImage,i*w2,0,w2,h2)
        }
        eachImage.src = blobURL
      })
    }
    firstImage.src=window.URL.createObjectURL(uploadTwo.files[0])    
    // console.log('u',uploadedFiles)
  })

  downloadButtons[2].addEventListener('click',()=>{
    downloadImage(canvas[0],'sprite')
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

  
  // trace perimeter
  const periButton = document.querySelector('.perimeter')

  periButton.addEventListener('click',()=>{
    // const row = rowInputs[0].value
    const column = columnInputs[0].value
    const w = 100 / column
    const arr = codesBox[0].value.split(',')
    const first = arr.indexOf('#000000') //first index  
    const direction = [ 1, +column, -1, -column ]
    const checkDirection = [ -column, +1, +column, -1 ]
    const directionFactor = [ 1, 1, -1, -1 ]
    const x = first % column
    const y = Math.floor(first / column)
    const d = [`M ${x * w} ${y * w}`]
    let letter = 'h'
    let dirIndex = 0
    let count = 0
    let checkedIndex = []


    const recordTraceData = (dirIndexToCheck, index) =>{
      if (dirIndex === dirIndexToCheck && arr[index + checkDirection[dirIndex]] === 'transparent'){
        if (checkedIndex.filter(d=>d === dirIndexToCheck).length) return
        checkedIndex.push(dirIndexToCheck)
        // const distance = letter === 'h' ? 100 / row : 100 / column
        const distance = 100 / column
        d.push(`${letter} ${distance * directionFactor[dirIndex]}`)
        dirIndex = dirIndex === 3 ? 0 : dirIndex + 1
        letter = letter === 'h' ? 'v' : 'h'
      }
    }
    

    const trace = (index) =>{
      count++
      const indexPattern = [0,1,2,3,0,1,2,3]
      indexPattern.forEach(i=>recordTraceData(i,index))

      checkedIndex.length = 0
      dirIndex = dirIndex === 0 ? 3 : dirIndex - 1
      letter = letter === 'h' ? 'v' : 'h'

      if (index === first && count > 2) return
      trace(index + direction[dirIndex])
    }
    trace(first)
    console.log('<path d="' + d.join(' ') + '"/>')
    // console.log('<path d="' + d.join(' ') + ' Z"/>')
  })

  const hexToRgb = hex => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`: null
  }



  const fillBucket = index =>{
    const fillValue = erase ? 'transparent' : colorInput.value
    const areaToFill = [+index]
    // const valueToSwap = hexToRgb(codes[0][index])
    const valueToSwap = codes[0][index]
    const column = +columnInputs[0].value

    const checkIfAreaIsFilled = (i,valueToCheck) =>{
      if(codes[0][i] === valueToCheck){
        if (areaToFill.filter(d=>d === i).length > 3) return
        areaToFill.push(i)
        checkAreaToFill(i)
        }
    }
    
    const checkAreaToFill = codeIndex =>{
      if (codeIndex % column !== 0) checkIfAreaIsFilled(codeIndex - 1,valueToSwap)
      if (codeIndex % column !== column - 1) checkIfAreaIsFilled(codeIndex + 1,valueToSwap)
        checkIfAreaIsFilled(codeIndex + column,valueToSwap)
        checkIfAreaIsFilled(codeIndex - column,valueToSwap)
    }

    checkAreaToFill(+index)

    codesBox[0].value = codesBox[0].value.split(',').map((c,i)=>{
      if (areaToFill.indexOf(i) === -1) return c
      return c === valueToSwap ? fillValue : c
    }).join(',')
    // //* to fill only connected squares, need different logic similar to dog navigation 
    generateFromColorCode()
  }

  fillButtons.addEventListener('click',()=>{
    fillButtons.classList.toggle('active')
    fill = !fill
    cursorType = fill ? 'bucket_cursor' : 'pen_cursor'
  })



  // const convertToDataUrl = () =>{
  //   console.log(canvas[0].toDataURL())
  // }
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

}

window.addEventListener('DOMContentLoaded', init)
