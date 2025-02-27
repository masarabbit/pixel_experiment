

const elements = {
  body: document.querySelector('body'),
  artboard: null,
  artboardWindows: [],
  windows: {},
  saveDataName: 'window-pos',
  saveData() {
    const obj = {}
    Object.keys(this.windows).forEach(key => {
      const { x, y, isOpen } = this.windows[key]
      const { column, row, cellSize } = settings
      obj[key] = { x, y, isOpen, column, row, cellSize }
    })
    localStorage.setItem(this.saveDataName, JSON.stringify(obj))
  },
  readData() {
    const saveData = localStorage.getItem(this.saveDataName)
    if (saveData) {
      const data = JSON.parse(saveData)

      Object.keys(data).forEach(key => {
        ;['x', 'y', 'isOpen'].forEach(prop => {
          this.windows[key][prop] = data[key][prop]
        })
        this.windows[key].setUp()

        ;['column', 'row', 'cellSize'].forEach(prop => {
          settings.inputs[prop].value = data[key][prop]
        })
        this.artboard.resize()
      })
    }
  }
}

const settings = {
  column: 16,
  row: 16,
  cellSize: 20,
  hex: '#000000',
  hex2: null,
  filename: 'pixel',
  shouldShowGrid: true,
  gridWidth: 0.5,
  colors: [],
  dataUrl: null,
  inputs: {},
  prev: [],
  saveDataName: 'save-data',
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
        lastPrev.colors === colors.join(',') &&
        lastPrev.row === row &&
        lastPrev.column === column
    ) return  
    this.prev.push({ colors: colors.join(','), column, row, cellSize: d })

    // keep artData.prev under 5 steps
    if (this.prev.length > 5) this.prev = this.prev.filter((d, i) =>{
      if(i) return d
    })
  },
  undo() {
    this.prev.pop()
    if (this.lastPrev) {
      ;['colors', 'row', 'column', 'cellSize'].forEach(key => {
        this.inputs[key].value = this.lastPrev[key]
      })
      elements.artboard.resize()
      elements.artboard.paintCanvas()
    }
}
}

export {
  elements,
  settings,
}
