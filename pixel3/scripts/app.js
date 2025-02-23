
import { Input, SizeInput, TextArea, Upload, Button } from './classes/input.js'
import { Artboard } from './classes/artboard.js'
import { settings, elements } from './classes/elements.js'

function init() {

  new TextArea({
    container: elements.wrapper,
    className: 'colors',
    action: e => {
      settings.colors = e.target.value.split(',')
      elements.artboard.output()
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

  elements.artboard = new Artboard({
    w: settings.column * settings.d,
    h: settings.row * settings.d,
    d: settings.d
  })

    ;['column', 'row', 'color', 'hex', 'color2', 'hex2', 'cellSize', 'fileName'].forEach(inputName => {
      const isNum = ['column', 'row', 'cellSize'].includes(inputName)
      const inputClass = ['column', 'row'].includes(inputName) ? SizeInput : Input
      settings.inputs[inputName] = new inputClass({
        inputName,
        container: elements.nav[0],
        className: isNum ? 'no' : '',
        update: isNum
          ? () => ['resize', 'paintCanvas'].forEach(action => elements.artboard[action]())
          : null
      })
    })

  new Upload({ container: elements.nav[1] })
  


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
      className: 'new-grid',
      action: ()=> {
        ;['resize', 'refresh', 'paintCanvas'].forEach(action => elements.artboard[action]())
      }
    }
  ].forEach(b => {
    new Button({
      ...b,
      container: elements.nav[1],
      className: `${b.className} icon`
    })
  }) 




}

window.addEventListener('DOMContentLoaded', init)
