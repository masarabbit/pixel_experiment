

const svgWrapper = ( {content, color, rotate, flip, wrapper, frameNo, speed, frameSize} ) =>{
  let scale = 1
  if (flip === 'h') scale = '-1, 1'
  if (flip === 'v') scale = '1, -1'
  const size = frameSize || 16
  return `
    <div class="${wrapper}" style="transform: rotate(${rotate}deg) scale(${scale}); ">
      ${frameNo ? `<div class="svg_anim" style="width:${100 * (frameNo || 1)}%;" ${frameNo ? `data-frame_no="${frameNo}"` : ''}  ${speed ? `data-speed="${speed}"` : ''}>` : ''}
      <svg x="0px" y="0px" width="100%" height="100%" viewBox="0 0 ${size * (frameNo || 1)} ${size}" fill="${color ? color : 'black'}">${content}</svg>
      ${frameNo ? '</div>' : ''}
    </div>
    `
}

const singleSvgWrapper = ({ content, color, frameSize }) =>{
  const size = frameSize || 16
  return `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 ${size} ${size}" fill="${color ? color : 'black'}">${content}</svg>`
}

const randomColor = () =>{
  const r = ()=> Math.ceil(Math.random() * 255)
  return `rgb(${r()},${r()},${r()})`
}

// const randomGreen = () =>{
//   const r = ()=> Math.ceil(Math.random() * 80)
//   const g = ()=> Math.ceil(Math.random() * 155) + 100
//   const b = ()=> Math.ceil(Math.random() * 100)
//   return `rgb(${r()},${g()},${b()})`
// }
// const treeColor = '#74645a'
// const treeColor = '#3de9f5'
const treeColor ='#0d8799'
// const treeHighlight = '#58d3d8'
// const subGreen = '#0d8799'
const treeHighlight = '#3de9f5' 
const subGreen = '#58d3d8'
// ${treeColor}

const treeOne = () =>{
  return `<path fill="${treeColor}" d="M 13 0 h 3 v 1 h -3 v -1"/> <path fill="${treeColor}" d="M 11 1 h 2 v 1 h -2 v -1"/> <path fill="${treeHighlight}" d="M 13 1 h 3 v 14 h -1 v -1 h -1 v -1 h 1 v -1 h -1 v -1 h -1 v 1 h -1 v -1 h -1 v -1 h 1 v -1 h -1 v -1 h -1 v -1 h 1 v -2 h 1 v -1 h -1 v -2 h 2 v -1"/> <path fill="${treeColor}" d="M 10 2 h 1 v 1 h -1 v -1"/> <path fill="${treeColor}" d="M 9 3 h 1 v 1 h -1 v -1"/> <path fill="${subGreen}" d="M 10 3 h 1 v 1 h 1 v 1 h -1 v 2 h -1 v 1 h 1 v 1 h 1 v 1 h -1 v 1 h 1 v 1 h 1 v -1 h 1 v 1 h 1 v 1 h -1 v 1 h 1 v 1 h 1 v 1 h -14 v -1 h 1 v -1 h 1 v -3 h 1 v -2 h 1 v -2 h 1 v -1 h 1 v -1 h 1 v -1 h 1 v -1"/> <path fill="${treeColor}" d="M 8 4 h 1 v 1 h -1 v -1"/> <path fill="${treeColor}" d="M 7 5 h 1 v 1 h -1 v -1"/> <path fill="${treeColor}" d="M 6 6 h 1 v 1 h -1 v -1"/> <path fill="${treeColor}" d="M 5 7 h 1 v 2 h -1 v -2"/> <path fill="${treeColor}" d="M 4 9 h 1 v 2 h -1 v -2"/> <path fill="${treeColor}" d="M 3 12 h 1 v 2 h -1 v -2"/> <path fill="${treeColor}" d="M 2 14 h 1 v 1 h -1 v -1"/> <path fill="${treeColor}" d="M 1 15 h 1 v 1 h -1 v -1"/>`
}

