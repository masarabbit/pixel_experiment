import { artData } from '../state.js'
import { input, elements } from '../elements.js'
import { nearestN, sortByFreqRemoveBlankAndDuplicates } from './utils.js'

// const n = 255
const n = 1
const rgbToHex = (r, g, b) => {
  if (r > 255 || g > 255 || b > 255)
    throw 'Invalid color component'  
  // return ((r << 16) | (g << 8) | b).toString(16)
  return ((nearestN(r, n) << 16) | (nearestN(g, n) << 8) | nearestN(b, n)).toString(16)
}

const hex = rgb => '#' + ('000000' + rgb).slice(-6)

const hexToRgb = hex => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : null
}

const updateColor = color =>{
  input.colorLabel.style.backgroundColor = color
  input.hex.value = color
  input.color.value = color
  artData.hex = color
}



//* populateDetailedPalette
// const factor = 51
// const factor = 1
// const factor = 255


// const nearestNArr = (arr, denom) => arr.map(n => nearestN(n, denom))

// const hexToRgbArr = hex =>{
//   const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
//   return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
// }

// const rgbFormat = rgbArr => rgbArr.map(a => `rgb(${a})`)

// const arrayTotal = arr => arr.reduce((acc, x)=> acc + x , 0)

const populateCompletePalette = arr =>{
  populatePalette(sortByFreqRemoveBlankAndDuplicates(arr))
}

const populatePalette = arr =>{
  elements.palette.innerHTML = arr.map(d =>{
    const background = `background-color:${d}`
    return `
        <div class="palette_cell">
          <div class="palette_color" style="${background};">
          </div>
        </div>`
  }).join('')

  document.querySelectorAll('.palette_color').forEach((cell, i)=>{
    cell.addEventListener('click',()=>{
      updateColor(arr[i])
    })
  })
}

// const populateDetailedPalette = (index, arr) =>{
//   const nearestNAndSorted = arr.filter(c => c !== 'transparent').map(c => nearestNArr(hexToRgbArr(c), factor)).sort((a,b)=>{
//     return arrayTotal(a) - arrayTotal(b)
//   })
//   const duplicateRemoved = [...new Set(nearestNAndSorted.map(a => `${a}` ))].map(a => a.split(','))
//   const filteredData = duplicateRemoved
//   // console.log('filteredData', filteredData)
//   // console.log('filteredData', rgbFormat(filteredData))
  
//   const rgbOutput = filteredData.map((c, i)=>{
//     return `<div>${i} :${hex(rgbToHex(c[0],c[1],c[2]))} : ${c}<div style="background-color:rgb(${c});"></div></div>`
//   }).join('')
//   document.querySelector('.color_output').innerHTML = rgbOutput
  
//   const rgbData = rgbFormat(filteredData)
//   palettes[index].innerHTML = rgbData.map(d=>{
//     const background = `background-color:${d}`
//     return `
//       <div class="palette_cell">
//         <div class="palette_color" style="${background};">
//         </div>
//       </div>`
//   }).join('')

//   document.querySelectorAll('.palette_color').forEach((cell, i)=>{
//     cell.addEventListener('click',()=>{
//       console.log('color3', rgbData[i] === 'transparent')
//       //! some logic required for transparency
//       input.color.value = rgbData[i]
//       input.colorLabel.style.backgroundColor = rgbData[i]
//       input.hex.value = hex(rgbToHex(filteredData[i][0], filteredData[i][1], filteredData[i][2]))
//     })
//   })
// }


export {
  rgbToHex,
  hex,
  hexToRgb,
  updateColor,
  // populateDetailedPalette,
  populatePalette,
  populateCompletePalette
}