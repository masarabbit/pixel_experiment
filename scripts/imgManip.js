function init() {

  
  const svg = '<path fill="#4d8da3" d="M 4 1 h 1 v 1 h 1 v 2 h 4 v -2 h 1 v -1 h 1 v 3 h 1 v 1 h 1 v 3 h -1 v 1 h -3 v 3 h 1 v 2 h -6 v -2 h 1 v -3 h -3 v -1 h -1 v -3 h 1 v -1 h 1 v -3"/> <path fill="#4d8da3" d="M 20 2 h 1 v 1 h 1 v 2 h 4 v -2 h 1 v -1 h 1 v 3 h 1 v 1 h 1 v 3 h -1 v 1 h -2 v 1 h 1 v 2 h -1 v 1 h -6 v -1 h -1 v -2 h 1 v -1 h -2 v -1 h -1 v -3 h 1 v -1 h 1 v -3"/> <path fill="#9edbf0" d="M 5 5 h 1 v 2 h -1 v -2"/> <path fill="#9edbf0" d="M 10 5 h 1 v 2 h -1 v -2"/> <path fill="#9edbf0" d="M 21 6 h 1 v 2 h -1 v -2"/> <path fill="#9edbf0" d="M 26 6 h 1 v 2 h -1 v -2"/>'
  
  const sampleImg = document.querySelector('.sample')
  const sampleImgWrapper = document.querySelector('.sample_wrapper')
  const handle = document.querySelector('.handle')
  const handleSquare = document.querySelector('.handle_square')
  const body = document.querySelector('body')
  const indicator = document.querySelector('.indicator')
  const indicatorTwo = document.querySelector('.indicator_two')
  let handleActive = false
  // let windowPos = {
  //   newX: 0,
  //   newY: 0,
  // }
  // let newAngle = 0
  // let handlePos = 'rightup'
  // let oldX
  // let oldY
  let newAngle = 0

  const svgWrapper = ({ content, color, w, h } ) =>{
    return `
      <div class="sprite">
        <svg x="0px" y="0px" width="100%" height="100%" viewBox="0 0 ${w || 16} ${h || 16}" fill="${color || 'black'}">${content}</svg>
      </div>  
      `
  }
  
  const animateSvg = ({ target, start, end, speed, frameSize }) => {
    const startFrame = start || 0
    let i = startFrame
    setInterval(()=> {
      target.style.marginLeft = `${-(i * (frameSize || 16))}px`
      i = i >= end
        ? startFrame
        : i + 1
    }, speed || 200)
  }
  

  const animateSprite = () =>{
    sampleImg.innerHTML = svgWrapper({ content: svg, className: 'cat', w: 32 })
    const sprite = sampleImg.childNodes[1]
    Object.assign(sprite.style, {
      width: '160px', 
      height: '80px'
    })
    animateSvg({ target: sprite, end: 1, frameSize: 80 })
  }

  animateSprite()

  const setTargetPos = (target, x, y) =>{
    Object.assign(target.style, { left: `${x}px`, top: `${y}px` })
  }

  // handleSquare.addEventListener('mouseenter', ()=>handleActive = true)
  // handleSquare.addEventListener('mouseleave', ()=>handleActive = false)

  const makeSpriteDraggable = target => {
    const pos = { a: 0, b: 0, c: 0, d: 0 }
    // const pos = {}
    //   ['a', 'b', 'c', 'd'].forEach( x => {
    //     pos[x] = 0
    //   })
    const onGrab = e => {
      pos.c = e.clientX
      pos.d = e.clientY
      document.addEventListener('mouseup', onLetGo)
      document.addEventListener('mousemove', onDrag)
    }
    
    const onDrag = e => {
      pos.a = pos.c - e.clientX
      pos.b = pos.d - e.clientY
      pos.c = e.clientX
      pos.d = e.clientY
      if (!handleActive) setTargetPos(
        target, 
        target.offsetLeft - pos.a, 
        target.offsetTop - pos.b
      )
    }

    const onLetGo = () => {
      document.removeEventListener('mouseup', onLetGo)
      document.removeEventListener('mousemove', onDrag)
    }

    target.addEventListener('mousedown', onGrab)
  }

  makeSpriteDraggable(sampleImgWrapper)


  makeSpriteRotatable = target =>{

    const handlePos = {
      startX: 0,
      startY: 0,
      // endX: 0,
      // endY: 0,
      prevPos: null,
    }

    const onGrab = e =>{
      indicatorTwo.innerHTML = `pageX:${e.pageX} pageY:${e.pageY}`
      handlePos.startX = e.pageX
      handlePos.startY = e.pageY
      handleActive = true
      document.addEventListener('mouseup', onLetGo)
      document.addEventListener('mousemove', onDrag)
    }

    const onDrag = e =>{
      indicatorTwo.innerHTML = `pageX:${e.pageX} pageY:${e.pageY}`
      // const dirX = e.pageX < handlePos.startX ? 'left' : 'right'
      // const dirY = e.pageY < handlePos.startY ? 'up' : 'down'
  
      // TODO not correct, needs correction
      const mark = document.querySelector('.mark')
      const { left, top, width, height } = mark.getBoundingClientRect()
      const center = {
        x: left + width / 2 || 0,
        y: top + height / 2 || 0,
      }
      // console.log(center)

      const testMark = document.createElement('div')
      testMark.classList.add('mark_two')
      Object.assign(testMark.style, {
        left: `${center.x}px`, 
        top: `${center.y}px`
      })      
      body.append(testMark)

      const testMarkClient = document.createElement('div')
      testMarkClient.classList.add('mark_three')
      Object.assign(testMarkClient.style, {
        left: `${e.pageX}px`, 
        top: `${e.pageY}px`
      })
      body.append(testMarkClient)

      // const { left:x, top:y } = handleSquare.getBoundingClientRect()
      // const handleDirX = x < left ? 'left' : 'right'
      // const handleDirY = y < top ? 'up' : 'down'
      console.log('e', e)
      console.log('measurement',`${center.y}-${e.pageY}-${center.x}-${e.pageX}`)

      // const angle = Math.atan2(center.y - e.pageY, center.x - e.pageX) * 180 / Math.PI
      const angle = Math.atan2(center.y - e.pageY, center.x - e.pageX)

      indicator.innerHTML = `${angle} - ${newAngle}`
      
      // const newPos = `${dirX}-${dirY}`
      // const newHandlePos = `${handleDirX}-${handleDirY}`
      
      // if (newHandlePos === 'right-up'){
      //   if (dirX === 'right' || dirY === 'down') newAngle += 0.1
      //   if (dirX === 'left' || dirY === 'up') newAngle -= 0.1
      // }
      // if (newHandlePos === 'right-down'){
      //   if (dirX === 'left' || dirY === 'down') newAngle += 0.1
      //   if (dirX === 'right' || dirY === 'up') newAngle -= 0.1
      // }
      // if (newHandlePos === 'left-down'){
      //   if (dirX === 'left' || dirY === 'up') newAngle += 0.1
      //   if (dirX === 'right' || dirY === 'down') newAngle -= 0.1
      // }
      // if (newHandlePos === 'left-up'){
      //   if (dirX === 'right' || dirY === 'up') newAngle += 0.1
      //   if (dirX === 'left' || dirY === 'down') newAngle -= 0.1
      // }

      const currentAngle = newAngle || 0

      newAngle = angle - currentAngle
      // newAngle = newAngle - 0.1
      console.log(angle)
  
      sampleImgWrapper.childNodes[3].style.transform = `rotate(${newAngle}rad)`  
      target.style.transform = `rotate(${newAngle}rad)`
  
      // indicator.innerHTML = `${dirX} - ${dirY} / ${handleDirX} - ${handleDirY}`
      // handlePos.prevPos = newPos
    }

    const onLetGo = () => {
      document.removeEventListener('mouseup', onLetGo)
      document.removeEventListener('mousemove', onDrag)
    }

    target.addEventListener('mousedown', onGrab)

    handle.addEventListener('mouseleave', ()=>handleActive = false)
  }
  
  
  makeSpriteRotatable(handle)



  const createMark = target =>{
    const mark = document.createElement('div')
    mark.classList.add('mark')
    target.append(mark)
    const { width, height } = target.getBoundingClientRect()
    Object.assign(mark.style, {
      left: `${(width / 2) - (mark.clientWidth / 2)}px`, 
      top: `${(height / 2) - (mark.clientHeight / 2)}px`
    })
  }

  createMark(sampleImgWrapper)

  // window.addEventListener('mousemove',(e)=>{
  //   indicator.innerHTML = `pageX:${e.pageX} - pageY${e.pageY}`
  // })
  
}

