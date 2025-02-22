
import { Input, TextArea, Upload, Button } from './classes/input.js'
import { Artboard } from './classes/artboard.js'
import { settings, elements } from './classes/elements.js'

function init() {


  elements.artboard = new Artboard({
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
          ? () => elements.artboard.updateSize()
          : null
      })
    })

  new Upload({ container: elements.nav[1] })
  new Button({ 
    container: elements.nav[1],
    className: 'download-file icon',
    action: ()=> {
      elements.artboard.paintCanvas()
      elements.artboard.downloadImage()
    } 
  })

  new TextArea({
    container: elements.wrapper,
    className: 'colors',
    action: e => {
      settings.colors = e.target.value
      elements.artboard.output()
    },
    buttons: [
      {
        className: 'icon generate',
        action: textArea => {
          settings.colors = textArea.input.value.split(',')
          elements.artboard.paintCanvas()
        }
      },
      {
        className: 'icon copy',
        action: textArea => textArea.copyText()
      },
    ]
  })


}

window.addEventListener('DOMContentLoaded', init)
