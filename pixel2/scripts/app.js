
function init() {

  const buttons = document.querySelectorAll('.btn')
  const overlay = document.querySelector('.overlay')
  const artboard = document.querySelector('.artboard')
  const aCtx = artboard.getContext('2d')
  const oCtx = overlay.getContext('2d')
  const canvasWrapper = document.querySelector('.canvas_wrapper')

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

  const setTargetSize = ({ target, w, h }) =>{
    target.style.width = `${w}px`
    target.style.height = `${h}px`
  }

  const resizeCanvas = ({ canvas, w, h }) =>{
    canvas.setAttribute('width', w)
    canvas.setAttribute('height', h)
  }

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
    setTargetSize({
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

  resize()
}

window.addEventListener('DOMContentLoaded', init)