window.addEventListener('DOMContentLoaded', init)


// const prevPos = pos
// let direction
// const { left, top } = mark.getBoundingClientRect()
// const { left:hLeft, top:hTop } = handleSquare.getBoundingClientRect()
      
// const dirX = e.pageX < oldX ? 'left' : 'right'
// const dirY = e.pageY < oldY ? 'up' : 'down'

// const handleX = hLeft  < left ? 'left' : 'right'
// const handleY = hTop < top ? 'up' : 'down'
// oldX = e.pageX
// oldY = e.pageY

// console.log('dirX',dirX, 'dirY',dirY)

// // const motion = dirX + dirY
// const handlePos = handleX + handleY
// // console.log(handlePos)

// if (handlePos === 'rightup'){
//   if (dirX === 'right') newAngle += 5
//   if (dirX === 'left') newAngle -= 5
// }

// if (handlePos === 'rightdown'){
//   if (dirX === 'left') newAngle += 5
//   if (dirX === 'right') newAngle -= 5
// }

// if (handlePos === 'leftdown'){
//   if (dirX === 'right') newAngle += 10
//   if (dirX === 'left') newAngle -= 10
// }

// if (handlePos === 'leftup'){
//   if (dirX === 'left') newAngle += 10
//   if (dirX === 'right') newAngle -= 10
// }
// if (prevPos === 'rightup' && (pos === 'rightup' || )


