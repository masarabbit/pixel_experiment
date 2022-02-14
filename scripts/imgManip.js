function init() {

  const svg = (main, sub) =>{
    const one = main || '#4d8da3'
    const two = sub || '#9edbf0'
    return `<path fill="${one}" d="M 4 1 h 1 v 1 h 1 v 2 h 4 v -2 h 1 v -1 h 1 v 3 h 1 v 1 h 1 v 3 h -1 v 1 h -3 v 3 h 1 v 2 h -6 v -2 h 1 v -3 h -3 v -1 h -1 v -3 h 1 v -1 h 1 v -3"/> <path fill="${one}" d="M 20 2 h 1 v 1 h 1 v 2 h 4 v -2 h 1 v -1 h 1 v 3 h 1 v 1 h 1 v 3 h -1 v 1 h -2 v 1 h 1 v 2 h -1 v 1 h -6 v -1 h -1 v -2 h 1 v -1 h -2 v -1 h -1 v -3 h 1 v -1 h 1 v -3"/> <path fill="${two}" d="M 5 5 h 1 v 2 h -1 v -2"/> <path fill="${two}" d="M 10 5 h 1 v 2 h -1 v -2"/> <path fill="${two}" d="M 21 6 h 1 v 2 h -1 v -2"/> <path fill="${two}" d="M 26 6 h 1 v 2 h -1 v -2"/>`
  } 

  const svgData = [
    {
      svg: svg,
      main: '#ff7788',
      frameNo: 2,
    },
    {
      svg: svg,
      // color: '#ff0088',
      sub: '#8800ff',
      main: '#ff0088',
      frameNo: 2,
    },
  ]

  const spriteData = [
    {
      startAngle: 0
    }
  ]
  
  const sampleImg = document.querySelector('.sample')
  const sampleImgWrapper = document.querySelector('.sample_wrapper')
  // const handle = document.querySelector('.handle')
  const palette = document.querySelector('.palette')
  const playground = document.querySelector('.playground')
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
  
  const animateSprite = ({target, content, w, h, frameNo, frameSize, color}) =>{
    target.innerHTML = `
      <div class="sprite">
        ${svgWrapper({ content, w, h, color })}
      </div>
    `
      
    const sprite = target.childNodes[1]
    Object.assign(sprite.style, {
      width: `${80 * frameNo}px`, 
      height: '80px'
    })
    animateSvg({ target: sprite, end: frameNo - 1, frameSize })
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


  // let startAngle = 0
  makeSpriteRotatable = (target, startAngle) =>{
    const handle = target.childNodes[1]
    
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
      target.childNodes[3].style.transform = `rotate(${newAngle}rad)`  
      handle.style.transform = `rotate(${newAngle}rad)`
    }
    const onLetGo = e => {
      document.removeEventListener('mouseup', onLetGo)
      document.removeEventListener('mousemove', onDrag)
      startAngle = getAngle(e)
      handleActive = false
    }
    handle.addEventListener('mousedown', onGrab)
  }
  
  makeSpriteDraggable(sampleImgWrapper)
  animateSprite({
    target: sampleImg,
    content: svgData[0].svg(),
    w: 32,
    frameNo: 2,
    frameSize: 80
  })
  makeSpriteRotatable(sampleImgWrapper, spriteData[0].startAngle)

  // console.log(sampleImgWrapper.childNodes[3])

  const createPalette = (target, svgData) =>{
    target.innerHTML = svgData.map(data=>{
      const { svg, color, main, sub, frameNo } = data
      return `
        <div class="palette_cell">
          <div class="palette_cell_inner" data-frame_no="${frameNo}">
            ${svgWrapper({
              content: svg(main, sub),
              color,
              w: 16 * frameNo
            })}
          </div>
        </div>
      `
    }).join('')
  
    document.querySelectorAll('.palette_cell_inner').forEach(cell=>{
      const frameNo = cell.dataset.frame_no
      Object.assign(cell.style, {
        width: `${100 * frameNo}%`, 
        height: '100%'
      })
      animateSvg({ target: cell, end: frameNo - 1, frameSize: 40 })
    })

    document.querySelectorAll('.palette_cell').forEach((cell, i) =>{
      cell.addEventListener('click', ()=>{
        spriteData.push({ startAngle: 0}) //TODO need some way to keep track of this

        const newSprite = document.createElement('div')
        newSprite.classList.add('sample_wrapper')
        newSprite.innerHTML = `
          <div class="handle">
            <div class="handle_square"></div>
          </div>
          <div class="sample"></div>`
        playground.append(newSprite)
        // newSprite.innerHTML = 
        const { svg, frameNo, main, sub, color } = svgData[i]
        animateSprite({
          target: newSprite.childNodes[3],
          content: svg(main, sub),
          w: 16 * frameNo,
          frameNo,
          frameSize: 80,
          color
        })

        makeSpriteDraggable(newSprite)
        // console.log(newSprite.childNodes[1])
        makeSpriteRotatable(newSprite, spriteData[spriteData.length - 1].startAngle)
      })
    })
  }

  createPalette(palette, svgData)


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

