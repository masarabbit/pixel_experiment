

const rgbToHex = (r, g, b) => {
  if (r > 255 || g > 255 || b > 255)
    throw 'Invalid color component'
  return ((r << 16) | (g << 8) | b).toString(16)
}

const hex = rgb => '#' + ('000000' + rgb).slice(-6)

const hexToRgb = hex => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : null
}

const invertHex = hexToInvert => {
  const rgbNo = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexToInvert)
  const rgb = rgbNo.map(rgb => 255 - parseInt(rgb, 16))
  return hex(rgbToHex(rgb[1], rgb[2], rgb[3]))
}