// console.log(dirX, dirY)
// if (dirX + dirY === 'leftup' || dirX + dirY === 'rightdown') newAngle -= 5
// if (dirX + dirY === 'rightup' || dirX + dirY === 'leftdown') newAngle += 5
// if (dirX === 'right') newAngle += 5
// if (dirX === 'left') newAngle -= 5

// } else {
//   newAngle = dirX === 'left' ? newAngle + 1 : newAngle - 1
// }


// ++++++++


  // // const handle = window.getComputedStyle(
  // //   document.querySelector('.sample_wrapper'), ':before'
  // // )
  
  // const rotatePos = {
  //   centerX: 0,
  //   centerY: 0,
  // }

  // const getDragAngle = (e, mark) => {
  //   // const element = e.target
  //   // console.log(e.target.dataset.angle)
  //   const startAngle = parseFloat(handle.dataset.angle) || 0

  //   const { left, top, width, height } = mark.getBoundingClientRect()
  //   console.log('test 2', left, top)
  //   const center = {
  //     x: parseFloat(left + width / 2) || 0,
  //     y: parseFloat(top + height / 2) || 0,
  //   }

  //   const testMark = document.createElement('div')
  //   testMark.classList.add('mark_two')
  //   Object.assign(testMark.style, {
  //     left: `${rotatePos.centerX}px`, 
  //     top: `${rotatePos.centerY}px`
  //   })

  //   // const { left:l2, top:t2 } = handleSquare.getBoundingClientRect()
    
  //   body.append(testMark)
  //   const angle = Math.atan2(center.y - e.clientY, center.x - e.clientX) //TODO e.clientY and e.cientX isn't right
  //   console.log('test Client', e.clientX)

  //   const testMarkClient = document.createElement('div')
  //   testMarkClient.classList.add('mark_three')
  //   Object.assign(testMarkClient.style, {
  //     left: `${e.pageX}px`, 
  //     top: `${e.pageY}px`
  //   })
    
  //   body.append(testMarkClient)

  //   return angle - startAngle
  // }




    // handle.addEventListener('mousedown', (e)=>{
  //   indicatorTwo.innerHTML = `pageX:${e.pageX} pageY:${e.pageY}`
  //   handlePos.startX = e.pageX
  //   handlePos.startY = e.pageY
  //   handleActive = true
  // })
  // handle.addEventListener('mousemove',(e)=>{
  //   indicatorTwo.innerHTML = `pageX:${e.pageX} pageY:${e.pageY}`
  //   const dirX = e.pageX < handlePos.startX ? 'left' : 'right'
  //   const dirY = e.pageY < handlePos.startY ? 'up' : 'down'

  //   // if (handlePos.prevPos === '')

  //   // TODO not correct, needs correction
  //   const mark = document.querySelector('.mark')
  //   const { left, top } = mark.getBoundingClientRect()
  //   const { left:x, top:y } = handleSquare.getBoundingClientRect()
  //   const handleDirX = x < left ? 'left' : 'right'
  //   const handleDirY = y < top ? 'up' : 'down'
    
  //   const newPos = `${dirX}-${dirY}`
  //   const newHandlePos = `${handleDirX}-${handleDirY}`
    
  //   if (newHandlePos === 'right-up'){
  //     // if (newPos === 'right-down') newAngle += 1
  //     // if (newPos === 'left-up') newAngle -= 1
  //     if (dirX === 'right' || dirY === 'down') newAngle += 1
  //     if (dirX === 'left' || dirY === 'up') newAngle -= 1
  //   }
  //   if (newHandlePos === 'right-down'){
  //     // if (newPos === 'left-down') newAngle += 1
  //     // if (newPos === 'right-up') newAngle -= 1
  //     if (dirX === 'left' || dirY === 'down') newAngle += 1
  //     if (dirX === 'right' || dirY === 'up') newAngle -= 1
  //   }
  //   if (newHandlePos === 'left-down'){
  //     // if (newPos === 'left-up') newAngle += 1
  //     // if (newPos === 'right-down') newAngle -= 1
  //     if (dirX === 'left' || dirY === 'up') newAngle += 1
  //     if (dirX === 'right' || dirY === 'down') newAngle -= 1
  //   }
  //   if (newHandlePos === 'left-up'){
  //     // if (newPos === 'right-up') newAngle += 1
  //     // if (newPos === 'left-down') newAngle -= 1
  //     if (dirX === 'right' || dirY === 'up') newAngle += 1
  //     if (dirX === 'left' || dirY === 'down') newAngle -= 1
  //   }

  //   sampleImgWrapper.childNodes[3].style.transform = `rotate(${newAngle}deg)`  
  //   handle.style.transform = `rotate(${newAngle}deg)`

  //   indicator.innerHTML = `${dirX} - ${dirY} / ${handleDirX} - ${handleDirY}`

  //   handlePos.prevPos = newPos
  // })

  // handle.addEventListener('mouseup', (e)=>{
  //   indicatorTwo.innerHTML = `pageX:${e.pageX} pageY:${e.pageY}`
  //   handlePos.endX = e.pageX
  //   handlePos.endY = e.pageY
  //   // handleActive = false
  // })
  // handleSquare.addEventListener('mouseleave', ()=>handleActive = false)


    // const addRotate = target =>{
  //   // const pos = { start: 0, end: 0 }

  //   const mark = document.createElement('div')
  //   mark.classList.add('mark')
  //   target.append(mark)
  //   const { width, height } = target.getBoundingClientRect()
  //   // console.log(left, top, width, height)
  //   // rotatePos.centerX = 
  //   // rotatePos.centerY = 
  //   Object.assign(mark.style, {
  //     left: `${(width / 2) - (mark.clientWidth / 2)}px`, 
  //     top: `${(height / 2) - (mark.clientHeight / 2)}px`
  //   })

  //   const startRotate = () =>{
  //     // pos.start = e.dataset.angle
  //     document.addEventListener('mousemove', rotateOn)
  //     document.addEventListener('mouseup', rotateOff)
  //   }

  //   const rotateOn = e =>{
  //     if (!handleActive) return
  //     const newAngle = getDragAngle(e, mark)

  //     target.childNodes[3].style.transform = `rotate(${newAngle}rad)`  
  //     handle.style.transform = `rotate(${newAngle}rad)`
  //     handle.dataset.angle = newAngle
  //   }

  //   const rotateOff = () =>{
  //     document.removeEventListener('mousemove', rotateOn)
  //     document.removeEventListener('mouseup', rotateOff)
  //   }
  
  //   handle.addEventListener('mousedown', startRotate)
  // }
  
  // addRotate(sampleImgWrapper)