import { artData } from '../state.js'
import { input } from '../elements.js'
import { calcX, calcY } from '../actions/utils.js'


const paintWithCircles = () => {
  const colors = input.colors.value.split(',')
  // const { cellD } = artData
  const circles = colors.map((color, i)=>{
    const x = calcX(i)
    const y = calcY(i)
    const r = 1

    // return `<circle fill="${color}" cx="${x + 0.3}" cy="${y + 0.3}" r="${r}"/>` +
    // `<circle fill="${color}" cx="${x + 0.6}" cy="${y + 0.3}" r="${r}"/>` +
    // `<circle fill="${color}" cx="${x + 0.3}" cy="${y + 0.6}" r="${r}"/>` +
    // `<circle fill="${color}" cx="${x + 0.6}" cy="${y + 0.6}" r="${r}"/>`
    return `<circle fill="${color}" cx="${x + 0.5}" cy="${y + 0.5}" r="${r}"/>`
  }).join('')
  input.svg.value = circles
}

export default paintWithCircles