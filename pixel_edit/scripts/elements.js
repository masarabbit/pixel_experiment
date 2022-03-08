const canvas = document.querySelectorAll('.canvas')
const ctx = canvas[0].getContext('2d')
const ctxTwo = canvas[1].getContext('2d')

const grids = document.querySelectorAll('.grid')
const palettes = document.querySelectorAll('.palette')
const cursor = document.querySelector('.cursor')
const copyGrid = document.querySelector('.copy_grid')

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
    canvas,
    ctx,
    ctxTwo,
    input,
    grids,
    palettes,
    cursor,
    copyGrid,
  }