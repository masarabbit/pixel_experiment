import { input }  from './elements.js'

const artData = {
  // draw
  draw: false,
  fill: false,
  erase: false,
  cursor: null,
  colors: [],
  svg: [],
  hex: '#000000',
  prev: [],
  palette: [],

  // grid
  column: +input.column.value,
  row: +input.row.value,
  cellD: +input.cellD.value,
  calcWidth: 0,
  calcHeight: 0,
  gridWidth: 0.5,
  gridColor: 'lightgrey',
  uploadedFile: null,
  grid: true,
}  

const copyData = {
  defPos: { 
    x: 0,
    y: 0,
  },
  xy: { 
    x: 0,
    y: 0,
  },
  size: {
    w: 0,
    h: 0,
  },
  ctx: null,
  move: false,
  crop: false,
  colors: [],
  index: [],
}

export {
  artData,
  copyData
}