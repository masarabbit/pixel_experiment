
import { checkAreaToFill } from '../actions/grid.js'
import { artData } from '../state.js'
import { input } from '../elements.js'
import { calcX, calcY } from '../actions/utils.js'

const isEmpty = value => value === 'transparent'

const traceSvg = () => {
  const pathData = []
  const areaToTrace = []
  const { column } = artData 
  const direction = [ 1, column, -1, -column ] // move right, down, left, up
  const checkDirection = [ -column, 1, column, -1 ] // check up, left, down, left of current cell
  const directionFactor = [ 1, 1, -1, -1 ]  // switches distance to move depending on which way the line is going.
  const indexPattern = [0, 1, 2, 3, 0, 1, 2, 3]
  //? values which needs reset for each trace
  const checkedIndex = []
  const pos = { x:0, y:0, h:0, v:0 }
  let arr
  let letter
  let dirIndex
  let proceed

  const checkSurroundingCells = (arr, index, dirIndex) => {
    return isEmpty(arr[index + checkDirection[dirIndex]]) || // cell in the  check direction is not filled
    !arr[index + checkDirection[dirIndex]] || // cell in the check direction is the edge
    // below added to ensure trace don't continue on from right edge to left edge
    (dirIndex === 1 && !isEmpty(arr[index + 1]) && index % column === column - 1) || 
    (dirIndex === 3 && !isEmpty(arr[index - 1]) && index % column === 0)
  }

  const recordTraceData = (dirIndexToCheck, index, path) =>{
    //TODO since transparent is converted to '', perhaps no longer need to check for it.
    // prevents same direction being checked twice.
    if ( proceed && !checkedIndex.some(i => i === dirIndexToCheck) && checkSurroundingCells(arr, index, dirIndex) ){
      const distanceToMove = directionFactor[dirIndex]
      const prev = path.length - 1
      checkedIndex.push(dirIndexToCheck)
      // increases distance to move if previous letter was the same (ie combines 'h1 h1' to 'h2')
      path[prev].split(' ')[0] === letter
        ? path[prev] = `${letter} ${+path[prev].split(' ')[1] + distanceToMove}`
        : path.push(`${letter} ${distanceToMove}`)
      
      pos[letter] += distanceToMove
      if (pos.h === pos.x && pos.v === pos.y) proceed = false
      dirIndex = dirIndex === 3 ? 0 : dirIndex + 1
      letter = letter === 'h' ? 'v' : 'h'
    }
  }

  const trace = (index, path) =>{
    while (proceed){
      indexPattern.forEach(i => recordTraceData(i, index, path))

      checkedIndex.length = 0
      dirIndex = dirIndex === 0 ? 3 : dirIndex - 1
      letter = letter === 'h' ? 'v' : 'h'
      index = index += direction[dirIndex] // moves to next cell to trace
    }
  }

  const convertToSvg = colors =>{  
    // changed this to while loop to avoid exceeding maximum call limit
    while (colors.some(code => code !== '')) {
      const currentColor = colors.find(cell => cell !== '')
      const first = colors.indexOf(currentColor) //first index
      areaToTrace.length = 0 // isolating area to trace (area with same color, but connected)

      checkAreaToFill({
        colors, 
        i: first, 
        valueToCheck: currentColor, 
        areaToFill: areaToTrace,
      })
      arr = colors.map((code, i) => areaToTrace.some(a => a === i) ? code : '')
      Object.assign(pos, { x: calcX(first), h: calcX(first), y: calcY(first), v: calcY(first) })
      const path = [`M ${pos.x} ${pos.y}`]   
      letter = 'h'
      dirIndex = 0
      checkedIndex.length = 0
      proceed = true
      trace(first, path) // recording traced area

      pathData.push(`<path fill="${currentColor}" d="${path.join(' ')}"/>`)

      //* removing traced area
      // when only one square is being traced, area to be traced doesn't get overwritten, so needed to reset it to [], and check below if it has been updated
      //TODO may not need this workaround when the areaToTrace/fill bucket logic is changed
      colors = areaToTrace.length 
        ? colors.map((code, i)=> areaToTrace.indexOf(i) === -1 ? code : '')
        : colors.map((code, i)=> i === first ? '' : code )
    }
  }
  const colors = input.colors.value.split(',').map(code => isEmpty(code) ? '' : code)
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
//     dirFactor: 1
//   },
//   {
//     moveDir: +column,
//     checkDir: 1,
//     dirFactor: 1
//   },
//   {
//     moveDir: -1,
//     checkDir: +column,
//     dirFactor: -1
//   },
//   {
//     moveDir: -column,
//     checkDir: -1,
//     dirFactor: -1
//   },
// ]