const treeTwo = () =>{
  return `<path fill="${treeHighlight}" d="M 0 0 h 3 v 1 h 1 v 1 h 1 v 1 h 1 v 1 h 1 v 1 h 2 v 2 h 1 v 1 h 1 v 3 h 1 v 2 h -1 v 1 h -1 v -1 h -1 v 3 h -1 v -1 h -1 v -1 h -1 v 2 h -3 v -2 h -1 v 1 h -1 v 1 h -1 v -16"/> <path fill="${treeColor}" d="M 4 1 h 1 v 1 h -1 v -1"/> <path fill="${treeColor}" d="M 5 2 h 1 v 1 h -1 v -1"/> <path fill="${treeColor}" d="M 6 3 h 1 v 1 h -1 v -1"/> <path fill="${treeColor}" d="M 7 4 h 1 v 1 h -1 v -1"/> <path fill="${treeColor}" d="M 9 6 h 1 v 1 h -1 v -1"/> <path fill="${treeColor}" d="M 10 7 h 1 v 1 h -1 v -1"/> <path fill="${treeColor}" d="M 11 9 h 1 v 2 h -1 v -2"/> <path fill="${treeColor}" d="M 12 12 h 1 v 2 h -1 v -2"/> <path fill="${subGreen}" d="M 9 13 h 1 v 1 h 1 v -1 h 1 v 1 h 1 v 1 h 1 v 1 h -5 v -3"/> <path fill="${subGreen}" d="M 2 14 h 1 v 2 h -2 v -1 h 1 v -1"/> <path fill="${subGreen}" d="M 6 14 h 1 v 1 h 1 v 1 h -2 v -2"/> <path fill="${treeColor}" d="M 13 14 h 1 v 1 h -1 v -1"/> <path fill="${treeColor}" d="M 14 15 h 1 v 1 h -1 v -1"/>`
}

const treeThree = () =>{
  return `<path fill="${treeColor}" d="M 1 0 h 1 v 3 h -1 v -3"/> <path fill="${subGreen}" d="M 2 0 h 14 v 7 h -4 v 1 h -1 v -1 h -3 v -1 h -3 v -1 h -2 v -2 h -1 v -3"/> <path fill="${treeColor}" d="M 2 3 h 1 v 2 h -1 v -2"/> <path fill="${treeColor}" d="M 3 5 h 2 v 1 h -2 v -1"/> <path fill="${treeColor}" d="M 5 6 h 3 v 1 h -3 v -1"/> <path fill="${treeColor}" d="M 8 7 h 3 v 1 h -3 v -1"/> <path fill="${treeColor}" d="M 12 7 h 4 v 1 h -4 v -1"/> <path fill="${treeColor}" d="M 11 8 h 1 v 3 h -1 v -3"/> F 12 8 h 4 v 6 h -4 v -1 h -1 v -2 h 1 v -3"/> <path fill="${treeHighlight}" d="M 10 10 h 1 v 2 h -1 v 1 h 1 v 1 h 1 v 1 h 4 v 1 h -5 v -1 h -1 v -1 h -1 v -3 h 1 v -1"/> <path fill="${treeColor}" d="M 10 12 h 1 v 1 h -1 v -1"/> <path fill="${treeColor}" d="M 11 13 h 1 v 1 h -1 v -1"/> <path fill="${treeColor}" d="M 12 14 h 4 v 1 h -4 v -1"/>`
}

