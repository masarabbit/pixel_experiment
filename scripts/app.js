function init() {
  
  // cell_1624118130397.png
  // cell_1624118654510.png
  //! create sprite creator

  //! edit grid with the codes.

  let canDraw = false
  let cellSize = 10
  let row = 10
  let column = 10
  let uploadedFiles
  let calcWidth
  let calcHeight
  
  const canvas = document.querySelector('.canvas_one')
  const ctx = canvas.getContext('2d')
  const canvasTwo = document.querySelector('.canvas_two')
  const ctxTwo = canvasTwo.getContext('2d')
  const grids = document.querySelectorAll('.grid')
  
  // button
  const draw = document.querySelector('.draw')
  const download = document.querySelector('.download')
  const copyButtons = document.querySelectorAll('.copy') 
  const createGridButtons = document.querySelectorAll('.create_grid')
  const add = document.querySelector('.add')
  const generate = document.querySelector('.generate')

  // input
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
  let codes = [1,2]

  function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
      throw 'Invalid color component'
    return ((r << 16) | (g << 8) | b).toString(16)
  }

  const updateGrid = () =>{
    grids[0].innerHTML=dots.map(dot=>{
      return `
        <div class="cell" style="background-color:${dot};">
        </div>
      `
    }).join('')
  }

  const updateCodesDisplay = (box,arr) =>{
    // box.value = `[${arr.map(ele=>ele).join(',')}]`
    box.value = `${arr.map(ele=>ele).join(',')}`
  }

  
  //draw
  const colorCell = e =>{
    const index = e.target.dataset.cell
    dots[index] = colorInput.value
    e.target.style.backgroundColor = colorInput.value
    updateCodesDisplay(dotsBox,dots)
  }

  // const continuousColorCell = e =>{
  //   if (!canDraw) return
  //   colorCell(e)
  //   e.target.classList.add('enlarge')
  //   setTimeout(()=>e.target.classList.remove('enlarge'),200)
  // }

  const drawMap = e =>{
    const index = e.target.dataset.cell
    console.log('arr',codes)
    codes[index] = letterInput.value
    e.target.innerHTML = letterInput.value
    updateCodesDisplay(codesBox,codes)
  }

  // const continuousDrawMap = e =>{
  //   if (!canDraw) return
  //   drawMap(e)
  //   e.target.classList.add('enlarge')
  //   setTimeout(()=>e.target.classList.remove('enlarge'),200)
  // }

  const continuousDraw = (e,action) =>{
    if (!canDraw) return
    action(e)
    e.target.classList.add('enlarge')
    setTimeout(()=>e.target.classList.remove('enlarge'),200)
  }
  
  

  const paintCanvas = () =>{
    const arr = new Array(row * column).fill('')
    
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
    console.log('clear',clear)
    const mapCells = document.querySelectorAll('.map_cell')
    mapCells.forEach(mapCell=>{
      mapCell.addEventListener('click',(e)=>drawMap(e))
      mapCell.addEventListener('mousemove',(e)=>continuousDraw(e,drawMap))
    })
    if (clear) updateCodesDisplay(codesBox,codes)
  }

  const generateMap = () =>{
    const mapGenCells = document.querySelectorAll('.map_gen_cell')
    mapGenCells.forEach((mapGenCell,i)=>{
      const background = codes[i] === '' ? '' : assignedCodes[codes[i]]
      if (background) mapGenCell.style.backgroundImage = `url(./assets/${background})`
      // mapCell.addEventListener('click',(e)=>drawMap(e))
      // mapCell.addEventListener('mousemove',(e)=>continuousDrawMap(e))
    })
    // updateCodesDisplay(codesBox,codes)  //! make the map editable with codes ?
  }

  const drawFunctions = [
    addDraw,
    addCodeDraw,
    generateMap
  ]

  const output = ()=>{
    if (!uploadedFiles) return
    const blobURL = window.URL.createObjectURL(uploadedFiles)
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

      grids[0].style.height = `${calcHeight - (calcHeight % cellSize)}px`
      grids[0].style.width = `${calcWidth}px` 
      dots.length = 0

      ctx.drawImage(imageTarget, 0, 0, calcWidth, calcHeight)

      for (let i = 0; i < row * column; i++) {
        const y = Math.floor(i / column) * cellSize
        const x = i % column * cellSize
        const c = ctx.getImageData(x, y , 1, 1).data
        var hex = '#' + ('000000' + rgbToHex(c[0], c[1], c[2])).slice(-6)
        dots.push(hex)
      }
      // populate grid and make it reactive
      updateGrid()
      updateCodesDisplay(dotsBox,dots)
      paintCanvas()
      addDraw()
    }
    imageTarget.src = blobURL
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
      mapCells[i].innerHTML = ele
    })
    generateMap()
  }


  const downloadImage = () =>{
    paintCanvas()
    const link = document.createElement('a')
    link.download = `cell_${new Date().getTime()}.png`;
    link.href = canvasTwo.toDataURL()
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

    const inputAssign = document.createElement('div')
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
  
  
  cellSizeInputs[0].addEventListener('change',()=>cellSize = cellSizeInputs[0].value)
  rowInputs[0].addEventListener('change',()=>row = rowInputs[0].value)
  columnInputs[0].addEventListener('change',()=>column = columnInputs[0].value)

  rowInputs[1].addEventListener('change',()=>rowInputs[2].value = rowInputs[1].value)
  columnInputs[1].addEventListener('change',()=>columnInputs[2].value = columnInputs[1].value)

  download.addEventListener('click',downloadImage)
  draw.addEventListener('click',output)
  generate.addEventListener('click',generateFromCode)
  copyButtons[0].addEventListener('click',()=>copyText(dotsBox))
  copyButtons[1].addEventListener('click',()=>copyText(codesBox))

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
    const upload = document.querySelector('#upload')
    uploadedFiles = upload.files[0]
    document.querySelector('.file_name').innerHTML = uploadedFiles.name
    draw.classList.remove('display_none')
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