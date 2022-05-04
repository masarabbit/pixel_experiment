
import { fillArea } from '../actions/grid.js'
import { artData } from '../state.js'
import { input } from '../elements.js'
import { calcX, calcY } from '../actions/utils.js'

const isEmpty = value => value === 'transparent'

const traceSvg = () => {
  const pathData = []
  const { column } = artData 
  const direction = [ 1, column, -1, -column ] // move right, down, left, up
  const checkDirection = [ -column, 1, column, -1 ] // check up, left, down, left of current cell
  const directionFactor = [ 1, 1, -1, -1 ]  // switches distance to move depending on which way the line is going.
  const indexPattern = [0, 1, 2, 3, 0, 1, 2, 3]
  const letters = ['h', 'v', 'h', 'v']
  //? values which needs reset for each trace
  const checkedIndex = []
  const pos = { x:0, y:0, h:0, v:0 }
  let arr
  let cI
  let proceed
  

  const checkSurroundingCells = (arr, index, cI) => {
    return !arr[index + checkDirection[cI]] || // cell in the check direction is the edge
    // below added to ensure trace don't continue on from right edge to left edge
    (cI === 1 && index % column === column - 1) || 
    (cI === 3 && index % column === 0)
  }

  const recordTraceData = (cItoCheck, index, path) =>{
    // prevents same direction being checked twice.
    if (proceed && !checkedIndex.some(i => i === cItoCheck) && checkSurroundingCells(arr, index, cI)){
      const distanceToMove = directionFactor[cI]
      const prev = path.length - 1
      checkedIndex.push(cItoCheck)
      // increases distance to move if previous letter was the same (ie combines 'h1 h1' to 'h2')
      path[prev].split(' ')[0] === letters[cI]
        ? path[prev] = `${letters[cI]} ${+path[prev].split(' ')[1] + distanceToMove}`
        : path.push(`${letters[cI]} ${distanceToMove}`)
      
      pos[letters[cI]] += distanceToMove
      if (pos.h === pos.x && pos.v === pos.y) proceed = false
      cI = cI === 3 ? 0 : cI + 1
    }
  }

  const trace = (index, path) =>{
    while (proceed){
      indexPattern.forEach(i => recordTraceData(i, index, path))

      checkedIndex.length = 0
      cI = cI === 0 ? 3 : cI - 1
      index = index += direction[cI] // moves to next cell to trace
    }
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
      Object.assign(pos, { x: calcX(first), h: calcX(first), y: calcY(first), v: calcY(first) })
      const path = [`M ${pos.x} ${pos.y}`]   
      cI = 0
      checkedIndex.length = 0
      proceed = true
      trace(first, path) // recording traced area

      pathData.push(`<path fill="${currentColor}" d="${path.join(' ')}"/>`)

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

  // TODO perhaps remove redundant space at this point
  input.svg.value = pathData.join(' ').replaceAll('ffffff','fff').replaceAll('000000','000')
}

export default traceSvg


// possible refactor

// const check = [
//   {
//     moveDir: 1,
//     checkDir: -column,
//     dirFactor: 1,
//     letter: 'h',
//   },
//   {
//     moveDir: column,
//     checkDir: 1,
//     dirFactor: 1,
//     letter: 'x',
//   },
//   {
//     moveDir: -1,
//     checkDir: column,
//     dirFactor: -1,
//     letter: 'h',
//   },
//   {
//     moveDir: -column,
//     checkDir: -1,
//     dirFactor: -1,
//     letter: 'x',
//   },
// ]


  //? since transparent is converted to '', removed isEmpty check
  // const checkSurroundingCells = (arr, index, cI) => {
  //   return isEmpty(arr[index + checkDirection[cI]]) || // cell in the  check direction is not filled
  //   !arr[index + checkDirection[cI]] || // cell in the check direction is the edge
  //   // below added to ensure trace don't continue on from right edge to left edge
  //   (cI === 1 && !isEmpty(arr[index + 1]) && index % column === column - 1) || 
  //   (cI === 3 && !isEmpty(arr[index - 1]) && index % column === 0)
  // }