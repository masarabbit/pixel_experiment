
import { cellWidthAndHeight, setTargetSize, sortByFreqRemoveBlankAndDuplicates } from '../actions/utils.js'
import { continuousDraw, updateCode, checkAreaToFill } from '../actions/draw.js'
import { createCopyGrids } from '../actions/copy.js'
import { populateDetailedPalette } from '../actions/colours.js'

import { artData, drawData } from '../state.js'
import { grids, input, palettes } from '../elements.js'



  const updateGrid = () =>{
    grids[0].innerHTML = artData.codes[0].map((dot, i) => {
      return `<div class="cell" index="${i}" data-cell=${i} style="background-color:${dot}; ${cellWidthAndHeight()}"></div>`
    }).join('')
  }


  const updateCodesDisplay = (box, arr) =>{
    box.value = `${arr.map(ele => ele).join(',')}`
    // const index = box === codesBox[0] ? 0 : 1 
    // populateDetailedPalette(0, arr)
    populatePalette(0, arr)
  }


  const createGridCells = (index, cellStyle) =>{
    const { cellD, row, column } = artData 
    const arr = new Array(row * column).fill('')
    setTargetSize({
      target: grids[index],
      w: column * cellD, h: row * cellD
    })
    grids[index].innerHTML = arr.map((_ele, i)=>{
      return `
        <div 
          class="${cellStyle}"
          style="${cellWidthAndHeight()}"
          index="${i}"
          data-cell=${i}
        >
        </div>
        `
    }).join('')

    grids[index].addEventListener('click', e => colorCell(e))
    grids[index].addEventListener('mousemove', e => continuousDraw(e, colorCell))
  }


  const createGrid = (index, cellStyle) =>{
    const { row, column } = artData 
    createGridCells(index, cellStyle)
    artData.codes[0] = new Array(row * column).fill('transparent')
    input.codes[0].value = artData.codes[0]

    updateCode()
  }


  // enable grid creation with buttons
  const triggerCreateGrid = e =>{
    const gridClass = e.target.dataset.grid_class  // cell
    const index = +e.target.dataset.index  // 0
    createGrid(index, gridClass)
  }


  const populatePalette = (index, arr) =>{
    const filteredData = sortByFreqRemoveBlankAndDuplicates(arr)
    palettes[index].innerHTML = filteredData.map(d=>{
      if (index === 0 && filteredData[0][0] !== '#' && filteredData[0][0] !== 't') return
      const background = `background-color:${d}`
      return `
        <div class="palette_cell">
          <div class="palette_color" style="${background};">
          </div>
        </div>`
    }).join('')

    document.querySelectorAll('.palette_color').forEach((cell, i)=>{
      cell.addEventListener('click',()=>{
        updateColor(filteredData[i])
      })
    })
  }


  const generateFromColorCode = () =>{
    const { row, column } = artData 

    createGridCells(0, 'cell')
    createCopyGrids('copy_cell')

    if (!input.codes[0].value) {
      artData.codes[0] = new Array(row * column).fill('transparent')
      input.codes[0].value = artData.codes[0]
    }
    // remove \n
    artData.codes[0] = input.codes[0].value.replace(/(\r\n|\n|\r)/gm,'').split(',')
    input.codes[0].value = artData.codes[0]

    const cells = document.querySelectorAll('.cell')
    input.codes[0].value.split(',').forEach((ele, i)=>{
      if (cells[i]) cells[i].style.backgroundColor = ele
    })
    populatePalette(0, artData.codes[0])
    // populateDetailedPalette(0, artData.codes[0])
    updateCode()
  }


  const fillBucket = index =>{
    const fillValue = drawData.erase ? 'transparent' : input.color.value  //! '' instead of transparent
    const areaToFillBucket = []
    const valueToSwap = artData.codes[0][index]

    checkAreaToFill({
      codeRef: artData.codes[0], 
      i: +index, 
      valueToCheck: valueToSwap, 
      areaToFill: areaToFillBucket,
    })
    input.codes[0].value = input.codes[0].value.split(',').map((c, i)=>{
      if (areaToFillBucket.indexOf(i) === -1) return c
      return c === valueToSwap ? fillValue : c
    }).join(',')

    generateFromColorCode()
  }


  const colorCell = e =>{
    if (drawData.selectCopy || e.target.classList.contains('grid')) return
    const index = e.target.dataset.cell
    if (drawData.fill) {
      fillBucket(index)
      return
    }
    const value = drawData.erase || input.hex.value === 'transparent' 
      ? 'transparent' 
      : input.color.value  //! transparent replaced with ''
    artData.codes[0][index] = value
    e.target.style.backgroundColor = value
    // console.log('artData', artData)
    updateCodesDisplay(input.codes[0], artData.codes[0])
    updateCode()
  }



  export {
    updateGrid,
    updateCodesDisplay,
    createGridCells,
    createGrid,
    generateFromColorCode,
    triggerCreateGrid
  }