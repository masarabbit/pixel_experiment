function init() {

  const canvas = document.querySelectorAll('.canvas')
  const canvasOutput = document.querySelector('.canvas_output')
  const cursor = document.querySelector('.cursor')
  const imageCount = document.querySelector('.image_count')
  const output = document.querySelector('.output')
  const imgNameInput = document.querySelector('.img_name')
  const imgNoInput = document.querySelector('.img_no')
  const scaleInput = document.querySelector('.scale')
  // const indicator = document.querySelector('.indicator')
  const gif = document.querySelector('.gif')
  
  // button
  const alts = document.querySelectorAll('.alt')
  const buttons = document.querySelectorAll('button')

  // input
  const upload = document.querySelector('#upload')
  const colorInput = document.querySelector('#color')
  const colorLabel = document.querySelector('.color_label')
  let uploadFiles
  let backgroundColor = '#ffffff'

  // drag
  const slotInfo = []
  const sequenceOutput = document.querySelector('.sequence')
  const thumbOutput = document.querySelector('.s_output')
  let sequence = []
  let slots
  let frames
  let draggable = true
  const thumbData = []

    
  colorInput.addEventListener('change',()=>{
    backgroundColor = colorInput.value
    colorLabel.style.backgroundColor = backgroundColor
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

  const combineImages = () =>{
    if (!uploadFiles || uploadFiles.length < 2) return
    canvas[0].classList.remove('display_none')

    const firstImage = new Image()
    firstImage.onload = () => {
      const { naturalWidth: w, naturalHeight: h } = firstImage
      setUpCanvas(canvas[0], w * uploadFiles.length, h)

      const w2 = 50
      const h2 = w2 * (w / h)
      setUpCanvas(canvas[1], w * uploadFiles.length, h)
      
      Array.from(uploadFiles).forEach((upload,i)=>{
        const blobURL = window.URL.createObjectURL(upload)
        const eachImage = new Image()   
        eachImage.onload = () => { 
          canvas[0].getContext('2d').drawImage(eachImage,i * w, 0, w, h)
          canvas[1].getContext('2d').drawImage(eachImage,i * w2, 0, w2, h2)
        }
        eachImage.src = blobURL
      })
    }
    firstImage.src = window.URL.createObjectURL(uploadFiles[0])    
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
    slot.classList.add('slot')
    slot.innerHTML =  `
    <div class="thumb_container" data-thumb_id=${thumbIndex} data-frame_id="${frameId}" >
      <div class="thumb_menu">
        <div class="delete" data-frame_id="${frameId}">&#8722;</div>
        <div class="duplicate" data-frame_id="${frameId}">&#43;</div>
      </div>
      <div class="input_wrapper">
        <p>${frameId}</p>
        <input class="transition input" placeholder="100" value="100" />
      </div>
    </div>`
    thumbData[thumbIndex] = frameId
    slot.childNodes[1].append(thumbImage)
    output.append(slot)
  }


  const createCopyCanvasAndDisplayThumbs = (canvas, thumbImage, imgNo, imageIndex, divide) =>{
    canvas.classList.add('divided_img')
    const scale = +scaleInput.value
    const img = new Image()
    img.onload = () => {
      // set up canvas and extract codes
      const { naturalWidth: w, naturalHeight: h } = img
      const newImgWidth = w / imgNo
      setUpCanvas(canvas, newImgWidth, h)
      const ctx = canvas.getContext('2d')
      const offset = divide ? imageIndex * -newImgWidth : 0
      ctx.drawImage(img, offset, 0, w, h)
      const codes = extractCodes(newImgWidth, h, ctx)
      
      // enlarge based on scale value and draw on canvas
      setUpCanvas(canvas, newImgWidth * scale, h * scale)
      codes.forEach((code, i)=>{
        const x = (i % newImgWidth) * scale
        const y = (Math.floor(i / h)) * scale
        ctx.fillStyle = code
        ctx.fillRect(x, y, scale, scale)
      })
      outputSvg(svgWrapper(signSvg, invertHex(backgroundColor), 71.8, 18.9), canvas)
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
    // sequenceOutput.value = sequence.join(' ')
    sequenceOutput.value = sequence.map(s=>thumbData[s]).join(' ')
  }

  const downloadDividedImgs = () =>{
    if (!output.childNodes.length) return
    document.querySelectorAll('.divided_img').forEach((c, i)=>{
      // downloadImage(c, `${imgNameInput.value}-${i}`)
      setTimeout(()=>{
        downloadImage(c, `${imgNameInput.value}-${i + 1}`)
      }, i * 200)
    })
  }


  const createGif = () =>{
    const dividedImages = document.querySelectorAll('.divided_img')
    if (dividedImages.length) {
      const transitionInput = document.querySelectorAll('.transition')
      const encoder = new GIFEncoder()
      encoder.setRepeat(0) //auto-loop
      encoder.start()
      console.log('sequence', sequence, 'thumbData', thumbData)
      sequence.forEach(index=>{
        if (index !== ' '){
          encoder.setDelay(transitionInput[index].value)
          console.log('dividedImages index', thumbData[index] - 1, 'index', index)

          encoder.addFrame(dividedImages[thumbData[index] - 1].getContext('2d'))
        }
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
    console.log(gif.src)
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

  // drag
  const addFramePositionActions = frame =>{
    frame.childNodes[1].classList.add('select')
    let newX
    let newY
    // const frameId = +frame.dataset.frame_id
    const thumbId = +frame.dataset.thumb_id
    // const positionWithinSequence = sequence.indexOf(frameId)

    const onDrag = e => {
      frame.style.transtion = '0s'
      const { x: offSetX, y: offSetY } = frame.getBoundingClientRect()
      newX = offSetX + e.movementX
      newY = offSetY + e.movementY
      setTargetPos(frame, newX, newY)
    }
    
    const tidySequence = () => sequence = sequence.map(s => s === thumbId ? ' ' : s )

    const onLetGo = () => {
      if (!draggable) return //TODO could this be made specific to the frame currently being dragged?
      draggable = false
      frame.childNodes[1].classList.remove('select')
      document.removeEventListener('mousemove', onDrag)
      document.removeEventListener('mouseup', onLetGo)
      let matchSlot

      frames.forEach(frame=>{
        frame.style.backgroundColor = 'transparent'
      }) 
      const currentSequence = [...sequence]
      const currentSelection = currentSequence.indexOf(+frame.dataset.thumb_id)

      slotInfo.forEach((info,i)=>{      
        const frameInsideSlot = frames[currentSequence[i]]  
        const newXC = newX + 50
        const newYC = newY + 55

        if ((newXC > info.x && newXC < info.x + 70) &&
            (newYC > info.y && newYC < info.y + 110)){
          frame.style.transition = '0.3s'
          newX = info.x
          newY = info.y
          matchSlot = true   

          // TODO refactor
          //* ends up with duplicate when there are slots with no content
          if (frameInsideSlot) {
            frames.forEach(frame=>{
              const framePos = currentSequence.indexOf(+frame.dataset.thumb_id)    
              frame.style.transition = '0.3s'
              if (framePos < currentSelection && framePos >= i) { 
                frame.style.backgroundColor = 'yellow'  // migi
                frame.style.left = `${slotInfo[framePos + 1].x}px`
                sequence[framePos + 1] = currentSequence[framePos]
                if (sequence[framePos] === currentSequence[framePos]) sequence[framePos] = ' ' // TODO doesn't always work
              } 
              if (framePos > currentSelection && framePos <= i) {
                frame.style.backgroundColor = 'green'  // hidari
                frame.style.left = `${slotInfo[framePos - 1].x}px`
                sequence[framePos - 1] = currentSequence[framePos]
                if (sequence[framePos] === currentSequence[framePos]) sequence[framePos] = ' ' // TODO doesn't always work
              }  
            })
          }
          sequence[i] = frameInsideSlot ? currentSequence[currentSelection] : +frame.dataset.thumb_id
        } else if (!matchSlot && (newX || newY)){
          tidySequence()
          slots[i].style.backgroundColor = 'transparent'
        }
      })
      sequenceOutput.value = sequence.map(s=>thumbData[s]).join(' ')
      thumbOutput.value = sequence.join(' ')
      setTargetPos(frame, newX, newY)
      setTimeout(()=> frames.forEach(frame => frame.style.transition = '0s'), 0)
      setTimeout(()=> draggable = true, 400)
    }
    const onGrab = () => {
      document.addEventListener('mousemove', onDrag)
      document.addEventListener('mouseup', onLetGo)
    }
    frame.addEventListener('mousedown', onGrab)
  }  

  const recordSlotPos = () =>{
    slots = document.querySelectorAll('.slot')
    slots.forEach((slot,i)=>{
      const { x, y } = slot.getBoundingClientRect()
      slot.dataset.i = i
      slotInfo[i] = { x, y }
    })
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
    imageCount.innerHTML = `image x ${uploadFiles.length}`
    if (uploadFiles.length < 1) return

    output.innerHTML = ''
    canvasOutput.innerHTML = ''
    sequence.length = 0

    new Array(uploadFiles.length).fill('').forEach((_file,i)=>{
      const thumbImage = document.createElement('img')
      createThumbs(i, i, thumbImage)
      // thumbImage.src = uploadFiles[i].toDataURL()
      const newCanvas = document.createElement('canvas')
      canvasOutput.append(newCanvas)
      createCopyCanvasAndDisplayThumbs(newCanvas, thumbImage, 1, i, false)
    })

    makeThumbsDraggable()
  }


  upload.addEventListener('change', uploadImage )


  const addDuplicateAction = () =>{
    const duplicateButtons = document.querySelectorAll('.duplicate')

    duplicateButtons.forEach(button=>{
      button.addEventListener('click', (e)=>{
        // console.log(e.target.dataset.id)
        const frameIndex = +e.target.dataset.frame_id - 1
        const thumbIndex = slots.length
        const thumbImage = document.createElement('img')
        createThumbs(frameIndex, thumbIndex, thumbImage)
        
        //TODO edit slot edit
        const dividedImages = document.querySelectorAll('.divided_img')
        createCopyCanvasAndDisplayThumbs(dividedImages[frameIndex], thumbImage, +imgNoInput.value, frameIndex, true) 
        frames = document.querySelectorAll('.thumb_container') 
        addFramePositionActions(frames[frames.length - 1])
        sequence.push(thumbIndex)
        sequenceOutput.value = sequence.map(s=>thumbData[s]).join(' ')
        repositionFrames()
      })
    })
  }


  const divide = () =>{
    if (!uploadFiles || uploadFiles.length > 1) return
    output.innerHTML = ''
    canvasOutput.innerHTML = ''
    sequence.length = 0
    const imgNo = +imgNoInput.value

    new Array(imgNo).fill('').forEach((_file,imageIndex)=>{
      const thumbImage = document.createElement('img')
      createThumbs(imageIndex, imageIndex, thumbImage)
      
      const newCanvas = document.createElement('canvas')
      canvasOutput.append(newCanvas)
      createCopyCanvasAndDisplayThumbs(newCanvas, thumbImage, imgNo, imageIndex, true) 
    })
    addDuplicateAction()
    makeThumbsDraggable()
  }
  
  const buttonTrigger = (button, classId, action) =>{
    if (button.classList.contains(classId)) button.addEventListener('click', action)
  }
  
  buttons.forEach(button=>{
    buttonTrigger(button, 'download_file', ()=>downloadImage(canvas[0], imgNameInput.value))
    buttonTrigger(button, 'combine', combineImages)
    buttonTrigger(button, 'divide', divide)
    buttonTrigger(button, 'download_imgs', downloadDividedImgs)
    buttonTrigger(button, 'create_gif', createGif)
    buttonTrigger(button, 'download_gif', downloadGif)
  })

  window.addEventListener('resize',()=>{
    repositionFrames()
  })   

  // copyGrid.addEventListener('click',()=>{
  //   indicator.innerHTML = ''
  // })


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

}

window.addEventListener('DOMContentLoaded', init)
