import { input }  from './elements.js'

const drawData = {
  draw: false,
  cursor: null,
  codes: [[], []],
  column: +input.column.value,
  row: +input.row.value,
  cellD: +input.cellD.value,
  gridWidth: 0.5,
}

export {
  drawData
}