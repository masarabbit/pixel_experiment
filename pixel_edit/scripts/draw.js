const continuousDraw = (e, canDraw, action) => {
  if (canDraw) action(e) 
}

export {
  continuousDraw
}