const treeFour = () =>{
  return `<path fill="${subGreen}" d="M 0 0 h 4 v 1 h 1 v -1 h 9 v 3 h -1 v 2 h -2 v 1 h -3 v 1 h -3 v 1 h -5 v -8"/> <path fill="${treeHighlight}" d="M 4 0 h 1 v 1 h -1 v -1"/> <path fill="${treeColor}" d="M 14 0 h 1 v 3 h -1 v -3"/> <path fill="${treeColor}" d="M 13 3 h 1 v 2 h -1 v -2"/> <path fill="${treeColor}" d="M 11 5 h 2 v 1 h -2 v -1"/> <path fill="${treeColor}" d="M 8 6 h 3 v 1 h -3 v -1"/> <path fill="${treeColor}" d="M 5 7 h 3 v 1 h -3 v -1"/> F 0 8 h 1 v 1 h 3 v 2 h 1 v 2 h -1 v 1 h -4 v -6"/> <path fill="${treeColor}" d="M 1 8 h 4 v 3 h -1 v -2 h -3 v -1"/> <path fill="${treeHighlight}" d="M 5 10 h 1 v 1 h 1 v 3 h -1 v 1 h -1 v 1 h -5 v -1 h 4 v -1 h 1 v -1 h 1 v -1 h -1 v -2"/> <path fill="${treeColor}" d="M 5 12 h 1 v 1 h -1 v -1"/> <path fill="${treeColor}" d="M 4 13 h 1 v 1 h -1 v -1"/> <path fill="${treeColor}" d="M 0 14 h 4 v 1 h -4 v -1"/>`
}

const tree = () =>{
  return 'D 5 0h6v1h2v1h1v1h1v1h1v7hNv1hNv1hNv1hTv2hNv-3hNvNhTv1hNv3hNvThTvNhNvNhNvNhNv-7h1vNh1vNh1vNh2vN"/ F 7 12h2v1h1v3h-4v-3h1vN"/'
}

const flowers = () =>{
  return 'D 2 1h2v1hTvN"/ D 1 2h1v1hNvN"/ D 4 2h1v1hNvN"/ D 2 3h2v1hTvN"/ D 11 4h2v1hTvN"/ D 10 5h1v1hNvN"/ D 13 5h1v1hNvN"/ D 11 6h2v1hTvN"/ D 4 8h2v1hTvN"/ D 3 9h1v1hNvN"/ D 6 9h1v1hNvN"/ D 4 10h2v1hTvN"/ D 13 12h2v1hTvN"/ D 12 13h1v1hNvN"/ D 15 13h1v1hNvN"/ D 13 14h2v1hTvN"/'
}

const buildingCorner = subColor =>{
  return `D 5 0h3v1h-3vN"/ <path fill="${subColor || 'white'}" d="M 8 0h2v1h2vNh2v1h2v15hN5vN1h1vTh1vNh2vNh3vN"/ D 10 0h2v1hTvN"/ D 14 0h2v1hTvN"/ D 3 1h2v1hTvN"/ D 2 2h1v1hNvN"/ D 1 3h1v2hNvT"/ D 0 5h1v11hNvN1"/`
}

const roofCorner = subColor =>{
  return `D 0 0h1v2hNvT"/ <path fill="${subColor || 'white'}" d="M 1 0h15v15hN1vNhTvNhTv-5hNvTh1vThNvTh1vT"/ D 0 4h1v2hNvT"/ D 0 8h1v8hNv-8"/ F 1 13h1v1h1v1h2v1h-4v-3"/ D 2 13h1v1hNvN"/ D 3 14h2v1hTvN"/ D 5 15h11v1hN1vN"/`
}

const checkered = () =>{
  return 'D 0 0h2v2hTvT"/ D 4 0h2v2hTvT"/ D 8 0h2v2hTvT"/ D 12 0h2v2hTvT"/ D 2 2h2v2hTvT"/ D 6 2h2v2hTvT"/ D 10 2h2v2hTvT"/ D 14 2h2v2hTvT"/ D 0 4h2v2hTvT"/ D 4 4h2v2hTvT"/ D 8 4h2v2hTvT"/ D 12 4h2v2hTvT"/ D 2 6h2v2hTvT"/ D 6 6h2v2hTvT"/ D 10 6h2v2hTvT"/ D 14 6h2v2hTvT"/ D 0 8h2v2hTvT"/ D 4 8h2v2hTvT"/ D 8 8h2v2hTvT"/ D 12 8h2v2hTvT"/ D 2 10h2v2hTvT"/ D 6 10h2v2hTvT"/ D 10 10h2v2hTvT"/ D 14 10h2v2hTvT"/ D 0 12h2v2hTvT"/ D 4 12h2v2hTvT"/ D 8 12h2v2hTvT"/ D 12 12h2v2hTvT"/ D 2 14h2v2hTvT"/ D 6 14h2v2hTvT"/ D 10 14h2v2hTvT"/ D 14 14h2v2hTvT"/'
}

