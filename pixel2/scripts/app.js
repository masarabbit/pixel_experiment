
function init() {

  const buttons = document.querySelectorAll('.btn')
  const overlay = document.querySelector('.overlay')
  const artboard = document.querySelector('.artboard')
  const canvasWrapper = document.querySelector('.canvas_wrapper')

  const input = {
    column: document.querySelector('.column'),
    row: document.querySelector('.row'),
    cellD: document.querySelector('.cell_size')
  }

  const state = {
    column: input.column.value,
    row: input.row.value,
    cellD: input.cellD.value,
  }

  const setTargetSize = ({ target, w, h }) =>{
    target.style.width = `${w}px`
    target.style.height = `${h}px`
  }

  const resizeCanvas = ({ canvas, w, h }) =>{
    canvas.setAttribute('width', w)
    canvas.setAttribute('height', h)
  }
  

  // TODO add grid using svg instead of cells
  // TODO see if it's possible to draw pixels on canvas without cells
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
  }

  buttons.forEach(b =>{
    const addClickEvent = (className, event) => b.classList.contains(className) && b.addEventListener('click', event)
    addClickEvent('resize', resize)
  })
}

window.addEventListener('DOMContentLoaded', init)
