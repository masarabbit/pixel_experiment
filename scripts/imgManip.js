function init() {

  const svg = '<path fill="#4d8da3" d="M 4 1 h 1 v 1 h 1 v 2 h 4 v -2 h 1 v -1 h 1 v 3 h 1 v 1 h 1 v 3 h -1 v 1 h -3 v 3 h 1 v 2 h -6 v -2 h 1 v -3 h -3 v -1 h -1 v -3 h 1 v -1 h 1 v -3"/> <path fill="#4d8da3" d="M 20 2 h 1 v 1 h 1 v 2 h 4 v -2 h 1 v -1 h 1 v 3 h 1 v 1 h 1 v 3 h -1 v 1 h -2 v 1 h 1 v 2 h -1 v 1 h -6 v -1 h -1 v -2 h 1 v -1 h -2 v -1 h -1 v -3 h 1 v -1 h 1 v -3"/> <path fill="#9edbf0" d="M 5 5 h 1 v 2 h -1 v -2"/> <path fill="#9edbf0" d="M 10 5 h 1 v 2 h -1 v -2"/> <path fill="#9edbf0" d="M 21 6 h 1 v 2 h -1 v -2"/> <path fill="#9edbf0" d="M 26 6 h 1 v 2 h -1 v -2"/>'
  
  const sampleImg = document.querySelector('.sample')
  const sampleImgWrapper = document.querySelector('.sample_wrapper')
  const handle = document.querySelector('.handle')
  // const handleSquare = document.querySelector('.handle_square')
  // const body = document.querySelector('body')
  // const indicator = document.querySelector('.indicator')
  // const indicatorTwo = document.querySelector('.indicator_two')
  let handleActive = false

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

  const setTargetPos = (target, x, y) =>{
    Object.assign(target.style, { left: `${x}px`, top: `${y}px` })
  }


  const makeSpriteDraggable = target => {
    const pos = { a: 0, b: 0, c: 0, d: 0 }

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


  let startAngle = 0
  makeSpriteRotatable = target =>{
    
    const onGrab = e =>{
      startAngle = getAngle(e)
      handleActive = true
      document.addEventListener('mouseup', onLetGo)
      document.addEventListener('mousemove', onDrag)
    }
    const getAngle = e =>{
      // const mark = document.querySelector('.mark')
      const { left, top, width, height } = handle.getBoundingClientRect()
      const center = {
        x: left + width / 2 || 0,
        y: top + height / 2 || 0,
      }
      const angle = Math.atan2(center.y - e.pageY, center.x - e.pageX)
      return angle - startAngle
    }
    const onDrag = e =>{
      const newAngle = getAngle(e)
      sampleImg.style.transform = `rotate(${newAngle}rad)`  
      target.style.transform = `rotate(${newAngle}rad)`
    }
    const onLetGo = e => {
      document.removeEventListener('mouseup', onLetGo)
      document.removeEventListener('mousemove', onDrag)
      startAngle = getAngle(e)
      handleActive = false
    }
    target.addEventListener('mousedown', onGrab)
  }
  
  makeSpriteDraggable(sampleImgWrapper)
  animateSprite()
  makeSpriteRotatable(handle)
  
}

window.addEventListener('DOMContentLoaded', init)


  // const createMark = target =>{
  //   const mark = document.createElement('div')
  //   mark.classList.add('mark')
  //   target.append(mark)
  //   const { width, height } = target.getBoundingClientRect()
  //   Object.assign(mark.style, {
  //     left: `${(width / 2) - (mark.clientWidth / 2)}px`, 
  //     top: `${(height / 2) - (mark.clientHeight / 2)}px`
  //   })
  // }
  // createMark(sampleImgWrapper)

  // window.addEventListener('mousemove',(e)=>{
  //   indicator.innerHTML = `pageX:${e.pageX} - pageY${e.pageY}`
  // })

