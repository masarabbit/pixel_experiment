function init() {
  
  // convert rgb(xxx,xxx,xxx) to hex
  // const c = cell.style.backgroundColor.replace('rgb(','').replace(')','').split(', ')
  // console.log(hex(rgbToHex(c[0], c[1], c[2])))
  
  // cell_1624118130397.png
  // cell_1624118654510.png

  //! some way of enlarging created image?
  //! create sprite creator

  let canDraw = false
  let cellSize = 10
  let row = 10
  let column = 10
  let uploadedFile
  let calcWidth
  let calcHeight
  
  const canvas = document.querySelector('.canvas_one')
  const ctx = canvas.getContext('2d')
  const canvasTwo = document.querySelector('.canvas_two')
  const ctxTwo = canvasTwo.getContext('2d')
  const grids = document.querySelectorAll('.grid')
  const palettes = document.querySelectorAll('.palette')
  
  // button
  const draw = document.querySelector('.draw')
  const combine = document.querySelector('.combine')
  const downloadButtons = document.querySelectorAll('.download')
  const copyButtons = document.querySelectorAll('.copy') 
  const createGridButtons = document.querySelectorAll('.create_grid')
  const add = document.querySelector('.add')
  const generate = document.querySelectorAll('.generate')
  const gridToggleButtons = document.querySelectorAll('.grid_display')

  // input
  const upload = document.querySelector('#upload')
  const uploadTwo = document.querySelector('#upload_two')
  const cellSizeInputs = document.querySelectorAll('.cell_size')
  const rowInputs = document.querySelectorAll('.row')
  const columnInputs = document.querySelectorAll('.column')
  const colorInput = document.querySelector('#color')
  const letterInput = document.querySelector('.letter')
  const colorLabel = document.querySelector('.color_label')
  const dotsBox = document.querySelector('.dots')
  const codesBox = document.querySelector('.codes')
  const inputAssignWrapper = document.querySelector('.input_assign_wrapper')
  const assignedCodes = {}

  let dots = []
  let codes = []

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
    grids[0].innerHTML=dots.map(dot=>{
      return `
        <div class="cell" style="background-color:${dot};">
        </div>
      `
    }).join('')
  }

  const populatePalette = (index,arr) =>{
    const filteredData = sortedByFrequencyDuplicatesAndBlankRemoved(arr)
    palettes[index].innerHTML = filteredData.map(d=>{
      if (filteredData[0][0] !== '#' && !assignedCodes[d]) return
      const background = d[0] === '#' ? `background-color:${d}` : `background-image:url(./assets/${assignedCodes[d]})`
      return `
        <div 
          class="palette_cell"
          style="${background};"
        >
        </div>
      `
    }).join('')

    const paletteCells = document.querySelectorAll('.palette_cell')
    paletteCells.forEach((cell,i)=>{
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
    const index = box === dotsBox? 0 : 1 
    populatePalette(index,arr)
  }

  
  //draw
  const colorCell = e =>{
    const index = e.target.dataset.cell
    dots[index] = colorInput.value
    e.target.style.backgroundColor = colorInput.value
    updateCodesDisplay(dotsBox,dots)
  }

  const drawMap = e =>{
    const index = e.target.dataset.cell
    codes[index] = letterInput.value
    e.target.innerHTML = letterInput.value
    updateCodesDisplay(codesBox,codes)
  }

  const drawWithImage = e =>{
    const index = e.target.dataset.cell
    codes[index] = letterInput.value
    const background = codes[index] === '' ? '' : assignedCodes[codes[index]]
    if (background )e.target.style.backgroundImage = `url(./assets/${background})`
    updateCodesDisplay(codesBox,codes)
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
    
    //! could something be added here to scale canvasTwo?
    if (calcWidth && calcHeight) {
      canvasTwo.setAttribute('width', (calcWidth / cellSize))
      canvasTwo.setAttribute('height', (calcHeight - (calcHeight % cellSize)) / cellSize)
    } else {
      canvasTwo.setAttribute('width', column)
      canvasTwo.setAttribute('height', row)
    }
    
    arr.forEach((_ele,i)=>{
      const x = i % column
      const y = Math.floor(i / column)
      ctxTwo.fillStyle = dots[i] === '' ? 'transparent' : dots[i]
      ctxTwo.fillRect(x, y, 1, 1)
    })
  }

  const paintCanvas = () =>{
    const arr = new Array(row * column).fill('')
    
    canvas.setAttribute('width', column * cellSize)
    canvas.setAttribute('height', row * cellSize)
  
    arr.forEach((_ele,i)=>{
      const x = i % column * cellSize
      const y = Math.floor(i / column) * cellSize
      ctx.fillStyle = dots[i] === '' ? 'transparent' : dots[i]
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
    if (clear) updateCodesDisplay(codesBox,codes)
  }

  const generateMap = clear =>{
    const mapGenCells = document.querySelectorAll('.map_gen_cell')
    mapGenCells.forEach((mapGenCell,i)=>{
      const background = codes[i] === '' ? '' : assignedCodes[codes[i]]
      if (background) mapGenCell.style.backgroundImage = `url(./assets/${background})`
      mapGenCell.addEventListener('click',(e)=>drawWithImage(e))
      mapGenCell.addEventListener('mousemove',(e)=>continuousDraw(e,drawWithImage))
    })
    if (clear) updateCodesDisplay(codesBox,codes)  
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
      canvas.setAttribute('width', calcWidth)
      canvas.setAttribute('height', calcHeight - (calcHeight % cellSize))
      row = rowInputs[0].value ? rowInputs[0].value : (calcHeight - (calcHeight % cellSize)) / cellSize
      rowInputs[0].value = row

      grids[0].style.height = `${calcHeight - (calcHeight % cellSize)}px`
      grids[0].style.width = `${calcWidth}px` 
      dots.length = 0

      ctx.drawImage(imageTarget, 0, 0, calcWidth, calcHeight)

      for (let i = 0; i < row * column; i++) {
        const x = i % column * cellSize
        const y = Math.floor(i / column) * cellSize
        const c = ctx.getImageData(x, y, 1, 1).data
        // var hex = '#' + ('000000' + rgbToHex(c[0], c[1], c[2])).slice(-6)
        dots.push(hex(rgbToHex(c[0], c[1], c[2])))
      }
      // populate grid and make it reactive
      updateGrid()
      updateCodesDisplay(dotsBox,dots)
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
    dots = dotsBox.value.split(',')
    const cells = document.querySelectorAll('.cell')
    dotsBox.value.split(',').forEach((ele,i)=>{
      if(!cells[i]) return
      cells[i].style.backgroundColor = ele
    })
    addDraw()
    populatePalette(0,dots)
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
    codes = codesBox.value.split(',')
    const mapCells = document.querySelectorAll('.map_cell')
    codesBox.value.split(',').forEach((ele,i)=>{
      if(!mapCells[i]) return
      mapCells[i].innerHTML = ele
    })
    generateMap(false)
    populatePalette(1,codes)
  }


  const downloadImage = canvas =>{
    canvas === canvasTwo
    ? paintCanvasTwo()
    : paintCanvas()

    const link = document.createElement('a')
    link.download = `cell_${new Date().getTime()}.png`;
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
    gridToggleButtons.forEach(button=>button.innerHTML = button.innerHTML === 'hide grid'?'show grid':'hide grid')
  }
  
  
  cellSizeInputs[0].addEventListener('change',()=>cellSize = cellSizeInputs[0].value)
  rowInputs[0].addEventListener('change',()=>row = rowInputs[0].value)
  columnInputs[0].addEventListener('change',()=>column = columnInputs[0].value)

  rowInputs[1].addEventListener('change',()=>rowInputs[2].value = rowInputs[1].value)
  columnInputs[1].addEventListener('change',()=>columnInputs[2].value = columnInputs[1].value)
  
  downloadButtons[0].addEventListener('click',()=>downloadImage(canvas))
  downloadButtons[1].addEventListener('click',()=>downloadImage(canvasTwo))
  draw.addEventListener('click',output)
  generate[0].addEventListener('click',generateFromColorCode)
  generate[1].addEventListener('click',generateFromCode)
  copyButtons[0].addEventListener('click',()=>copyText(dotsBox))
  copyButtons[1].addEventListener('click',()=>copyText(codesBox))
  gridToggleButtons.forEach(button=>button.addEventListener('click',toggleGrid))

  grids.forEach(grid=>{
    grid.addEventListener('mousedown',()=>canDraw = true)
    grid.addEventListener('mouseup',()=>canDraw = false)
    grid.addEventListener('mouseleave',()=>canDraw = false)
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
      canvas.setAttribute('width', w * uploadTwo.files.length)
      canvas.setAttribute('height', h)
      console.log(uploadTwo.files)
      
      Array.from(uploadTwo.files).forEach((upload,i)=>{
        const blobURL = window.URL.createObjectURL(uploadTwo.files[i])
        const eachImage = new Image()   
        eachImage.onload = () => {
          // console.log(w,h,eachImage)  
          ctx.drawImage(eachImage,i*w,0,w,h)
        }
        eachImage.src = blobURL
      })
    }
    firstImage.src=window.URL.createObjectURL(uploadTwo.files[0])    
    // console.log('u',uploadedFiles)
  })

  combine.addEventListener('click',()=>{
    console.log('click')
  })

  // enable grid creation with buttons
  createGridButtons.forEach(button=>{
    button.addEventListener('click',(e)=>{
      const gridClass = e.target.dataset.grid_class
      const index = +e.target.dataset.index
      createGrid(index,gridClass)
    })
  })


}

window.addEventListener('DOMContentLoaded', init)