const plain = subColor =>{
  return `<path fill="${subColor || 'white'}" d="M 0 0h16v16hN6vN6"/`
}

const plainEdge = subColor =>{
  return `D 0 0h16v1hN6vN"/ <path fill="${subColor || 'white'}" d="M 0 1h16v15hN6vN5"/`
}

const door = () =>{
  return 'F 0 0h16v15hNvN0hNvThTvNhTvNh-4v1hTv1hTv2hNv10hNvN5"/ D 6 1h4v1h2v1h2v2h1v10h1v1hN6vNh1vN0h1vTh2vNh2vN"/'
}

const roundWindow = () =>{
  return 'F 0 0h16v16hN6vN6"/ D 6 2h4v1h2v1h1v2h1v4hNv2hNv1hTv1h-4vNhTvNhNvThNv-4h1vTh1vNh2vN"/'
}

const squareWindow = () =>{
  return 'F 0 0h16v16hN6vN6"/ D 5 2h6v1h1v10hNv1h-6vNhNvN0h1vN"/'
}

const sideSquareWindow = () =>{
  return 'D 0 0h1v16hNvN6"/ F 1 0h15v16h-3vNh1v-9hNvNh-4v1hNv9h1v1h-8vN6"/ D 9 5h4v1h1v9hNv1h-4vNhNv-9h1vN"/'
}

const noSideWindow = () =>{
  return 'F 0 0h16v16h-3vNh1v-9hNvNh-4v1hNv9h1v1h-9vN6"/ D 9 5h4v1h1v9hNv1h-4vNhNv-9h1vN"/`'
}

const roofCurve = subColor =>{
  return `<path fill="${subColor || 'white'}" d="M 0 0h16v15hTvNhNvNhNvNhTvNh-4v1hTv1hNv1hNv1hTvN5"/ D 6 11h4v1h-4vN"/ D 4 12h2v1hTvN"/ F 6 12h4v1h2v1h1v1h1v1hN2vNh1vNh1vNh2vN"/ D 10 12h2v1hTvN"/ D 3 13h1v1hNvN"/ D 12 13h1v1hNvN"/ D 2 14h1v1hNvN"/ D 13 14h1v1hNvN"/ D 0 15h2v1hTvN"/ D 14 15h2v1hTvN"/`
}

const roofTopBottomCorner = subColor =>{
  return `D 0 0h1v2hNvT"/ F 1 0h15v15hN1vNhTvNhNvThNv-3hNvTh1vThNvTh1vT"/ D 0 4h1v2hNvT"/ D 0 8h1v3hNv-3"/ <path fill="${subColor || 'white'}" d="M 0 11h1v2h1v1h1v1h2v1h-5v-5"/ D 1 11h1v2hNvT"/ D 2 13h1v1hNvN"/ D 3 14h2v1hTvN"/ D 5 15h11v1hN1vN"/`
}

const river = () =>{
  const main = '#58d3d8'
  const sub = '#a2fcf0'

  return `<path fill="${main}" d="M 0 0h2v7h2v-7h19v4h2v-4h7v16h-7v-5hTv5h-9v-7hTv7hN2vN6"/ <path fill="${sub}" d="M 2 0h2v7hTv-7"/ <path fill="${sub}" d="M 23 0h2v4hTv-4"/ <path fill="${sub}" d="M 28 3h2v9hTv-9"/ <path fill="${sub}" d="M 7 4h2v8hTv-8"/ <path fill="${sub}" d="M 18 4h2v9hTv-9"/ <path fill="${sub}" d="M 12 9h2v7hTv-7"/ <path fill="${sub}" d="M 23 11h2v5hTv-5"/`
}

