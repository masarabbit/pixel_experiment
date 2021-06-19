function init() {
  
  //! create sprite creator

  let canDraw = false
  let cellSize = 10
  let row = 20
  let column = 20
  let uploadedFiles
  let calcWidth
  let calcHeight
  
  const canvas = document.querySelector('.canvas_one')
  const ctx = canvas.getContext('2d')
  const canvasTwo = document.querySelector('.canvas_two')
  const ctxTwo = canvasTwo.getContext('2d')

  const draw = document.querySelector('.draw')
  const download = document.querySelector('.download')
  const dotsBox = document.querySelector('.dots')
  const codesBox = document.querySelector('.codes')

  const cellSizeInputs = document.querySelectorAll('.cell_size')
  const rowInputs = document.querySelectorAll('.row')
  const columnInputs = document.querySelectorAll('.column')
  const colorInput = document.querySelector('#color')
  const letterInput = document.querySelector('.letter')
  const colorLabel = document.querySelector('.color_label')

  const grids = document.querySelectorAll('.grid')
  const dots = []
  const codes = []

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
    box.value = `[${arr.map(ele=>ele).join(',')}]`
  }


  const colorCell = e =>{
    const index = e.target.dataset.cell
    dots[index] = colorInput.value
    e.target.style.backgroundColor = colorInput.value
    updateCodesDisplay(dotsBox,dots)
  }

  const continuousColorCell = e =>{
    if (!canDraw) return
    colorCell(e)
    e.target.classList.add('enlarge')
    setTimeout(()=>e.target.classList.remove('enlarge'),200)
  }
  

  const paintCanvas = () =>{
    const arr = new Array(row * column).fill('')
    // arr.forEach((_ele,i)=>{
    //   const x = i % column * cellSize
    //   const y = Math.floor(i / column) * cellSize
    //   ctx.fillStyle = dots[i]
    //   ctx.fillRect(x, y, cellSize, cellSize)
    // })
    
    if (calcWidth && calcHeight) {
      canvasTwo.setAttribute('width', (calcWidth / cellSize))
      canvasTwo.setAttribute('height', (calcHeight - (calcHeight % cellSize)) / cellSize)
      //* check what these would return...
      console.log(
        'widthX',(calcWidth / cellSize),
        'heightX',(calcHeight - (calcHeight % cellSize)) / cellSize
      )
      // console.log(row,column)
    } else {
      canvasTwo.setAttribute('width', column)
      canvasTwo.setAttribute('height', row)
      console.log(
        'width',column,
        'height',row,
        dots
      )
    }
    
    
    arr.forEach((_ele,i)=>{
      const x = i % column
      const y = Math.floor(i / column)
      // console.log(
      //   'check',x,y
      // )
      ctxTwo.fillStyle = dots[i]
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
        c.addEventListener('mousemove',(e)=>continuousColorCell(e))
      })
  }

  const addCodeDraw = () =>{
    const mapCells = document.querySelectorAll('.map_cell')
    mapCells.forEach(mapCell=>{
      mapCell.addEventListener('click',(e)=>drawMap(e))
      mapCell.addEventListener('mousemove',(e)=>continuousDrawMap(e))
    })
    // codes = [...arr]
    updateCodesDisplay(codesBox,codes)
  }

  const drawFunctions = [
    addDraw,
    addCodeDraw,
    ()=>null
  ]

  const dataBase = [
    dots,
    codes,
    []
  ]


  const output = ()=>{
    if (!uploadedFiles) return
    const blobURL = window.URL.createObjectURL(uploadedFiles)
    const imageTarget = new Image()
    let iHeight
    let iWidth

    cellSize = cellSizeInputs[0].value ? cellSizeInputs[0].value : 10
    column = columnInputs[0].value ? columnInputs[0].value : 20

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

      //* populate grid and make it reactive
      updateGrid()
      updateCodesDisplay(dotsBox,dots)

      paintCanvas()
      addDraw()
    }

    imageTarget.src = blobURL
  }



  const downloadImage = () =>{
    paintCanvas()
    const link = document.createElement('a')
    link.download = `cell_${new Date().getTime()}.png`;
    link.href = canvasTwo.toDataURL()
    link.click()
  }


  const copyButtons = document.querySelectorAll('.copy') 


  const copyText = box =>{
    box.select()
    box.setSelectionRange(0, 99999) // For mobile devices 
    document.execCommand('copy')
  }
  

  //* eventlistener
  download.addEventListener('click',downloadImage)
  draw.addEventListener('click',output)
  copyButtons[0].addEventListener('click',()=>copyText(dotsBox))
  copyButtons[1].addEventListener('click',()=>copyText(codesBox))
  grids.forEach(grid=>{
    grid.addEventListener('mousedown',()=>canDraw = true)
    grid.addEventListener('mouseup',()=>canDraw = false)
  })
  colorInput.addEventListener('change',()=>{
    colorLabel.style.backgroundColor = colorInput.value
  })

  //* display filename and pixelise button
  upload.addEventListener('change',()=>{
    const upload = document.querySelector('#upload')
    uploadedFiles = upload.files[0]
    document.querySelector('.file_name').innerHTML = uploadedFiles.name
    draw.classList.remove('display_none')
  })


  const drawMap = e =>{
    const index = e.target.dataset.cell
    codes[index] = letterInput.value
    e.target.innerHTML = letterInput.value
    updateCodesDisplay(codesBox,codes)
  }

  const continuousDrawMap = e =>{
    if (!canDraw) return
    drawMap(e)
    e.target.classList.add('enlarge')
    setTimeout(()=>e.target.classList.remove('enlarge'),200)
  }

  const createGrid = (index,cellStyle) =>{
    const row = rowInputs[index].value ? rowInputs[index].value : 50
    const column = columnInputs[index].value ? columnInputs[index].value : 50
    const cellSize = cellSizeInputs[index].value ? cellSizeInputs[index].value : 10
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
    drawFunctions[index]()
    dataBase[index].length = 0
    arr.forEach(()=>dataBase[index].push('#ffffff'))
    paintCanvas()
  }
  

  //* enable grid creation with buttons
  const createGridButtons = document.querySelectorAll('.create_grid')
  createGridButtons.forEach(button=>{
    button.addEventListener('click',(e)=>{
      const gridClass = e.target.dataset.grid_class
      const index = +e.target.dataset.index
      createGrid(index,gridClass)
    })
  })


  const inputAssignWrapper = document.querySelector('.input_assign_wrapper')
  const add = document.querySelector('.add')
  const assignedCodes = {}

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

    //* assign button
    const assignButton = document.createElement('button')
    assignButton.innerHTML = '>'
    inputAssign.appendChild(assignButton)
    assignButton.addEventListener('click',()=>{
      assignedCodes[input.value]=assign.value
      console.log(assignedCodes)
    })
    
    //* remove button
    const remove = document.createElement('button')
    remove.innerHTML = '-'
    inputAssign.appendChild(remove)
    remove.addEventListener('click',()=>{
      delete assignedCodes[input.value]
      inputAssignWrapper.removeChild(inputAssign)
      console.log(assignedCodes)
    })

  })
  

  rowInputs[1].addEventListener('change',()=>rowInputs[2].value = rowInputs[1].value)
  columnInputs[1].addEventListener('change',()=>columnInputs[2].value = columnInputs[1].value)

}

window.addEventListener('DOMContentLoaded', init)