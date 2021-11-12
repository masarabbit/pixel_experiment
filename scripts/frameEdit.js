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
  let sequence = []
  let slots
  let frames

    
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

  const rgbToHex = (r, g, b) => {
    if (r > 255 || g > 255 || b > 255)
      throw 'Invalid color component'
    return ((r << 16) | (g << 8) | b).toString(16)
  }

  const hex = rgb => '#' + ('000000' + rgb).slice(-6)

  const combineImages = () =>{
    if (!uploadFiles || uploadFiles.length < 2) return
    canvas[0].classList.remove('display_none')

    const firstImage = new Image()
    firstImage.onload = () => {
      const { naturalWidth:w, naturalHeight:h, } = firstImage
      canvas[0].setAttribute('width', w * uploadFiles.length)
      canvas[0].setAttribute('height', h)

      const w2 = 50
      const h2 = w2 * (w / h)
      canvas[1].setAttribute('width', w2 * uploadFiles.length)
      canvas[1].setAttribute('height', h2)
      
      Array.from(uploadFiles).forEach((upload,i)=>{
        const blobURL = window.URL.createObjectURL(upload)
        const eachImage = new Image()   
        eachImage.onload = () => {
          // console.log(w,h,eachImage)  
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


  const createThumbs = (i, thumbImage) =>{
    thumbImage.classList.add('thumb_image')
    const slot = document.createElement('div')
    slot.classList.add('slot')
    slot.innerHTML =  `
    <div class="thumb_container" data-id="${i + 1}" >
      <div class="input_wrapper">
        <p>${i + 1}</p>
        <input class="transition input" placeholder="100" value="100" />
      </div>
    </div>`

    slot.childNodes[1].append(thumbImage)
    output.append(slot)
  }

  const createCopyCanvasAndDisplayThumbs = (canvas, thumbImage, imgNo, imageIndex, divide) =>{
    canvas.classList.add('divided_img')
    const scale = +scaleInput.value
    const img = new Image()
    img.onload = () => {
      const { naturalWidth:w, naturalHeight:h } = img
      const newImgWidth = w / imgNo
      canvas.setAttribute('width', newImgWidth)
      canvas.setAttribute('height', h)

      const ctx = canvas.getContext('2d')
      const offset = divide ? imageIndex * -newImgWidth : 0
      ctx.drawImage(img, offset, 0, w, h)
      const codes = extractCodes(newImgWidth, h, ctx)
      
      // enlarge based on scale value
      canvas.setAttribute('width', newImgWidth * scale)
      canvas.setAttribute('height', h * scale)

      codes.forEach((code, i)=>{
        const x = (i % newImgWidth) * scale
        const y = (Math.floor(i / h)) * scale
        ctx.fillStyle = code
        ctx.fillRect(x, y, scale, scale)
      })

      thumbImage.src = canvas.toDataURL()
    }
    img.src = window.URL.createObjectURL(uploadFiles[ divide ? 0 : imageIndex])  
  }

  const makeThumbsDraggable = () =>{
    frames = document.querySelectorAll('.thumb_container')
    slots = document.querySelectorAll('.slot')
    sequence = new Array(slots.length).fill('').map((_s, i)=> i + 1)
    frames.forEach(frame => addFramePositionActions(frame))
    recordSlotPos()
    sequenceOutput.value = sequence.join(' ')
  }


  const divide = () =>{
    if (!uploadFiles || uploadFiles.length > 1) return
    output.innerHTML = ''
    canvasOutput.innerHTML = ''
    sequence.length = 0
    const imgNo = +imgNoInput.value

    new Array(imgNo).fill('').forEach((_file,imageIndex)=>{
      const thumbImage = document.createElement('img')
      createThumbs(imageIndex, thumbImage)
      
      const newCanvas = document.createElement('canvas')
      canvasOutput.append(newCanvas)
      createCopyCanvasAndDisplayThumbs(newCanvas, thumbImage, imgNo, imageIndex, true) 
    })

    makeThumbsDraggable()
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


  const buttonTrigger = (button, classId, action) =>{
    if (button.classList.contains(classId)) button.addEventListener('click', action)
  }


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

  // copyGrid.addEventListener('click',()=>{
  //   indicator.innerHTML = ''
  // })

  const createGif = () =>{
    const dividedImages = document.querySelectorAll('.divided_img')
    const transitionInput = document.querySelectorAll('.transition')
    if (!dividedImages.length) return
    
    const encoder = new GIFEncoder()
    encoder.setRepeat(0) //auto-loop
    encoder.start()
    
    dividedImages.forEach((_canvas, i)=>{
      const index = sequence.indexOf(i + 1)
      if (index === -1) return

      encoder.setDelay(transitionInput[index].value)
      encoder.addFrame(dividedImages[index].getContext('2d'))
    })
    
    encoder.finish()
    // const img = document.querySelector('.image')
    const { offsetHeight, offsetWidth } = dividedImages[0]
    gif.style.height = `${offsetHeight}px`
    gif.style.width = `${offsetWidth}px`
    gif.onload = () => repositionFrames()
    gif.src = 'data:image/gif;base64,'+encode64(encoder.stream().getData())
  }  

  const downloadGif = () =>{
    console.log(gif.src)
    if (!gif.src) return

    const link = document.createElement('a')
    link.download = `${imgNameInput.value || 'gif'}_${new Date().getTime()}.gif`
    link.href = gif.src
    link.click()
  }



  // drag
  const addFramePositionActions = frame =>{

    frame.childNodes[1].classList.add('select')
    let newX
    let newY
    const frameId = +frame.dataset.id
    const positionWithinSequence = sequence.indexOf(frameId)

    const onDrag = e => {
      frame.style.transtion = '0s'
      const { x: offSetX, y: offSetY } = frame.getBoundingClientRect()
      newX = offSetX + e.movementX
      newY = offSetY + e.movementY
      frame.style.left = `${newX}px`
      frame.style.top = `${newY}px`
    }
    
    const tidySequence = () => sequence = sequence.map(s => s === frameId ? ' ' : s )

    const onLetGo = () => {
      frame.childNodes[1].classList.remove('select')
      document.removeEventListener('mousemove', onDrag)
      document.removeEventListener('mouseup', onLetGo)
      let matchSlot

      slotInfo.forEach((info,i)=>{
        const openSlot = sequence.map((slot,i)=> slot === ' ' ? i : 'none').filter(slot => slot !== 'none')        
        const selectedFrame = frames[sequence[i] - 1]  
        // const positionWithinSequence = sequence.indexOf(frameId)
        const newXC = newX + 50
        const newYC = newY + 55

        if ((newXC > info.x && newXC < info.x + 70) &&
            (newYC > info.y && newYC < info.y + 110)){
          frame.style.transition = '0.3s'
          newX = info.x
          newY = info.y
          matchSlot = true
        
          // if slot is full  
          if(!openSlot.length && positionWithinSequence === -1) {
            selectedFrame.style.transition = '0.3s'
            selectedFrame.style.left =`${20 * frameId}px`
            selectedFrame.style.top = `${output.getBoundingClientRect().y - 100}px`
            sequence = sequence.map(s => s === selectedFrame.dataset.id ? ' ' : s)
          }

          //swap if frame outside slot overlap with frame in slot
          if(openSlot.length && positionWithinSequence === -1 && sequence[i] && sequence[i] !== ' ') {
            selectedFrame.style.transition = '0.3s'
            
            // checks for open slot
            let availableSlot
            let offset = 0
            while (!availableSlot) {
              offset++
              if (openSlot.find(s => s === i + offset)) availableSlot = i + offset
              if (openSlot.find(s => s === i - offset)) availableSlot = i - offset
            }
  
          selectedFrame.style.left =`${slotInfo[availableSlot].x}px`
          selectedFrame.style.top =`${slotInfo[availableSlot].y}px`
          sequence[availableSlot] = sequence[i]
          }
          //swap if square in slot overlap with another square in slot
          else if(positionWithinSequence !== -1 && sequence[i] && sequence[i] !== ' ') {
            selectedFrame.style.transition = '0.3s'
            selectedFrame.style.left =`${slotInfo[positionWithinSequence].x}px`
            selectedFrame.style.top =`${slotInfo[positionWithinSequence].y}px`
            sequence[positionWithinSequence] = sequence[i]
          } 

          //update sequence
          tidySequence()
          sequence[i] = frameId
        }  else if (!matchSlot && (newX || newY)){
          tidySequence()
        }
      })

      sequenceOutput.value = sequence.join(' ')
      frame.style.left = `${newX}px`
      frame.style.top = `${newY}px`
      setTimeout(()=> frames.forEach(frame => frame.style.transition = '0s'),200)
    }
    const onGrab = () => {
      document.addEventListener('mousemove', onDrag)
      document.addEventListener('mouseup', onLetGo)
    }
    frame.addEventListener('mousedown', onGrab)
  }  

  const recordSlotPos = () =>{
    slots.forEach((slot,i)=>{
      const { x, y } = slot.getBoundingClientRect()
      slot.dataset.i = i
      slotInfo[i] = { x, y }
    })
  }

  const repositionFrames = () =>{
    if (!sequence || sequence.length || !slots) return
    recordSlotPos()
    sequence.forEach((frame,i)=>{
      if (frame !== ' '){
        const { x, y } = slotInfo[i]
        frames[+frame -1].style.left = `${x}px`
        frames[+frame -1].style.top = `${y}px`
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
      createThumbs(i, thumbImage)
      // thumbImage.src = uploadFiles[i].toDataURL()
      const newCanvas = document.createElement('canvas')
      canvasOutput.append(newCanvas)
      createCopyCanvasAndDisplayThumbs(newCanvas, thumbImage, 1, i, false)
    })

    makeThumbsDraggable()
  }


  upload.addEventListener('change', uploadImage )

  
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
}

window.addEventListener('DOMContentLoaded', init)
