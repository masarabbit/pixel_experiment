// const sub = '#f9ede5'
import {
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
  exit 
} from '../data/svg.js'


const sub = '#58d3d8'
const main = '#74645a'

const svgData = {
  'ta': { svg: treeOne },
  'tb': { svg: treeTwo },
  'tc': { svg: treeThree },
  'td': { svg: treeFour },
  't': { svg: tree, color: '#0d8799' },
  'w': { svg: tree, color: '#0d8799' },
  'o': { svg: flowers, color: randomColor },
  'd': { svg: buildingCorner, color: main, subColor: sub },
  's': { svg: buildingCorner, color: main, subColor: sub, rotate: 90 },
  'bt': { svg: buildingCorner, color: main },
  'br': { svg: buildingCorner, color: main, rotate: 90 },
  'bb': { svg: buildingCorner, color: main, rotate: 180 },
  'bl': { svg: buildingCorner, color: main, rotate: 270 },
  'bx': { svg: roofTopBottomCorner, color: main, subColor: '#0d8799' },
  'by': { svg: roofTopBottomCorner, color: main, subColor: '#0d8799', flip: 'h' },
  'rr': { svg: roofTopBottomCorner, color: main, subColor: sub },
  'rl': { svg: roofTopBottomCorner, color: main, subColor: sub, flip: 'h' },
  'rt': { svg: roofTopBottomCorner, rotate: 180, color: main, subColor: sub },
  'ry': { svg: roofTopBottomCorner, rotate: 180, color: main, subColor: sub, flip: 'h' },
  'g': { svg: roofCorner, color: main, subColor: sub },
  'y': { svg: roofCorner, color: main, subColor: sub, flip: 'h' },
  'p': { svg: plain },
  'rp': { svg: plain, subColor: sub },
  'do': { svg: door, color: main },
  'wi': { svg: roundWindow, color: main },
  'sw': { svg: squareWindow, color: main },
  'sl': { svg: sideSquareWindow, color: main },
  'sr': { svg: sideSquareWindow, color: main, flip: 'h' },
  'nw': { svg: noSideWindow, color: main },
  'nr': { svg: noSideWindow, color: main, flip: 'h' },
  'at': { svg: plainEdge, color: main  },
  'ar': { svg: plainEdge, color: main, rotate: 90 },
  'ab': { svg: plainEdge, color: main, rotate: 180 },
  'al': { svg: plainEdge, color: main, rotate: 270 },
  'rc': { svg: roofCurve, color: main, subColor: sub },
  'pt': { svg: plainEdge, color: main, subColor: sub },
  'pr': { svg: plainEdge, color: main, subColor: sub, rotate: 90 },
  'pb': { svg: plainEdge, color: main, subColor: sub, rotate: 180 },
  'pu': { svg: plainEdge, color: main, subColor: sub, rotate: 270 },
  'b': { svg: plain, subColor: '#a2fcf0' },
  'bd': { svg: plain, subColor: '#0d8799' },
  'r': { svg: river, frameNo: 2, speed: 1000 },
  'rh': { svg: river, rotate: 90, frameNo: 2, speed: 1000 },
  'ra': { svg: riverCurve, frameNo: 2, speed: 1000 },
  'rb': { svg: riverCurve, rotate: 90, frameNo: 2, speed: 1000 },
  'rd': { svg: riverCurve, rotate: 180, frameNo: 2, speed: 1000 },
  're': { svg: riverCurve, rotate: 270, frameNo: 2, speed: 1000 },
  'la': { svg: ladder, color: main, subColor: sub },
  'c': { svg: checkered, color: '#a2e8fc' },
  'e': { svg: exit, color: '#0d8799', subColor: '#fff' },
  'lh': { svg: ladderHole, color: '#bba293', subColor: sub }
}


export default svgData