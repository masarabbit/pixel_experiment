function init() {
  
  //TODO add the output code here so that decoder doesn't have to be used.
  //TODO change logic to enter SVG's rather than change background
  //TODO change logic for clearing grid / erase
  //TODO debug reason for SVG sometimes not showing up


  let cellSize = 20
  let row = 20
  let column = 20

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

  const svgWrapper = (content, color, rotate, flip, wrapper ) =>{
    let scale = 1
    if (flip === 'h') scale = '-1, 1'
    if (flip === 'v') scale = '1, -1'
    return `
      <div class="${wrapper}" style="transform: rotate(${rotate}deg) scale(${scale});">
        <svg x="0px" y="0px" width="100%" height="100%" viewBox="0 0 16 16" fill="${color ? color : 'black'}">${content}</svg>
      </div>
      `
  }

  // const svgAnimFrame = (content, color, rotate, flip) =>{
  //   let scale = 1
  //   if (flip === 'h') scale = '-1, 1'
  //   if (flip === 'v') scale = '1, -1'
  //   return `<div class="svg_anim_frame" style="transform: rotate(${rotate}deg) scale(${scale});"><svg x="0px" y="0px" width="100%" height="100%" viewBox="0 0 32 16" fill="${color ? color : 'black'}">${content}</svg></div>`
  // }

  const randomColor = () =>{
    const r = ()=> Math.ceil(Math.random() * 255)
    return `rgb(${r()},${r()},${r()})`
  }

  const randomGreen = () =>{
    const r = ()=> Math.ceil(Math.random() * 80)
    const g = ()=> Math.ceil(Math.random() * 155) + 100
    const b = ()=> Math.ceil(Math.random() * 100)
    return `rgb(${r()},${g()},${b()})`
  }

  const tree = () =>{
    return 'D 5 0h6v1h2v1h1v1h1v1h1v7hNv1hNv1hNv1hTv2hNv-3hNvNhTv1hNv3hNvThTvNhNvNhNvNhNv-7h1vNh1vNh1vNh2vN"/ F 7 12h2v1h1v3h-4v-3h1vN"/'
  }

  const flowers = () =>{
    return 'D 2 1h2v1hTvN"/ D 1 2h1v1hNvN"/ D 4 2h1v1hNvN"/ D 2 3h2v1hTvN"/ D 11 4h2v1hTvN"/ D 10 5h1v1hNvN"/ D 13 5h1v1hNvN"/ D 11 6h2v1hTvN"/ D 4 8h2v1hTvN"/ D 3 9h1v1hNvN"/ D 6 9h1v1hNvN"/ D 4 10h2v1hTvN"/ D 13 12h2v1hTvN"/ D 12 13h1v1hNvN"/ D 15 13h1v1hNvN"/ D 13 14h2v1hTvN"/'
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
    return 'F 0 0h16v15hNvN0hNvThTvNhTvNh-4v1hTv1hTv2hNv10hNvN5"/ D 6 1h4v1h2v1h2v2h1v10h1v1hN6vNh1vN0h1vTh2vNh2vN"/'
  }

  const roundWindow = () =>{
    return 'F 0 0h16v16hN6vN6"/ D 6 2h4v1h2v1h1v2h1v4hNv2hNv1hTv1h-4vNhTvNhNvThNv-4h1vTh1vNh2vN"/'
  }

  const squareWindow = () =>{
    return 'F 0 0h16v16hN6vN6"/ D 5 2h6v1h1v10hNv1h-6vNhNvN0h1vN"/'
  }

  const sideSquareWindow = () =>{
    // return `D 0 0h1v16hNvN6"/ F 1 0h15v16hN5vN6"/ D 7 2h6v1h1v10hNv1h-6vNhNvN0h1vN"/`
    // return `D 0 0h1v16hNvN6"/ F 1 0h15v16hN5vN6"/ D 9 3h5v1h1v10hNv1h-5vNhNvN0h1vN"/`
    // return `D 0 0h1v16hNvN6"/ F 1 0h15v16hN5vN6"/ D 10 4h4v1h1v9hNv1h-4vNhNv-9h1vN"/`
    return 'D 0 0h1v16hNvN6"/ F 1 0h15v16h-3vNh1v-9hNvNh-4v1hNv9h1v1h-8vN6"/ D 9 5h4v1h1v9hNv1h-4vNhNv-9h1vN"/'
  }

  const noSideWindow = () =>{
    return 'F 0 0h16v16h-3vNh1v-9hNvNh-4v1hNv9h1v1h-9vN6"/ D 9 5h4v1h1v9hNv1h-4vNhNv-9h1vN"/`'
  }

  const sideSquareWindowAlt = () =>{
    return 'D 0 0h1v16hNvN6"/ F 1 0h15v5hNvNh-4v1hNv10h1v1hN0vN6"/ D 11 4h4v1h1v10hNv1h-4vNhNvN0h1vN"/ F 15 15h1v1hNvN"/'
  }

  const roofCurve = subColor =>{
    return `<path fill="${subColor ? subColor : 'white'}" d="M 0 0h16v15hTvNhNvNhNvNhTvNh-4v1hTv1hNv1hNv1hTvN5"/ D 6 11h4v1h-4vN"/ D 4 12h2v1hTvN"/ F 6 12h4v1h2v1h1v1h1v1hN2vNh1vNh1vNh2vN"/ D 10 12h2v1hTvN"/ D 3 13h1v1hNvN"/ D 12 13h1v1hNvN"/ D 2 14h1v1hNvN"/ D 13 14h1v1hNvN"/ D 0 15h2v1hTvN"/ D 14 15h2v1hTvN"/`
  }

  const roofTopBottomCorner = subColor =>{
    return `D 0 0h1v11hNvN1"/ F 1 0h15v15hN1vNhTvNhNvThNvN1"/ <path fill="${subColor ? subColor : 'white'}" d="M 0 11h1v2h1v1h1v1h2v1h-5v-5"/ D 1 11h1v2hNvT"/ D 2 13h1v1hNvN"/ D 3 14h2v1hTvN"/ D 5 15h11v1hN1vN"/`
  }

  const river = () =>{
    const main = '#adfffe'
    const sub = '#50fbf9'

    return `<path fill="${main}" d="M 0 0h2v7h2v-7h12v16hTv-7hTv7hN2vN6"/ <path fill="#50fbf9" d="M 2 0h2v7hTv-7"/ <path fill="${sub}" d="M 7 4h2v8hTv-8"/ <path fill="${sub}" d="M 12 9h2v7hTv-7"/`
  }

  const riverAnim = () =>{
    const main = '#adfffe'
    const sub = '#50fbf9'

    return `<path fill="${main}" d="M 0 0h7v4h2v-4h7v16h-7v-5hTv5h-7vN6"/ <path fill="#50fbf9" d="M 7 0h2v4hTv-4"/ <path fill="${sub}" d="M 12 3h2v9hTv-9"/ <path fill="${sub}" d="M 2 4h2v9hTv-9"/ <path fill="${sub}" d="M 7 11h2v5hTv-5"/`
  }

  const riverCurve = () =>{
    const main = '#adfffe'
    const sub = '#50fbf9'
    
    return `<path fill="${main}" d="M 8 0h8v6hNv1hTv1hTv2hNv1hNv3h2v-3h1vNh1vNh2vNh1v8hN2v-6h1vNh1vTh1vNh2vNh1vThNv1hTv1hNv1hNv1hNv2hNv1hNv6hTv-8h1vTh1vTh1vNh1vNh2vNh2vN"/ <path fill="${sub}" d="M 9 3h1v2hNv1hTv1hNv2hNv1hNv6hTv-6h1vNh1vTh1vNh1vNh1vNh2vN"/ <path fill="${sub}" d="M 15 6h1v2hNv1hTv1hNv1hNv3hTv-3h1vNh1vTh2vNh2vN"/`
  }

  const riverCurveAnim = () =>{
    const main = '#adfffe'
    const sub = '#50fbf9'

    return `<path fill="${main}" d="M 8 0h4v1hNv1hTv1hNv1hNv1hNv1hNv1hNv2h2vTh1vNh2vNh1vNh1vNh1vNh2vNh1vNh1v16h-6v-4h1vNh1vNh1vNh1vThNv1hNv1hNv1hNv1hNv1hNv4h-8v-8h1vTh1vTh1vNh1vNh2vNh2vN"/ <path fill="${sub}" d="M 12 0h3v1hNv1hTv1hNv1hNv1hNv1hTv1hNv2hTvTh1vNh1vNh1vNh1vNh1vNh2vNh1vN"/ <path fill="${sub}" d="M 13 7h1v2hNv1hNv1hNv1hNv4hTv-4h1vNh1vNh1vNh1vNh1vN"/`
  }

  const sub = '#e2cc9c'
  const main = '#7d551c'

  const svgData = {
    't': { svg: tree, color: randomGreen },
    'w': { svg: tree, color: randomGreen },
    'o': { svg: flowers, color: randomColor },
    'd': { svg: buildingCorner, color: main, subColor: sub },
    's': { svg: buildingCorner, color: main, subColor: sub, rotate: 90 },
    'bt': { svg: buildingCorner, color: main },
    'br': { svg: buildingCorner, color: main, rotate: 90 },
    'bb': { svg: buildingCorner, color: main, rotate: 180 },
    'bl': { svg: buildingCorner, color: main, rotate: 270 },
    'rbr': { svg: roofTopBottomCorner, color: main, subColor: sub },
    'rbl': { svg: roofTopBottomCorner, color: main, subColor: sub, flip: 'h' },
    'g': { svg: roofCorner, color: main, subColor: sub },
    'y': { svg: roofCorner, color: main, subColor: sub, flip: 'h' },
    'p': { svg: plain },
    'rp': { svg: plain, subColor: sub },
    'do': { svg: door, color: main },
    'wi': { svg: roundWindow, color: main },
    'sw': { svg: squareWindow, color: main },
    'swl': { svg: sideSquareWindow, color: main },
    'swr': { svg: sideSquareWindow, color: main, flip: 'h' },
    'nwl': { svg: noSideWindow, color: main },
    'nwr': { svg: noSideWindow, color: main, flip: 'h' },
    'swal': { svg: sideSquareWindowAlt, color: main },
    'swar': { svg: sideSquareWindowAlt, color: main, flip: 'h' },
    'at': { svg: plainEdge, color: main  },
    'ar': { svg: plainEdge, color: main, rotate: 90 },
    'ab': { svg: plainEdge, color: main, rotate: 180 },
    'al': { svg: plainEdge, color: main, rotate: 270 },
    'rc': { svg: roofCurve, color: main, subColor: sub },
    'pt': { svg: plainEdge, color: main, subColor: sub },
    'pr': { svg: plainEdge, color: main, subColor: sub, rotate: 90 },
    'pb': { svg: plainEdge, color: main, subColor: sub, rotate: 180 },
    'pu': { svg: plainEdge, color: main, subColor: sub, rotate: 270 },
    'b': { svg: plain, subColor: '#afff7a' },
    'r': { svg: river, animation: riverAnim },
    'rh': { svg: river, rotate: 90, animation: riverAnim },
    'ra': { svg: riverCurve, animation: riverCurveAnim },
    'rb': { svg: riverCurve, rotate: 90, animation: riverCurveAnim },
    'rd': { svg: riverCurve, rotate: 180, animation: riverCurveAnim },
    're': { svg: riverCurve, rotate: 270, animation: riverCurveAnim }
  }

  // const svgAnimFrames = {
  //   'ra': { svg: riverCurve },
  //   'rb': { svg: riverCurve, rotate: 90 },
  //   'rd': { svg: riverCurve, rotate: 180 },
  //   're': { svg: riverCurve, rotate: 270 }
  // }





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
  
  const populateWithSvg = (key,target) =>{
    if (svgData[key]){
      const { svg, color, subColor, rotate, flip, animation } = svgData[key]
      let colorAction = ''
      colorAction = typeof(color) === 'function' ? color() : color

      const svgContent = `
      ${animation ? 
    `
        ${svgWrapper(
    decode(subColor ? animation(subColor) : animation()),
    color ? colorAction : '',
    rotate ? rotate : 0,
    flip ? flip : null,
    'svg_anim_wrap' 
  )}
  `
    : ''
}
          ${svgWrapper(
    decode(subColor ? svg(subColor) : svg()),
    color ? colorAction : '',
    rotate ? rotate : 0,
    flip ? flip : null,
    'svg_wrap' 
  )}  
      `

      target.innerHTML = svgContent

      // if (!animation) {
      //   target.innerHTML = 
      //   svgWrapper(
      //     decode(subColor ? svg(subColor) : svg()),
      //     color ? colorAction : '',
      //     rotate ? rotate : 0,
      //     flip ? flip : null, 
      //     false
      //   )
      // } else {
      //   const animationWrapper = document.createElement('div')
      //   animationWrapper.classList.add('svg_anim_wrap')
      //   animationWrapper.style.transform = `rotate(${rotate}deg)`
      //   // console.log(`rotate(${rotate}deg)`)
      //   // animationWrapper.style.transform = 'rotate(90deg)'
      //   animationWrapper.innerHTML =  
      //   svgWrapper(
      //     decode(subColor ? svg(subColor) : svg()),
      //     color ? colorAction : '',
      //     0,
      //     null, 
      //     true
      //   )
      //   target.appendChild(animationWrapper)
      // }
    

      // if (animation) setInterval(()=>{
      //   target.style.paddingLeft = target.style.paddingLeft === '0px' ? '32px' : '0px'
      // },500) 
    } 
  
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
    // const index = box === codesBox[0]? 0 : 1 
    // populatePalette(index,arr)
    // console.log(window.location)
    //TODO create a href and link go to it (maybe not good to keep refreshing so some way to just change the address?)
    // console.log(`${columnInputs[0].value}#${rowInputs[0].value}#${compress(codesBox[0].value)}`)
    window.location.hash = `${columnInputs[0].value}#${rowInputs[0].value}#${compress(codesBox[0].value).join('-')}`
    // .replaceAll(',','-')
  }

  
  //draw
  const drawMap = e =>{
    const index = e.target.dataset.cell
    const value = erase ? 'b' : letterInput.value
    codes[0][index] = value
    e.target.innerHTML = value
    updateCodesDisplay(codesBox[0],codes[0])
  }


  const drawWithImage = e =>{
    const index = e.target.dataset.cell
    const value = erase ? 'b' : letterInput.value
    codes[0][index] = value

    updateCodesDisplay(codesBox[0],codes[0])

    if (svgData[value] && !erase)  {
      populateWithSvg(value,e.target) 
    } else {
      e.target.innerHTML = ''
    }
    // console.log('error',e.target)
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
      if (codes[0][i] === 'v') mapGenCell.innerHTML = 'x'
      // if (codes[0][i] === 'b') mapGenCell.innerHTML = '-'
      
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
      if (!mapCells[i]) return
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
    row = rowInputs[index].value ? rowInputs[index].value : 50
    column = columnInputs[index].value ? columnInputs[index].value : 50
    cellSize = cellSizeInputs[index].value ? cellSizeInputs[index].value : 10
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
    codesBox[1].value = compress(codesBox[0].value)
  })

  codesBox[1].addEventListener('change',()=>{   
    codesBox[0].value = decompress(codesBox[1].value)
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


  // reads from url
  const query = window.location.hash
  console.log(query)
  if (query){
    const queryArray = query.split('#')
    columnInputs[0].value = queryArray[1]
    rowInputs[0].value = queryArray[2]

    codesBox[0].value = decompress(queryArray[3].replaceAll('-',','))
    generateFromCode()

    // const keys = Object.keys(svgData)
    // codesBox[0].value.split(',').forEach(letter=>{
    //   if (keys.indexOf(letter) === -1) console.log(letter)
    // })
  }

}

window.addEventListener('DOMContentLoaded', init)
