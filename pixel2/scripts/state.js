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

  // copy
  // selectCopy: false,
  // copyState: false,
  // moveState: false,
  // copyBoxCreated: false,
  // copyBox: null,
  // copied: false,
  // isCut: false,
  // prevX: 0,
  // prevY: 0,
  prev: {
    x: null,
    y: null,
  },
  defPos: {}
}  

export {
  artData
}