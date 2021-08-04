function init() {

  //TODO add the output code here so that decoder doesn't have to be used.
  //TODO change logic to enter SVG's rather than change background
  //TODO change logic for clearing grid / erase
  //TODO debug reason for SVG sometimes not showing up

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

  const svgWrapper = (content, color, rotate, flip) =>{
    let scale = 1
    if (flip === 'h') scale = '-1, 1'
    if (flip === 'v') scale = '1, -1'
    return `<div class="svg_wrap" style="transform: rotate(${rotate}deg) scale(${scale});"><svg x="0px" y="0px" width="100%" height="100%" viewBox="0 0 16 16" fill="${color ? color : 'black'}">${content}</svg></div>`
  }

  const randomColor = () =>{
    const r=()=> Math.ceil(Math.random() * 255)
    return `rgb(${r()},${r()},${r()})`
  }

  const randomGreen= () =>{
    const r=()=> Math.ceil(Math.random() * 80)
    const g=()=> Math.ceil(Math.random() * 155) + 100
    const b=()=> Math.ceil(Math.random() * 100)
    return `rgb(${r()},${g()},${b()})`
  }

  const tree = () =>{
    return `D 5 0h6v1h2v1h1v1h1v1h1v7hNv1hNv1hNv1hTv2hNv-3hNvNhTv1hNv3hNvThTvNhNvNhNvNhNv-7h1vNh1vNh1vNh2vN"/ F 7 12h2v1h1v3h-4v-3h1vN"/`
  }

  const flowers = () =>{
    return `D 2 1h2v1hTvN"/ D 1 2h1v1hNvN"/ D 4 2h1v1hNvN"/ D 2 3h2v1hTvN"/ D 11 4h2v1hTvN"/ D 10 5h1v1hNvN"/ D 13 5h1v1hNvN"/ D 11 6h2v1hTvN"/ D 4 8h2v1hTvN"/ D 3 9h1v1hNvN"/ D 6 9h1v1hNvN"/ D 4 10h2v1hTvN"/ D 13 12h2v1hTvN"/ D 12 13h1v1hNvN"/ D 15 13h1v1hNvN"/ D 13 14h2v1hTvN"/`
  }

  const buildingCorner = subColor =>{
    return `D 5 0h11v1hN1vN"/ D 3 1h2v1hTvN"/ <path fill="${subColor ? subColor : 'white'}" d="M 5 1h11v15hN5vN1h1vTh1vNh2vN"/ D 2 2h1v1hNvN"/ D 1 3h1v2hNvT"/ D 0 5h1v11hNvN1"/`
  }

  const roofCorner = subColor =>{
    return `D 0 0h1v11h1v2hNv3hNvN6"/ <path fill="${subColor ? subColor : 'white'}" d="M 1 0h15v15hN1vNhTvNhNvThNvN1"/ F 1 13h1v1h1v1h2v1h-4v-3"/ D 2 13h1v1hNvN"/ D 3 14h2v1hTvN"/ D 5 15h11v1hN1vN"/`
  }

  const plain = subColor =>{
    return `<path fill="${subColor ? subColor : 'white'}" d="M 0 0h16v16hN6vN6"/`
  }

  const plainEdge = subColor =>{
    return `D 0 0h16v1hN6vN"/ <path fill="${subColor ? subColor : 'white'}" d="M 0 1h16v15hN6vN5"/`
  }

  const door = () =>{
    return `F 0 0h16v15hNvN0hNvThTvNhTvNh-4v1hTv1hTv2hNv10hNvN5"/ D 6 1h4v1h2v1h2v2h1v10h1v1hN6vNh1vN0h1vTh2vNh2vN"/`
  }

  const roundWindow = () =>{
    return `F 0 0h16v16hN6vN6"/ D 6 2h4v1h2v1h1v2h1v4hNv2hNv1hTv1h-4vNhTvNhNvThNv-4h1vTh1vNh2vN"/`
  }

  const svgData = {
    't': {svg: tree, color: randomGreen},
    'w': {svg: tree, color: randomGreen},
    'o': {svg: flowers, color: randomColor},
    'd': {svg: buildingCorner, subColor: '#94ffd6'},
    's': {svg: buildingCorner, subColor: '#94ffd6', rotate: 90},
    'bt': {svg: buildingCorner },
    'br': {svg: buildingCorner, rotate: 90},
    'bb': {svg: buildingCorner, rotate: 180},
    'bl': {svg: buildingCorner, rotate: 270},
    'g': {svg: roofCorner, subColor: '#94ffd6'},
    'y': {svg: roofCorner, subColor: '#94ffd6', flip: 'h'},
    'u': {svg: plain },
    'm': {svg: plainEdge, subColor: '#94ffd6' },
    'a': {svg: plainEdge, subColor: '#94ffd6', rotate: 90 },
    'i': {svg: plainEdge, subColor: '#94ffd6', rotate: 180 },
    'do': {svg: door },
    'wi': {svg: roundWindow },
    'at': {svg: plainEdge },
    'ar': {svg: plainEdge, rotate: 90 },
    'ab': {svg: plainEdge, rotate: 180 },
    'al': {svg: plainEdge, rotate: 270 },
  }





  let cursorType = 'pen_cursor'
  let canDraw = false
  let erase = false
  

  const grids = document.querySelectorAll('.grid')
  const palettes = document.querySelectorAll('.palette')
  const cursor = document.querySelector('.cursor')
  
  // button
  const alts = document.querySelectorAll('.alt')
  const copyButtons = document.querySelectorAll('.copy') 
  const createGridButtons = document.querySelectorAll('.create_grid')
  const generate = document.querySelectorAll('.generate')
  const gridToggleButtons = document.querySelectorAll('.grid_display')
  const clearButtons = document.querySelectorAll('.clear')

  // input
  const cellSizeInputs = document.querySelectorAll('.cell_size')
  const rowInputs = document.querySelectorAll('.row')
  const columnInputs = document.querySelectorAll('.column')
  const letterInput = document.querySelector('.letter')
  const codesBox = document.querySelectorAll('.codes')
  const codes = {
    0: [],
    // 1: []
  }
  
  const populateWithSvg = (key,target) =>{
    const { svg, color, subColor, rotate, flip } = svgData[key]
    target.innerHTML = svgWrapper(
      decode(subColor ? svg(subColor) : svg()),
      color ? color() : '',
      rotate ? rotate : 0,
      flip ? flip : null
    )
  }


  const populatePalette = () =>{
    const keys = Object.keys(svgData)

    palettes[0].innerHTML = keys.map(d=>`<div class="palette_cell" data-key="${d}"></div>`).join('')

    const paletteCells = document.querySelectorAll('.palette_cell')
    
    keys.forEach((key,i)=>{
      populateWithSvg(key,paletteCells[i]) 
    })

    paletteCells.forEach(palette=>{
      palette.addEventListener('click',(e)=>{
        letterInput.value = e.target.dataset.key
      })
    })
  }

  populatePalette()


  const updateCodesDisplay = (box,arr) =>{
    box.value = `${arr.map(ele=>ele).join(',')}`
    const index = box === codesBox[0]? 0 : 1 
    // populatePalette(index,arr)
  }

  
  //draw
  const drawMap = e =>{
    const index = e.target.dataset.cell
    const value = erase ? '' : letterInput.value
    codes[0][index] = value
    e.target.innerHTML = value
    updateCodesDisplay(codesBox[0],codes[0])
  }


  const drawWithImage = e =>{
    const index = e.target.dataset.cell
    const value = erase ? '' : letterInput.value
    codes[0][index] = value

    updateCodesDisplay(codesBox[0],codes[0])
    //* draws letters

    if (svgData[value] && !erase)  {
      populateWithSvg(value,e.target) 
    } else {
      e.target.innerHTML = ''
    }

    console.log('error',e.target)
  }

  const continuousDraw = (e,action) =>{
    if (!canDraw) return
    action(e)
  }
  
  


  const addCodeDraw = clear =>{
    const mapCells = document.querySelectorAll('.map_cell')
    mapCells.forEach(mapCell=>{
      mapCell.addEventListener('click',(e)=>drawMap(e))
      mapCell.addEventListener('mousemove',(e)=>continuousDraw(e,drawMap))
    })
    if (clear) updateCodesDisplay(codesBox[0],codes[0])
  }

  const generateMap = clear =>{
    const mapGenCells = document.querySelectorAll('.map_gen_cell')
    mapGenCells.forEach((mapGenCell,i)=>{

      if (svgData[codes[0][i]]) populateWithSvg(codes[0][i],mapGenCell) 
      
      mapGenCell.addEventListener('click',(e)=>drawWithImage(e))
      mapGenCell.addEventListener('mousemove',(e)=>continuousDraw(e,drawWithImage))
    })
    if (clear) updateCodesDisplay(codesBox[0],codes[0])  
  }

  const generateFromCode = () =>{
    createGridCells(
      rowInputs[0].value,
      columnInputs[0].value,
      cellSizeInputs[0].value,
      0,
      'map_gen_cell',
      false
    )
    createGridCells(
      rowInputs[0].value,
      columnInputs[0].value,
      cellSizeInputs[0].value,
      1,
      'map_cell',
      false
    ) 
    codes[0] = codesBox[0].value.split(',')
    const mapCells = document.querySelectorAll('.map_cell')
    codesBox[0].value.split(',').forEach((ele,i)=>{
      if(!mapCells[i]) return
      mapCells[i].innerHTML = ele
    })
    generateMap(false)
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
    addCodeDraw(clear)
  }
  

  const createGrid = (index,cellStyle) =>{
    const row = rowInputs[index].value ? rowInputs[index].value : 50
    const column = columnInputs[index].value ? columnInputs[index].value : 50
    const cellSize = cellSizeInputs[index].value ? cellSizeInputs[index].value : 10
    createGridCells(row,column,cellSize,index,cellStyle,true)
    codes[0] = new Array(row * column).fill('')
    codesBox[0].value = new Array(row * column).fill('')
  }
  
  // eventlistener
  const toggleGrid = () =>{
    grids.forEach(grid=>grid.classList.toggle('grid_hide'))
  }

  cellSizeInputs[0].addEventListener('change',()=>cellSize = cellSizeInputs[0].value)
  rowInputs[0].addEventListener('change',()=>row = rowInputs[0].value)
  columnInputs[0].addEventListener('change',()=>column = columnInputs[0].value)

  generate[0].addEventListener('click',generateFromCode)

  copyButtons.forEach((copyButton,i)=>{
    copyButton.addEventListener('click',()=>copyText(codesBox[i]))
  })

  codesBox[0].addEventListener('change',()=>{
    const originalArray = codesBox[0].value.split(',')
    let current = ''
    const record = []

    originalArray.forEach((letter,i)=>{
      const next = i > originalArray.length ? '' : originalArray[i + 1]
      if (letter === next){
        current += letter
      } else {
        current += letter
        record.push(current)
        current = ''        
      }
    })

    codesBox[1].value = record.map(arr=>arr[0] + arr.length)
  })

  codesBox[1].addEventListener('change',()=>{   
    const output = []
    codesBox[1].value.split(',').forEach(v=>{
      const letter = v[0]
      const repeat = v.slice(1)
      for (let i = 0; i < repeat; i++){
        output.push(letter)
      }
    })
    codesBox[0].value = output
  })



  gridToggleButtons.forEach(button=>button.addEventListener('click',toggleGrid))

  grids.forEach(grid=>{
    grid.addEventListener('mousedown',()=>canDraw = true)
    grid.addEventListener('mouseup',()=>canDraw = false)
    grid.addEventListener('mouseleave',()=>canDraw = false)

    grid.addEventListener('mouseenter',()=>cursor.classList.add(cursorType))
    grid.addEventListener('mouseleave',()=>cursor.classList.remove(cursorType))
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
