
const overlay = document.querySelector('.overlay')
const artboard = document.querySelector('.artboard')
const aCtx = artboard.getContext('2d')
const oCtx = overlay.getContext('2d')

const elements = {
  cursor: document.querySelector('.cursor'),
  buttons: document.querySelectorAll('.btn'),
  canvasWrapper: document.querySelector('.canvas_wrapper'),
  alts: document.querySelectorAll('.alt')
}

const input = {
  column: document.querySelector('.column'),
  row: document.querySelector('.row'),
  cellD: document.querySelector('.cell_size'),
  colors: document.querySelector('.colors'),
  svg: document.querySelector('.svg'),
}

export {
  overlay,
  artboard,
  aCtx,
  oCtx,
  elements,
  input,
}