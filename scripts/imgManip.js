function init() {
  
  const svg = `<path fill="#4d8da3" d="M 4 1 h 1 v 1 h 1 v 2 h 4 v -2 h 1 v -1 h 1 v 3 h 1 v 1 h 1 v 3 h -1 v 1 h -3 v 3 h 1 v 2 h -6 v -2 h 1 v -3 h -3 v -1 h -1 v -3 h 1 v -1 h 1 v -3"/> <path fill="#4d8da3" d="M 20 2 h 1 v 1 h 1 v 2 h 4 v -2 h 1 v -1 h 1 v 3 h 1 v 1 h 1 v 3 h -1 v 1 h -2 v 1 h 1 v 2 h -1 v 1 h -6 v -1 h -1 v -2 h 1 v -1 h -2 v -1 h -1 v -3 h 1 v -1 h 1 v -3"/> <path fill="#9edbf0" d="M 5 5 h 1 v 2 h -1 v -2"/> <path fill="#9edbf0" d="M 10 5 h 1 v 2 h -1 v -2"/> <path fill="#9edbf0" d="M 21 6 h 1 v 2 h -1 v -2"/> <path fill="#9edbf0" d="M 26 6 h 1 v 2 h -1 v -2"/>`
  
  const sampleImg = document.querySelector('.sample')
  const sampleImgWrapper = document.querySelector('.sample_wrapper')
  const handle = document.querySelector('.handle')
  let handleActive = false
  let newAngle = 0
  let oldX
  let oldY

  const svgWrapper = ({ content, color, w, h} ) =>{
    return `
      <div class="sprite">
        <svg x="0px" y="0px" width="100%" height="100%" viewBox="0 0 ${w || 16} ${h || 16}" fill="${color || 'black'}">${content}</svg>
      </div>  
      `
  }
  
  const animateSvg = ({target, start, end, speed, frameSize}) => {
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
    sampleImg.innerHTML = svgWrapper({content: svg, className:'cat', w:32})
    const sprite = sampleImg.childNodes[1]
    Object.assign(sprite.style, {
      width: '160px', 
      height: '80px'
    })
    animateSvg({target:sprite, end: 1, frameSize: 80})
  }

  animateSprite()

  const setTargetPos = (target, x, y) =>{
    Object.assign(target.style, { left: `${x}px`, top: `${y}px`})
  }

  handle.addEventListener('mouseenter', ()=>handleActive = true)
  handle.addEventListener('mouseleave', ()=>handleActive = false)


  const makeSpriteDraggable = sprite =>{
    let newX, newY

    const onDrag = e => {
      // if (handleActive) return
      const { x: offSetX, y: offSetY } = sprite.getBoundingClientRect()
      newX = offSetX + e.movementX
      newY = offSetY + e.movementY

      if (!handleActive) setTargetPos(sprite, newX, newY)
    }

    const onLetGo = () => {
      console.log('h', handleActive)
      // ? below didn't work
      // [['mousemove', handleOnDrag],['mouseup', handleOnLetGo]].forEach(evt => document.addEventListener(evt[0], evt[1]))

      document.removeEventListener('mousemove', onDrag)
      document.removeEventListener('mouseup', onLetGo)
      if (!handleActive) setTargetPos(sprite, newX, newY)
    }

    const rotateOff = () =>{
      handle.removeEventListener('mousemove', rotateOn)
      handle.removeEventListener('mouseup', rotateOff)
    }

    const rotateOn = e =>{
      if (!handleActive) return

      const dirX = e.pageX < oldX ? 'left' : 'right'
      const dirY = e.pageY < oldY ? 'up' : 'down'
      oldX = e.pageX
      oldY = e.pageY

      console.log(dirX, dirY)
      if (dirX + dirY === 'leftdown' || dirX + dirY === 'rightup') newAngle += 5
      if (dirX + dirY === 'rightdown' || dirX + dirY === 'leftup') newAngle -= 5

      sprite.childNodes[3].style.transform = `rotate(${newAngle}deg)`
      handle.style.transform = `rotate(${newAngle}deg)`
    }

    const startRotate = () =>{
      handle.addEventListener('mousemove', rotateOn)
      handle.addEventListener('mouseup', rotateOff)
    }
    
    const onGrab = () => {
      document.addEventListener('mousemove', onDrag)
      document.addEventListener('mouseup', onLetGo)
    }  

    sprite.addEventListener('mousedown', onGrab)
    handle.addEventListener('mousedown', startRotate)
  }  

  makeSpriteDraggable(sampleImgWrapper)

  sampleImg.addEventListener('click', ()=>{
    console.log('test')
  })


  // TODO how to make handle that is visible despite overflow hidden?

  // const handle = window.getComputedStyle(
  //   document.querySelector('.sample_wrapper'), ':before'
  // )
  




  handle.addEventListener('click', (e)=>{
    console.log('hello', e.target)
    console.log('x', e.movementX)
    console.log('y', e.movementY)
  })
  
}

window.addEventListener('DOMContentLoaded', init)
