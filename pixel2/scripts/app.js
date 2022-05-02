import { artboard, elements, input, aCtx, overlay }  from './elements.js'
import { styleTarget, mouse, resizeCanvas, copyText, update } from './actions/utils.js'
import { artData } from './state.js'
import { continuousDraw, colorCell, paintCanvas, flipImage, drawPos, copyColors, downloadImage, updateCode } from './actions/draw.js'
import { resize, grid } from './actions/grid.js'
import { updateColor } from './actions/colors.js'
import { createSelectBox, copySelection, paste, select } from './actions/select.js'
import traceSvg from '../scripts/actions/traceSvg.js'


// TODO undo - logic added, updateCode needs to be added.
// TODO edit codes when column or row is edited
// TODO add cursor icon edit
// TODO represent transparent as t?
// TODO break new Array(width * (h / cellD)).fill('') this out to function?


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
        document.querySelector('.upload_file_name').innerHTML = artData.uploadedFile.name
        document.querySelector('.pixelise').classList.remove('display_none')
      } else if (key === 'colors') {
        artData.colors = e.target.value.split(',')
      } else {
        if ( artData[key]) {
          // column, row and cellD
          artData[key] = +e.target.value
          resize()
          paintCanvas()
        }
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
      copyColors({
        w: column, h: row, 
        ctx: aCtx, 
        data: artData.colors
      })
      input.colors.value = artData.colors
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

  
  const undo = () =>{
    console.log('undo')
    // input[key].value = value
    // artData[key] = value

    // console.log('prev check', prev[prev.length - 1])
    if (!artData.prev[artData.prev.length - 1]) return
    const { colors: newData, row: newRow, column: newColumn,  cellD: newCellD } = artData.prev[artData.prev.length - 1]
    // console.log('newData', newData)
    update('column', newColumn)
    update('row', newRow)
    update('colors', newData)
    update('cellD', newCellD)
    resize()
    // input.colors.value = newData
    // input.row.value = newRow
    // input.column.value = newColumn
    // input.cellD.value = newCellD
    // artData.colors = newData

    // Object.assign(artData, { 
    //   column: newColumn, row: newRow, cellD: newCellD 
    // })
    paintCanvas()
    // generateFromColorCode()

    artData.prev = artData.prev.filter((_data, i)=>{
      return i !== artData.prev.length - 1
    })
    if (!artData.prev.length) updateCode()
  }

  elements.buttons.forEach(b =>{
    const addClickEvent = (className, event) => b.classList.contains(className) && b.addEventListener('click', event)
    addClickEvent('create_grid', ()=>{
      resize()
      paintCanvas()
      resetCodes()
    })
    addClickEvent('pixelise', output)
    addClickEvent('copy', e => copyText(input[e.target.dataset.code]))
    addClickEvent('generate', paintCanvas)
    addClickEvent('flip', e => flipImage(e.target.dataset.dir))
    addClickEvent('fill', e => triggerFill(e))
    addClickEvent('clear', e => {
      e.target.classList.toggle('active')
      artData.erase = !artData.erase 
    })
    addClickEvent('select', select)
    addClickEvent('copy_selection', copySelection)
    addClickEvent('cut_selection', ()=> copySelection({ cut: true }))
    addClickEvent('paste_selection', paste)
    addClickEvent('grid_display', ()=> {
      grid[!artData.grid ? 'draw' : 'clear']()
      overlay.classList.toggle('hide')
      artData.grid = !artData.grid
    })
    addClickEvent('crop_selection', ()=> copySelection({ crop: true }))
    addClickEvent('download', ()=>{
      paintCanvas()
      downloadImage()
    })
    addClickEvent('trace_svg', traceSvg)
    addClickEvent('undo', undo)
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
    const isArtboard = artData.cursor === 'artboard' 
    const pos = isArtboard
      ? { 
          x: drawPos(e, cellD).x - cellD + left, 
          y: drawPos(e, cellD).y - cellD + top 
        }
      : { x: e.pageX, y: e.pageY }
    elements.cursor.classList[isArtboard ? 'add' : 'remove']('highlight')
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
  paintCanvas()
  updateCode()
  
  // window.addEventListener('mousemove', e =>{
  //   const { cellD, column } = artData
  //   const { x, y } = drawPos(e, cellD)
  //   const index = ((y / cellD - 1) * column) + x / cellD - 1
  //   input.svg.value = `index:${index} / x:${(x - cellD) / cellD + 1} / y:${(y - cellD) / cellD + 1} / ${x} | ${y} `
  // })
  elements.alts.forEach(button=>{
    mouse.enter(button, 'add', e => {
      elements.cursor.childNodes[0].innerHTML = e.target.dataset.alt
    })
    mouse.leave(button, 'add', () => {
      elements.cursor.childNodes[0].innerHTML = ''
    })
  })
}

window.addEventListener('DOMContentLoaded', init)
