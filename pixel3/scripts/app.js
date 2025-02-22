

function init() {
  const nearestN = (x, n) => x === 0 ? 0 : (x - 1) + Math.abs(((x - 1) % n) - n)
  const isNum = x => typeof x === 'number'
  const px = n => `${n}px`

  const n = 1
  const rgbToHex = (r, g, b) => {
    if (r > 255 || g > 255 || b > 255)
      throw 'Invalid color component'  
    return ((nearestN(r, n) << 16) | (nearestN(g, n) << 8) | nearestN(b, n)).toString(16)
  }
  
  const hex = rgb => '#' + ('000000' + rgb).slice(-6)

  const convertCameCase = string => {
    return string.split('').map(letter => {
      return (letter === letter.toUpperCase() || isNum(letter)) ?  ` ${letter.toLowerCase()}` : letter
    }).join('')
  }


  const mouse = {
    addEvents(target, event, action, array) {
      array.forEach(a => target[`${event}EventListener`](a, action))
    },
    up(t, e, a) { this.addEvents(t, e, a, ['mouseup', 'touchend']) },
    move(t, e, a) { this.addEvents(t, e, a, ['mousemove', 'touchmove']) },
    down(t, e, a) { this.addEvents(t, e, a, ['mousedown', 'touchstart']) },
    enter(t, e, a) { this.addEvents(t, e, a, ['mouseenter', 'touchstart']) },
    leave(t, e, a) { this.addEvents(t, e, a, ['mouseleave', 'touchmove']) }
  }

  const elements = {
    wrapper: document.querySelector('.wrapper'),
    canvasWrapper: document.querySelector('.canvas-wrapper'),
    nav: document.querySelectorAll('nav')
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
    inputs: {
      // test: 'b',
      // get a() {
      //   return this.test
      // },
    },
    calcX(cell) {
      return cell % this.column
    },
    calcY(cell) {
      return Math.floor(cell / this.column)
    }

  }

  class Input {
    constructor(props) {
      const label = convertCameCase(props.inputName)
      const isColorInput = props.inputName.includes('color')
      Object.assign(this, {
        el: Object.assign(document.createElement('div'), {
          className: isColorInput ? '' : 'input-wrap',
          innerHTML: `
            <label class="${isColorInput ? 'color-label' : ''}" for="${props.inputName}">
              ${isColorInput ? '' : label}
            </label>
            <input 
              id="${props.inputName}" 
              class="${props?.className || ''} ${props.inputName} input" 
              type="${isColorInput ? 'color' : 'text'}" 
              placeholder="${label}"
            >
          `
        }),
        ...props,
      })
      props.container.appendChild(this.el)
      this.input = this.el.querySelector('input')
      this.input.addEventListener('change', e => {
        settings[this.key] = e.target.value
        if (isColorInput || this.inputName.includes('hex')) this.updateColor()
        if (this.update) this.update() 
      })
      if (this.default) settings[this.inputName] = this.default
      if (isColorInput) {
        this.label = this.el.querySelector('label')
        this.updateColor()
      } else {
        this.input.value = settings[props.inputName]
      }
    }
    get key() {
      return this.inputName.replace('color', 'hex')
    }
    updateColor() {
      const label = this.label || settings.inputs[this.inputName.replace('hex', 'color')].label
      label.style.backgroundColor = settings[this.key]
      if (settings?.inputs[this.key]) settings.inputs[this.key].input.value = settings[this.key]
    }
  }

  class Button {
    constructor(props) {
      Object.assign(this, {
        el: Object.assign(document.createElement('button'), {
          className: `btn ${props?.className || ''}`,
          innerHTML: props?.btnText || '',
        }),
        ...props,
      })
      props.container.appendChild(this.el)
      this.el.addEventListener('click', this.action)
    }
  }

  class TextArea {
    constructor(props) {
      Object.assign(this, {
        input: Object.assign(document.createElement('textarea'), {
          className: props.className,
          spellcheck: false,
        }),
        ...props
      })
      this.container.append(this.input)
      this.input.addEventListener('change', this.action)
      const buttonWrapper = Object.assign(document.createElement('div'), {
        className: 'mini-wrap',
      })
      this.container.append(buttonWrapper)
      this.buttons.forEach(b => {
        new Button({
          ...b,
          container: buttonWrapper,
          action: ()=> b.action(this)
        })
      })
      settings.inputs[this.className] = this
    }
    copyText() {
      this.input.select()
      this.input.setSelectionRange(0, 999999) // For mobile devices 
      document.execCommand('copy')
    }
  }



  class PageObject {
    constructor(props) {
      Object.assign(this, {
        ...props,
      })
    }
    syncSize() {
      const { width, height } = this.el
        .querySelector('div')
        .getBoundingClientRect()
      this.w = width
      this.h = height
    }
    get pos() {
      return {
        x: this.x,
        y: this.y,
      }
    }
    get size() {
      return {
        w: this.w,
        h: this.h,
      }
    }
    setStyles() {
      Object.assign(this.el.style, {
        left: px(this.x || 0),
        top: px(this.y || 0),
        width: px(this.w),
        height: px(this.h || this.w),
      })
    }
    addToPage() {
      // this.setStyles()
      this.container.appendChild(this.el)
    }
  }

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
      this.ctx = this.el.getContext('2d', {willReadFrequently: true} )
      // this.ctx.imageSmoothingEnabled = false
      this.resizeCanvas()
    }
    resizeCanvas({ w, h }={}) {
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


  class ArtBoard extends PageObject {
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
      mouse.down(this.drawboard.el, 'add', ()=> this.draw = true)
      mouse.up(this.drawboard.el, 'add', ()=> this.draw = false)
      mouse.move(this.drawboard.el, 'add', e => this.continuousDraw(e))
      mouse.leave(this.drawboard.el, 'add', ()=> {
        this.draw = false
        // artData.cursor = null
      })
      // mouse.enter(artboard, 'add', ()=> artData.cursor = 'artboard')
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
        ? fillBucket(index)
        : settings.colors[index] = value
      // input.colors.value = artData.colors
      
      // if (!artData.palette.includes(value)) {
      //   artData.palette.push(value)
      //   populatePalette(artData.palette)
      // }
      // recordState()
    }
    continuousDraw = e => {
      if (this.draw) this.colorCell(e) 
    }
    updateSize() {
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
      settings.colors.forEach((c, i)=>{
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
        this.drawboard.resizeCanvas({
          // canvas: artboard, 
          w: column * d, h: row * d
        })
        this.paintCanvas()
        // this.copyColors() // why repeat?
        console.log(settings.inputs)
        settings.inputs.colors.input.value = settings.colors
        // populateCompletePalette(artData.colors)
      }
      imageTarget.src = blobURL
      this.blobURL = blobURL
      // recordState()
    }
  }

  const artboard = new ArtBoard({
    w: settings.column * settings.d,
    h: settings.row * settings.d,
    d: settings.d
  })

  ;['column', 'row', 'color', 'hex', 'color2', 'hex2', 'cellSize', 'fileName'].forEach(inputName => {
    const isNum = ['column', 'row', 'cellSize'].includes(inputName)
    settings.inputs[inputName] = new Input({
      inputName,
      container: elements.nav[0],
      className: isNum ? 'no' : '',
      update: isNum
        ? ()=> artboard.updateSize()
        : null
    })
  })

  class Upload{
    constructor(props) {
      Object.assign(this, {
        el: Object.assign(document.createElement('div'), {
          className: 'upload-wrapper',
          innerHTML: `
            <input id="upload" type="file" single/>
            <label for="upload" data-alt="upload image file" class="upload icon alt"></label>
            <div></div>
          `
        }),
        ...props
      })
      this.container.appendChild(this.el)
      ;['input', 'label', 'display'].forEach(key => this[key] = this.el.querySelector(`${key === 'display' ? 'div' : key}`))

      this.pixeliseBtn = new Button({
        container: this.container,
        className: 'pixelise icon d-none',
        action: ()=> {
          artboard.output()
          console.log('pixelise')
        }
      })
      this.el.addEventListener('change', () => {
        artboard.uploadedFile = this.input.files[0]
        this.display.innerHTML = artboard.uploadedFile.name
        this.pixeliseBtn.el.classList.remove('d-none')
      }) 
    }
  }
  
  new Upload({ container: elements.nav[1] })

  new TextArea({
    container: elements.wrapper,
    className: 'colors',
    action: e => {
      settings.colors = e.target.value
    },
    buttons: [
      {
        className: 'icon copy',
        action: textArea => textArea.copyText()
      }
    ]

  })


}

window.addEventListener('DOMContentLoaded', init)
