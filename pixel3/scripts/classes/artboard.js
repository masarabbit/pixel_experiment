import { nearestN, rgbToHex, hex, mouse } from '../utils.js'
import PageObject from './pageObject.js'
import { elements, settings } from './elements.js'

class Canvas extends PageObject {
  constructor(props) {
    super({
      el: Object.assign(document.createElement('canvas'), {
        className: props.className,
      }),
      gridColor: 'lightgrey',
      gridWidth: 0.5,
      ...props,
    })
    if (props?.container) this.addToPage()
    this.ctx = this.el.getContext('2d', { willReadFrequently: true })
    // this.ctx.imageSmoothingEnabled = false
    this.resizeCanvas()
  }
  resizeCanvas({ w, h } = {}) {
    // console.log('test', w, h)
    if (w) this.w = w
    if (h) this.h = h
    // this.setStyles()
    this.el.setAttribute('width', this.w)
    this.el.setAttribute('height', this.h || this.w)
  }
  drawGrid() {
    const { gridColor, gridWidth, ctx } = this
    const { column, row, d } = settings
    ctx.strokeStyle = gridColor
    ctx.beginPath()
    const pos = (n, max) => n * d + (n === max ? -gridWidth : gridWidth)

    for (let x = 0; x <= column; x++) {
      ctx.moveTo(pos(x, column), gridWidth)
      ctx.lineTo(pos(x, column), this.h - gridWidth)
    }
    for (let y = 0; y <= row; y++) {
      ctx.moveTo(gridWidth, pos(y, row))
      ctx.lineTo(this.w - gridWidth, pos(y, row))
    }
    ctx.stroke()
  }
  clearGrid() {
    this.ctx.clearRect(0, 0, this.w, this.h)
  }
}

