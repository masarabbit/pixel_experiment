import { input } from './elements.js'

const artData = {
  // draw
  draw: false,
  fill: false,
  erase: false,
  cursor: null,
  colors: [ "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#000405", "#000405", "#000405", "#000405", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#000405", "#000405", "#000405", "#000405", "#000405", "#000405", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#000405", "#000405", "#000405", "#000405", "#ffffff", "#000405", "#000405", "#000405", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#000405", "#000405", "#000405", "#000405", "#ffffff", "#000405", "#000405", "#000405", "#000405", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#000405", "#000405", "#000405", "#000405", "#000405", "#000405", "#000405", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#000405", "#000405", "#000405", "#000405", "#000405", "#000405", "#000405", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#000405", "#000405", "#000405", "#000405", "#ffffff", "#ffffff", "#ffffff", "#000405", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#000405", "#000405", "#000405", "#000405", "#ffffff", "#ffffff", "#ffffff", "#000405", "#000405", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#000405", "#000405", "#000405", "#000405", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#000405", "#000405", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#000405", "#ffffff", "#000405", "#000405", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#000405", "#000405", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#000405", "#ffffff", "#ffffff", "#000405", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#c6fc03", "#000405", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#000405", "#000405", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#000405", "#b2e203", "#b2e203", "#000405", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#000405", "#000405", "#b2e203", "#000405", "#000405", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03", "#c6fc03" ],
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


export {
  artData,
}