function init() {

  // TODO imageSmoothing might not be mixable.

  // TODO add image flip
  // TODO simplify rotate?
  // TODO edit nav bar (and hide palette)

  // TODO make it draggable on the phone, and make the ui responsive
  // partly done, but not fully...

  // TODO use setTargetPos and setTargetSize where possible


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

  const spriteDatas = []
  const palette = document.querySelector('.palette')
  const artboard = document.querySelector('.artboard')
  const canvas = document.querySelectorAll('canvas')
  const renderCanvas = document.querySelectorAll('.render_canvas')
  const stamp = document.querySelector('.stamp')
  const indicator = document.querySelector('.indicator')
  const imageSmoothing = false
  const imageQuality = 'high'
  const seq = [0, 1, 2, 3]
  const gif = document.querySelector('.gif')
  const buttons = document.querySelectorAll('.button')
  const handleOffset = 32
  const alts = document.querySelectorAll('.alt')
  const cursor = document.querySelector('.cursor')
  // let count = 0
  const count = {
    sprite: 0,
    frame: 0
  }
  let speed = 300
  let imgName
  const stampData = { 
    interval: null,
    active: false,
    index: null 
  }
  const drawData = {
    handleActive: false,
    rotate: false,
    resize: false,
    resize_artboard: false,
  } 


  // TODO change to:
  // const input = {
  //   row
  // }
  const rowInput = document.querySelector('.row')
  const columnInput = document.querySelector('.column')
  const colorInput = document.querySelector('#color')
  const colorLabel = document.querySelector('.color_label')
  const hexInput = document.querySelector('.hex')
  const selectedInput = document.querySelector('.selected')
  const outputBox = document.querySelector('.output')

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
      : spriteDatas[spriteIndex] || { interval: null }
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
  
  const setTargetSize = (target, w, h) =>{
    const unit = w * 0 === 0 ? 'px' : ''
    Object.assign(target.style, { width: `${w}${unit}`, height: `${h}${unit}` })
  }


  const addEvents = (target, action, event, array) =>{
    array.forEach(a => {
      event === 'remove' ? target.removeEventListener(a, action) : target.addEventListener(a, action)
    })
  }
  const mouseUp = (t, a, e) => addEvents(t, a, e, ['mouseup', 'touchend'])
  const mouseMove = (t, a, e) => addEvents(t, a, e, ['mousemove', 'touchmove'])
  const mouseDown = (t, a, e) => addEvents(t, a, e, ['mousedown', 'touchstart'])
  const mouseEnter = (t, a, e) => addEvents(t, a, e, ['mouseenter', 'touchstart'])
  const mouseLeave = (t, a, e) => addEvents(t, a, e, ['mouseleave', 'touchmove'])


  const makeSpriteDraggable = (target, targetSpriteData) => {
    const pos = { a: 0, b: 0, c: 0, d: 0 }

    const onGrab = e => {
      pos.c = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX
      pos.d = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY
      mouseUp(document, onLetGo, 'add')
      mouseMove(document, onDrag, 'add')
    }
    const onDrag = e => {
      const x = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX
      const y = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY
      pos.a = pos.c - x
      pos.b = pos.d - y
      pos.c = x
      pos.d = y
      if (!drawData.handleActive) {
        const newX = target.offsetLeft - pos.a
        const newY = target.offsetTop - pos.b

        Object.assign(targetSpriteData, { 
          x: newX - artboard.offsetLeft, 
          y: newY - artboard.offsetTop
        })
        setTargetPos(target, newX, newY)
      }
    }
    const onLetGo = () => {
      mouseUp(document, onLetGo, 'remove')
      mouseMove(document, onDrag, 'remove')
    }
    mouseDown(target, onGrab, 'add')
  }

  

  const makeResizable = (target, spriteData) =>{
    const pos = { a: 0, b: 0, c: 0, d: 0 }
    const handle = target.childNodes[1]
    const isArtboard = target === artboard
    
    const onGrab = e =>{
      if (drawData.resize || drawData.resize_artboard ) {
        if (!isArtboard) drawData.handleActive = true
        console.log('test', drawData)
        pos.c = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX
        pos.d = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY   
        mouseUp(document, onLetGo, 'add')
        mouseMove(document, onDrag, 'add')
      }
    }
    const onDrag = e =>{
      const x = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX
      const y = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY
      pos.a = x - pos.c
      pos.b = y - pos.d
      pos.c = x
      pos.d = y
      if (isArtboard && drawData.resize_artboard) {
        const { width, height } = artboard.getBoundingClientRect()
        columnInput.value = width + pos.a
        rowInput.value = height + pos.b
        setTargetSize(artboard, columnInput.value, rowInput.value)

      } else if (spriteData) {
        const newW = spriteData.w + pos.a
        const newH = spriteData.h + pos.a

        Object.assign(spriteData, { w: newW, h: newH })
        const { frameNo } = svgData[spriteData.svgIndex]
        setTargetSize(handle, newW + handleOffset, newH + handleOffset)
        setTargetSize(target.childNodes[3], newW, newH)
        setTargetSize(target.childNodes[3].childNodes[1], newW * frameNo, newH)
      }
    }
    const onLetGo = () => {
      mouseUp(document, onLetGo, 'remove')
      mouseMove(document, onDrag, 'remove')
      drawData.handleActive = false
    }
    isArtboard 
      ? mouseDown(artboard, onGrab, 'add')
      : mouseDown(handle, onGrab, 'add')
  }

  makeResizable(artboard)


  const makeSpriteRotatable = (target, spriteData) =>{
    const handle = target.childNodes[1]
    
    const onGrab = e =>{
      if (!drawData.rotate) return
      spriteData.angle = getAngle(e)
      drawData.handleActive = true
      mouseUp(document, onLetGo, 'add')
      mouseMove(document, onDrag, 'add')
    }
    const getAngle = e =>{
      const { left, top, width, height } = handle.getBoundingClientRect()
      const center = {
        x: left + width / 2 || 0,
        y: top + height / 2 || 0,
      }
      const x = e.type[0] === 'm' ? e.pageX : e.touches[0].pageX
      const y = e.type[0] === 'm' ? e.pageY : e.touches[0].pageY

      const newAngle = Math.atan2(center.y - y, center.x - x)
      return newAngle - spriteData.angle
    }
    const onDrag = e =>{
      const newAngle = getAngle(e)
      target.childNodes[3].style.transform = `rotate(${newAngle}rad)`  
      handle.style.transform = `rotate(${newAngle}rad)`
    }
    const onLetGo = e => {
      mouseUp(document, onLetGo, 'remove')
      mouseMove(document, onDrag, 'remove')
      spriteData.angle = getAngle(e)

      spriteData.degree = Math.round(spriteData.angle * (180 / Math.PI))
      outputBox.innerHTML = JSON.stringify(spriteDatas)
      drawData.handleActive = false
    }
    mouseDown(handle, onGrab, 'add')
  }
  
  const createSprite = ({index, stampX, stampY, x, y}) =>{
    spriteDatas.push({ 
      angle: 0,
      svgIndex: index,
      w: 80, h: 80,
      x, y,
      interval: null,
    })

    const newSprite = document.createElement('div')
    newSprite.classList.add('sprite_wrapper')
    newSprite.innerHTML = `
      <div class="handle">
        <div class="handle_square"></div>
        <div class="resize_square"></div>
      </div>
      <div class="sprite_container" style="--color: ${svgData[index].color || svgData[index].main};"></div>`
    artboard.append(newSprite)
    setTargetPos(newSprite, stampX, stampY)

    const sprites = document.querySelectorAll('.sprite_wrapper')
    spriteDatas.forEach((data, i) =>{
      const { svg, frameNo, main, sub, color } = svgData[data.svgIndex]
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
    const targetSpriteData = spriteDatas[spriteDatas.length - 1]
    makeSpriteDraggable(newSprite, targetSpriteData)
    makeSpriteRotatable(newSprite, targetSpriteData)
    makeResizable(newSprite, targetSpriteData)
  }

  const createPalette = (target, svgData) =>{
    target.innerHTML = svgData.map( data =>{
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
  
    document.querySelectorAll('.palette_cell_inner').forEach( cell =>{
      const frameNo = cell.dataset.frame_no
      // Object.assign(cell.style, {
      //   width: `${100 * frameNo}%`, 
      //   height: '100%'
      // })
      setTargetSize(cell, `${100 * frameNo}%`, '100%')
      animateSvg({ target: cell, end: frameNo - 1, frameSize: 40 })
    })
    const paletteCells = document.querySelectorAll('.palette_cell')
    paletteCells.forEach((cell, i) => {
      cell.addEventListener('click', ()=> {
        stampData.index = stampData.index === i ? null : i   
        paletteCells.forEach(c => c.classList.remove('selected'))
        if (stampData.index === i) {
          cell.classList.add('selected')
          selectedInput.value = i
          Object.assign(drawData, { resize: false, rotate: false })
          artboard.className = 'artboard'
        } 
      })
      cell.addEventListener('click', ()=>createStamp(i))
    })
  }

  createPalette(palette, svgData)


  const check = []

  //* +++++++++++++++++++++++++++++++
  //* +++++++ output image ++++++++++
  //* +++++++++++++++++++++++++++++++

  const output = ({ content, ctx, w, h, frameNo, currentFrame, x, y, angle, id }) =>{
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
  
      check.push(id)
      count.sprite++

      // console.log(id, check)

      if (count.sprite < spriteDatas.length) {
        outputSpriteData(ctx, count.sprite, count.frame)
      } else if (count.frame < 4) {
        count.frame++
        count.sprite = 0
        createGif(count.sprite, count.frame)
      } else if (count.frame === 4 && count.sprite === spriteDatas.length) {
        compileGif()
        count.frame = 0
        count.sprite = 0
        check.length = 0
      } else {
        console.log('nothing')
      }
    }
    imageTarget.src = url
  }

  const animationFrame = (i, frameNo) =>{
    const rem = i % frameNo
    return rem === 0 ? frameNo : rem
  }
  

  const outputSpriteData = (ctx, spriteIndex, frameIndex) =>{
    // spriteDatas
    // console.log(spriteDatas[spriteIndex], spriteIndex, frameIndex)
    const { svg, main, sub, color, frameNo, } = svgData[spriteDatas[spriteIndex].svgIndex]
    const { x, y, w, h, angle } = spriteDatas[spriteIndex]

    output({
      content: svgWrapper({
        content: svg(main, sub),
        w: 16 * frameNo,
        h: 16,
        frameNo,
        color,
      }),
      ctx,
      w, h, x, y,
      angle,
      frameNo,
      currentFrame: animationFrame(frameIndex, frameNo),
      id: `sprite-${spriteIndex}/frame-${frameIndex}`
    })
  }

  const createGif = (spriteIndex, frameIndex) =>{
    const { width, height } = artboard.getBoundingClientRect()
    canvas[frameIndex].width = width
    canvas[frameIndex].height = height
    const ctx = canvas[frameIndex].getContext('2d')
    ctx.imageSmoothingQuality = imageQuality 

    ctx.fillStyle = colorInput.value
    ctx.fillRect(0, 0, width, height)

    outputSpriteData(ctx, spriteIndex, frameIndex)
  }


  
  const compileGif = () =>{
    const encoder = new GIFEncoder()
    encoder.setRepeat(0) //auto-loop
    encoder.start()
    
    seq.forEach(i=>{
      const ctx = canvas[i].getContext('2d')
      encoder.setDelay(speed)
      encoder.addFrame(ctx)
    })
    encoder.finish()

    const { width, height } = artboard.getBoundingClientRect()
    setTargetSize(gif, width, height)
    gif.src = 'data:image/gif;base64,' + encode64(encoder.stream().getData())
  }

  
  const downloadGif = () =>{
    if (!gif.src) return

    const link = document.createElement('a')
    link.download = `${imgName || 'gif'}_${new Date().getTime()}.gif`
    link.href = gif.src
    link.click()
  }
  
  const stampPos = e =>{
    const { width: w, height: h } = stamp.getBoundingClientRect()
    return {
      x: (e.pageX - w / 2),
      y: (e.pageY - h / 2)
    }
  }

  const isTouchDevice = () => {
    return ( 'ontouchstart' in window ) || ( navigator.maxTouchPoints > 0 ) || ( navigator.msMaxTouchPoints > 0 )
  }

  const activateStamp = () =>{
    if (stampData.active) {
      if (!isTouchDevice()) stamp.classList.remove('display_none') 
      artboard.classList.add('stamp_active')
    }
  }

  const deactivateStamp = () =>{
    if (!isTouchDevice()) stamp.classList.add('display_none')
    artboard.classList.remove('stamp_active')
  }

  const positionStamp = e =>{
    if (stampData.active) setTargetPos(stamp, stampPos(e).x, stampPos(e).y)
  }

  const stampAction = e =>{
    if (stampData.active) {
      const { w, h } = svgData[stampData.index]
      const { left, top } = artboard.getBoundingClientRect()
      const adjustedLeft = left + window.pageXOffset
      const adjustedTop = top + window.pageYOffset

      // console.log(artboard.parentNode.offsetLeft)
      createSprite({
        index: stampData.index, 
        stampX: stampPos(e).x - adjustedLeft, stampY: stampPos(e).y - adjustedTop, 
        x: e.pageX - (w / 2) - adjustedLeft, y: e.pageY - (h / 2) - adjustedTop
      })
    }
  }



  const createStamp = i =>{
    stampData.active = stampData.index === i ? true : false
    if (stampData.active) {
      const { svg, frameNo, main, sub, color} = svgData[i]
        animateSprite({
          target: stamp,
          content: svg(main, sub),
          w: 80, h: 80,
          frameNo,
          color,
          spriteIndex: i,
          stamp: true
        })
    }
  }

  const toggleMode = mode =>{
    stampData.active = false
    document.querySelectorAll('.palette_cell').forEach(cell => cell.classList.remove('selected'))

    Array.from(Object.keys(drawData)).forEach(m =>{
      m === mode
        ? drawData[m] = !drawData[m]
        : drawData[m] = false
    })
    artboard.className = drawData[mode] ? `artboard ${mode}_active` : 'artboard'
  }

  buttons.forEach(b =>{
    const addClickEvent = (className, event) =>{
      if (b.classList.contains(className)) b.addEventListener('click', event)
    }
    addClickEvent('create_gif', ()=> createGif(0, 0))
    addClickEvent('download_file', downloadGif)
    addClickEvent('rotate', ()=> toggleMode('rotate'))
    addClickEvent('resize', ()=> toggleMode('resize'))
    addClickEvent('resize_artboard', ()=> toggleMode('resize_artboard'))
  })

  hexInput.addEventListener('change',()=>{
    const bgColor = hexInput.value
    colorLabel.style.backgroundColor = bgColor
    artboard.style.backgroundColor = bgColor
    // createSign(svgWrapper(signSvg, invertHex(backgroundColor), signDim.w, signDim.h), hideBox)
  })

  colorInput.addEventListener('change',()=>{
    const bgColor = colorInput.value
    hexInput.value = bgColor
    artboard.style.backgroundColor = bgColor
    colorLabel.style.backgroundColor = bgColor
    // createSign(svgWrapper(signSvg, invertHex(backgroundColor), signDim.w, signDim.h), hideBox)
  })

  columnInput.addEventListener('change',()=> artboard.style.width = `${columnInput.value}px`)
  rowInput.addEventListener('change',()=> artboard.style.height = `${rowInput.value}px` )
  
  const updateColumnRow = () =>{
    const { width, height } = artboard.getBoundingClientRect()
    columnInput.value = width
    rowInput.value = height
  }

  updateColumnRow()
  

  mouseEnter(artboard, activateStamp, 'add')
  mouseLeave(artboard, deactivateStamp, 'add')
  artboard.addEventListener('mousemove', positionStamp)
  artboard.addEventListener('click', stampAction)


  window.addEventListener('mousemove', (e)=>{
    const { left, top } = artboard.getBoundingClientRect()
    indicator.innerHTML = `${e.pageX - 40 - left}-${e.pageY - 40 - top}`
  })

  const handleCursor = e => setTargetPos(cursor, e.pageX, e.pageY)

  window.addEventListener('mousemove', handleCursor)


  alts.forEach(button => {
    mouseEnter(button,
      e => cursor.childNodes[0].innerHTML = e.target.dataset.alt,
      'add'
      )
    mouseLeave(button,
      () => cursor.childNodes[0].innerHTML = '' ,
      'add'
      )
  })
  

}

window.addEventListener('DOMContentLoaded', init)


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

  

