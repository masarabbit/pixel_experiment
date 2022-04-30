import { artboard, elements, input, aCtx }  from './elements.js'
import { styleTarget, mouse, nearestN, resizeCanvas, copyText } from './actions/utils.js'
import { artData } from './state.js'
import { continuousDraw, drawSquare, paintCanvas, flipImage } from './actions/draw.js'
import { resize } from './actions/grid.js'
import { updateColor, hex, rgbToHex } from './actions/colours.js'

// TODO fill bucket
// TODO copy
// TODO trace
// TODO erase
// TODO undo
// TODO download
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
      artData.colors.length = 0
      const offset = Math.floor(cellD / 2)
      for (let i = 0; i < row * column; i++) {
        const x = i % column * cellD
        const y = Math.floor(i / column) * cellD
        const c = aCtx.getImageData(x + offset, y + offset, 1, 1).data //!offset
        // this thing included here to prevent rendering black instead of transparent
        c[3] === 0
          ? artData.colors.push('transparent')
          : artData.colors.push(hex(rgbToHex(c[0], c[1], c[2])))
      }
      paintCanvas()
    }
    imageTarget.src = blobURL
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
  })

  artboard.addEventListener('click', drawSquare)
  mouse.down(artboard, 'add', ()=> artData.draw = true)
  mouse.up(artboard, 'add', ()=> artData.draw = false)
  mouse.move(artboard, 'add', e => continuousDraw(e, drawSquare))
  mouse.leave(artboard, 'add', ()=> {
    artData.draw = false
    artData.cursor = null
  })
  mouse.enter(artboard, 'add', ()=> artData.cursor = 'artboard')


  //TODO needs adjusting - highight square
  window.addEventListener('mousemove', e =>{
    const { cellD } = artData
    
    const pos = artData.cursor === 'artboard' 
      ? { x: nearestN(e.pageX, cellD) - (cellD / 2), y: nearestN(e.pageY, cellD) - (cellD / 2)} 
      // ? { x: nearestN(e.pageX, cellD - 0.5), y: nearestN(e.pageY, cellD - 0.5)} 
      // ? drawPos(e, cellD)
      : { x: e.pageX, y: e.pageY }

    styleTarget({
      target: elements.cursor,
      x: pos.x, 
      y: pos.y,
      w: cellD,
      h: cellD,
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

}

window.addEventListener('DOMContentLoaded', init)
