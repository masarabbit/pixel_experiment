
import { checkAreaToFill } from '../actions/draw.js'

import { artData } from '../state.js'
import { input } from '../elements.js'



const traceSvg = () =>{
  const pathData = []
  const areaToTrace = []
  const { column } = artData 
  const w = 1
  const direction = [ 1, +column, -1, -column ] // move right, down, left, up
  const checkDirection = [ -column, +1, +column, -1 ] // check up, left, down, left of current cell

  // switches distance to move depending on which way the line is going.
  // corresponds to right, down, left, up
  const directionFactor = [ 1, 1, -1, -1 ] 
  const indexPattern = [0, 1, 2, 3, 0, 1, 2, 3]

  //? values which needs reset for each trace
  let arr
  let first
  let x
  let y
  let d
  let letter
  let dirIndex
  const checkedIndex = []
  let initialX
  let initialY
  let stop

  const recordTraceData = (dirIndexToCheck, index) =>{
    //TODO since transparent is converted to '', perhaps no longer need to check for it.
    if (stop) return 
    if (dirIndex === dirIndexToCheck && 
      (arr[index + checkDirection[dirIndex]] === 'transparent' || // cell in the  check direction is not filled
      !arr[index + checkDirection[dirIndex]] || // cell in the check direction is the edge

      // below added to ensure trace don't continue on from right edge to left edge
      ((dirIndex === 1) && arr[index + 1] !== 'transparent' && index % column === column - 1) || 
      ((dirIndex === 3) && arr[index - 1] !== 'transparent' && index % column === 0)
      )){

      // prevents same direction being checked twice.
      if (checkedIndex.some(d => d === dirIndexToCheck)) return
      checkedIndex.push(dirIndexToCheck)

      const distance = 1
      const distanceToMove = distance * directionFactor[dirIndex]
      if (d[d.length - 1].split(' ')[0] === letter){
        //* this increases distance to move if previous letter was the same (ie combines 'h1 h1' to 'h2')
        d[d.length - 1] = `${letter} ${+d[d.length - 1].split(' ')[1] + distanceToMove}`
      } else {
        d.push(`${letter} ${distanceToMove}`)
      }
      
      if (letter === 'h') initialX += distanceToMove
      if (letter === 'v') initialY += distanceToMove
      if (initialX === x * w && initialY === y * w) stop = true
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
    while (processedCodes.filter(code => code !== '').length) {
      //first index
      const currentColor = processedCodes.find(cell => cell !== '')
      first = processedCodes.indexOf(currentColor) 

      //* isolating area to trace (area with same color, but connected)
      areaToTrace.length = 0

      checkAreaToFill({
        codeRef: processedCodes, 
        i: first, 
        valueToCheck: currentColor, 
        areaToFill: areaToTrace,
      })
      arr = processedCodes.map((code, i) => areaToTrace.some(a => a === i) ? code : '')

      x = first % column
      y = Math.floor(first / column)
      d = [`M ${x * w} ${y * w}`]   
      initialX = x * w
      initialY = y * w
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
        ? processedCodes.map((code,i)=> areaToTrace.indexOf(i) === -1 ? code : '')
        : processedCodes.map((code,i)=> i === first ? '' : code )
    }
  }

  const processedCodes = input.codes[0].value.split(',').map(code =>{
    return code === 'transparent' ? '' : code
  })
  // console.log('processedCodes',processedCodes)
  convertToSvg(processedCodes)

  // put in to compress
  // codesBox[1].value = pathData.join(' ').replaceAll('<path d="M','D').replaceAll('<path fill="#ffffff" d="M','F').replaceAll('/>','/').replaceAll('-1','N').replaceAll('-2','T').replaceAll(' v ','v').replaceAll(' h ','h').replaceAll('<path fill="#000000" d="M','D')

  input.codes[1].value = pathData.join(' ').replaceAll('ffffff','fff').replaceAll('000000','000')
}

export default traceSvg