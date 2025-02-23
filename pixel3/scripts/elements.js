

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
  dataUrl: null,
  inputs: {},
  calcX(cell) {
    return cell % this.column
  },
  calcY(cell) {
    return Math.floor(cell / this.column)
  },
  get d() { return this.cellSize },
  set d(val) { this.cellSize = val },
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
