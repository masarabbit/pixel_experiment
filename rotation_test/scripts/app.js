import { artboard, elements, input, aCtx, overlay }  from './elements.js'
import { styleTarget, mouse, resizeCanvas, copyText, update, calcX, calcY } from './actions/utils.js'
import { artData } from './state.js'
import { paintCanvas, drawPos, paintFromColors } from './actions/draw.js'
import { resize, grid, updateColors } from './actions/grid.js'
import { updateColor } from './actions/colors.js'


// 　x' = x cosθ - y sinθ
// 　y’ = x sinθ + y cosθ

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
        if (artData[key] !== null) {
          // column, row and cellD
          updateColors[key] && updateColors[key]()
          artData[key] = +e.target.value
          resize()
          paintCanvas()
          
        }
      }
    })
  })

  const degToRad = deg => deg / (180 / Math.PI)
  
  const rotate = () =>{
    console.log('trigger')
    artData.rotatedColors.length = 0
    const { cellD, colors, angle, column, row } = artData
    const a = degToRad(angle)
  

    const origin = {
      x: column / 2,
      y: row / 2
    }

    const indexs = []
    
    colors.forEach((_ele, i)=>{
      const x = calcX(i)
      const y = calcY(i)

      // 　x' = (cosθ * (x - x0) - (sinθ * (y - y0)
      // 　y’ = sinθ * (x - x0) + (cosθ * y - y0)
      // (x0, y0) = origin

      const newX = Math.round((Math.cos(a) * (x - origin.x)) - (Math.sin(a) * (y - origin.y)))
      const newY = Math.round((Math.sin(a) * (x - origin.x)) + (Math.cos(a) * (y - origin.y)))
  
      // subtract index of center
      const offset = (column * (column / 2)) - (row / 2 + 1) //eg. 495 in the case of (16, 16)
      const index = (newY * column) + newX + offset
  
      // console.log(index, newX, newY)
      artData.rotatedColors[index] = colors[i]
    })
    aCtx.clearRect(0, 0, column * cellD, row * cellD)
    paintFromColors({
      ctx: aCtx,
      colors: artData.rotatedColors
    })
    input.svg.value = indexs
  }
  

  elements.buttons.forEach(b =>{
    const addClickEvent = (className, event) => b.classList.contains(className) && b.addEventListener('click', event)
    addClickEvent('rotate', ()=> {
      setInterval(()=>{
        update('angle', artData.angle + 1)
        if (artData.angle > 359) update('angle', 0)
        rotate()
      }, 50)
      // rotate()
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

  // window.addEventListener('mousemove', e =>{
  //   const { cellD, column } = artData
  //   const { x, y } = drawPos(e, cellD)
  //   const index = ((y / cellD - 1) * column) + x / cellD - 1
  //   input.svg.value = `index:${index} / x:${(x - cellD) / cellD + 1} / y:${(y - cellD) / cellD + 1} | ${x} | ${y}`
  // })

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
