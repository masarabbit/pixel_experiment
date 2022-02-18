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
  let backgroundColor = 'transparent'

    
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

  const hex = rgb =>{
    return '#' + ('000000' + rgb).slice(-6)
  }

  const combineImages = () =>{
    if (!uploadFiles || uploadFiles.length < 2) return
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
    return new Array(Math.round(w) * Math.round(h)).fill('').map((_code,a)=>{
      const x = a % w
      const y = Math.floor(a / h)
      const c = ctx.getImageData(x, y, 1, 1).data

      // this thing included here to prevent rendering black instead of transparent
      return c[3] === 0
        ? backgroundColor
        : hex(rgbToHex(c[0], c[1], c[2]))
    })
  }

  const divide = () =>{
    if (!uploadFiles || uploadFiles.length > 1) return
    output.innerHTML = ''
    canvasOutput.innerHTML = ''
    const imgNo = +imgNoInput.value
    const scale = +scaleInput.value

    new Array(imgNo).fill('').forEach((_file,i)=>{

      // TODO isolate this bit
      const newCanvas = document.createElement('canvas')
      newCanvas.classList.add('divided_img')
      canvasOutput.append(newCanvas)

      const thumbContainer = document.createElement('div')
      thumbContainer.classList.add('thumb_container')
      thumbContainer.innerHTML =  `
        <div class="input_wrapper">
          <p>${i + 1}</p>
          <input class="transition input" placeholder="100" value="100" />
        </div>`
      const thumbImage = document.createElement('img')
      thumbImage.classList.add('thumb_image')
      thumbContainer.append(thumbImage)
      output.append(thumbContainer)


      // TODO isolate this bit
      const img = new Image()
      img.onload = () => {
        const { naturalWidth:w, naturalHeight:h,  } = img
        const newImgWidth = w / imgNo
        newCanvas.setAttribute('width', newImgWidth)
        newCanvas.setAttribute('height', h)

        const ctx = newCanvas.getContext('2d')
        ctx.drawImage(img, i * -newImgWidth, 0, w, h)

        const codes = extractCodes(newImgWidth, h, ctx)
        
        // enlarge based on scale value
        newCanvas.setAttribute('width', newImgWidth * scale)
        newCanvas.setAttribute('height', h * scale)

        codes.forEach((code, b)=>{
          const x = (b % newImgWidth) * scale
          const y = (Math.floor(b / h)) * scale
          ctx.fillStyle = code
          ctx.fillRect(x, y, scale, scale)
        })

        thumbImage.src = newCanvas.toDataURL()
      }
      img.src = window.URL.createObjectURL(uploadFiles[0])  

    })
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

  upload.addEventListener('change',()=>{
    uploadFiles = upload.files
    imageCount.innerHTML = `image x ${uploadFiles.length}`

    // TODO when multiple image is loaded, display them onto canvas
  })

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
    console.log('trigger')
    if (!dividedImages.length) return
    console.log('trigger 2')
    
    const encoder = new GIFEncoder()
    encoder.setRepeat(0) //auto-loop
    encoder.start()
    
    dividedImages.forEach((canvas, i)=>{
      encoder.setDelay(transitionInput[i].value)
      encoder.addFrame(canvas.getContext('2d'))
    })
    
    encoder.finish()
    // const img = document.querySelector('.image')
    const { offsetHeight, offsetWidth } = dividedImages[0]
    gif.style.height = `${offsetHeight}px`
    gif.style.width = `${offsetWidth}px`
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


  buttons.forEach(button=>{
    buttonTrigger(button, 'download_file', ()=>downloadImage(canvas[0], imgNameInput.value))
    buttonTrigger(button, 'combine', combineImages)
    buttonTrigger(button, 'divide', divide)
    buttonTrigger(button, 'download_imgs', downloadDividedImgs)
    buttonTrigger(button, 'create_gif', createGif)
    buttonTrigger(button, 'download_gif', downloadGif)
  })
}

window.addEventListener('DOMContentLoaded', init)
