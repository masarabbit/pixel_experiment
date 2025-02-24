

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
  prev: [],
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
  },
  get lastPrev() {
    return this.prev.length && this.prev[this.prev.length - 1]
  },
  recordState() {
    const { row, column, d, colors, lastPrev } = this
  
    if (lastPrev &&
        lastPrev.colors === colors &&
        lastPrev.row === row &&
        lastPrev.column === column
    ) return
  
    this.prev.push({ colors, column, row, d })
    // keep artData.prev under 5 steps
    if (this.prev.length > 5) this.prev = this.prev.filter((d, i) =>{
      if(i) return d
    })
  }
}

export {
  elements,
  settings,
}
