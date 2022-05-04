import { artboard, elements, input, aCtx, overlay }  from './elements.js'
import { styleTarget, mouse, resizeCanvas, copyText, update } from './actions/utils.js'
import { artData } from './state.js'
import { paintCanvas, drawPos } from './actions/draw.js'
import { resize, grid, updateColors } from './actions/grid.js'
import { updateColor } from './actions/colors.js'


// TODO maybe add transparent margin to image so it's easier to test rotation

function init() {

  const resetCodes = () =>{
    artData.colors = Array(artData.row * artData.column).fill('transparent')
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
          updateColors[key] && updateColors[key]()
          artData[key] = +e.target.value
          resize()
          paintCanvas()
        }
      }
    })
  })


  // // TODO move this to draw?
  // const output = () =>{
  //   const { cellD, row, column, uploadedFile } = artData 
  //   if (!uploadedFile) return
  //   const blobURL = window.URL.createObjectURL(uploadedFile)
  //   const imageTarget = new Image()
    
  //   imageTarget.onload = () => {
  //     const { naturalWidth: w, naturalHeight: h } = imageTarget
  //     artData.calcHeight = (column * cellD) * (h / w)
  //     artData.calcWidth = artData.calcHeight * (w / h)
  //     const { calcWidth, calcHeight } = artData 
  //     resizeCanvas({
  //       canvas: artboard, 
  //       w: calcWidth, h: calcHeight - (calcHeight % cellD)
  //     })   
  //     aCtx.drawImage(imageTarget, 0, 0, calcWidth, calcHeight)
  //     copyColors({
  //       w: column, h: row, 
  //       ctx: aCtx, 
  //       data: artData.colors
  //     })
  //     // revert canvas size before painting
  //     resizeCanvas({
  //       canvas: artboard, 
  //       w: column * cellD, h: row * cellD
  //     })
  //     paintCanvas()
  //     copyColors({
  //       w: column, h: row, 
  //       ctx: aCtx, 
  //       data: artData.colors
  //     })
  //     input.colors.value = artData.colors
  //   }
  //   imageTarget.src = blobURL
  // }
  

  elements.buttons.forEach(b =>{
    const addClickEvent = (className, event) => b.classList.contains(className) && b.addEventListener('click', event)
    addClickEvent('create_grid', ()=>{
      resize()
      paintCanvas()
      resetCodes()
    })
  })
  
  mouse.leave(artboard, 'add', ()=> {
    artData.draw = false
    artData.cursor = null
  })
  mouse.enter(artboard, 'add', ()=> artData.cursor = 'artboard')

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
  
  // resetCodes()
  resize()
  paintCanvas()
  
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
