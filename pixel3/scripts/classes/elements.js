

const elements = {
  wrapper: document.querySelector('.wrapper'),
  canvasWrapper: document.querySelector('.canvas-wrapper'),
  nav: document.querySelectorAll('nav'),
  artboard: null,
}

const settings = {
  column: 16,
  row: 16,
  cellSize: 20,
  hex: '#000000',
  hex2: null,
  fileName: '',
  colors: [],
  get d() { return this.cellSize },
  // get color() { return this.hex },
  // get color2() { return this.hex2 },
  // set color(val) { this.hex = val },
  // set color2(val) { this.hex2 = val },
  inputs: {},
  calcX(cell) {
    return cell % this.column
  },
  calcY(cell) {
    return Math.floor(cell / this.column)
  }
}

export {
  elements,
  settings,
}
