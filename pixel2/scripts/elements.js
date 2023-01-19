
const overlay = document.querySelector('.overlay')
const artboard = document.querySelector('.artboard')
const aCtx = artboard.getContext('2d')
const oCtx = overlay.getContext('2d')
const body = document.querySelector('body')

const elements = {
  cursor: document.querySelector('.cursor'),
  buttons: document.querySelectorAll('.btn'),
  canvasWrapper: document.querySelector('.canvas_wrapper'),
  palette: document.querySelector('.palette'),
  flip: document.querySelectorAll('.flip'),
  selectBox: null,
  alts: document.querySelectorAll('.alt'),
  onionBg: document.querySelector('.onion_bg'),
}

const input = {
  column: document.querySelector('.column'),
  row: document.querySelector('.row'),
  cellD: document.querySelector('.cell_size'),
  colors: document.querySelector('.colors'),
  svg: document.querySelector('.svg'),
  color: document.querySelector('#color'),
  color2: document.querySelector('#color2'),
  colorLabel: document.querySelectorAll('.color_label'),
  hex: document.querySelector('.hex'),
  hex2: document.querySelector('.hex2'),
  fileName: document.querySelector('.file_name'),
  upload: document.querySelector('#upload'),
}

export {
  overlay,
  artboard,
  aCtx,
  oCtx,
  elements,
  input,
  body
}