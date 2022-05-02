import { artboard, elements, input, aCtx, overlay }  from './elements.js'
import { styleTarget, mouse, resizeCanvas, copyText } from './actions/utils.js'
import { artData } from './state.js'
import { continuousDraw, colorCell, paintCanvas, flipImage, drawPos, copyColors } from './actions/draw.js'
import { resize } from './actions/grid.js'
import { updateColor } from './actions/colors.js'
import { createSelectBox, copySelection, paste } from './actions/select.js'

// TODO trace
// TODO undo
// TODO download
// TODO hide / display grid (overlay)
// TODO add alt + cursor
// TODO represent transparent as t?

function init() {

  const resetCodes = () =>{
    artData.colors = new Array(artData.row * artData.column).fill('transparent')
    input.colors.value = artData.colors
  }

  Object.keys(input).forEach(key =>{
    input[key].addEventListener('change', e =>{  
      if (['color', 'hex'].includes(key)) {
        updateColor(input[key].value)
      } else if (key === 'upload') {
        artData.uploadedFile = input.upload.files[0]
        document.querySelector('.file_name').innerHTML = artData.uploadedFile.name
        document.querySelector('.pixelise').classList.remove('display_none')
      } else if (key === 'colors') {
        artData.colors = e.target.value.split(',')
      } else {
        // column, row and cellD
        artData[key] = +e.target.value
        resize()
      }
    })
  })


  // TODO move this to draw?
  const output = () =>{
    const { cellD, row, column, uploadedFile } = artData 
    if (!uploadedFile) return
    const blobURL = window.URL.createObjectURL(uploadedFile)
    const imageTarget = new Image()
    
    imageTarget.onload = () => {
      const { naturalWidth: w, naturalHeight: h } = imageTarget
      artData.calcHeight = (column * cellD) * (h / w)
      artData.calcWidth = artData.calcHeight * (w / h)
      const { calcWidth, calcHeight } = artData 
      resizeCanvas({
        canvas: artboard, 
        w: calcWidth, h: calcHeight - (calcHeight % cellD)
      })   
      aCtx.drawImage(imageTarget, 0, 0, calcWidth, calcHeight)
      // artData.colors.length = 0
      copyColors({
        w: column, h: row, 
        ctx: aCtx, 
        data: artData.colors
      })
      // revert canvas size before painting
      resizeCanvas({
        canvas: artboard, 
        w: column * cellD, h: row * cellD
      })
      paintCanvas()
    }
    imageTarget.src = blobURL
  }
  
  const triggerFill = e =>{
    e.target.classList.toggle('active')
    artData.fill = !artData.fill
    // artData.cursorType = artData.fill 
    //   ? 'bucket_cursor' 
    //   : drawData.moveState 
    //     ? 'motion_cursor' 
    //     : 'pen_cursor'
  }

  elements.buttons.forEach(b =>{
    const addClickEvent = (className, event) => b.classList.contains(className) && b.addEventListener('click', event)
    addClickEvent('resize', ()=>{
      resize()
      resetCodes()
    })
    addClickEvent('pixelise', output)
    addClickEvent('copy', () => copyText(input.colors))
    addClickEvent('generate', paintCanvas)
    addClickEvent('flip', e => flipImage(e.target.dataset.dir))
    addClickEvent('fill', e => triggerFill(e))
    addClickEvent('clear', e => {
      e.target.classList.toggle('active')
      artData.erase = !artData.erase 
    })
    addClickEvent('select', ()=>{
      overlay.classList.toggle('select')
      if (elements.selectBox) {
        elements.canvasWrapper.removeChild(elements.selectBox)
        elements.selectBox = null
      }
    })
    addClickEvent('copy_selection', copySelection)
    addClickEvent('cut_selection', ()=> copySelection(true))
    addClickEvent('paste_selection', paste)
  })

  artboard.addEventListener('click', colorCell)
  mouse.down(artboard, 'add', ()=> artData.draw = true)
  mouse.up(artboard, 'add', ()=> artData.draw = false)
  mouse.move(artboard, 'add', e => continuousDraw(e, colorCell))
  mouse.leave(artboard, 'add', ()=> {
    artData.draw = false
    artData.cursor = null
  })
  mouse.enter(artboard, 'add', ()=> artData.cursor = 'artboard')

  overlay.addEventListener('click', e => createSelectBox(e))


  window.addEventListener('mousemove', e =>{
    const { cellD, gridWidth } = artData
    const { left, top } = artboard.getBoundingClientRect()
    const pos = artData.cursor === 'artboard' 
      ? { 
          x: drawPos(e, cellD).x - cellD + left, 
          y: drawPos(e, cellD).y - cellD + top 
        }
      : { x: e.pageX, y: e.pageY }
    
    styleTarget({
      target: elements.cursor,
      x: pos.x + (2 * gridWidth),
      y: pos.y + (2 * gridWidth),
      w: cellD - gridWidth,
      h: cellD - gridWidth,
    })
  })

  const query = window.location.hash
  if (query){
    const queryArray = query.split('#')
    input.column.value = queryArray[1] || 10
    input.row.value = queryArray[2] || 10
    input.cellD.value = queryArray[3] || 20

    Object.assign(artData, {
      column: +input.column.value, row: +input.row.value, cellD: +input.cellD.value
    })
  }
  
  resetCodes()
  resize()
  
  window.addEventListener('mousemove', e =>{
    const { cellD, column } = artData
    const { x, y } = drawPos(e, cellD)
    const index = ((y / cellD - 1) * column) + x / cellD - 1
    input.svg.value = `index:${index} / x:${(x - cellD) / cellD + 1} / y:${(y - cellD) / cellD + 1} / ${x} | ${y} `
  })

}

window.addEventListener('DOMContentLoaded', init)
