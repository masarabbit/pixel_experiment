function init() {
  
  let cellSize = 20
  let row = 20
  let column = 20

  // const decode = arr =>{
  //   return arr.split('').map(c=>{
  //     if (c === 'D') return '<path d="M'
  //     if (c === 'F') return '<path fill="#fff" d="M'
  //     if (c === '/') return '/>'
  //     if (c === 'N') return '-1' 
  //     if (c === 'T') return '-2'
  //     return c
  //   }).join('')
  // }

  const decodeRef = {
    a: ' h 1',
    b: ' h 2',
    e: ' h 3',
    g: ' h 4',
    j: ' h 5',
    A: ' v 1',
    B: ' v 2',
    E: ' v 3',
    G: ' v 4',
    J: ' v 5',
    n: 'h -1',
    u: ' h -2',
    k: ' h -3',
    x: ' h -4', 
    i: ' h -5',
    N: ' v -1',
    U: ' v -2', 
    K: ' v -3',
    X: ' v -4', 
    I: ' v -5',
    w: ' v ', 
    W: ' h ',
    D: '<path d="M',
    d: '<path d="M',
    o: '<path fill="#fcbbc3" d="M',
    F: '<path fill="#fff" d="M',
    f: '<path fill="#fff" d="M',
    '/': '/>',
  }

  const decode = arr =>{
    return arr.split('').map(c=>{
      if (!decodeRef[c]) return c
      return decodeRef[c]
    }).join('')
  }

  const svgWrapper = content =>{
    return `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
    width="100%" height="100%" viewBox="0 0 ${column} ${row}" fill="black"
    >${content}</svg>`
  }


  // let cursorType = 'pen_cursor'
  let erase = false
  
  const canvas = document.querySelector('canvas')
  const ctx = canvas.getContext('2d')
  // const grids = document.querySelectorAll('.grid')
  const cursor = document.querySelector('.cursor')
  
  // button
  const alts = document.querySelectorAll('.alt')
  const copyButtons = document.querySelectorAll('.copy') 
  const createGridButtons = document.querySelectorAll('.create_grid')
  const generate = document.querySelectorAll('.generate')
  // const gridToggleButtons = document.querySelectorAll('.grid_display')
  const clearButtons = document.querySelectorAll('.clear')
  const downloadButton = document.querySelector('.download')

  // input
  const cellSizeInputs = document.querySelectorAll('.cell_size')
  const rowInputs = document.querySelectorAll('.row')
  const columnInputs = document.querySelectorAll('.column')
  const fileName = document.querySelector('.file_name')
  const codesBox = document.querySelectorAll('.codes')
  const codes = {
    0: [],
    // 1: []
  }


  const generateFromCode = () =>{
    createGridCells(
      row,
      column,
      cellSize,
      0
    )
    output(svgWrapper(codesBox[1].value))
  }

  const copyText = box =>{
    box.select()
    box.setSelectionRange(0, 99999) // For mobile devices 
    document.execCommand('copy')
  }

  const createGridCells = (row,column,cellSize) =>{
    // grids[index].style.width = `${column * cellSize}px`
    // grids[index].style.height = `${row * cellSize}px`
    canvas.setAttribute('width', column * cellSize)
    canvas.setAttribute('height', row * cellSize)
  }
  

  const createGrid = () =>{
    createGridCells(row,column,cellSize)
    codes[0] = new Array(row * column).fill('')
    codesBox[0].value = new Array(row * column).fill('')
  }
  
  // eventlistener
  // const toggleGrid = () =>{
  //   grids.forEach(grid=>grid.classList.toggle('grid_hide'))
  // }

  cellSizeInputs[0].addEventListener('change',()=>cellSize = cellSizeInputs[0].value)
  rowInputs[0].addEventListener('change',()=>row = rowInputs[0].value)
  columnInputs[0].addEventListener('change',()=>column = columnInputs[0].value)

  generate[0].addEventListener('click',generateFromCode)

  copyButtons.forEach((copyButton,i)=>{
    copyButton.addEventListener('click',()=>copyText(codesBox[i]))
  })

  codesBox[0].addEventListener('change',()=>{
    codesBox[1].value = decode(codesBox[0].value)
  })

  codesBox[1].addEventListener('change',()=>{   
    // codesBox[0].value = codesBox[1].value.replaceAll('<path d="M','D').replaceAll('<path fill="#ffffff" d="M','F').replaceAll('/>','/').replaceAll('-1','N').replaceAll('-2','T').replaceAll(' v ','v').replaceAll(' h ','h').replaceAll('<path fill="#000000" d="M','D').replaceAll('<path fill="#fff" d="M','F')

    codesBox[0].value = codesBox[1].value
      .replaceAll(' <path d="M','D')
      .replaceAll(' <path fill="#ffffff" d="M','F')
      .replaceAll(' <path fill="#fcbbc3" d="M', 'o')
      .replaceAll(' <path fill="#000" d="M','D')
      .replaceAll('<path fill="#000" d="M','d')
      .replaceAll(' <path fill="#fff" d="M','F')
      .replaceAll('<path fill="#fff" d="M','f')
      .replaceAll('/>','/')
      .replaceAll(' h 1','a')
      .replaceAll(' h 2','b')
      .replaceAll(' h 3','e')
      .replaceAll(' h 4','g')
      .replaceAll(' h 5','j')
      .replaceAll(' v 1','A')
      .replaceAll(' v 2','B')
      .replaceAll(' v 3','E')
      .replaceAll(' v 4','G')
      .replaceAll(' v 5','J')
      .replaceAll(' h -1','n')
      .replaceAll(' h -2','u')
      .replaceAll(' h -3','k')
      .replaceAll(' h -4','x')
      .replaceAll(' h -5','i')
      .replaceAll(' v -1','N')
      .replaceAll(' v -2','U')
      .replaceAll(' v -3','K')
      .replaceAll(' v -4','X')
      .replaceAll(' v -5','I')
      .replaceAll(' v ','w')
      .replaceAll(' h ','W')
  })


  // gridToggleButtons.forEach(button=>button.addEventListener('click',toggleGrid))

  // grids.forEach(grid=>{
  //   grid.addEventListener('mouseenter',()=>cursor.classList.add(cursorType))
  //   grid.addEventListener('mouseleave',()=>cursor.classList.remove(cursorType))
  // })


  // enable grid creation with buttons
  createGridButtons.forEach(button=>{
    button.addEventListener('click',()=>{
      // const gridClass = e.target.dataset.grid_class
      // const index = +e.target.dataset.index
      createGrid()
    })
  })
  
  clearButtons.forEach(button=>{
    button.addEventListener('click',()=>{
      erase = !erase
      clearButtons.forEach(button=>button.classList.toggle('active'))
      // cursorType = erase ? 'eraser_cursor' : 'pen_cursor'
    })
  })


  // const handleCursor = e =>{
  //   cursor.style.top = `${e.pageY}px`
  //   cursor.style.left = `${e.pageX}px`
  // }
  // window.addEventListener('mousemove', handleCursor)


  alts.forEach(button=>{
    button.addEventListener('mouseover',(e)=>{
      cursor.childNodes[0].innerHTML = e.target.dataset.alt
    })
    button.addEventListener('mouseleave',()=>{
      cursor.childNodes[0].innerHTML = ''
    })
  })
  

  const output = content =>{
    const data = new Blob([content], { type: 'image/svg+xml;charset=utf-8' })
    const url = window.URL.createObjectURL(data)
    const imageTarget = new Image()
    imageTarget.onload = () => {
      ctx.drawImage(imageTarget, 0, 0, column * cellSize, row * cellSize)
    }
    imageTarget.src = url
  }

  const downloadImage = () =>{
    const link = document.createElement('a')
    link.download = `${fileName.value}_${new Date().getTime()}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

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
  }

  columnInputs[0].addEventListener('change',()=>{
    column = columnInputs[0].value
  })

  rowInputs[0].addEventListener('change',()=>{
    row = rowInputs[0].value
  })

  cellSizeInputs[0].addEventListener('change',()=>{
    cellSize = cellSizeInputs[0].value
  })

  downloadButton.addEventListener('click', downloadImage)

}

window.addEventListener('DOMContentLoaded', init)
