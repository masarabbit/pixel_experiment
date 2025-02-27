
import { Input, SizeInput, TextArea, Upload, Button } from './classes/input.js'
import { NavWindow } from './classes/nav.js'
import { Artboard, SelectBox } from './classes/artboard.js'
import TraceSvg from './classes/traceSvg.js'
import { settings, elements } from './elements.js'
import { mouse } from './utils.js'

// TODO add cursor for highlighting hover area (and possibly showing alt)
// TODO some bugs relating to having multiple artboards (maybe need to have separate places to store colors and data url, since these can get mixed up)
// TODO bugs relating to undo, since it only considers one artboard
// TODO enable deleting artboards
// TODO add more options for combining canvases
// TODO fix bugs present in the SVG convert (doesn't quite work when there are tranparent holes)


// TODO palettes / presets, color dropper
// TODO output 1px dataUrl


function init() {

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
    artboard: settings.createNewArtboard(),
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
        nav.addButtons([
            {
              className: 'download-file',
              action: ()=> {
                ;['paintCanvas', 'downloadImage'].forEach(action => elements.artboard[action]())
              },
            },  
            { 
              className: 'output-data-url-from-image',
              action: ()=> {
                elements.artboard.dataUrl = elements.artboard.drawboard.el.toDataURL()
                settings.inputs.dataUrl.value = elements.artboard.dataUrl
              }
            },
            { 
              className: 'trace-svg',
              action: ()=> {
                new TraceSvg()
              }
            },
          ])
      }
    }),
    select: new NavWindow({
      name: 'select',
      container: elements.body,
      x: 100, y: 200,
      isVertical: true,
      content: nav => nav.addButtons([
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
      ])
    }),
    draw: new NavWindow({
      name: 'draw',
      container: elements.body,
      x: 100, y: 200,
      isVertical: true,
      isOpen: true,
      content: nav => nav.addButtons( [
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
      ])
    }),
    test: new NavWindow({
      name: 'test',
      container: elements.body,
      x: 100, y: 200,
      isOpen: true,
      content: nav => nav.addButtons([
        { 
          btnText: 'new board',
          action: settings.createNewArtboard
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
        { 
          btnText: 'combine',
          action: ()=> settings.combineArtboards()
        },
      ])      
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
