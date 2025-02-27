
import { Input, SizeInput, TextArea, Upload, Button } from './classes/input.js'
import { NavWindow } from './classes/nav.js'
import { Artboard, SelectBox } from './classes/artboard.js'
import TraceSvg from './classes/traceSvg.js'
import { settings, elements } from './elements.js'
import { mouse } from './utils.js'

// TODO add cursor for highlighting hover area (and possibly showing alt)
// TODO output svg

function init() {

  const createNewArtboard = () => {
    return new NavWindow({
      name: 'artboard',
      container: elements.body,
      className: 'current',
      isOpen: true,
      x: 10, y: 10,
      content: nav => {
        nav.artboard = new Artboard({
          container: nav.contentWrapper,
          w: settings.column * settings.d,
          h: settings.row * settings.d,
          d: settings.d
        })
        elements.artboardWindows.push(nav)
      },
      selectAction: nav => nav.artboard.switchArtboard()
    })
  }

  elements.windows = {
    colors: new NavWindow({
      name: 'colors',
      container: elements.body,
      isOpen: true,
      x: 10, y: 400,
      content: nav => {
        new TextArea({
          container: nav.contentWrapper,
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
      }
    }),
    dataUrl: new NavWindow({
      name: 'dataUrl / svg',
      container: elements.body,
      isOpen: true,
      x: 200, y: 400,
      content: nav => {
        new TextArea({
          container: nav.contentWrapper,
          inputName: 'dataUrl',
          action: e => {
            if (!elements.artboard) return
            elements.artboard.dataUrl = e.target.value
          },
          buttons: [
            { 
              className: 'icon output-from-data-url',
              action: ()=> {
                if (elements.artboard?.dataUrl?.[0] === 'd') {
                  elements.artboard.output()
                }
              }
            },
            {
              className: 'icon copy',
              action: textArea => textArea.copyText()
            },
          ]
        })
      }
    }),
    artboard: createNewArtboard(),
    main: new NavWindow({
      name: 'main',
      container: elements.body,
      isOpen: true,
      x: 400, y: 0,
      content: nav => {
        ['column', 'row', 'cellSize', 'color', 'hex', 'color2', 'hex2'].forEach(inputName => {
          const isNum = ['column', 'row', 'cellSize'].includes(inputName)
          const inputClass = ['column', 'row'].includes(inputName) ? SizeInput : Input
          settings.inputs[inputName] = new inputClass({
            inputName,
            container: nav.contentWrapper,
            isNum,
            className: isNum ? 'no' : '',
            update: isNum
              ? () => ['resize', 'paintCanvas'].forEach(action => elements.artboard[action]())
              : null
          })
        })
      }
    }),
    fileName: new NavWindow({
      name: 'fileName',
      container: elements.body,
      x: 500, y: 0,
      isOpen: false,
      content: nav => {
        settings.inputs.filename = new Input({
          inputName: 'filename',
          container: nav.contentWrapper,
        })
        new Upload({ container: nav.contentWrapper })
        ;[
          {
            className: 'download-file',
            action: ()=> {
              ;['paintCanvas', 'downloadImage'].forEach(action => elements.artboard[action]())
            },
          },  
          { 
            className: 'output-data-url-from-image',
            action: ()=> {
              settings.inputs.dataUrl.value = elements.artboard.drawboard.el.toDataURL()
            }
          },
          { 
            className: 'trace-svg',
            action: ()=> {
              new TraceSvg()
            }
          },
        ].forEach(b => {
          new Button({
            ...b,
            container: nav.contentWrapper,
            className: `${b.className} icon`
          })
        }) 
      }
    }),
    select: new NavWindow({
      name: 'select',
      container: elements.body,
      x: 100, y: 200,
      column: true,
      content: nav => {
        ;[
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
            className: 'flip-h',
            action: ()=> {
              if (elements.artboard.selectBox.copyData.length) elements.artboard.selectBox.flipHorizontal()
            }
          },
          { 
            className: 'flip-v',
            action: ()=> {
              if (elements.artboard.selectBox.copyData.length) elements.artboard.selectBox.flipVertical()
            }
          },
        ].forEach(b => {
          new Button({
            ...b,
            container: nav.contentWrapper,
            className: `${b.className} icon`
          })
        }) 
      }
    }),
    draw: new NavWindow({
      name: 'draw',
      container: elements.body,
      x: 100, y: 200,
      column: true,
      isOpen: true,
      content: nav => {
        ;[
          { 
            className: 'undo',
            action: ()=> settings.undo() 
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
            className: 'new-grid',
            action: ()=> {
              ;['resize', 'refresh', 'paintCanvas'].forEach(action => elements.artboard[action]())
            }
          }
        ].forEach(b => {
          new Button({
            ...b,
            container: nav.contentWrapper,
            className: `${b.className} icon`
          })
        }) 
      
      }
    }),
    test: new NavWindow({
      name: 'draw',
      container: elements.body,
      x: 100, y: 200,
      column: true,
      isOpen: true,
      content: nav => {
        ;[
          { 
            btnText: 'new board',
            action: createNewArtboard
          },
          { 
            btnText: 'show elements',
            action: ()=> {
              console.log('elements', elements)
            }
          },
          { 
            btnText: 'show setting',
            action: ()=> {
              console.log('settings', settings)
            }
          },
        ].forEach(b => {
          new Button({
            ...b,
            container: nav.contentWrapper,
            className: `${b.className} icon`
          })
        }) 
      
      }
    })
  }

  elements.readData()

  // new NavWindow({
  //   name: 'artboard',
  //   container: elements.body,
  //   isOpen: true,
  //   x: 100, y: 100,
  //   content: nav => {
  //     new Artboard({
  //       container: nav.contentWrapper,
  //       w: settings.column * settings.d,
  //       h: settings.row * settings.d,
  //       d: settings.d
  //     })
  //   }
  // }),


  settings.colors = `#000000,#000000,#000000,#000000,#000000,#000000,#000000,#000000,#000000,#000000,#000000,#000000,#000000,#000000,#000000,#000000,#000000,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,#000000,#000000,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,#000000,#000000,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,#000000,#000000,transparent,transparent,transparent,#187c71,transparent,transparent,transparent,transparent,transparent,transparent,transparent,#187c71,transparent,transparent,#000000,#000000,transparent,transparent,transparent,#187c71,transparent,transparent,transparent,transparent,transparent,transparent,transparent,#187c71,transparent,transparent,#000000,#000000,transparent,transparent,transparent,#187c71,transparent,transparent,transparent,transparent,transparent,transparent,transparent,#187c71,transparent,transparent,#000000,#000000,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,#000000,#000000,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,#000000,#000000,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,#000000,#000000,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,#000000,#000000,transparent,transparent,transparent,#59187c,#59187c,#59187c,#59187c,#59187c,#59187c,#59187c,#59187c,#59187c,transparent,transparent,#000000,#000000,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,#000000,#000000,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,#000000,#000000,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,transparent,#000000,#000000,#000000,#000000,#000000,#000000,#000000,#000000,#000000,#000000,#000000,#000000,#000000,#000000,#000000,#000000,#000000`.split(',')


  settings.inputs.colors.value = settings.colors

  elements.artboard.paintCanvas()

  settings.recordState()

  mouse.up(document, 'add', ()=> settings.recordState())


}

window.addEventListener('DOMContentLoaded', init)
