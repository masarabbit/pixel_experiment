import mapData from './data/mapData.js'
import svgData from './data/svgData.js'
import { svgWrapper, singleSvgWrapper } from './data/svg.js'
import { resizeCanvas } from '../pixel_edit/scripts/actions/utils.js'

function init() {
  
  //TODO change style to display grid number using pseudo elements
  //TODO add highlights for event points etc

  let cellSize = 20
  let row = 20
  let column = 20

  //copy
  const copyData = {
    index: null,
    data: [],
    width: null,
    height: null,
  }
  
  let selectCopy = false
  let copyGrids
  let copyState
  let moveState
  let copyBoxCreated
  let copyBox
  let copied
  let isCut
  let prevX
  let prevY
  const defaultPos = {
    top: null,
    left: null,
    cell: null
  }

  const decode = arr =>{
    return arr.split('').map(c=>{
      if (c === 'D') return '<path d="M'
      if (c === 'F') return '<path fill="#fff" d="M'
      if (c === '/') return '/>'
      if (c === 'N') return '-1' 
      if (c === 'T') return '-2'
      return c
    }).join('')
  }


  let cursorType = 'pen_cursor'
  let canDraw = false
  let erase = false
  

  const grids = document.querySelectorAll('.grid')
  const palettes = document.querySelectorAll('.palette')
  const cursor = document.querySelector('.cursor')
  const copyGrid = document.querySelector('.copy_grid')
  const canvas = document.querySelectorAll('canvas')
  const ctx = canvas[0].getContext('2d')
  const ctx2 = canvas[1].getContext('2d')
  
  // button
  let alts = document.querySelectorAll('.alt')
  const copyButtons = document.querySelectorAll('.copy') 
  const indexToggleButton = document.querySelector('.display_index')
  const buttons = document.querySelectorAll('button')

  // input
  const cellSizeInputs = document.querySelectorAll('.cell_size')
  const rowInputs = document.querySelectorAll('.row')
  const columnInputs = document.querySelectorAll('.column')
  const letterInput = document.querySelector('.letter')
  const codesBox = document.querySelectorAll('.codes')
  const indexIndicator = document.querySelector('.index_indicator')
  const codes = {
    0: [],
    // 1: []
  }


  const compress = value =>{
    const originalArray = value.split(',')
    let count = 0
    const record = []

    originalArray.forEach((letter,i)=>{
      const next = i > originalArray.length ? '' : originalArray[i + 1]
      count++
      if (letter === next) return
      record.push([letter,count])
      count = 0 
    })

    return record.map(x=> x[0] + x[1])
  }


  const decompress = value =>{
    const output = []
    value.split(',').forEach(x=>{
      const letter = x.split('').filter(y=>y * 0 !== 0).join('')
      const repeat = x.split('').filter(y=>y * 0 === 0).join('')
      for (let i = 0; i < repeat; i++){
        output.push(letter)
      }
    })
    return output
  }

  const calcX = cell => cell % column
  const calcY = cell => Math.floor(cell / column)
  const rounded = i => ~~(i / cellSize) 
  const degToRad = deg => deg / (180 / Math.PI)
  
  const populateWithSvg = (key, target) =>{
    if (svgData[key]){
      const { svg, color, subColor, rotate, flip, frameNo, speed } = svgData[key]
      let colorAction = ''
      colorAction = typeof(color) === 'function' ? color() : color


      const svgContent = 
      `${svgWrapper({
          content: decode(subColor ? svg(subColor) : svg()),
          color: colorAction || '',
          rotate: rotate || 0,
          flip,
          wrapper: frameNo ? 'anim_wrapper' : 'svg_wrap',
          frameNo,
          speed
        })}`

      target.innerHTML = svgContent
      // svgContent.style.width = `${100 * (frameNo || 0)}%`  
      // target.childNodes[1].style.width = `${100 * (frameNo || 1)}%`  
    } 
  }
  
  const animateCell = ({ target, start, frameNo, speed }) => {
    const startFrame = start || 0
    let i = startFrame
    setInterval(()=> {
      target.style.marginLeft = `${-(i * 100)}%`
      i = i >= frameNo - 1
        ? startFrame
        : i + 1
    }, speed || 200)
  }


  const populatePalette = () =>{
    const keys = Object.keys(svgData)

    palettes[0].innerHTML = keys.map(d=>`<div class="palette_cell" data-key="${d}"></div>`).join('')

    const paletteCells = document.querySelectorAll('.palette_cell')
    
    keys.forEach((key,i)=>{
      populateWithSvg(key, paletteCells[i]) 
    })

    paletteCells.forEach(palette=>{
      palette.addEventListener('click',(e)=>{
        letterInput.value = e.target.dataset.key
      })
    })
    
  }

  populatePalette()


  const updateCodesDisplay = (box, arr) =>{
    box.value = `${arr.map(ele => ele).join(',')}`
    window.location.hash = `${columnInputs[0].value}#${rowInputs[0].value}#${compress(codesBox[0].value).join('-')}`
  }

  
  //draw
  const drawMap = e =>{
    if (selectCopy) return
    const index = e.target.dataset.cell
    const value = erase ? 'b' : letterInput.value
    codes[0][index] = value
    e.target.innerHTML = value
    updateCodesDisplay(codesBox[0],codes[0])
  }


  const drawWithImage = e =>{
    if (selectCopy) return
    const index = e.target.dataset.cell
    const value = erase ? 'b' : letterInput.value
    codes[0][index] = value

    updateCodesDisplay(codesBox[0],codes[0])

    if (svgData[value] && !erase)  {
      populateWithSvg(value,e.target) 
    } else {
      e.target.innerHTML = ''
    }

    // const cell = e.target.childNodes[1].childNodes[1]
    // animateCell({
    //   target: cell,
    //   frameNo: cell.dataset.frame_no,
    //   speed: cell.dataset.speed,
    // })
    // console.log('error',e.target)
  }


  const continuousDraw = (e, action) =>{
    if (!canDraw) return
    action(e)
  }
  
  


  const addCodeDraw = clear =>{
    const mapCells = document.querySelectorAll('.map_cell')
    mapCells.forEach(mapCell => {
      mapCell.addEventListener('click', e =>drawMap(e))
      mapCell.addEventListener('mousemove', e =>continuousDraw(e, drawMap))
    })
    if (clear) updateCodesDisplay(codesBox[0],codes[0])
  }

  const generateMap = clear =>{
    const mapGenCells = document.querySelectorAll('.map_gen_cell')

    // add way to display event in the map
    if (mapData[indexIndicator.value]) console.log(mapData[indexIndicator.value].events)

    mapGenCells.forEach((mapGenCell, i)=>{
      if (svgData[codes[0][i]]) {
        populateWithSvg(codes[0][i], mapGenCell) 
        mapGenCell.setAttribute('data-alt', codes[0][i])
      }  
      if (codes[0][i] === 'v') mapGenCell.innerHTML = 'x'
      // if (codes[0][i] === 'b') mapGenCell.innerHTML = '-'
      
      mapGenCell.addEventListener('click', e =>drawWithImage(e))
      mapGenCell.addEventListener('mousemove', e =>continuousDraw(e,drawWithImage))
    })

    document.querySelectorAll('.svg_anim').forEach(cell =>{
      animateCell({
        target: cell, 
        frameNo: cell.dataset.frame_no, 
        speed: cell.dataset.speed
      })
      // console.log(cell.dataset.frame_no)
    })

    if (clear) updateCodesDisplay(codesBox[0],codes[0])  
  }

  const createCopyGrids = (row, column, cellSize, cellStyle) =>{
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

    copyGrids.forEach((grid, i)=>{
      grid.addEventListener('click', e =>{
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
        }
      })
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

  copyGrid.addEventListener('mousemove', e =>{     
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
      // console.log('index', copyData.index, 'prevY',prevY, 'prevX', prevX)
      // copySelection()
    }     
  })


  const generateFromCode = () =>{
    createGridCells({
      row,
      column,
      cellSize: cellSizeInputs[0].value,
      index: 0,
      cellStyle: 'map_gen_cell',
      clear: false
    })
    // createGridCells(
    //   row,
    //   column,
    //   cellSizeInputs[0].value,
    //   1,
    //   'map_cell',
    //   false
    // ) 

    codes[0] = codesBox[0].value.split(',')
    const mapCells = document.querySelectorAll('.map_cell')
    codes[0].forEach((ele,i)=>{
      if (!mapCells[i]) return
      mapCells[i].innerHTML = ele
    })
    generateMap(false)
    
    createCopyGrids(
      row,
      column,
      cellSize,
      'copy_cell'
    )
  }

  const copyText = box =>{
    box.select()
    box.setSelectionRange(0, 99999) // For mobile devices 
    document.execCommand('copy')
  }

  const displayLabel = e =>{
    cursor.childNodes[0].innerHTML = e.target.dataset.alt
  }

  const hideLabel = () =>{
    cursor.childNodes[0].innerHTML = ''
  }

  const addLabelDisplay = () =>{
    alts.forEach(button => {
      button.addEventListener('mouseover', displayLabel)
      button.addEventListener('mouseleave', hideLabel)
    })
  }

  const removeLabelDisplay = () =>{
    alts.forEach(button => {
      button.removeEventListener('mouseover', displayLabel)
      button.removeEventListener('mouseleave', hideLabel)
    })
  }

  const createGridCells = ({ row, column, cellSize, index, cellStyle, clear }) =>{
    const arr = new Array(row * column).fill('')
    grids[index].style.width = `${column * cellSize}px`
    grids[index].style.height = `${row * cellSize}px`
    grids[index].innerHTML = arr.map((_ele, i)=>{
      return `
        <div 
          class="${cellStyle} alt"
          index="${i}"
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
    addCodeDraw(clear)
    removeLabelDisplay()
    alts = document.querySelectorAll('.alt')
    addLabelDisplay()
  }
  

  const createGrid = (index, cellStyle) =>{
    row = rowInputs[index].value ? rowInputs[index].value : 50
    column = columnInputs[index].value ? columnInputs[index].value : 50
    cellSize = cellSizeInputs[index].value ? cellSizeInputs[index].value : 10
    createGridCells({ row, column, cellSize, index, cellStyle, clear:true })
    codes[0] = new Array(row * column).fill('')
    codesBox[0].value = new Array(row * column).fill('')
  }
  
  // eventlistener
  const toggleGrid = () =>{
    grids.forEach(grid => grid.classList.toggle('grid_hide'))
    copyGrid.classList.toggle('grid_hide')
  }
  
  const toggleIndex = () =>{
    const mapGenCells = document.querySelectorAll('.map_gen_cell')
    mapGenCells.forEach(grid => grid.classList.toggle('index_display'))
  }

  cellSizeInputs[0].addEventListener('change',()=> cellSize = cellSizeInputs[0].value)
  // rowInputs[0].addEventListener('change',()=>row = rowInputs[0].value)
  rowInputs[0].addEventListener('change',()=> {
    const newRow = +rowInputs[0].value
    const diff = Math.abs(newRow - row) 
    codesBox[0].value = newRow > row
      ?  [...codes[0], ...Array(diff * column).fill('transparent')]
      :  codes[0].slice(0, codes[0].length - (diff * column))
    row = newRow
    codes[0] = codesBox[0].value
    generateFromCode()
    // console.log('row', row)
  })
  // columnInputs[0].addEventListener('change',()=>column = columnInputs[0].value)
  columnInputs[0].addEventListener('change',()=> {
    const newColumn = +columnInputs[0].value
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

    codesBox[0].value = updatedCodes.map(codes =>{
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
    generateFromCode()
    // console.log('column',column)
  })

  const compressCode = () =>{
    codesBox[1].value = compress(codesBox[0].value)
  }

  copyButtons.forEach((copyButton, i) =>{
    copyButton.addEventListener('click',()=>copyText(codesBox[i]))
  })

  codesBox[0].addEventListener('change', compressCode)

  codesBox[1].addEventListener('change',()=>{   
    codesBox[0].value = decompress(codesBox[1].value)
  })




  indexToggleButton.addEventListener('click', toggleIndex)

  grids.forEach(grid=>{
    grid.addEventListener('mousedown',()=>canDraw = true)
    grid.addEventListener('mouseup',()=>canDraw = false)
    grid.addEventListener('mouseleave',()=>canDraw = false)

    grid.addEventListener('mouseenter',()=>cursor.classList.add(cursorType))
    grid.addEventListener('mouseleave',()=>cursor.classList.remove(cursorType))
  })

  copyGrid.addEventListener('mouseenter',()=>cursor.classList.add(cursorType))
  copyGrid.addEventListener('mouseleave',()=>cursor.classList.remove(cursorType))


  // enable grid creation with buttons

  const handleCursor = e =>{
    cursor.style.top = `${e.pageY}px`
    cursor.style.left = `${e.pageX}px`
  }
  window.addEventListener('mousemove', handleCursor)

  



  // reads from url
  const query = window.location.hash
  // console.log(query)
  if (query){
    const queryArray = query.split('#')
    row = queryArray[2]
    column = queryArray[1]
    rowInputs[0].value = row
    columnInputs[0].value = column

    codes[0] = decompress(queryArray[3].replaceAll('-',','))
    codesBox[0].value = codes[0]
    if (queryArray[4]) indexIndicator.value = queryArray[4]
    generateFromCode()
  }

  //* map links

  const mapKeys = Object.keys(mapData)
  const mapLinks = document.querySelector('.map_link')
  mapLinks.innerHTML = mapKeys.map( map =>{
    return `
      <div class="map_link_cell">
        ${map}
      </div>
    `
  }).join('')

  const mapLinkCells = document.querySelectorAll('.map_link_cell')

  mapLinkCells.forEach((link, i)=>{
    link.addEventListener('click',()=>{
      const { iWidth, iHeight, map } = mapData[mapKeys[i]]
      const url = `${iWidth}#${iHeight}#${map.replaceAll(',','-')}#${i}`
      window.location.hash = url      
      location.reload(true)
    })
  })


  
  const returnSelectedCells = (firstCell, roundedX, roundedY) =>{
    if (copyBox && !copied){
      copyBox.style.justifyContent = 'flex-end'
      copyBox.style.alignItems = 'flex-end'
    }
    let width = copyBox ? copyBox.style.width.replace('px','') / cellSize : ''
    let height = copyBox ? copyBox.style.height.replace('px','') / cellSize : ''
    const selection = []

    if (roundedX < 0) width += roundedX // adjusts width if selection is beyond left edge of copyBox
    if (roundedY < 0) height += roundedY // adjusts height if selection is beyond top edge of copyBox 

    // adjusts width if selection is beyond right edge of copyBox
    if (roundedX + width > column) {
      if (!copied) copyBox.style.justifyContent = 'flex-start'
      width -= Math.abs((roundedX + width) - column) 
    }
    // adjust height if selection is beyond bottom edge of copyBox
    if (roundedY + height > row) {
      if (!copied) copyBox.style.alignItems = 'flex-start'
      height -= Math.abs((roundedY + height) - row) 
    }

    for (let a = firstCell; a < firstCell + (height * column); a += +column){
      for (let b = a; b < (a + width); b++){
        selection.push(b) 
      }
    }
    
    if (!copied){
      const activeArea = document.querySelector('.active_area')
      if (!activeArea) {
        copyBox.innerHTML = `
      <div   
      class="active_area"
      style="
      width:${width * cellSize}px;
      height:${height * cellSize}px;
      ">
      </div>
    `
      } else {
        activeArea.style.width = `${width * cellSize}px`
        activeArea.style.height = `${height * cellSize}px`
      }
      // copyData.activeArea = selection
    }
    
    return selection
  }


  const copySelectionToCopyBox = cut =>{
    if (copyData.data.length) return
    const activeArea = document.querySelector('.active_area')
    if (!activeArea) return
    activeArea.innerHTML = copyData.index.map(()=>{
      return `
        <div   
        class="active_cell"
        style="
        width:${cellSize}px;
        height:${cellSize}px;
        ">
        </div>
      `
    }).join('')
    
    const activeCells = document.querySelectorAll('.active_cell')
    activeCells.forEach((area, i)=>{
      const index = copyData.index[i]
      if (svgData[codes[0][index]]) populateWithSvg(codes[0][index], area) 
      if (codes[0][index] === 'v') area.innerHTML = 'x'
    })

    copyData.index.forEach((index, i)=>{
      copyData.data[i] = codesBox[0].value.split(',')[index]
    })

    if (cut){
      //* delete original
      codes[0] = codesBox[0].value.split(',').map((grid, i)=>{ 
        if (copyData.index.some(data => data === i)) console.log('test', grid) 
        return copyData.index.some(data => data === i) ? 'x' : grid
      })
      codesBox[0].value = codes[0]
      isCut = true

      document.querySelectorAll('.map_gen_cell').forEach((cell, i)=>{
        // if (svgData[codes[0][i]]) populateWithSvg(codes[0][i],cell) 
        // if (codes[0][i] === 'v') cell.innerHTML = 'x'
        if (copyData.index.some(data => data === i)) cell.innerHTML = 'x'
      })
    } 
    copied = true
    
  
    copyBox.style.top = `${copyBox.offsetTop + activeArea.offsetTop}px`
    copyBox.style.left = `${copyBox.offsetLeft + activeArea.offsetLeft}px`
    copyBox.style.width = activeArea.style.width
    copyBox.style.height = activeArea.style.height
    // updateCode()

    moveSelection()
  }

  const paste = () =>{
    if (!copyData.data.length) return
    console.log('copydata', copyData.data)

    copyData.index.forEach((index, i)=>{
      if (copyData.data[i] === 'x') return
      codes[0][index] = copyData.data[i]
    })
    codesBox[0].value = codes[0]

    document.querySelectorAll('.map_gen_cell').forEach((cell, i)=>{
      // cell.style.backgroundColor = codes[0][i]
      if (svgData[codes[0][i]]) populateWithSvg(codes[0][i], cell) 
      if (codes[0][i] === 'v') cell.innerHTML = 'x'
    })

    if (isCut){
      handleSelect()
    } 
    // updateCode()
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
  


  //TODO to add by editing.
  const crop = () =>{
    if (!copyData.index) return
    codesBox[0].value = codesBox[0].value.split(',').filter((_code, i)=>{
      return copyData.index.find(data => +data === i)
    }).join(',')
    column = copyData.width
    row = copyData.height
    columnInputs[0].value = column
    rowInputs[0].value = row
    generateFromCode()
    handleSelect()
  }

  const deleteSelection = () =>{
    if (!copyData.index) return
    codesBox[0].value = codesBox[0].value.split(',').map((code, i)=>{
      return copyData.index.find(data => +data === i) 
        ? 'x'
        : code
    }).join(',')
    generateFromCode()
    handleSelect()
  }

  const triggerCreateGrid = e =>{
    const gridClass = e.target.dataset.grid_class
    const index = +e.target.dataset.index
    createGrid(index, gridClass)
  }

  const handleClear = e =>{
    erase = !erase
    e.target.classList.toggle('active')
    cursorType = erase 
      ? 'eraser_cursor' 
      : moveState 
        ? 'motion_cursor' 
        : 'pen_cursor'
  }

  const output = ({ content, x, y, flip, rotate }) =>{
    const data = new Blob([content], { type: 'image/svg+xml;charset=utf-8' })
    const url = window.URL.createObjectURL(data)
    const imageTarget = new Image()
    let scale = [1, 1]
    if (flip === 'h') scale = [-1, 1]
    if (flip === 'v') scale = [1, -1]
    
    imageTarget.onload = () => {
      ctx.save()
      ctx.translate(cellSize / 2 , cellSize / 2)
      if (rotate) ctx.rotate(degToRad(rotate))
      ctx.scale(scale[0], scale[1])
      ctx.translate(-cellSize / 2 , -cellSize / 2)

      // TODO background color
      ctx.fillStyle = '#a2fcf0'
      ctx.fillRect(0, 0, cellSize, cellSize)

      ctx.drawImage(imageTarget, 0, 0)
      ctx2.drawImage(canvas[0], x, y, cellSize, cellSize)
      ctx.restore()
      ctx.clearRect(0, 0, cellSize, cellSize) 
    }
    imageTarget.src = url
  }

  const downloadImage = (canvas, name, date) =>{
    if (!canvas.classList.contains('display_none')) {
      const link = document.createElement('a')
      link.download = `${name}_${date ? new Date().getTime() : ''}.png`
      link.href = canvas.toDataURL()
      link.click()
    }
  }

  const createMapPng = () =>{
    // console.log(codes[0])
    canvas[1].classList.remove('display_none')
    resizeCanvas({canvas: canvas[0], w:cellSize, h:cellSize})
    resizeCanvas({canvas: canvas[1], w:column * cellSize, h:row * cellSize})
    
    codes[0].forEach((code, i) =>{
      if (svgData[code]){
        const { svg, color, subColor, rotate, flip, } = svgData[code]
        let colorAction = ''
        colorAction = typeof(color) === 'function' ? color() : color

        const svgContent = 
        `${singleSvgWrapper({
            content: decode(subColor ? svg(subColor) : svg()),
            color: colorAction || '',
          })}`
          
        // console.log('svgContent', svgContent)
        const y = Math.floor(i / column) * cellSize
        const x = i % column * cellSize
        output({
          content: svgContent, 
          x, y,
          flip, 
          rotate
        })
      }
    })
  }

  buttons.forEach(b =>{
    const addClickEvent = (className, event) =>{
      if (b.classList.contains(className)) b.addEventListener('click', event)
    }
    addClickEvent('create_grid', triggerCreateGrid)
    addClickEvent('generate', generateFromCode)
    addClickEvent('grid_display', toggleGrid)
    addClickEvent('clear', handleClear)
    addClickEvent('select', handleSelect)
    addClickEvent('copy_selection', ()=>copySelectionToCopyBox(false))
    addClickEvent('cut_selection', ()=>copySelectionToCopyBox(true))
    addClickEvent('move_selection', moveSelection)
    addClickEvent('paste_selection', paste)
    addClickEvent('crop_selection', crop)
    addClickEvent('delete_selection', deleteSelection)
    addClickEvent('compress', compressCode)
    addClickEvent('compile_map', createMapPng)
    addClickEvent('download', ()=>downloadImage(canvas[1], 'map', true))
  })

}

window.addEventListener('DOMContentLoaded', init)
