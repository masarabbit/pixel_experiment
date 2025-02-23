

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
  shouldShowGrid: true,
  gridWidth: 0.5,
  colors: [],
  inputs: {},
  calcX(cell) {
    return cell % this.column
  },
  calcY(cell) {
    return Math.floor(cell / this.column)
  },
  get d() { return this.cellSize },
  set d(val) { this.cellSize = val },
  // get color() { return this.hex },
  // get color2() { return this.hex2 },
  // set color(val) { this.hex = val },
  // set color2(val) { this.hex2 = val },
  get splitColors() {
    return this.colors.reduce((acc, _, i) => {
      if (i % this.column === 0) acc.push(this.colors.slice(i, i + this.column))
      return acc
    }, [])
  }
}

export {
  elements,
  settings,
}
