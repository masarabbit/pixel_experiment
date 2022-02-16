function init() {

  // TODO imageSmoothing might not be mixable.

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
      w: 80,
      h: 80
    },
    {
      svg: svg,
      // color: '#ff0088',
      sub: '#8800ff',
      main: '#ff0088',
      frameNo: 1,
      w: 80,
      h: 80
    },
  ]

  const spriteData = []
  
  // const sampleImg = document.querySelector('.sample')
  // const sampleImgWrapper = document.querySelector('.sample_wrapper')
  // const handle = document.querySelector('.handle')
  const palette = document.querySelector('.palette')
  const playground = document.querySelector('.playground')
  const canvas = document.querySelectorAll('canvas')
  // const handleSquare = document.querySelector('.handle_square')
  // const body = document.querySelector('body')
  // const indicator = document.querySelector('.indicator')
  // const indicatorTwo = document.querySelector('.indicator_two')
  // const imageSmoothing = false
  const imageQuality = 'high'
  let handleActive = false

  const buttons = document.querySelectorAll('.button')

  const svgContentWrapper = ({ content, color, w, h } ) =>{
    return `
      <div class="sprite">
        <svg x="0px" y="0px" width="100%" height="100%" viewBox="0 0 ${w || 16} ${h || 16}" fill="${color || 'black'}">${content}</svg>
      </div>  
      `
  }

  const svgWrapper = ({ content, w, h }) =>{
    return `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
    width="100%" height="100%" viewBox="0 0 ${w} ${h}"
    >${content}</svg>`
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
  
  const animateSprite = ({ target, content, w, h, frameNo, frameSize, color }) =>{
    target.innerHTML = `
      <div class="sprite">
        ${svgContentWrapper({ content, w, h, color })}
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


  const makeSpriteDraggable = (target, targetSpriteData) => {
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
      if (!handleActive) {
        const newX = target.offsetLeft - pos.a
        const newY = target.offsetTop - pos.b

        Object.assign(targetSpriteData, { 
          x: newX - playground.offsetLeft, 
          y: newY - playground.offsetTop
        })
        setTargetPos(target, newX, newY)
      }
    }
    const onLetGo = () => {
      document.removeEventListener('mouseup', onLetGo)
      document.removeEventListener('mousemove', onDrag)
    }
    target.addEventListener('mousedown', onGrab)
  }


  makeSpriteRotatable = (target, targetSpriteData) =>{
    const handle = target.childNodes[1]
    
    const onGrab = e =>{
      targetSpriteData.angle = getAngle(e)
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
      const newAngle = Math.atan2(center.y - e.pageY, center.x - e.pageX)
      return newAngle - targetSpriteData.angle
    }
    const onDrag = e =>{
      const newAngle = getAngle(e)
      target.childNodes[3].style.transform = `rotate(${newAngle}rad)`  
      handle.style.transform = `rotate(${newAngle}rad)`
    }
    const onLetGo = e => {
      document.removeEventListener('mouseup', onLetGo)
      document.removeEventListener('mousemove', onDrag)
      targetSpriteData.angle = getAngle(e)
      handleActive = false
    }
    handle.addEventListener('mousedown', onGrab)
  }
  

  const createPalette = (target, svgData) =>{
    target.innerHTML = svgData.map(data=>{
      const { svg, color, main, sub, frameNo } = data
      return `
        <div class="palette_cell">
          <div class="palette_cell_inner" data-frame_no="${frameNo}">
            ${svgContentWrapper({
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
        spriteData.push({ 
          angle: 0,
          svgIndex: i,
          w: 80,
          h: 80,
          x: 0,
          y: 0
        }) //TODO need some way to keep track of this

        const newSprite = document.createElement('div')
        newSprite.classList.add('sample_wrapper')
        newSprite.innerHTML = `
          <div class="handle">
            <div class="handle_square"></div>
          </div>
          <div class="sample"></div>`
        playground.append(newSprite)

        const { svg, frameNo, main, sub, color } = svgData[i]
        animateSprite({
          target: newSprite.childNodes[3],
          content: svg(main, sub),
          w: 16 * frameNo,
          frameNo,
          frameSize: 80,
          color
        })
        
        const targetSpriteData = spriteData[spriteData.length - 1]
        makeSpriteDraggable(newSprite, targetSpriteData)
        // console.log(newSprite.childNodes[1])
        makeSpriteRotatable(newSprite, targetSpriteData)
      })
    })
  }

  createPalette(palette, svgData)


  // const downloadImage = index =>{
  //   const link = document.createElement('a')
  //   link.download = `test_${new Date().getTime()}.png`
  //   link.href = canvas[index || 0].toDataURL()
  //   link.click()
  // }


  //* +++++++++++++++++++++++++++++++
  //* +++++++ output image ++++++++++
  //* +++++++++++++++++++++++++++++++

  // const dpr = window.devicePixelRatio || 1

  const output = ({ content, ctx, w, h, frameNo, currentFrame, x, y, angle}) =>{
    const data = new Blob([content], { type: 'image/svg+xml;charset=utf-8' })
    const url = window.URL.createObjectURL(data)
    const imageTarget = new Image()

    const imageSmoothing = angle === 0 ? false : true

    // * set up canvas
    canvas[1].width = w
    canvas[1].height = h
    const ctx2 = canvas[1].getContext('2d')
    ctx2.imageSmoothingEnabled = imageSmoothing
    ctx2.imageSmoothingQuality = imageQuality

    const hyp = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2))
    canvas[2].width = hyp
    canvas[2].height = hyp
    const ctx3 = canvas[2].getContext('2d')
    ctx3.imageSmoothingEnabled = imageSmoothing
    ctx3.imageSmoothingQuality = imageQuality 

    imageTarget.onload = () => {

      ctx2.drawImage(
        imageTarget, 
        (w / frameNo) * currentFrame, 0,  
        w, h,
        0, 0,
        w * frameNo, h * frameNo
      )
      
      ctx3.save()
      // ctx3.clearRect(0, 0, hyp, hyp)
      ctx3.translate(hyp / 2 , hyp / 2)  //TODO need to investigate how rotation works
      ctx3.rotate(angle)
      ctx3.translate(-hyp / 2 ,-hyp / 2) 
      const offsetW = (hyp - w) / 2
      const offsetY = (hyp - h) / 2
      ctx3.drawImage(canvas[1], offsetW, offsetY)
      
      ctx.imageSmoothingEnabled = imageSmoothing
      ctx.drawImage(
        canvas[2], 
        0, 0,                     // where to get the frame from
        hyp, hyp,                 // how much of the frame to copy
        x - offsetW, y - offsetY, // position within canvas / image
        hyp, hyp                  // how much of the frame to paste
      )
      
      ctx2.clearRect(0, 0, w, h)   
      ctx3.restore()
      ctx3.clearRect(0, 0, hyp, hyp)
    }
    imageTarget.src = url
  }
  


  const createGif = () =>{
    //* set up target canvas
  
    const { width, height } = playground.getBoundingClientRect()
    canvas[0].width = width
    canvas[0].height = height
  
    const ctx = canvas[0].getContext('2d')
    // ctx.imageSmoothingEnabled = imageSmoothing
    ctx.imageSmoothingQuality = imageQuality 
    // ctx.scale(ratio * dpr, ratio * dpr)

    spriteData.forEach(data =>{
      const { svg, main, sub, frameNo, w, h } = svgData[data.svgIndex]
      const { x, y, angle } = data

      output({
        content: svgWrapper({
          content: svg(main, sub),
          w: 16 * frameNo,
          h: 16,
          frameNo
        }),
        ctx,
        w, h,
        x, y,
        angle,
        frameNo,
        currentFrame: frameNo - 1, // TODO this will be looped through
      })
    })
  }

  buttons.forEach(b =>{
    const addClickEvent = (className, event) =>{
      if (b.classList.contains(className)) b.addEventListener('click', event)
    }
    addClickEvent('create_gif', createGif)
  })

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



   // ? sample
  // makeSpriteDraggable(sampleImgWrapper)
  // animateSprite({
  //   target: sampleImg,
  //   content: svgData[0].svg(),
  //   w: 32,
  //   frameNo: 2,
  //   frameSize: 80
  // })
  // makeSpriteRotatable(sampleImgWrapper, spriteData[0].angle)

  // console.log(sampleImgWrapper.childNodes[3])