const riverCurve = () =>{
  const main = '#58d3d8'
  const sub = '#a2fcf0'
  return `
  <path fill="${main}" d="M 8 0h8v8h1vTh1vTh1vNh1vNh2vNh2vNh8v2h-3v1h-4v2h4vNh3v8hTv1hTv3h-8v-5h1vThTv2hNv5h-9v-4h1vTh1vNh2vThTv1hNv1hNv1hNv2hNv4h-7v-8h1vTh1vTh1vNh1vNh2vNh2vN"/ <path fill="${sub}" d="M 10 2h5v2h-5v1hTv1hNv1hTvTh2vNh1vNh2vN"/ <path fill="${sub}" d="M 29 2h3v2h-3v1h-4vTh4vN"/ <path fill="${sub}" d="M 11 7h2v2hTv1hNv2hNv4hTv-4h1vTh1vNh1vNh1vN"/ <path fill="${sub}" d="M 26 7h3v2h-3v1hNv1hTvTh1vNh2vN"/ <path fill="${sub}" d="M 19 9h2v2hNv5hTv-5h1vT"/ <path fill="${sub}" d="M 30 12h2v2hTv2hTv-3h2vN"/ <path fill="${main}" d="M 30 14h2v2hTvT"/`
}

const ladder = subColor =>{
  return `<path fill="${subColor || 'white'}" d="M 0 0h16v16hN6vN6"/ D 3 1h1v1hNvN"/ D 12 1h1v1hNvN"/ D 4 2h8v1h-8vN"/ D 3 5h1v1hNvN"/ D 12 5h1v1hNvN"/ D 4 6h8v1h-8vN"/ D 3 9h1v1hNvN"/ D 12 9h1v1hNvN"/ D 4 10h8v1h-8vN"/ D 3 13h1v1hNvN"/ D 12 13h1v1hNvN"/ D 4 14h8v1h-8vN"/`
}

const ladderHole = subColor =>{
  return `D 0 0h16v1hNv10hNv2hTv1hTv1h-4vNhTvNhTvThNvN0hNvN"/ F 0 1h1v10h1v2h2v1h2v1h4vNh2vNh2vTh1vN0h1v15hN6vN5"/ <path fill="${subColor}" d="M 3 1h1v1hNvN"/ <path fill="${subColor}" d="M 12 1h1v1hNvN"/ <path fill="${subColor}" d="M 4 2h8v1h-8vN"/ <path fill="${subColor}" d="M 3 5h1v1hNvN"/ <path fill="${subColor}" d="M 12 5h1v1hNvN"/ <path fill="${subColor}" d="M 4 6h8v1h-8vN"/ <path fill="${subColor}" d="M 3 9h1v1hNvN"/ <path fill="${subColor}" d="M 12 9h1v1hNvN"/ <path fill="${subColor}" d="M 4 10h8v1h-8vN"/`
} 

const exit = subColor =>{
  return `<path fill="${subColor}" d="M 0 0h16v4hTv2hTvThTv2hTvThTv2hTvThTv2hTv-6"/ D 2 4h2v2hTvT"/ D 6 4h2v2hTvT"/ D 10 4h2v2hTvT"/ D 14 4h2v2hTvT"/ D 0 6h2v2h2vTh2v2h2vTh2v2h2vTh2v2h2v8hN6vN0"/ <path fill="${subColor}" d="M 2 6h2v2hTvT"/ <path fill="${subColor}" d="M 6 6h2v2hTvT"/ <path fill="${subColor}" d="M 10 6h2v2hTvT"/ <path fill="${subColor}" d="M 14 6h2v2hTvT"/`
}

export {
  svgWrapper,
  singleSvgWrapper, 
  randomColor,
  treeOne,
  treeTwo,
  treeThree,
  treeFour,
  tree,
  flowers,
  buildingCorner,
  roofCorner,
  checkered,
  plain,
  plainEdge,
  door,
  roundWindow,
  squareWindow,
  sideSquareWindow,
  noSideWindow,
  roofCurve,
  roofTopBottomCorner,
  river,
  riverCurve,
  ladder,
  ladderHole,
  exit,
}