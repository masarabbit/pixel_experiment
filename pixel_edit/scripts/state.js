const artData = {
  prev: [],
  cellD: 20,
  row: 10,
  column: 10,
  calcWidth: 0,
  calcHeight: 0,
  uploadedFile: null,
  codes: {
    0: [],
    1: []
  }
}

// copy selection box
const drawData = {
  cursorType: 'pen_cursor',
  canDraw: false,
  erase: false,
  fill: false,
  selectCopy: false,
  copyState: false,
  moveState: false,
  copyBoxCreated: false,
  copyBox: null,
  copied: false,
  isCut: false,
  prevX: 0,
  prevY: 0,
  defaultPos: {}
}

const copyData = {
  index: null,
  data: [],
  width: null,
  height: null,
}

  // input
  const input = {
    cellD: document.querySelector('.cell_size'),
    row: document.querySelector('.row'),
    column: document.querySelector('.column'),
    codes: document.querySelectorAll('.codes'),
    upload: document.querySelector('#upload'),
    color: document.querySelector('#color'),
    colorLabel: document.querySelector('.color_label'),
    hex: document.querySelector('.hex')
  }


export {
  artData,
  drawData,
  copyData,
  input
}