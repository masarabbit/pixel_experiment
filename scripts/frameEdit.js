function init() {

  //TODO reflect background colour when uploading multiple background
  //TODO buggy when creating gifs multiple times (old data doesn't get erased?)
  //TODO frames don't reposition when resizing (it does, but not when resizing with console window)

  const canvas = document.querySelectorAll('.canvas')
  const canvasOutput = document.querySelector('.canvas_output')
  const cursor = document.querySelector('.cursor')
  const imageCount = document.querySelector('.image_count')
  const output = document.querySelector('.output')
  const imgNameInput = document.querySelector('.img_name')
  const imgNoInput = document.querySelector('.img_no')
  const scaleInput = document.querySelector('.scale')
  const gif = document.querySelector('.gif')
  const hideBox = document.querySelector('.hide_box')
  
  // button
  const alts = document.querySelectorAll('.alt')
  const buttons = document.querySelectorAll('button')

  // input
  const upload = document.querySelector('#upload')
  const colorInput = document.querySelector('#color')
  const colorLabel = document.querySelector('.color_label')
  const uploadSizeInput = document.querySelector('.upload_size')
  const hexInput = document.querySelector('.hex')
  const transitionInput = document.querySelector('.transition_input')
  let uploadFiles
  let backgroundColor = 'transparent'

  // drag
  const slotInfo = []
  const codeData = []
  const sequenceOutput = document.querySelector('.sequence')
  const thumbOutput = document.querySelector('.s_output')
  let sequence = []
  let canvasData = { w: null, h: null }
  let slots
  let frames
  const thumbData = []
  let frameMode = 'upload'

    
  hexInput.addEventListener('change',()=>{
    backgroundColor = hexInput.value
    colorLabel.style.backgroundColor = backgroundColor
    createSign(svgWrapper(signSvg, invertHex(backgroundColor), signDim.w, signDim.h), hideBox)
  })

  colorInput.addEventListener('change',()=>{
    backgroundColor = colorInput.value
    hexInput.value = backgroundColor
    colorLabel.style.backgroundColor = backgroundColor
    createSign(svgWrapper(signSvg, invertHex(backgroundColor), signDim.w, signDim.h), hideBox)
  })

  const downloadImage = (canvas, name, date) =>{
    const link = document.createElement('a')
    link.download = `${name}_${date ? new Date().getTime() : ''}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  const setUpCanvas = (canvas, w, h) =>{
    canvas.setAttribute('width', w)
    canvas.setAttribute('height', h)
  }

  createSign(svgWrapper(signSvg, invertHex('#ffffff'), signDim.w, signDim.h), hideBox)
  

  const combineImages = () =>{
    const dividedImages = document.querySelectorAll('.divided_img')
    // console.log('dividedImages', dividedImages)
    if (!uploadFiles && !dividedImages.length) return
    canvas[0].classList.remove('display_none')
    // const wOffset = frameMode === 'divide' ? +imgNoInput.value : uploadFiles.length
    const wOffset = +imgNoInput.value
    // console.log('wOffset', wOffset)
    // const scale = +scaleInput.value

    const img = new Image()
    img.onload = () => {
      const { naturalWidth: w, naturalHeight: h } = img
      setUpCanvas(canvas[0], w * wOffset, h)

      const w2 = 50
      const h2 = w2 * (w / h)
      setUpCanvas(canvas[1], w * wOffset, h)
      
      sequence.filter(s=>s !== ' ').forEach((index,i)=>{
        const url = dividedImages[thumbData[index].frameId - 1].toDataURL()
        const eachImage = new Image()   
        eachImage.onload = () => { 
          canvas[0].getContext('2d').drawImage(eachImage, i * w, 0, w, h)
          canvas[1].getContext('2d').drawImage(eachImage, i * w2, 0, w2, h2)
        }
        eachImage.src = url
      })
    }
    img.src = dividedImages[0].toDataURL() 
    // console.log('u',uploadedFiles)
  }

  const extractCodes = (w, h, ctx) =>{
    return new Array(Math.round(w) * Math.round(h)).fill('').map((_code, i)=>{
      const x = i % w
      const y = Math.floor(i / h)
      const c = ctx.getImageData(x, y, 1, 1).data

      // this thing included here to prevent rendering black instead of transparent
      return c[3] === 0
        ? backgroundColor
        : hex(rgbToHex(c[0], c[1], c[2]))
    })
  }


  const createThumbs = (frameIndex, thumbIndex, thumbImage) =>{
    thumbImage.classList.add('thumb_image')
    const slot = document.createElement('div')
    const frameId = frameIndex + 1
    const transition = +transitionInput.value || 100
    slot.classList.add('slot')
    slot.innerHTML =  `
    <div class="thumb_container" data-thumb_id=${thumbIndex} data-frame_id="${frameId}" >
      <div class="thumb_menu">
        <div class="delete" data-thumb_id=${thumbIndex} data-frame_id="${frameId}">&#8722;</div>
        <div class="duplicate" data-thumb_id=${thumbIndex} data-frame_id="${frameId}">&#43;</div>
      </div>
      <div class="input_wrapper">
        <p>${frameId}</p>
        <input class="transition input" placeholder="100" value="${transition}" />
      </div>
    </div>`
    thumbData[thumbIndex] = { frameId, draggable: true }
    slot.childNodes[1].append(thumbImage)
    output.append(slot)
  }

  const resizeAndPaintCanvas = (canvas, w, h, scale, codes, ctx) =>{
    setUpCanvas(canvas, w * scale, h * scale)
    codes.forEach((code, i)=>{
      const x = (i % w) * scale
      const y = (Math.floor(i / h)) * scale
      ctx.fillStyle = code
      ctx.fillRect(x, y, scale, scale)
    })
  }

  const createCopyCanvasAndDisplayThumbs = (canvas, thumbImage, imgNo, imageIndex, divide) =>{
    canvas.classList.add('divided_img')
    const scale = +scaleInput.value
    const img = new Image()
    img.onload = () => {
      // set up canvas and extract codes
      
      const uploadSize = +uploadSizeInput.value
      let { naturalWidth: w, naturalHeight: h } = img
      if (uploadSize){
        w = uploadSize
        h = uploadSize
      }
      const newImgWidth = w / imgNo

      // record canvas' raw width and height to enable scaling
      if (imageIndex === 0) canvasData = { w: newImgWidth, h }

      setUpCanvas(canvas, newImgWidth, h)
      const ctx = canvas.getContext('2d')
      const offset = divide ? imageIndex * -newImgWidth : 0
      ctx.drawImage(img, offset, 0, w, h)
      const codes = extractCodes(newImgWidth, h, ctx)
      
      resizeAndPaintCanvas(canvas, newImgWidth, h, scale, codes, ctx)
      codeData[imageIndex] = codes
      // outputSvg(svgWrapper(signSvg, invertHex(backgroundColor), signDim.w, signDim.h), canvas)
      thumbImage.src = canvas.toDataURL()
    }
    img.src = window.URL.createObjectURL(uploadFiles[ divide ? 0 : imageIndex])  
  }
  
  const makeThumbsDraggable = () =>{
    frames = document.querySelectorAll('.thumb_container')
    slots = document.querySelectorAll('.slot')
    sequence = new Array(slots.length).fill('').map((_s, i)=> i)
    frames.forEach(frame => addFramePositionActions(frame))
    recordSlotPos()
    updateSequence()
  }

  const downloadDividedImgs = () =>{
    if (!output.childNodes.length) return
    document.querySelectorAll('.divided_img').forEach((c, i)=>{
      setTimeout(()=>{
        downloadImage(c, `${imgNameInput.value}-${i + 1}`)
      }, i * 200)
    })
  }

  const createGif = () =>{
    const dividedImages = document.querySelectorAll('.divided_img')
    if (dividedImages.length) {
      const transitionInput = document.querySelectorAll('.transition')

      sequence.filter(s=>s !== ' ').forEach( index =>{
        printSign(dividedImages[thumbData[index].frameId - 1])
      })

      const encoder = new GIFEncoder()
      encoder.setRepeat(0) //auto-loop
      encoder.start()
      sequence.filter(s=>s !== ' ').forEach((index,i) =>{
        encoder.setDelay(transitionInput[i]?.value)
        encoder.addFrame(dividedImages[thumbData[index].frameId - 1].getContext('2d'))
      })
      encoder.finish()
  
      const { offsetHeight, offsetWidth } = dividedImages[0]
      gif.style.height = `${offsetHeight}px`
      gif.style.width = `${offsetWidth}px`
      gif.onload = () => repositionFrames()
      gif.src = 'data:image/gif;base64,' + encode64(encoder.stream().getData())
    } 
  }  

  const downloadGif = () =>{
    // console.log(gif.src)
    if (!gif.src) return

    const link = document.createElement('a')
    link.download = `${imgNameInput.value || 'gif'}_${new Date().getTime()}.gif`
    link.href = gif.src
    link.click()
  }

  const setTargetPos = (target, x, y) =>{
    target.style.left = `${x}px`
    target.style.top = `${y}px`
  }

  const updateSequence = () =>{
    sequenceOutput.value = sequence.map(s=> (s === ' ' || (!s && s !== 0)) ? ' ' : thumbData[s].frameId).join(' ')
  }

  const tidySequence = id => sequence = sequence.map(s => s === id ? ' ' : s )

  // drag
  const addFramePositionActions = frame =>{
    const pos = { a: 0, b: 0, c: 0, d: 0 }
    const thumbId = +frame.dataset.thumb_id

    const onGrab = e => {
      pos.c = e.clientX
      pos.d = e.clientY
      document.addEventListener('mousemove', onDrag)
      document.addEventListener('mouseup', onLetGo)
    }

    const onDrag = e => {
      frame.style.transtion = '0s'
      pos.a = frame.offsetLeft - (pos.c - e.clientX)
      pos.b = frame.offsetTop - (pos.d - e.clientY)
      pos.c = e.clientX
      pos.d = e.clientY
      setTargetPos( frame, pos.a, pos.b)
    }
    
    const onLetGo = () => {
      const currentSequence = [...sequence]
      const currentSelection = currentSequence.indexOf(thumbId)

      frame.childNodes[1].classList.remove('select')
      document.removeEventListener('mousemove', onDrag)
      document.removeEventListener('mouseup', onLetGo)
      let matchSlot

      frames.forEach(frame=>{
        frame.style.backgroundColor = 'transparent'
      }) 

      slotInfo.forEach((info,i)=>{      
        const frameInsideSlot = frames[currentSequence[i]]  
        const newX = pos.a + 50
        const newY = pos.b + 55

        if ((newX > info.x && newX < info.x + 70) &&
            (newY > info.y && newY < info.y + 110)){

          if (!thumbData[thumbId].draggable) return 
          thumbData[thumbId].draggable = false    
          frame.style.transition = '0.3s'
          pos.a = info.x
          pos.b = info.y
          matchSlot = true   

          if (frameInsideSlot) {
            frames.forEach(frame=>{
              const framePos = currentSequence.indexOf(+frame.dataset.thumb_id)    
              frame.style.transition = '0.3s'
              frame.style.backgroundColor = 'rgba(0, 0, 0, 0.2)'
              if (currentSelection === -1) return
              if (framePos < currentSelection && framePos >= i) { 
                // frame.style.left = `${slotInfo[framePos + 1].x}px`
                setTargetPos(frame, slotInfo[framePos + 1].x, slotInfo[framePos + 1].y)
                tidySequence(currentSequence[framePos])
                sequence[framePos + 1] = currentSequence[framePos]
              } 
              if (framePos > currentSelection && framePos <= i) {
                // frame.style.left = `${slotInfo[framePos - 1].x}px`
                setTargetPos(frame, slotInfo[framePos - 1].x, slotInfo[framePos - 1].y)
                tidySequence(currentSequence[framePos])
                sequence[framePos - 1] = currentSequence[framePos]
              }  
            })
          }
          sequence[i] = frameInsideSlot ? currentSequence[currentSelection] : thumbId
          frames[thumbId].style.backgroundColor = 'grey'
        } else if (!matchSlot && (pos.a || pos.b)){
          thumbData[thumbId].draggable = true
          tidySequence(thumbId)
          slots[i].style.backgroundColor = 'transparent'
        }
      })
      updateSequence()
      thumbOutput.value = sequence.join(' ')
      setTargetPos(frame, pos.a, pos.b)
      setTimeout(()=> frames.forEach(frame => frame.style.transition = '0s'), 0)
      setTimeout(()=> thumbData[thumbId].draggable = true, 300)
    }

    frame.addEventListener('mousedown', onGrab)
  }  

  const recordSlotPos = () =>{
    slots = document.querySelectorAll('.slot')
    setTimeout(()=>{
      slots.forEach((slot,i)=>{
        const { x, y } = slot.getBoundingClientRect()
        slot.dataset.i = i
        slotInfo[i] = { x, y }
      })
    },100)
  }

  const repositionFrames = () =>{
    if (!sequence || !sequence.length || !slots) return
    recordSlotPos()
    sequence.forEach((frame,i)=>{
      if (frame !== ' '){
        const { x, y } = slotInfo[i] 
        setTargetPos(frames[+frame], x, y)
      }
    })
  }

  const uploadImage = () =>{
    uploadFiles = upload.files
    frameMode = 'upload'
    imageCount.innerHTML = `image x ${uploadFiles.length}`
    if (uploadFiles.length < 1) return

    output.innerHTML = ''
    canvasOutput.innerHTML = ''
    sequence.length = 0
    codeData.length = 0
    new Array(uploadFiles.length).fill('').forEach((_file,i)=>{
      const thumbImage = document.createElement('img')
      createThumbs(i, i, thumbImage)
      // thumbImage.src = uploadFiles[i].toDataURL()
      const newCanvas = document.createElement('canvas')
      canvasOutput.append(newCanvas)
      createCopyCanvasAndDisplayThumbs(newCanvas, thumbImage, 1, i, false)
    })
    // recordCanvasSize()
    addDuplicateAction(true)
    makeThumbsDraggable()
  }


  upload.addEventListener('change', uploadImage )

  const addAddAction = (button, upload) =>{
    button.addEventListener('click', (e)=>{
      const frameIndex = +e.target.dataset.frame_id - 1
      const thumbIndex = slots.length
      const thumbImage = document.createElement('img')
      createThumbs(frameIndex, thumbIndex, thumbImage)
      
      const dividedImages = document.querySelectorAll('.divided_img')
      createCopyCanvasAndDisplayThumbs(dividedImages[frameIndex], thumbImage, upload ? 1 : +imgNoInput.value, frameIndex, !upload) 
      frames = document.querySelectorAll('.thumb_container') 
      addFramePositionActions(frames[frames.length - 1])
      sequence.push(thumbIndex)
      updateSequence()
      repositionFrames()
      
      const newFrame = frames[thumbIndex]
      newFrame.style.backgroundColor = '#00e8d18e'
      
      // console.log('newFrame', newFrame.childNodes[1].childNodes)
      addAddAction(newFrame.childNodes[1].childNodes[3], upload)
      addDeleteAction(newFrame.childNodes[1].childNodes[1])
      // const { left, top } = frames[frameIndex].style
      // setTargetPos(frames[thumbIndex], +left.replace('px',''), +top.replace('px', '') - 120 )
    })
  }

  const addDeleteAction = button =>{
    button.addEventListener('click', (e)=>{
      const thumbIndex = +e.target.dataset.thumb_id

      frames[thumbIndex].classList.add('deleted_frame')
      tidySequence(thumbIndex)
      updateSequence()
    })
  }

  const addDuplicateAction = upload =>{
    document.querySelectorAll('.duplicate').forEach(button => addAddAction(button, upload))
    document.querySelectorAll('.delete').forEach(button => addDeleteAction(button))
  }

  const divide = () =>{
    if (!uploadFiles || uploadFiles.length > 1) return
    frameMode = 'divide'
    output.innerHTML = ''
    canvasOutput.innerHTML = ''
    sequence.length = 0
    const imgNo = +imgNoInput.value
    codeData.length = 0
    new Array(imgNo).fill('').forEach((_file,imageIndex)=>{
      const thumbImage = document.createElement('img')
      createThumbs(imageIndex, imageIndex, thumbImage)
      
      const newCanvas = document.createElement('canvas')
      canvasOutput.append(newCanvas)
      createCopyCanvasAndDisplayThumbs(newCanvas, thumbImage, imgNo, imageIndex, true) 
    })
    // recordCanvasSize()
    
    addDuplicateAction(false)
    makeThumbsDraggable()
  }
  
  const buttonTrigger = (button, classId, action) =>{
    if (button.classList.contains(classId)) button.addEventListener('click', action)
  }

  const updateCanvas = () => {
    // console.log('update canvas', frameMode)
    const dividedImages = document.querySelectorAll('.divided_img')
    if (dividedImages.length) {
      const { w, h } = canvasData
      const scale = +scaleInput.value

      dividedImages.forEach((canvas, index)=>{
        const { offsetWidth: w, offsetHeight: h } = canvas
        const ctx = canvas.getContext('2d')
        resizeAndPaintCanvas(canvas, w, h, scale, codeData[index], ctx)
      })
    }
    // console.log(codeData)
    // console.log(canvasData)
  }
  
  buttons.forEach(button=>{
    buttonTrigger(button, 'download_file', ()=>downloadImage(canvas[0], imgNameInput.value))
    buttonTrigger(button, 'combine', combineImages)
    buttonTrigger(button, 'divide', divide)
    buttonTrigger(button, 'download_imgs', downloadDividedImgs)
    buttonTrigger(button, 'create_gif', createGif)
    buttonTrigger(button, 'download_gif', downloadGif)
    buttonTrigger(button, 'update_canvas', updateCanvas)
  })

  window.addEventListener('resize',()=>{
    repositionFrames()
  })   
  
  // icon alt
  const handleCursor = e =>{
    cursor.style.top = `${e.pageY}px`
    cursor.style.left = `${e.pageX}px`
  }
  window.addEventListener('mousemove', handleCursor)

  alts.forEach(button=>{
    button.addEventListener('mouseover',(e)=>{
      cursor.childNodes[0].innerHTML = e.target.dataset.alt
    })
    button.addEventListener('mouseleave',()=>{
      cursor.childNodes[0].innerHTML = ''
    })
  })

  // const indicator = document.querySelector('.indicator')
  // copyGrid.addEventListener('click',()=>{
  //   indicator.innerHTML = ''
  // })

}

window.addEventListener('DOMContentLoaded', init)

