import { input }  from './elements.js'

const artData = {
  draw: false,
  cursor: null,
  code: [],
  svg: [],
  column: +input.column.value,
  row: +input.row.value,
  cellD: +input.cellD.value,
  gridWidth: 0.5,
  hex: '#000000',
  uploadedFile: null,
  calcWidth: 0,
  calcHeight: 0,
  gridColor: 'lightgrey'
}

export {
  artData
}