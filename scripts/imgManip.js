function init() {

  // TODO imageSmoothing might not be mixable.

  // TODO add playground resize

  // TODO z-index

  const svg = (main, sub) =>{
    const one = main || '#4d8da3'
    const two = sub || '#9edbf0'
    return `<path fill="${one}" d="M 4 1 h 1 v 1 h 1 v 2 h 4 v -2 h 1 v -1 h 1 v 3 h 1 v 1 h 1 v 3 h -1 v 1 h -3 v 3 h 1 v 2 h -6 v -2 h 1 v -3 h -3 v -1 h -1 v -3 h 1 v -1 h 1 v -3"/> <path fill="${one}" d="M 20 2 h 1 v 1 h 1 v 2 h 4 v -2 h 1 v -1 h 1 v 3 h 1 v 1 h 1 v 3 h -1 v 1 h -2 v 1 h 1 v 2 h -1 v 1 h -6 v -1 h -1 v -2 h 1 v -1 h -2 v -1 h -1 v -3 h 1 v -1 h 1 v -3"/> <path fill="${two}" d="M 5 5 h 1 v 2 h -1 v -2"/> <path fill="${two}" d="M 10 5 h 1 v 2 h -1 v -2"/> <path fill="${two}" d="M 21 6 h 1 v 2 h -1 v -2"/> <path fill="${two}" d="M 26 6 h 1 v 2 h -1 v -2"/>`
  } 

  const feet = () =>{
    return `<path d="M 5 3 h 6 v 10 h -1 v -2 h -1 v 2 h -1 v -2 h -1 v 2 h -1 v -2 h -1 v 2 h -1 v -3 h 1 v -7"/> <path d="M 21 5 h 6 v 7 h -1 v -1 h -1 v 1 h -1 v -1 h -1 v 1 h -1 v -1 h -1 v 1 h -1 v -2 h 1 v -5"/> <path d="M 38 5 h 6 v 5 h -1 v 1 h -1 v 1 h -1 v -1 h -1 v 1 h -1 v -1 h -1 v 1 h -1 v -1 h -1 v -1 h 1 v -1 h 1 v -4"/> <path d="M 53 5 h 6 v 7 h -1 v -1 h -1 v 1 h -1 v -1 h -1 v 1 h -1 v -1 h -1 v 1 h -1 v -2 h 1 v -5"/> <path d="M 35 11 h 1 v 1 h -1 v -1"/> <path d="M 19 12 h 1 v 1 h -1 v -1"/> <path d="M 21 12 h 1 v 1 h -1 v -1"/> <path d="M 23 12 h 1 v 1 h -1 v -1"/> <path d="M 25 12 h 1 v 1 h -1 v -1"/> <path d="M 34 12 h 1 v 1 h -1 v -1"/> <path d="M 36 12 h 1 v 1 h -1 v -1"/> <path d="M 38 12 h 1 v 1 h -1 v -1"/> <path d="M 40 12 h 1 v 1 h -1 v -1"/> <path d="M 51 12 h 1 v 1 h -1 v -1"/> <path d="M 53 12 h 1 v 1 h -1 v -1"/> <path d="M 55 12 h 1 v 1 h -1 v -1"/> <path d="M 57 12 h 1 v 1 h -1 v -1"/>`
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
    {
      svg: feet,
      color: '#ff0088',
      // sub: '#8800ff',
      // main: '#ff0088',
      frameNo: 4,
      w: 80,
      h: 80
    },
  ]

  const spriteData = []
  
  const palette = document.querySelector('.palette')
  const playground = document.querySelector('.playground')
  const canvas = document.querySelectorAll('canvas')
  const renderCanvas = document.querySelectorAll('.render_canvas')
  const stamp = document.querySelector('.stamp')
  const indicator = document.querySelector('.indicator')
  const imageSmoothing = false
  const imageQuality = 'high'
  const drawData = {
    handleActive: false,
    rotate: false,
    resize: false,
  }
  // let handleActive = false

  // const seq = [1, 2, 3, 4]
  const seq = [0, 1, 2, 3]
  const gif = document.querySelector('.gif')
  const colorInput = document.querySelector('#color')
  const colorLabel = document.querySelector('.color_label')
  const hexInput = document.querySelector('.hex')
  const selectedInput = document.querySelector('.selected')

  const buttons = document.querySelectorAll('.button')
  let count = 0
  let speed = 300
  let imgName
  const stampData = { 
    interval: null,
    active: false,
    index: null 
  }

  const handleOffset = 32

  hexInput.addEventListener('change',()=>{
    backgroundColor = hexInput.value
    colorLabel.style.backgroundColor = backgroundColor
    playground.style.backgroundColor = backgroundColor
    createSign(svgWrapper(signSvg, invertHex(backgroundColor), signDim.w, signDim.h), hideBox)
  })

  colorInput.addEventListener('change',()=>{
    backgroundColor = colorInput.value
    hexInput.value = backgroundColor
    playground.style.backgroundColor = backgroundColor
    colorLabel.style.backgroundColor = backgroundColor
    // createSign(svgWrapper(signSvg, invertHex(backgroundColor), signDim.w, signDim.h), hideBox)
  })


  const svgContentWrapper = ({ content, color, w, h } ) =>{
    return `
        <svg x="0px" y="0px" width="100%" height="100%" viewBox="0 0 ${w || 16} ${h || 16}" fill="${color || 'black'}">${content}</svg>
      `
  }

  const svgWrapper = ({ content, color, w, h }) =>{
    return `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" fill="${color || 'black'}"
    width="100%" height="100%" viewBox="0 0 ${w} ${h}"
    >${content}</svg>`
  }
  
  const animateSvg = ({ target, start, end, spriteIndex, stamp }) => {
    const startFrame = start || 0
    let i = startFrame
    const spriteObj = stamp 
      ? stampData
      : spriteData[spriteIndex] || { interval: null }
    clearInterval(spriteObj.interval)
    spriteObj.interval = setInterval(()=> {
      target.style.marginLeft = `${-(i * 100)}%`
      i = i >= end
        ? startFrame
        : i + 1
    }, speed || 200)
  }
  
  const animateSprite = ({ target, content, w, h, frameNo, color, spriteIndex }) =>{
    target.innerHTML = `
      <div class="sprite">
        ${svgContentWrapper({ content, w:16 * frameNo, color })}
      </div>
    `
    const sprite = target.childNodes[1]
    Object.assign(sprite.style, {
      width: `${w * frameNo}px`, 
      height: `${h}px`
    })
    animateSvg({ target: sprite, end: frameNo - 1, spriteIndex })
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
      if (!drawData.handleActive) {
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

  const setTargetSize = (target, w, h) =>{
    Object.assign(target.style, { width: `${w}px`, height: `${h}px` })
  }

  makeSpriteResizable = (target, targetSpriteData) =>{
    const pos = { old: 0, new: 0 }
    const handle = target.childNodes[1]
    
    const onGrab = e =>{
      if (!drawData.resize) return
      pos.new = e.clientX
      document.addEventListener('mouseup', onLetGo)
      document.addEventListener('mousemove', onDrag)
    }
    const onDrag = e =>{
      pos.old = e.clientX - pos.new
      pos.new = e.clientX
      if (!drawData.handleActive) {
        const newW = targetSpriteData.w + pos.old
        const newH = targetSpriteData.h + pos.old

        Object.assign(targetSpriteData, { 
          w: newW, 
          h: newH
        })
        const { frameNo } = svgData[targetSpriteData.svgIndex]
        setTargetSize(handle, newW + handleOffset, newH + handleOffset)
        setTargetSize(target.childNodes[3], newW, newH)
        setTargetSize(target.childNodes[3].childNodes[1], newW * frameNo, newH)
      }
    }
    const onLetGo = () => {
      document.removeEventListener('mouseup', onLetGo)
      document.removeEventListener('mousemove', onDrag)
      drawData.handleActive = false
    }
    handle.addEventListener('mousedown', onGrab)
  }


  makeSpriteRotatable = (target, targetSpriteData) =>{
    const handle = target.childNodes[1]
    
    const onGrab = e =>{
      if (!drawData.rotate) return
      targetSpriteData.angle = getAngle(e)
      drawData.handleActive = true
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
      drawData.handleActive = false
    }
    handle.addEventListener('mousedown', onGrab)
  }
  
  const createSprite = (index, stampX, stampY, x, y) =>{
    spriteData.push({ 
      angle: 0,
      svgIndex: index,
      w: 80, h: 80,
      x, y,
      interval: null,
    }) //TODO need some way to keep track of this

    const newSprite = document.createElement('div')
    newSprite.classList.add('sprite_wrapper')
    newSprite.innerHTML = `
      <div class="handle">
        <div class="handle_square"></div>
        <div class="resize_square"></div>
      </div>
      <div class="sprite_container" style="--color: ${svgData[index].color || svgData[index].main};"></div>`
    playground.append(newSprite)
    setTargetPos(newSprite, stampX, stampY)

    const sprites = document.querySelectorAll('.sprite_wrapper')
    spriteData.forEach((data, i)=>{
      const { svg, frameNo, main, sub, color} = svgData[data.svgIndex]
      const { w, h } = data
      animateSprite({
        target: sprites[i].childNodes[3],
        content: svg(main, sub),
        w, h,
        frameNo,
        color,
        spriteIndex: i,
      })
    })
    
    const targetSpriteData = spriteData[spriteData.length - 1]
    makeSpriteDraggable(newSprite, targetSpriteData)
    // console.log(newSprite.childNodes[1])
    makeSpriteRotatable(newSprite, targetSpriteData)
    makeSpriteResizable(newSprite, targetSpriteData)
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

    const paletteCells = document.querySelectorAll('.palette_cell')

    paletteCells.forEach((cell, i) =>{
      cell.addEventListener('click', ()=>{
        stampData.index = stampData.index === i ? null : i   
        paletteCells.forEach(c => c.classList.remove('selected'))
        if (stampData.index === i) {
          cell.classList.add('selected')
          selectedInput.value = i
          Object.assign(drawData, { resize: false, rotate: false,})
          playground.className = 'playground'
        } 
      })
      
      cell.addEventListener('click', ()=>createStamp(i))
    })
  }

  createPalette(palette, svgData)





  //* +++++++++++++++++++++++++++++++
  //* +++++++ output image ++++++++++
  //* +++++++++++++++++++++++++++++++

  // const dpr = window.devicePixelRatio || 1
  // console.log('dpr', dpr)

  const output = ({ content, ctx, w, h, frameNo, currentFrame, x, y, angle}) =>{
    const data = new Blob([content], { type: 'image/svg+xml;charset=utf-8' })
    const url = window.URL.createObjectURL(data)
    const imageTarget = new Image()

    imageTarget.onload = () => {
      // * set up canvas
      renderCanvas[0].width = w
      renderCanvas[0].height = h
      const ctxA = renderCanvas[0].getContext('2d')
      ctxA.imageSmoothingEnabled = imageSmoothing
      ctxA.imageSmoothingQuality = imageQuality

      const hyp = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2))
      renderCanvas[1].width = hyp
      renderCanvas[1].height = hyp
      const ctxB = renderCanvas[1].getContext('2d')
      ctxB.imageSmoothingEnabled = imageSmoothing
      ctxB.imageSmoothingQuality = imageQuality 

      ctxA.drawImage(
        imageTarget, 
        (w / frameNo) * (currentFrame - 1), 0,  
        w, h,
        0, 0,
        w * frameNo, h * frameNo
      )
      
      ctxB.save()
      // ctxB.clearRect(0, 0, hyp, hyp)
      ctxB.translate(hyp / 2 , hyp / 2)  //TODO need to investigate how rotation works
      ctxB.rotate(angle)
      ctxB.translate(-hyp / 2 ,-hyp / 2) 
      const offsetW = (hyp - w) / 2
      const offsetY = (hyp - h) / 2
      ctxB.drawImage(renderCanvas[0], offsetW, offsetY)
      
      ctx.imageSmoothingEnabled = imageSmoothing
      ctx.drawImage(
        renderCanvas[1], 
        0, 0,                     // where to get the frame from
        hyp, hyp,                 // how much of the frame to copy
        x - offsetW, y - offsetY, // position within canvas / image
        hyp, hyp                  // how much of the frame to paste
      )
      
      ctxA.clearRect(0, 0, w, h)   
      ctxB.restore()
      ctxB.clearRect(0, 0, hyp, hyp)
      count++
      if (count === 4) {
        // console.log('trigger', count)
        compileGif()
        count = 0
      }  
    }
    imageTarget.src = url
  }
  
  // const animationPattern = (arr, num) => {
  //   return arr.map(item=>{
  //     const rem = item % num
  //     return rem === 0 ? num : rem
  //   })
  // }

  const animationFrame = (i, frameNo) =>{
    const rem = i % frameNo
    return rem === 0 ? frameNo : rem
  }
  
  
  const outputSpriteData = (ctx, index) =>{
    spriteData.forEach(data =>{
      const { svg, main, sub, color, frameNo, } = svgData[data.svgIndex]
      const { x, y, w, h, angle } = data

      output({
        content: svgWrapper({
          content: svg(main, sub),
          w: 16 * frameNo,
          h: 16,
          frameNo,
          color,
        }),
        ctx,
        w, h,
        x, y,
        angle,
        frameNo,
        currentFrame: animationFrame(index, frameNo)
      })
    })
  }


  const createGif = () =>{
    console.log(spriteData)
    const encoder = new GIFEncoder()
    encoder.setRepeat(0) //auto-loop
    encoder.start()

    //* set up target canvas
    seq.forEach(i=>{
      // if (i === 0) canvas[i].classList.remove('display_none')
      const { width, height } = playground.getBoundingClientRect()
      canvas[i].width = width
      canvas[i].height = height
      const ctx = canvas[i].getContext('2d')
      ctx.imageSmoothingQuality = imageQuality 
      ctx.fillStyle = colorInput.value
      ctx.fillRect(0, 0, width, height)

      outputSpriteData(ctx, i)
    })
  }

  
  const compileGif = () =>{
    //* start encoder
    const encoder = new GIFEncoder()
    encoder.setRepeat(0) //auto-loop
    encoder.start()
    
    seq.forEach(i=>{
      const ctx = canvas[i].getContext('2d')
      encoder.setDelay(speed) // TODO set this value somewhere?
      encoder.addFrame(ctx)
    })
    encoder.finish()

    const { width, height } = playground.getBoundingClientRect()
    Object.assign(gif.style, {
      width: `${width}px`, 
      height: `${height}px`, 
    })
    gif.src = 'data:image/gif;base64,' + encode64(encoder.stream().getData())
  }

  
  const downloadGif = () =>{
    console.log('test', gif.src)
    if (!gif.src) return

    const link = document.createElement('a')
    link.download = `${imgName || 'gif'}_${new Date().getTime()}.gif`
    link.href = gif.src
    link.click()
  }

  // const stopAnimation = () =>{
  //   console.log(spriteData)
  //   spriteData.forEach(data =>{
  //     clearInterval(data.interval)
  //   })
  // }

  // const handleCursor = e =>{
  //   cursor.style.top = `${e.pageY}px`
  //   cursor.style.left = `${e.pageX}px`
  // }
  // window.addEventListener('mousemove', handleCursor)

  

  const stampPos = e =>{
    const { width: w, height: h } = stamp.getBoundingClientRect()
    return {
      x: (e.pageX - w / 2),
      y: (e.pageY - h / 2)
    }
  }

  const activateStamp = () =>{
    if (stampData.active) {
      stamp.classList.remove('display_none') 
      playground.classList.add('stamp_active')
    }
  }

  const deactivateStamp = () =>{
    stamp.classList.add('display_none')
    playground.classList.remove('stamp_active')
  }

  const positionStamp = e =>{
    if (stampData.active) setTargetPos(stamp, stampPos(e).x, stampPos(e).y)
  }

  const stampAction = e =>{
    if (stampData.active) {
      const { w, h } = svgData[stampData.index]
      createSprite(
        stampData.index, 
        stampPos(e).x, stampPos(e).y, 
        e.pageX - playground.offsetLeft - (w / 2), e.pageY - playground.offsetTop - (h / 2)
      )
    }
  }

  playground.addEventListener('mouseenter', activateStamp)
  playground.addEventListener('mouseleave', deactivateStamp)
  playground.addEventListener('mousemove', positionStamp)
  playground.addEventListener('click', stampAction)


  const createStamp = i =>{
    // stamp.classList.toggle('display_none')
    // console.log(stampData)
    stampData.active = stampData.index === i ? true : false
    // stampData.index = i
    if (stampData.active) {
      // console.log(i)
      const { svg, frameNo, main, sub, color} = svgData[i]
        animateSprite({
          target: stamp,
          content: svg(main, sub),
          w: 80,
          h: 80,
          frameNo,
          color,
          spriteIndex: i,
          stamp: true
        })
    }
  }

  
  // TODO make this one function ?
  const toggleRotate = () =>{
    stampData.active = false
    document.querySelectorAll('.palette_cell').forEach(cell => cell.classList.remove('selected'))

    Object.assign(drawData, {
      rotate: !drawData.rotate,
      resize: false,
    })
    playground.className = drawData.rotate ? 'playground rotate_active' : 'playground'
  }

  const toggleResize = () =>{
    stampData.active = false
    document.querySelectorAll('.palette_cell').forEach(cell => cell.classList.remove('selected'))

    Object.assign(drawData, {
      resize: !drawData.resize,
      rotate: false,
    })
    playground.className = drawData.resize ? 'playground resize_active' : 'playground'
  }

  buttons.forEach(b =>{
    const addClickEvent = (className, event) =>{
      if (b.classList.contains(className)) b.addEventListener('click', event)
    }
    addClickEvent('create_gif', createGif)
    // addClickEvent('compile', compileGif)
    addClickEvent('download_file', downloadGif)
    addClickEvent('rotate', toggleRotate)
    addClickEvent('resize', toggleResize)
    // addClickEvent('test', stopAnimation)
  })


  

}

window.addEventListener('DOMContentLoaded', init)