class Artboard extends PageObject {
  constructor(props) {
    super({
      el: elements.canvasWrapper,
      d: 10,
      draw: false,
      ...props,
    })
    this.setStyles()
    const { w, h, d } = this
      ;['drawboard', 'overlay'].forEach(className => {
        this[className] = new Canvas({
          artboard: this,
          container: this.el,
          className,
          w, h, d
        })
      })
    this.overlay.drawGrid()

    this.drawboard.el.addEventListener('click', this.colorCell)
    mouse.down(this.drawboard.el, 'add', () => this.draw = true)
    mouse.up(this.drawboard.el, 'add', () => this.draw = false)
    mouse.move(this.drawboard.el, 'add', e => this.continuousDraw(e))
    mouse.leave(this.drawboard.el, 'add', () => {
      this.draw = false
      // artData.cursor = null
    })
    // mouse.enter(artboard, 'add', ()=> artData.cursor = 'artboard')
    this.refresh()
  }
  drawPos = e => {
    const { top, left } = this.drawboard.el.getBoundingClientRect()
    return {
      x: nearestN(e.pageX - left - window.scrollX, settings.d),
      y: nearestN(e.pageY - top - window.scrollY, settings.d)
    }
  }
  colorCell = e => {
    const { x, y } = this.drawPos(e)
    const { column, d } = settings
    this.drawboard.ctx.fillStyle = settings.hex
    this.drawboard.ctx[settings.erase ? 'clearRect' : 'fillRect'](x - d, y - d, d, d)

    const value = settings.erase || settings.hex === 'transparent'
      ? 'transparent'
      : settings.hex  // transparent replaced with ''
    const index = ((y / d - 1) * column) + x / d - 1
    settings.fill
      ? this.fillBucket(index)
      : settings.colors[index] = value
    settings.inputs.colors.value = settings.colors

    // if (!artData.palette.includes(value)) {
    //   artData.palette.push(value)
    //   populatePalette(artData.palette)
    // }
    // recordState()
  }
  continuousDraw = e => {
    if (this.draw) this.colorCell(e)
  }
  resize() {
    this.w = settings.column * settings.d,
    this.h = settings.row * settings.d,
    this.d = settings.d
    this.setStyles()
    this.drawboard.resizeCanvas(this.size)
    this.overlay.resizeCanvas(this.size)
    this.overlay.drawGrid()
  }
  copyColors() {
    settings.colors.length = 0
    const { column: w, row: h, d } = settings
    const offset = Math.floor(d / 2)
    for (let i = 0; i < w * h; i++) {
      const x = i % w * d
      const y = Math.floor(i / w) * d
      const c = this.drawboard.ctx.getImageData(x + offset, y + offset, 1, 1).data //offset
      // this thing included here to prevent rendering black instead of transparent
      c[3] === 0
        ? settings.colors.push('transparent')
        : settings.colors.push(hex(rgbToHex(c[0], c[1], c[2])))
    }
  }
  paintFromColors() {
    const { d } = settings
    settings.colors.forEach((c, i) => {
      this.drawboard.ctx.fillStyle = c || 'transparent'
      this.drawboard.ctx.fillRect(settings.calcX(i) * d, settings.calcY(i) * d, d, d)
    })
  }
  paintCanvas() {
    const { column, row, d } = settings
    this.drawboard.ctx.clearRect(0, 0, column * d, row * d)
    this.paintFromColors()
    // populatePalette(artData.colors)
    // recordState()
  }
  updateColorsAndPaint() {
    settings.colors = settings.inputs.colors.value
    this.paintCanvas()
  }
  output() {
    const { column, row, d } = settings
    if (!this.uploadedFile) return
    const blobURL = window.URL.createObjectURL(this.uploadedFile)
    const imageTarget = new Image()

    imageTarget.onload = () => {
      const { naturalWidth: w, naturalHeight: h } = imageTarget
      const calcHeight = (column * d) * (h / w)
      const calcWidth = calcHeight * (w / h)

      this.drawboard.resizeCanvas({ w: calcWidth, h: calcHeight - (calcHeight % d) })
      this.drawboard.ctx.drawImage(imageTarget, 0, 0, calcWidth, calcHeight)
      this.copyColors()
      // revert canvas size before painting
      this.drawboard.resizeCanvas({ w: column * d, h: row * d })
      this.paintCanvas()
      // this.copyColors() // why repeat?
      settings.inputs.colors.value = settings.colors
      // populateCompletePalette(artData.colors)
    }
    imageTarget.src = blobURL
    this.blobURL = blobURL
    // recordState()
  }
  downloadImage() {
    const link = document.createElement('a')
    link.download = `${settings.inputs.fileName.value || 'art'}_${new Date().getTime()}.png`
    link.href = this.drawboard.el.toDataURL()
    link.click()
  }
  fillArea = ({ i, valueToCheck }) =>{
    const fillArea = []
    const fillStack = []
    const { column: w } = settings
    fillStack.push(i) // first cell to fill
    
    while (fillStack.length > 0){
      const checkCell = fillStack.pop() // removes from area to check
      if (settings.colors[checkCell] !== valueToCheck) continue // cell value already valueToCheck?
      if (fillArea.some(d => d === checkCell)) continue // in fillArea already?
      fillArea.push(checkCell) // if passed above check, include in fillArea
      if (checkCell % w !== 0) fillStack.push(checkCell - 1) // check left
      if (checkCell % w !== w - 1) fillStack.push(checkCell + 1) // check right
      fillStack.push(checkCell + w) // check up
      fillStack.push(checkCell - w) // check down
    }
    return fillArea
  }
  fillBucket = index => {
    const fillValue = settings.erase ? 'transparent' : settings.hex  //! '' instead of transparent
    const valueToSwap = settings.colors[index]
    const fillAreaBucket = this.fillArea({
        i: +index, 
        valueToCheck: valueToSwap, 
      })
    settings.inputs.colors.value = settings.inputs.colors.value.map((c, i)=>{
      if (!fillAreaBucket.includes(i)) return c
      return c === valueToSwap ? fillValue : c
    }).join(',')
    this.updateColorsAndPaint()
  }
  refresh() {
    settings.colors = Array(settings.row * settings.column).fill('transparent')
    settings.inputs.colors.value = settings.colors
  }
}

export {
  Artboard
}