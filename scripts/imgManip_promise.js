function init() {

  // TODO imageSmoothing might not be mixable.
  // TODO addResize

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
  const renderCanvas = document.querySelectorAll('.render_canvas')
  // const indicator = document.querySelector('.indicator')
  // const indicatorTwo = document.querySelector('.indicator_two')
  // const imageSmoothing = false
  const imageQuality = 'high'
  let handleActive = false
  const seq = [1, 2, 3, 4]
  // const seq = [0, 1, 2, 3]
  const gif = document.querySelector('.gif')
  const colorInput = document.querySelector('#color')
  const colorLabel = document.querySelector('.color_label')
  const hexInput = document.querySelector('.hex')

  const buttons = document.querySelectorAll('.button')
  let count = 0
  let count2 = 0
  let speed = 300

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
  
  const animateSvg = ({ target, start, end, frameSize, spriteIndex }) => {
    const startFrame = start || 0
    let i = startFrame
    const spriteObj = spriteData[spriteIndex] || { interval: null }
    clearInterval(spriteObj.interval)
    spriteObj.interval = setInterval(()=> {
      target.style.marginLeft = `${-(i * (frameSize || 16))}px`
      i = i >= end
        ? startFrame
        : i + 1
    }, speed || 200)
  }
  
  const animateSprite = ({ target, content, w, h, frameNo, frameSize, color, spriteIndex }) =>{
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
    animateSvg({ target: sprite, end: frameNo - 1, frameSize, spriteIndex })
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
  
  const createSprite = index =>{
    spriteData.push({ 
      angle: 0,
      svgIndex: index,
      w: 80, h: 80,
      x: 0, y: 0,
      interval: null,
    }) //TODO need some way to keep track of this

    const newSprite = document.createElement('div')
    newSprite.classList.add('sample_wrapper')
    newSprite.innerHTML = `
      <div class="handle">
        <div class="handle_square"></div>
      </div>
      <div class="sample"></div>`
    playground.append(newSprite)
    
    const sprites = document.querySelectorAll('.sample_wrapper')
    spriteData.forEach((data, i)=>{
      const { svg, frameNo, main, sub, color} = svgData[data.svgIndex]
      animateSprite({
        target: sprites[i].childNodes[3],
        content: svg(main, sub),
        w: 16 * frameNo,
        frameNo,
        frameSize: 80,
        color,
        spriteIndex: i,
      })
    })
    
    const targetSpriteData = spriteData[spriteData.length - 1]
    makeSpriteDraggable(newSprite, targetSpriteData)
    // console.log(newSprite.childNodes[1])
    makeSpriteRotatable(newSprite, targetSpriteData)
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
      cell.addEventListener('click', ()=>createSprite(i))
    })
  }

  createPalette(palette, svgData)



  //* +++++++++++++++++++++++++++++++
  //* +++++++ output image ++++++++++
  //* +++++++++++++++++++++++++++++++

  // const dpr = window.devicePixelRatio || 1
  // console.log('dpr', dpr)

  const load = target => {
    return new Promise(function(resolve, _reject) {
      target.onload = resolve
    })
  }

  const complete = (index, check) =>{
    return new Promise(function(resolve, _reject) {
      console.log('test', index, check)
      if(index === check) resolve()
    })
  }


  const output = ({ content, ctx, w, h, frameNo, currentFrame, x, y, angle}) =>{
    const data = new Blob([content], { type: 'image/svg+xml;charset=utf-8' })
    const url = window.URL.createObjectURL(data)
    const imageTarget = new Image()

    const imageSmoothing = angle === 0 ? false : true

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

    imageTarget.src = url
    load(imageTarget).then(
      () => {
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
        console.log('a',count)
        if (count === 4) {
          console.log('trigger', count)
          // compileGif()
          count = 0
        }  
      }
    )
  }
  
  const animationPattern = (arr, num) => {
    return arr.map(item=>{
      const rem = item % num
      return rem === 0 ? num : rem
    })
  }
  
  
  const outputSpriteData = (ctx, index) =>{
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
        currentFrame: animationPattern(seq, frameNo)[index]
      })
    })
  }


  const createGif = () =>{
    // const encoder = new GIFEncoder()
    // encoder.setRepeat(0) //auto-loop
    // encoder.start()

    //* set up target canvas
    seq.forEach( (_n, i) =>{
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
    
    console.log('start')

    const { width, height } = playground.getBoundingClientRect()
    canvas[0].width = width
    canvas[0].height = height
    const ctx = canvas[0].getContext('2d')
    ctx.imageSmoothingQuality = imageQuality 

    
    
    seq.forEach( (_n, i) =>{
      ctx.fillStyle = colorInput.value
      ctx.fillRect(0, 0, width, height)
      outputSpriteData(ctx, i)
      console.log(count, i)
      complete(count, 4).then(()=>{
        console.log('b',count)
        // encoder.start()
        encoder.setDelay(speed) // TODO set this value somewhere?
        encoder.addFrame(ctx)
        count2++
      })
    })
    complete(count2 === 4).then(()=>{
      encoder.finish()

      // const { width, height } = playground.getBoundingClientRect()
      Object.assign(gif.style, {
        width: `${width}px`, 
        height: `${height}px`, 
      })
      gif.src = 'data:image/gif;base64,' + encode64(encoder.stream().getData())
      count2 = 0
    })
  
  }

  let imgName
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

  buttons.forEach(b =>{
    const addClickEvent = (className, event) =>{
      if (b.classList.contains(className)) b.addEventListener('click', event)
    }
    addClickEvent('create_gif', compileGif)
    // addClickEvent('compile', compileGif)
    addClickEvent('download_file', downloadGif)
    // addClickEvent('test', stopAnimation)
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

