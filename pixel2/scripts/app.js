
function init() {

  const buttons = document.querySelectorAll('.btn')
  const overlay = document.querySelector('.overlay')
  const artboard = document.querySelector('.artboard')
  const aCtx = artboard.getContext('2d')
  const oCtx = overlay.getContext('2d')
  const canvasWrapper = document.querySelector('.canvas_wrapper')

  const drawData = {
    draw: false,
  }

  const input = {
    column: document.querySelector('.column'),
    row: document.querySelector('.row'),
    cellD: document.querySelector('.cell_size')
  }

  const state = {
    column: +input.column.value,
    row: +input.row.value,
    cellD: +input.cellD.value,
    gridWidth: 0.5,
  }

  Object.keys(input).forEach(key =>{
    input[key].addEventListener('change', e =>{
      state[key] = +e.target.value
      resize()
    })
  })

  const styleTarget = ({ target, w, h, x, y }) =>{
    if (w) target.style.width = `${w}px`
    if (h) target.style.height = `${h}px`
    if (x) target.style.left = `${x}px`
    if (y) target.style.top = `${y}px`
  }

  // const setTargetPos = ({ target, x, y }) =>{
  
  // }

  const resizeCanvas = ({ canvas, w, h }) =>{
    canvas.setAttribute('width', w)
    canvas.setAttribute('height', h)
  }

  const addEvents = (target, action, event, array) =>{
    array.forEach(a => event === 'remove' ? target.removeEventListener(a, action) : target.addEventListener(a, action))
  }
  const mouseUp = (t, e, a) => addEvents(t, a, e, ['mouseup', 'touchend'])
  const mouseMove = (t, e, a) => addEvents(t, a, e, ['mousemove', 'touchmove'])
  const mouseDown = (t, e, a) => addEvents(t, a, e, ['mousedown', 'touchstart'])
  // const mouseEnter = (t, e, a) => addEvents(t, a, e, ['mouseenter', 'touchstart'])
  const mouseLeave = (t, e, a) => addEvents(t, a, e, ['mouseleave', 'touchmove'])

  const nearestN = (n, denom) => n === 0 ? 0 : (n - 1) + Math.abs(((n - 1) % denom) - denom)

  const drawPos = (e, cellD) => {
    const { top, left } = artboard.getBoundingClientRect()
    return {
      x: nearestN(e.pageX - left, cellD) - cellD,
      y: nearestN(e.pageY - top, cellD) - cellD
    }
  }

  const drawGrid = () => {
    const { width, height } = overlay.getBoundingClientRect()  
    const { column, row, cellD, gridWidth } = state

    oCtx.strokeStyle = 'lightgrey'
    oCtx.beginPath()
    const pos = (n, type) => n === type ? n * cellD - gridWidth : n * cellD + gridWidth
    for (let x = 0; x <= column; x += 1) {
      oCtx.moveTo(pos(x, column), gridWidth)
      oCtx.lineTo(pos(x, column), height - gridWidth)
    }
    for (let y = 0; y <= row; y += 1) {
      oCtx.moveTo(gridWidth, pos(y, row))
      oCtx.lineTo(width - gridWidth, pos(y, row))
    }
    oCtx.stroke()
  }

  const continuousDraw = (e, action) => {
    if (drawData.draw) action(e) 
  }
  
  const drawSquare = e => {
    const { cellD } = state
    const pos = drawPos(e, cellD)
    aCtx.fillStyle = '#000000'
    aCtx.fillRect(pos.x, pos.y, cellD, cellD)
    // TODO add way to record the drawn squares
    //* add continuous draw
    //* add highlight state
  }


  artboard.addEventListener('click', drawSquare)
  mouseDown(artboard, 'add', ()=> drawData.draw = true)
  mouseUp(artboard, 'add', ()=> drawData.draw = false)
  mouseLeave(artboard, 'add', ()=> drawData.draw = false)
  mouseMove(artboard, 'add', e => continuousDraw(e, drawSquare))

  // TODO add grid using svg instead of cells
  
  const resize = () =>{
    const { column, row, cellD } = state
    const boards = [overlay, artboard]
    boards.forEach(b =>{
      resizeCanvas({
        canvas: b,
        w: column * cellD,
        h: row * cellD
      })
    })
    styleTarget({
      target: canvasWrapper,
      w: column * cellD,
      h: row * cellD
    })
    drawGrid()
    // TODO add some way to re-draw what was drawn
  }



  buttons.forEach(b =>{
    const addClickEvent = (className, event) => b.classList.contains(className) && b.addEventListener('click', event)
    addClickEvent('resize', resize)
  })



  // window.addEventListener('mousemove', e => 
  //   styleTarget({
  //     target: cursor,
  //     x: e.pageX, y: e.pageY
  //   })
  // )
  resize()
}

window.addEventListener('DOMContentLoaded', init)
