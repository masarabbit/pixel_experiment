import { artboard, elements, input, aCtx, overlay }  from './elements.js'
import { styleTarget, mouse, nearestN, calcX, calcY, update } from './actions/utils.js'
import { artData } from './state.js'
import { paintCanvas, drawPos, paintFromColors } from './actions/draw.js'
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

  const mode = arr => {
    return arr.sort((a,b) =>
          arr.filter(v => v===a).length
        - arr.filter(v => v===b).length
    ).pop()
  }  
  const surroundingCells = (arr, i) =>{
    const { column } = artData
    // const param = [1, column + 1, column - 1,  -1, column, -column, -column + 1, -column -1]
    const param = [1, -1, -column, column]
    return param.map(p => arr[i + p]).filter(v => v)
  }

  const degToRad = deg => deg / (180 / Math.PI)
  
  //* this versions renders by rotating each cell, and filling any missing cells based on the most common color used in the surrounding cell
  const oldRotate = () =>{
    artData.rotatedColors.length = 0
    const { cellD, colors, angle, column, row } = artData
    const a = degToRad(angle)
  
    const origin = {
      x: Math.floor(column / 2),
      y: Math.ceil(row / 2),
      offset: (column * Math.floor(column / 2)) - (Math.ceil(row / 2) + 1)
    }

    const initialRender = []
    
    colors.forEach((_ele, i)=>{
      const x = calcX(i)
      const y = calcY(i)
      // 　x' = (cosθ * (x - x0) - (sinθ * (y - y0)
      // 　y’ = sinθ * (x - x0) + (cosθ * y - y0)
      // (x0, y0) = origin
      const newX = Math.round((Math.cos(a) * (x - origin.x)) - (Math.sin(a) * (y - origin.y)))
      const newY = Math.round((Math.sin(a) * (x - origin.x)) + (Math.cos(a) * (y - origin.y)))
      // offset index of center
      const index = (newY * column) + newX + origin.offset //eg. 495 in the case of (16, 16)
      initialRender[index] = colors[i]
    }) 
    colors.forEach((_, i) => {
      artData.rotatedColors[i] = initialRender[i] || mode(surroundingCells(initialRender, i))  
    })
    aCtx.clearRect(0, 0, column * cellD, row * cellD)
    paintFromColors({
      ctx: aCtx,
      colors: artData.rotatedColors
    })
  }



  

  // TODO edge carries over
  const rotate = () =>{
    artData.rotatedColors.length = 0
    const { cellD, colors, angle, column, row } = artData
    const a = -degToRad(angle)
    const origin = {
      x: Math.round(column / 2),
      y: Math.round(row / 2),
      offset: Math.round((column * (column / 2)) - ((row / 2) + 1))
    }
    // TODO change center of rotation
    // const origin = {
    //   x: 20,
    //   y: 20,
    //   offset: (column * 20) - (20 + 1),
    // }
    // how much to offset
    // 90   1 (1 + 0)
    // 180  0 (0 + 0)
    // 270  8 (0 + 8)
    // 0, 360  9 (1 + 8)
    const adjust = [column + 1, 1, 0, column, column + 1]
    const test = []
    const indexes = colors.map((_ele, i) => {
      const x = calcX(i)
      const y = calcY(i)
      const newX = Math.round((Math.cos(a) * (x - origin.x)) - (Math.sin(a) * (y - origin.y)))
      const newY = Math.round((Math.sin(a) * (x - origin.x)) + (Math.cos(a) * (y - origin.y)))
      const index = (newY * column) + newX + origin.offset + adjust[Math.round(angle / 90)]
      test.push(`${i} | r:${index} | x:${newX} | y:${newY} | ${(newY * column) + newX } | ${origin.offset} \n`)
      return index
    }) 
  
    artData.rotatedColors = indexes.map(i => colors[i])
    aCtx.clearRect(0, 0, column * cellD, row * cellD)
    paintFromColors({
      ctx: aCtx,
      colors: artData.rotatedColors
    })
    // input.svg.value = `${origin.x} | ${origin.y} | ${origin.offset}`
    input.svg.value = test
  }
  

  elements.buttons.forEach(b =>{
    const addClickEvent = (className, event) => b.classList.contains(className) && b.addEventListener('click', event)
    addClickEvent('rotate', ()=> {
      // setInterval(()=>{
      //   update('angle', artData.angle + 1)
      //   if (artData.angle > 359) update('angle', 0)
      //   rotate()
      // }, 10)
      rotate()
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



// tried to get area inside square with this but didn't work:
// https://stackoverflow.com/questions/2752725/finding-whether-a-point-lies-inside-a-rectangle-or-not

// function pointInRectangle(m, r) {
//   var AB = vector(r.A, r.B);
//   var AM = vector(r.A, m);
//   var BC = vector(r.B, r.C);
//   var BM = vector(r.B, m);
//   var dotABAM = dot(AB, AM);
//   var dotABAB = dot(AB, AB);
//   var dotBCBM = dot(BC, BM);
//   var dotBCBC = dot(BC, BC);
//   return 0 <= dotABAM && dotABAM <= dotABAB && 0 <= dotBCBM && dotBCBM <= dotBCBC;
// }

// function vector(p1, p2) {
//   return {
//           x: (p2.x - p1.x),
//           y: (p2.y - p1.y)
//   };
// }

// function dot(u, v) {
//   return u.x * v.x + u.y * v.y; 
// }

// if (!pointInRectangle(
// {x: calcX(i), y: calcY(i)},
// {
//   A: {x: calcX(indexes[0]), y: calcY(indexes[0]) },
//   B: {x: calcX(indexes[column - 1]), y: calcY(indexes[0])},
//   C: {x: calcX(indexes[0]), y: calcY(indexes[column - 1])},
//   D: {x: calcX(indexes[column - 1]), y: calcY(indexes[column - 1])},
// }
// )) return 'transparent'