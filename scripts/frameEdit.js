function init() {

  const signSvg = `
  <g>
	<g>
		<path d="M3.1,18.3C2,19,0.8,18.8,0.2,18c-0.4-0.5,0-4.8,0-6.5C0.3,9.3,0.3,6.6,1.7,6c0.5-0.2,1.6-0.2,2,0
			c1.2,0.6,2.1,2,2.6,2.8c0.9,1.5,1.3,2.8,1.6,2.6s2.7-4.3,3.2-4.6c0.7-0.5,2.3-0.9,2.6-0.4c0.3,0.5,0.7,1.9,1,3
			c0.2,1,0.9,4.4,1.2,5.4c0.3,1,0.4,1.6,0.4,2.2c0,0.5,0,0.9-0.5,1c-0.4,0.1-0.7,0.2-1.1,0.3c-0.4,0.1-0.8,0.2-1.4,0
			c-0.6-0.3-0.9-2.5-1-3.2c-0.3-1.3-0.5-2.9-0.7-2.9c-0.3,0-0.7,0.8-1.4,1.5c-0.4,0.4-0.9,0.9-1.2,1.1c-0.3,0.3-0.7,0.6-1.2,0.5
			c-0.7,0-1.6-0.7-2.4-1.7c-0.8-1-1.4-2.9-1.6-2.8c-0.3,0.1-0.1,0.9-0.2,2.1s-0.1,2.2-0.1,2.6c0,0.6-0.1,1.4-0.1,1.7
			C3.2,17.6,3.3,18.2,3.1,18.3z"/>
		<path d="M27,17.1c0.5-0.7,3-1.1,2.9-2.1c-0.1-1-2.5-2.2-3.2-3.7c-0.5-1-0.6-2-0.3-3.3c0.1-0.7,1.3-1.8,2.8-1.7
			c0.8,0.1,1,0.9,1,1c-0.1,0.3-0.9-0.1-1.3,0.3c-0.5,0.6-0.4,1.6,0,2.2c0.4,0.6,2.8,1.7,3.4,2.4c0.4,0.5,1.1,2.2,1,2.8
			c-0.2,1.1-1.7,2.2-3.1,3.1c-0.5,0.3-1,0.6-1.8,0.7C27.8,18.9,26,18.6,27,17.1z"/>
		<path d="M37.5,10.9c-0.3-0.1-1.2,1.9-1.3,2.2c-0.1,0.4,0.2,1.6,0.5,1.7c0.3,0.1,1-0.6,1.3-1.1
			C38.3,13.4,38,11.1,37.5,10.9z M41.2,17c-0.6-0.2-1.3-1.7-1.5-1.6c-0.3,0.1-1.5,1.4-2.2,1.6c-0.4,0.1-2.1,0-2.4-0.2
			s-1.2-2.1-1.2-2.7c0.2-2.4,2.4-4.3,2.9-4.4c0.3-0.1,0.4,0.3,0.7,0.2c0.3-0.1,0.8-0.6,1.9-0.7c0.5,0,1.8,2,2.4,3.1
			c0.5,0.9,1.1,1.8,1.4,1.9c0.3,0.2,0.6,0.1,0.7,0.3c0.1,0.3,0.3,0.8,0.2,1.1c-0.1,0.4-0.6,0.9-0.8,1.1S41.5,17.1,41.2,17L41.2,17z"
			/>
		<path d="M47.1,15.8c-0.2,0.2-1.4,0.7-1.6,0.7s-0.7-0.6-0.8-0.9c-0.1-0.3-0.2-3.5-0.4-5.4S43,1.4,43,1
			c0.1-0.4,0.4-0.9,0.8-1c0.4-0.1,1.1,0.2,1.4,0.9c1,2.3,1.4,8.3,1.9,8.6c0.4,0.3,2.1-0.2,2.5,0.1c0.3,0.2,1.5,1,1.7,1.5
			c0.2,0.5,1.7,3.8,1.7,4.4C52.9,16.1,51.4,17,51,17c-0.2,0-1-0.3-1.3-1c-0.3-0.7-0.9-4.2-1.3-4.2C48.1,11.8,47.4,15.5,47.1,15.8z"
			/>
		<path d="M54.9,5.6c-0.1,0.2-1.2,0.8-1.7,0.6c-0.3-0.1-0.8-1-0.7-1.4C52.7,4.4,53,4,53.2,3.9c0.2-0.1,1.5,0,1.6,0.3
			c0.1,0.3,0,0.5,0,0.7S55.1,5.3,54.9,5.6z"/>
		<path d="M54.3,10.7c-0.2,0.2-0.8,3.7-0.6,4.2c0.1,0.4,0.5,1.3,0.8,1.3c0.4,0,1.7-0.6,1.8-0.9c0.1-0.3,0.2-0.6,0.2-0.9
			c0-0.3-0.8-3.7-0.9-3.9C55.4,10.4,54.6,10.5,54.3,10.7z"/>
		<path d="M58.8,9.3c-0.5-0.2-1.7,0-2.2-0.2c-0.4-0.2-0.8-1.5-0.1-1.8c0.6-0.3,2.1,0,2.2-0.3c0.1-0.3-0.1-0.8-0.2-1.3
			c0-0.4-0.2-2.5-0.2-2.9c0-0.6,0.5-1.6,0.8-1.7s1.3-0.1,1.4,0.2c0,0.5,0.1,0.9,0.2,1.4c0,0.4,0.1,0.9,0.2,1.3C60.9,4.5,61,5,61,5.6
			c0.1,0.3,0.1,1,0.4,1.1c0.2,0.1,1.7-0.2,2,0.1c0.2,0.2,0.5,0.4,0.6,0.8c0,0.3-0.8,1.2-1,1.3c-0.4,0.2-1.1,0-1.1,0.2
			c0,0.2,1.2,5.6,1.2,6.4s-0.3,1.8-0.5,2c-0.2,0.2-1.4,0.4-1.7,0.2c-0.3-0.2-1-0.7-1.1-1.2C59.6,16,59,9.5,58.8,9.3z"/>
		<path d="M23.7,17.2c-0.3-0.1-1.1-2.1-1.4-2.1c-0.3,0-1.1,1.4-1.7,1.7c-0.3,0.2-1.7,0.8-2.2,0.6c-0.4-0.2-2-2.6-2-4.1
			s1.1-3.9,2.7-4.4c1.3-0.5,2.8-0.6,3.3-0.1c0.5,0.5,0.9,2.1,1.5,3.1s2.7,3.6,2.6,4.2C26.5,16.7,24.1,17.4,23.7,17.2z M20.3,10.4
			c-0.2-0.1-1.3,1.2-1.6,2.1c-0.2,0.5,0.3,2.1,0.7,2.1c0.3,0,1.1-2,1.2-2.4C20.6,11.9,20.5,10.5,20.3,10.4z"/>
		<path d="M65.7,9.3c-0.3,0.3-1.3,3.9-1.4,4.4c0,0.6,0.2,1.5,0.4,1.9c0.2,0.4,1,0.6,1.1,0.7c0.1,0.1,0.2,0.3,0.5,0.5
			c0.3,0.1,2.5,0.3,2.8,0c0.4-0.3,2.6-3.1,2.6-4.9c0-0.9-1.9-2.7-2.5-3C68.6,8.6,66.3,8.7,65.7,9.3z M69,12.2c0,0.4-1.1,2.2-1.4,2.3
			c-0.2,0-0.6-0.2-0.7-0.6c-0.1-0.4-0.2-2.7,0-3c0.2-0.3,0.8-0.5,0.9-0.4c0.1,0,0.1,0.2,0.2,0.3C68.1,10.9,69.1,11.8,69,12.2
			L69,12.2z"/>
	</g>
</g>
  `

  const svgWrapper = (content, color, w, h) =>{
    return `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="${w}px" height="${h}px" viewBox="0 0 ${w} ${h}" fill="${color}">${content}</svg>`
  }

  const outputSvg = (content, canvas) =>{
    const data = new Blob([content], { type: 'image/svg+xml;charset=utf-8' })
    const url = window.URL.createObjectURL(data)
    const sign = new Image()
    sign.onload = () => {
      const { naturalWidth: w, naturalHeight: h } = sign
      const { offsetWidth: cW, offsetHeight: cH } = canvas
      canvas.getContext('2d').drawImage(sign, cW - (6 + w), cH - (7 + h), w, h)
    }
    sign.src = url
  }

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


  const rgbToHex = (r, g, b) => {
    if (r > 255 || g > 255 || b > 255)
      throw 'Invalid color component'
    return ((r << 16) | (g << 8) | b).toString(16)
  }

  const hex = rgb => '#' + ('000000' + rgb).slice(-6)

  // const hexToRgb = hex => {
  //   const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  //   return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : null
  // }

  const invertHex = hexToInvert => {
    const rgbNo = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexToInvert)
    const rgb = rgbNo.map(rgb=> 255 - parseInt(rgb, 16))
    return hex(rgbToHex(rgb[1], rgb[2], rgb[3]))
  }

    
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


  const combineImages = () =>{
    if (!uploadFiles || uploadFiles.length < 2) return
    canvas[0].classList.remove('display_none')

    const firstImage = new Image()
    firstImage.onload = () => {
      const { naturalWidth: w, naturalHeight: h } = firstImage
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
      <div class="thumb_menu">
        <div class="delete" data-id="${i + 1}">&#8722;</div>
        <div class="duplicate" data-id="${i + 1}">&#43;</div>
      </div>
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
      const { naturalWidth: w, naturalHeight: h } = img
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
      outputSvg(svgWrapper(signSvg, invertHex(backgroundColor), 71.8, 18.9), canvas)
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
    gif.src = 'data:image/gif;base64,' + encode64(encoder.stream().getData())
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
          if (!openSlot.length && positionWithinSequence === -1) {
            selectedFrame.style.transition = '0.3s'
            selectedFrame.style.left = `${20 * frameId}px`
            selectedFrame.style.top = `${output.getBoundingClientRect().y - 100}px`
            sequence = sequence.map(s => s === selectedFrame.dataset.id ? ' ' : s)
          }

          //swap if frame outside slot overlap with frame in slot
          if (openSlot.length && positionWithinSequence === -1 && sequence[i] && sequence[i] !== ' ') {
            selectedFrame.style.transition = '0.3s'
            
            // checks for open slot
            let availableSlot
            let offset = 0
            while (!availableSlot) {
              offset++
              if (openSlot.find(s => s === i + offset)) availableSlot = i + offset
              if (openSlot.find(s => s === i - offset)) availableSlot = i - offset
            }
  
            selectedFrame.style.left = `${slotInfo[availableSlot].x}px`
            selectedFrame.style.top = `${slotInfo[availableSlot].y}px`
            sequence[availableSlot] = sequence[i]
          }
          //swap if square in slot overlap with another square in slot
          else if (positionWithinSequence !== -1 && sequence[i] && sequence[i] !== ' ') {
            selectedFrame.style.transition = '0.3s'
            selectedFrame.style.left = `${slotInfo[positionWithinSequence].x}px`
            selectedFrame.style.top = `${slotInfo[positionWithinSequence].y}px`
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
        frames[+frame - 1].style.left = `${x}px`
        frames[+frame - 1].style.top = `${y}px`
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


  const addDuplicateAction = () =>{
    const duplicateButtons = document.querySelectorAll('.duplicate')

    duplicateButtons.forEach(button=>{
      button.addEventListener('click', (e)=>{
        console.log(e.target.dataset.id)
        const index = +e.target.dataset.id - 1
        const thumbImage = document.createElement('img')
        createThumbs(index, thumbImage)
        
        //TODO edit slot edit
        //* id and index should be separate = e.target.dataset.id and e.target.dataset.index
        const dividedImages = document.querySelectorAll('.divided_img')
        createCopyCanvasAndDisplayThumbs(dividedImages[index], thumbImage, +imgNoInput.value, index, true) 
        frames = document.querySelectorAll('.thumb_container') 
        addFramePositionActions(frames[frames.length - 1])
        console.log('sequence', sequence)
        sequence.push(index + 1)
        sequenceOutput.value = sequence.join(' ')
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
      createThumbs(imageIndex, thumbImage)
      
      const newCanvas = document.createElement('canvas')
      canvasOutput.append(newCanvas)
      createCopyCanvasAndDisplayThumbs(newCanvas, thumbImage, imgNo, imageIndex, true) 
    })
    addDuplicateAction()
    makeThumbsDraggable()
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
}

window.addEventListener('DOMContentLoaded', init)
