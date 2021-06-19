function init() {
  

  //! create map creator
  //! create sprite creator

  let canDraw = false
  let cellSize
  let row
  let column
  let uploadedFiles
  
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
  let codes = []

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
    arr.forEach((_ele,i)=>{
      const x = i % column * cellSize
      const y = Math.floor(i / column) * cellSize
      ctx.fillStyle = dots[i]
      ctx.fillRect(x, y, cellSize, cellSize)
    })

    canvasTwo.setAttribute('width', (calcWidth / cellSize))
    canvasTwo.setAttribute('height', (calcHeight - (calcHeight % cellSize)) / cellSize)
    
    arr.forEach(ele=>{
      const x = ele % column
      const y = Math.floor(ele / column)
      ctxTwo.fillStyle = dots[ele]
      ctxTwo.fillRect(x, y, 1, 1)
    })
  }


  const output = ()=>{
    if (!uploadedFiles) return
    const blobURL = window.URL.createObjectURL(uploadedFiles)
    const imageTarget = new Image()

    cellSize = cellSizeInputs[0].value ? cellSizeInputs[0].value : 10
    column = columnInputs[0].value ? columnInputs[0].value : 40

    let iHeight
    let iWidth

    imageTarget.onload = () => {
      //* cellX x cellY
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
        // console.log(dots)
      }

      //* populate grid and make it reactive
      updateGrid()
      updateCodesDisplay(dotsBox,dots)

      paintCanvas()
      
      const cells = document.querySelectorAll('.cell')
      cells.forEach((c,i)=>{
        c.style.height = `${cellSize}px`
        c.style.width = `${cellSize}px`
        c.dataset.cell = i
        c.addEventListener('click',(e)=>colorCell(e))
        c.addEventListener('mousemove',(e)=>continuousColorCell(e))
      })
    }

    imageTarget.src = blobURL
  }



  const downloadImage = () =>{
    paintCanvas()
    const link = document.createElement('a')
    link.download = 'filename.png';
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

  
  const createMapGrid = () =>{
    const row = rowInputs[1].value ? rowInputs[1].value : 50
    const column = columnInputs[1].value ? columnInputs[1].value : 50
    const mapCellSize = cellSizeInputs[1].value ? cellSizeInputs[1].value : 10
    const arr = new Array(row * column).fill('')
    grids[1].style.width = `${column * mapCellSize}px`
    grids[1].style.height = `${row * mapCellSize}px`
    grids[1].innerHTML = arr.map((_ele,i)=>{
      return `
        <div 
          class="map_cell"
          style="
            width:${mapCellSize}px;
            height:${mapCellSize}px;
            font-size:${mapCellSize}px;
            line-height:${mapCellSize}px;
          "
          data-cell=${i}
        >
        </div>
        `
    }).join('') //! this can be refactored to create grid for grid 1


    const mapCells = document.querySelectorAll('.map_cell')
    mapCells.forEach(mapCell=>{
      mapCell.addEventListener('click',(e)=>drawMap(e))
      mapCell.addEventListener('mousemove',(e)=>continuousDrawMap(e))
    })
    codes = [...arr]
    updateCodesDisplay(codesBox,codes)
  }

  const createGrid = document.querySelector('.create_grid')
  createGrid.addEventListener('click',createMapGrid)


  const inputAssignWrapper = document.querySelector('.input_assign_wrapper')
  const add = document.querySelector('.add')
  add.addEventListener('click',()=>{
    const input = document.createElement('div')
    input.innerHTML = '<input class="key"><textarea class="assign"></textarea>'
    input.classList.add('input_assign')
    inputAssignWrapper.appendChild(input)


    //* assign button
    const assign = document.createElement('button')
    assign.innerHTML = '>'
    input.appendChild(assign)
    assign.addEventListener('click',()=>{
      console.log('test')
    })
    

    //* remove button
    const remove = document.createElement('button')
    remove.innerHTML = '-'
    input.appendChild(remove)
    remove.addEventListener('click',()=>{
      inputAssignWrapper.removeChild(input)
    })

  })

  // const remove = document.querySelector('.remove')
  // remove.addEventListener('click',()=>{
  //   const input = document.createElement('div')
  //   input.innerHTML = '<input class="key"><textarea class="assign"></textarea>'
  //   input.classList.add('input_assign')
  //   inputAssignWrapper.appendChild(input)
  // })


}

window.addEventListener('DOMContentLoaded', init)