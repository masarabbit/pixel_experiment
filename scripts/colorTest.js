function init() {

  const cursorType = 'pen_cursor'

  let cellSize = 20
  let row = 10
  let column = 10
  let uploadedFile
  let calcWidth
  let calcHeight
  
  const canvas = document.querySelectorAll('.canvas')
  const ctx = canvas[0].getContext('2d')
  const ctxTwo = canvas[1].getContext('2d')
  const grids = document.querySelectorAll('.grid')
  const palettes = document.querySelectorAll('.palette')
  const cursor = document.querySelector('.cursor')
  
  // button
  const alts = document.querySelectorAll('.alt')
  const copyButtons = document.querySelectorAll('.copy') 
  const buttons = document.querySelectorAll('.button')
  const gridToggleButtons = document.querySelectorAll('.grid_display')

  // input
  const cellSizeInput = document.querySelector('.cell_size')
  const rowInput = document.querySelector('.row')
  const columnInput = document.querySelector('.column')
  const codesBox = document.querySelectorAll('.codes')
  const upload = document.querySelector('#upload')
  const colorInput = document.querySelector('#color')
  const colorLabel = document.querySelector('.color_label')

  const colorOutput = document.querySelector('.color_output')
  
  const codes = {
    0: [],
    1: []
  }

  const factor = 51

  const rgbToHex = (r, g, b) => {
    if (r > 255 || g > 255 || b > 255)
      throw 'Invalid color component'
    return ((r << 16) | (g << 8) | b).toString(16)
  }

  // const hexToRgb = hex => {
  //   const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  //   return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : null
  // }

  const nearestN = (arr, denom) =>{
    return arr.map(n => n === 0 ? 0 : (n - 1) + Math.abs(((n - 1) % denom) - denom))
  }

  const hexToRgbArr = hex =>{
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
  }

  const rgbFormat = rgbArr =>{
    return rgbArr.map(a => `rgb(${a})`)
  }

  const hex = rgb => '#' + ('000000' + rgb).slice(-6)

  const calcX = cell => cell % column
  
  const calcY = cell => Math.floor(cell / column)

  const cellWidthAndHeight = () => `width:${cellSize}px; height:${cellSize}px;`

  const updateGrid = () =>{
    grids[0].innerHTML = codes[0].map(dot => {
      return `<div class="cell" style="background-color:${dot}; ${cellWidthAndHeight()}"></div>`
    }).join('')
  }
  
  const arrayTotal = arr =>{
    return arr.reduce((acc, x)=> acc + x , 0)
  }


  const populatePalette = (index, arr) =>{
    const nearestNAndSorted = arr.filter(c=>c !== 'transparent').map(c=> nearestN(hexToRgbArr(c), factor)).sort((a,b)=>{
      return arrayTotal(a) - arrayTotal(b)
    })
    const duplicateRemoved = [...new Set(nearestNAndSorted.map(a => `${a}` ))].map(a => a.split(','))
    const filteredData = duplicateRemoved
    // console.log('filteredData', filteredData)
    // console.log('filteredData', rgbFormat(filteredData))
    
    const rgbOutput = filteredData.map((c, i)=>{
      return `<div>${i} :${hex(rgbToHex(c[0],c[1],c[2]))} : ${c}<div style="background-color:rgb(${c});"></div></div>`
    }).join('')
    colorOutput.innerHTML = rgbOutput
    
    const rgbData = rgbFormat(filteredData)
    palettes[index].innerHTML = rgbData.map(d=>{
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
        console.log('color3', rgbData[i] === 'transparent')
        //! some logic required for transparency
        colorInput.value = rgbData[i]
        colorLabel.style.backgroundColor = rgbData[i]
        document.querySelector('.color_hex').innerHTML = hex(rgbToHex(filteredData[i][0], filteredData[i][1], filteredData[i][2]))
      })
    })
  }

  const updateCodesDisplay = (box, arr) =>{
    box.value = `${arr.map(ele => ele).join(',')}`
    populatePalette(0, arr)
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
        const c = ctx.getImageData(x + offset, y + offset, 1, 1).data
        const filteredC = nearestN(c, factor)

        // this thing included here to prevent rendering black instead of transparent
        c[3] === 0
          ? codes[0].push('transparent')
          : codes[0].push(hex(rgbToHex(filteredC[0], filteredC[1], filteredC[2])))
        
      }
      // populate grid and make it reactive
      updateGrid()
      updateCodesDisplay(codesBox[0],codes[0])
      paintCanvasTwo()
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
    populatePalette(0, codes[0])
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
  }

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
  }

  
  // eventlistener
  cellSizeInput.addEventListener('change',()=>{
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

    column = newColumn
    codes[0] = codesBox[0].value
    paintCanvas()
    generateFromColorCode()
  })
  
  copyButtons.forEach((button, i) =>{
    button.addEventListener('click',()=>copyText(codesBox[i]))
  })
  
  const toggleGrid = () =>{
    grids.forEach(grid => grid.classList.toggle('grid_hide'))
  }

  gridToggleButtons.forEach(button=>button.addEventListener('click',toggleGrid))
  
  
  grids.forEach(grid=>{
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
    document.querySelector('.draw').classList.remove('display_none')
  })


  const addClickEvent = (b, className, event) =>{
    if (b.classList.contains(className)) b.addEventListener('click', event)
  }
  
  buttons.forEach(b =>{
    addClickEvent(b, 'draw', output)
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
  
}

window.addEventListener('DOMContentLoaded', init)
