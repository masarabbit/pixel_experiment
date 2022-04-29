import { artboard, elements, input }  from './elements.js'
import { styleTarget, mouse, nearestN } from './actions/utils.js'
import { drawData } from './drawData.js'
import { continuousDraw, drawSquare } from './actions/draw.js'
import { resize } from './actions/grid.js'

function init() {
  

  // const updateCodesDisplay = (box, arr) =>{
  //   box.value = `${arr.map(ele => ele).join(',')}`
  //   populatePalette(0, arr)
  // }

  const resetCodes = () =>{
    drawData.codes[0] = new Array(drawData.row * drawData.column).fill('transparent')
    input.codes[0].value = drawData.codes[0]
  }

  Object.keys(input).forEach(key =>{
    input[key].length 
    ? input[key].forEach(k =>{
      k.addEventListener('change', e =>{
        drawData[k] = +e.target.value
        resize()
      })
    })
    : input[key].addEventListener('change', e =>{
      drawData[key] = +e.target.value
      resize()
    })
  })


  elements.buttons.forEach(b =>{
    const addClickEvent = (className, event) => b.classList.contains(className) && b.addEventListener('click', event)
    addClickEvent('resize', ()=>{
      resize()
      resetCodes()
    })
  })

  artboard.addEventListener('click', drawSquare)
  mouse.down(artboard, 'add', ()=> drawData.draw = true)
  mouse.up(artboard, 'add', ()=> drawData.draw = false)
  mouse.move(artboard, 'add', e => continuousDraw(e, drawSquare))
  mouse.leave(artboard, 'add', ()=> {
    drawData.draw = false
    drawData.cursor = null
  })
  mouse.enter(artboard, 'add', ()=> drawData.cursor = 'artboard')

  

  //TODO needs adjusting - highight square
  window.addEventListener('mousemove', e =>{
    const { cellD } = drawData
    
    const pos = drawData.cursor === 'artboard' 
      // ? { x: nearestN(e.pageX, cellD) - (cellD / 2 - 0.5), y: nearestN(e.pageY, cellD) - (cellD / 2 + 1)} 
      ? { x: nearestN(e.pageX, cellD - 0.5), y: nearestN(e.pageY, cellD - 0.5)} 
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
  
  resetCodes()
  resize()

}

window.addEventListener('DOMContentLoaded', init)
