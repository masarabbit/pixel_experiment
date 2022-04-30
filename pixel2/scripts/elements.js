
const overlay = document.querySelector('.overlay')
const artboard = document.querySelector('.artboard')
const aCtx = artboard.getContext('2d')
const oCtx = overlay.getContext('2d')

const elements = {
  cursor: document.querySelector('.cursor'),
  buttons: document.querySelectorAll('.btn'),
  canvasWrapper: document.querySelector('.canvas_wrapper'),
  palette: document.querySelector('.palette')
}

const input = {
  column: document.querySelector('.column'),
  row: document.querySelector('.row'),
  cellD: document.querySelector('.cell_size'),
  codes: document.querySelectorAll('.code'),
  color: document.querySelector('#color'),
  colorLabel: document.querySelector('.color_label'),
  hex: document.querySelector('.hex'),
  upload: document.querySelector('#upload'),
}

export {
  overlay,
  artboard,
  aCtx,
  oCtx,
  elements,
  input,
}