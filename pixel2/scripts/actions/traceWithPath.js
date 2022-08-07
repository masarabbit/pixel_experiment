
import { fillArea } from '../actions/grid.js'
import { artData } from '../state.js'
import { input, body, artboard } from '../elements.js'
import { styleTarget } from '../actions/utils.js'
import { drawPathWithCoords } from './drawPath.js'

// TODO coords aren't in the right order, and too many coordinates get selected.

const traceWithPath = () => {
  const distance = 1
  const pathData = []
  const { column, row } = artData 
  const stroke = 'blue'
  const strokeWidth = 0.1
  let arr
  let coords = []

  const checkPoints = path => {
    for (let x = 0; x < column; x++) {
      for (let y = 0; y < row; y++) {
        if (y > 0) {
          if (arr[x + (y * column)] !== arr[x + ((y - 1) * column)]) path.push([distance * x, distance * y])
        }
      }
    }
    for (let y = 0; y < row + 1; y++) {
      for (let x = 0; x < column; x++) {
        if (x > 0) {
          if (arr[x + (y * column)] !== arr[x + (y * column) - 1] && path.some(p => p[0] !== distance * x && p[1] !== distance * y)) path.push([distance * x, distance * y])
        }
      }
    }
  }

  const mark = (x, y) =>{
    const marker = document.createElement('div')
    marker.classList.add('marker')
    console.log('trigger', x, y)
    marker.setAttribute('xy', `${x}-${y}`)
    body.append(marker)
    const { top, left } = artboard.getBoundingClientRect()
    styleTarget({
      target: marker,
      x: (x * 20) + left, 
      y: (y * 20) + top
    })
  }

  const convertToSvg = colors =>{  
    // changed this to while loop to avoid exceeding maximum call limit
    while (colors.some(c => c !== '')) {
      const currentColor = colors.find(c => c !== '')
      const first = colors.indexOf(currentColor) //first index
      // isolating area to trace (area with same color, but connected)
      const areaToTrace = fillArea({
        colors, 
        i: first, 
        valueToCheck: currentColor, 
      })
      arr = colors.map((c, i) => areaToTrace.some(a => a === i) ? c : '')
      const path = []   
      console.log(path)
      checkPoints(path)
      coords = [...coords,...path]
      pathData.push(`<path fill="none" d="${drawPathWithCoords(path)}" stroke="${currentColor}" stroke-width="${strokeWidth}"/>`)

      //* removing traced area
      // when only one square is being traced, area to be traced doesn't get overwritten, so needed to reset it to [], 
      // and check below if it has been updated
      //TODO may not need this workaround when the areaToTrace/fill bucket logic is changed
      colors = areaToTrace.length 
        ? colors.map((c, i)=> areaToTrace.indexOf(i) === -1 ? c : '')
        : colors.map((c, i)=> i === first ? '' : c )
    }
  }
  // TODO at this point, can flag transparent so it can be replaced with something
  // need something like evenodd to enable having transparent inside
  const colors = input.colors.value.split(',').map(c => c === 'transparent' ? '' : c)
  convertToSvg(colors)
  
  coords.forEach(coord => mark(coord[0], coord[1]))
  // TODO perhaps remove redundant space at this point
  input.svg.value = pathData.join(' ').replaceAll('ffffff','fff').replaceAll('000000','000')
}

export default traceWithPath

