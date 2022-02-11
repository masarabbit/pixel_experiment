function init() {
  
  const svg = `<path fill="#4d8da3" d="M 4 1 h 1 v 1 h 1 v 2 h 4 v -2 h 1 v -1 h 1 v 3 h 1 v 1 h 1 v 3 h -1 v 1 h -3 v 3 h 1 v 2 h -6 v -2 h 1 v -3 h -3 v -1 h -1 v -3 h 1 v -1 h 1 v -3"/> <path fill="#4d8da3" d="M 20 2 h 1 v 1 h 1 v 2 h 4 v -2 h 1 v -1 h 1 v 3 h 1 v 1 h 1 v 3 h -1 v 1 h -2 v 1 h 1 v 2 h -1 v 1 h -6 v -1 h -1 v -2 h 1 v -1 h -2 v -1 h -1 v -3 h 1 v -1 h 1 v -3"/> <path fill="#9edbf0" d="M 5 5 h 1 v 2 h -1 v -2"/> <path fill="#9edbf0" d="M 10 5 h 1 v 2 h -1 v -2"/> <path fill="#9edbf0" d="M 21 6 h 1 v 2 h -1 v -2"/> <path fill="#9edbf0" d="M 26 6 h 1 v 2 h -1 v -2"/>`
  
  const sampleImg = document.querySelector('.sample')
  const sampleImgWrapper = document.querySelector('.sample_wrapper')

  const svgWrapper = ({ content, color, w, h} ) =>{
    return `
      <div class="handle"></div>
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
    const sprite = sampleImg.childNodes[3]
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

  const makeSpriteDraggable = sprite =>{
    let newX, newY

    const onDrag = e => {
      // sprite.style.transtion = '0s'
      const { x: offSetX, y: offSetY } = sprite.getBoundingClientRect()
      newX = offSetX + e.movementX
      newY = offSetY + e.movementY
      setTargetPos(sprite, newX, newY)
    }
    const onLetGo = () => {
      // frame.childNodes[1].classList.remove('select')

      // ? below didn't work
      // const handleOnLetGo = () =>{
      //   onLetGo
      // }
      // const handleOnDrag = e =>{
      //   onDrag(e)
      // }
      // [['mousemove', handleOnDrag],['mouseup', handleOnLetGo]].forEach(evt => document.addEventListener(evt[0], evt[1]))

      document.removeEventListener('mousemove', onDrag)
      document.removeEventListener('mouseup', onLetGo)
      setTargetPos(sprite, newX, newY)
    }
    const onGrab = () => {
      document.addEventListener('mousemove', onDrag)
      document.addEventListener('mouseup', onLetGo)
    }
    sprite.addEventListener('mousedown', onGrab)
  }  

  makeSpriteDraggable(sampleImgWrapper)
  
  sampleImg.addEventListener('click', ()=>{
    console.log('test')
  })


  // TODO how to make handle that is visible despite overflow hidden?

  // const handle = window.getComputedStyle(
  //   document.querySelector('.sample'), ':before'
  // );
  
  // handle.addEventListener('click', ()=>{
  //   console.log('hello')
  // })
  
}

window.addEventListener('DOMContentLoaded', init)
