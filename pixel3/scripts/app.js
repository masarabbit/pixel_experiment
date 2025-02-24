
import { Input, SizeInput, TextArea, Upload, Button } from './classes/input.js'
import { Artboard } from './classes/artboard.js'
import { settings, elements } from './elements.js'
import { mouse } from './utils.js'

// TODO add cursor for highlighting hover area (and possibly showing alt)
// TODO add draggable navWindow

function init() {

  new TextArea({
    container: elements.wrapper,
    className: 'colors',
    action: e => {
      settings.colors = e.target.value.split(',')
      elements.artboard.paintCanvas()
    },
    buttons: [
      {
        className: 'icon generate',
        action: textArea => {
          settings.colors = textArea.value
          elements.artboard.paintCanvas()
        }
      },
      {
        className: 'icon copy',
        action: textArea => textArea.copyText()
      },
    ]
  })

  new TextArea({
    container: elements.wrapper,
    inputName: 'dataUrl',
    action: e => {
      if (!elements.artboard) return
      elements.artboard.dataUrl = e.target.value
      // elements.artboard.output()
    },
    buttons: [
      {
        className: 'icon copy',
        action: textArea => textArea.copyText()
      },
    ]
  })

  elements.artboard = new Artboard({
    w: settings.column * settings.d,
    h: settings.row * settings.d,
    d: settings.d
  })

    ;['column', 'row', 'cellSize', 'color', 'hex', 'color2', 'hex2', 'fileName'].forEach(inputName => {
      const isNum = ['column', 'row', 'cellSize'].includes(inputName)
      const inputClass = ['column', 'row'].includes(inputName) ? SizeInput : Input
      settings.inputs[inputName] = new inputClass({
        inputName,
        container: elements.nav[0],
        isNum,
        className: isNum ? 'no' : '',
        update: isNum
          ? () => ['resize', 'paintCanvas'].forEach(action => elements.artboard[action]())
          : null
      })
    })

  new Upload({ container: elements.nav[1] })
  new Button({ 
    container: elements.nav[0],
    className: 'undo icon',
    action: ()=> settings.undo() 
  })
  

  ;[
    { 
      className: 'download-file',
      action: ()=> {
        ;['paintCanvas', 'downloadImage'].forEach(action => elements.artboard[action]())
      } 
    },
    { 
      className: 'fill',
      action: b => {
        b.el.classList.toggle('active')
        settings.fill = !settings.fill
      } 
    },
    {
      className: 'clear',
      action: b => {
        b.el.classList.toggle('active')
        settings.erase = !settings.erase
      } 
    },
    {
      className: 'flip-h',
      action: ()=> elements.artboard.flipHorizontal()
    },
    {
      className: 'flip-v',
      action: ()=> elements.artboard.flipVertical()
    },
    {
      className: 'grid-display',
      action: ()=> {
        settings.shouldShowGrid = !settings.shouldShowGrid
        elements.artboard.overlay[settings.shouldShowGrid ? 'drawGrid' : 'clearGrid']()
      }
    },
    { 
      className: 'select-state',
      action: ()=> elements.artboard.toggleSelectState()
    },
    { 
      className: 'copy-selection',
      action: ()=> {
        if (elements.artboard.selectBox) elements.artboard.selectBox.copy()
      }
    },
    { 
      className: 'paste-selection',
      action: ()=> {
        const { selectBox } = elements.artboard
        if (selectBox && selectBox.copyData.length) selectBox.paste()
      }
    },
    { 
      className: 'cut-selection',
      action: ()=> {
        if (elements.artboard.selectBox) elements.artboard.selectBox.cut()
      }
    },
    { 
      className: 'crop-selection',
      action: ()=> {
        if (elements.artboard.selectBox) elements.artboard.selectBox.crop()
      }
    },
    { 
      btnText: 'flip select h',
      action: ()=> {
        if (elements.artboard.selectBox.copyData.length) elements.artboard.selectBox.flipHorizontal()
      }
    },
    { 
      btnText: 'flip select v',
      action: ()=> {
        if (elements.artboard.selectBox.copyData.length) elements.artboard.selectBox.flipVertical()
      }
    },
    { 
      className: 'new-grid',
      action: ()=> {
        ;['resize', 'refresh', 'paintCanvas'].forEach(action => elements.artboard[action]())
      }
    },
    { 
      className: 'output-data-url-from-image',
      action: ()=> {
        settings.inputs.dataUrl.value = elements.artboard.drawboard.el.toDataURL()
      }
    },
    { 
      className: 'output-from-data-url',
      action: ()=> {
        if (elements.artboard?.dataUrl?.[0] === 'd') {
          elements.artboard.output()
        }
      }
    },
    { 
      btnText: 'show setting',
      action: ()=> {
        console.log(settings)
      }
    },
  ].forEach(b => {
    new Button({
      ...b,
      container: elements.nav[1],
      className: `${b.className} icon`
    })
  }) 


  settings.colors = `#0fc771,#0fc771,#0fc771,#0fc771,#0fc771,#0fc771,#0fc771,#0fc771,#0fc771,#0fc771,#0fc771,#0fc771,#0fc771,#0fc771,#0fc771,#0fc771,#0fc771,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,#0fc771,#0fc771,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,#0fc771,#0fc771,transparent,transparent,#c70f0f,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,#c7590f,transparent,#0fc771,#0fc771,transparent,transparent,#c70f0f,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,#c7590f,transparent,#0fc771,#0fc771,transparent,transparent,#c70f0f,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,#c7590f,transparent,#0fc771,#0fc771,transparent,transparent,#c70f0f,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,#c7590f,transparent,#0fc771,#0fc771,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,#0fc771,#0fc771,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,#0fc771,#0fc771,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,#0fc771,#0fc771,transparent,#0f15c7,#0f15c7,#0f15c7,#0f15c7,#0f15c7,#0f15c7,#0f15c7,#0f15c7,#0f15c7,#0f15c7,#0f15c7,#0f15c7,transparent,#0fc771,#0fc771,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,#0fc771,#0fc771,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,#0fc771,#0fc771,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,#0fc771,#0fc771,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,#0fc771,#0fc771,#0fc771,#0fc771,#0fc771,#0fc771,#0fc771,#0fc771,#0fc771,#0fc771,#0fc771,#0fc771,#0fc771,#0fc771,#0fc771,#0fc771,#0fc771`.split(',')


  settings.inputs.colors.value = settings.colors

  elements.artboard.paintCanvas()

  settings.recordState()

  mouse.up(document, 'add', ()=> settings.recordState())

}

window.addEventListener('DOMContentLoaded', init)
