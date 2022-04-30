import { input }  from './elements.js'

const artData = {
  // draw
  draw: false,
  fill: false,
  erase: false,
  cursor: null,
  code: [],
  svg: [],
  hex: '#000000',
  // grid
  column: +input.column.value,
  row: +input.row.value,
  cellD: +input.cellD.value,
  calcWidth: 0,
  calcHeight: 0,
  gridWidth: 0.5,
  gridColor: 'lightgrey',
  uploadedFile: null,
}

export {
  artData
}