
import { checkAreaToFill } from '../actions/grid.js'
import { artData } from '../state.js'
import { input } from '../elements.js'
import { calcX, calcY } from '../actions/utils.js'

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

// const initial = { x: 0, y: 0 }

const isEmpty = value => value === 'transparent'

const traceSvg = () => {
  const pathData = []
  const areaToTrace = []
  const { column } = artData 
  const direction = [ 1, +column, -1, -column ] // move right, down, left, up
  const checkDirection = [ -column, 1, +column, -1 ] // check up, left, down, left of current cell

  // switches distance to move depending on which way the line is going.
  // corresponds to right, down, left, up
  const directionFactor = [ 1, 1, -1, -1 ] 
  const indexPattern = [0, 1, 2, 3, 0, 1, 2, 3]

  //? values which needs reset for each trace
  const checkedIndex = []
  const pos = { x:0, y:0,}
  const initial = { x:0, y:0 }
  let arr
  let d
  let letter
  let dirIndex
  let stop
  // const stop = (initial, pos) => initial.x === pos.x && initial.y === pos.y //! stops too early

  const recordTraceData = (dirIndexToCheck, index) =>{
    //TODO since transparent is converted to '', perhaps no longer need to check for it.
    if (stop) return 
    if (dirIndex === dirIndexToCheck && 
      (isEmpty(arr[index + checkDirection[dirIndex]]) || // cell in the  check direction is not filled
      !arr[index + checkDirection[dirIndex]] || // cell in the check direction is the edge

      // below added to ensure trace don't continue on from right edge to left edge
      ((dirIndex === 1) && !isEmpty(arr[index + 1]) && index % column === column - 1) || 
      ((dirIndex === 3) && !isEmpty(arr[index - 1]) && index % column === 0)
      )){

      // prevents same direction being checked twice.
      if (checkedIndex.some(d => d === dirIndexToCheck)) return
      checkedIndex.push(dirIndexToCheck)

      const distanceToMove = directionFactor[dirIndex]
      if (d[d.length - 1].split(' ')[0] === letter){
        //* this increases distance to move if previous letter was the same (ie combines 'h1 h1' to 'h2')
        d[d.length - 1] = `${letter} ${+d[d.length - 1].split(' ')[1] + distanceToMove}`
      } else {
        d.push(`${letter} ${distanceToMove}`)
      }
      
      if (letter === 'h') initial.x += distanceToMove
      if (letter === 'v') initial.y += distanceToMove
      if (initial.x === pos.x && initial.y === pos.y) stop = true
      dirIndex = dirIndex === 3 ? 0 : dirIndex + 1
      letter = letter === 'h' ? 'v' : 'h'
    }
  }

  const trace = index =>{
    let traceIndex = index
    
    while (!stop){
      indexPattern.forEach(i => recordTraceData(i, traceIndex))

      checkedIndex.length = 0
      dirIndex = dirIndex === 0 ? 3 : dirIndex - 1
      letter = letter === 'h' ? 'v' : 'h'
      traceIndex = traceIndex += direction[dirIndex] // moves to next cell to trace
    }
  }

  const convertToSvg = processedCodes =>{  

    //* changed this to while loop to avoid exceeding maximum call limit
    while (processedCodes.some(code => code !== '')) {
      //first index
      const currentColor = processedCodes.find(cell => cell !== '')
      const first = processedCodes.indexOf(currentColor) 

      //* isolating area to trace (area with same color, but connected)
      areaToTrace.length = 0

      checkAreaToFill({
        codeRef: processedCodes, 
        i: first, 
        valueToCheck: currentColor, 
        areaToFill: areaToTrace,
      })

      arr = processedCodes.map((code, i) => areaToTrace.some(a => a === i) ? code : '')
      Object.assign(pos, { x: calcX(first), y: calcY(first) })
      d = [`M ${pos.x} ${pos.y}`]   
      initial.x = pos.x
      initial.y = pos.y
      letter = 'h'
      dirIndex = 0
      checkedIndex.length = 0
      stop = false
      trace(first)
      //* recording traced area

      pathData.push(`<path fill="${currentColor}" d="${d.join(' ')}"/>`)

      //* removing traced area
      // when only one square is being traced, area to be traced doesn't get overwritten, so needed to reset it to [], and check below if it has been updated
      //TODO may not need this workaround when the areaToTrace/fill bucket logic is changed
      processedCodes = areaToTrace.length 
        ? processedCodes.map((code, i)=> areaToTrace.indexOf(i) === -1 ? code : '')
        : processedCodes.map((code, i)=> i === first ? '' : code )
    }
  }

  const processedCodes = input.colors.value.split(',').map(code =>{
    return code === 'transparent' ? '' : code
  })
  convertToSvg(processedCodes)

  // put in to compress
  // codesBox[1].value = pathData.join(' ').replaceAll('<path d="M','D').replaceAll('<path fill="#ffffff" d="M','F').replaceAll('/>','/').replaceAll('-1','N').replaceAll('-2','T').replaceAll(' v ','v').replaceAll(' h ','h').replaceAll('<path fill="#000000" d="M','D')
  
  // TODO perhaps remove redundant space at this point
  input.svg.value = pathData.join(' ').replaceAll('ffffff','fff').replaceAll('000000','000')
}

export default traceSvg