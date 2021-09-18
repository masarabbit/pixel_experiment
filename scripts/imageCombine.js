function init() {

  const canvas = document.querySelectorAll('.canvas')
  const ctx = canvas[0].getContext('2d')
  const ctxTwo = canvas[1].getContext('2d')
  const cursor = document.querySelector('.cursor')
  // const indicator = document.querySelector('.indicator')
  
  // button
  const alts = document.querySelectorAll('.alt')
  const downloadButtons = document.querySelectorAll('.download')

  // input
  const upload = document.querySelector('#upload')

  const downloadImage = (canvas,name) =>{
    const link = document.createElement('a')
    link.download = `${name}_${new Date().getTime()}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  // eventlistener
  upload.addEventListener('change',()=>{
    const firstImage = new Image()
    firstImage.onload = () => {
      const w = firstImage.naturalWidth
      const h = firstImage.naturalHeight
      canvas[0].setAttribute('width', w * upload.files.length)
      canvas[0].setAttribute('height', h)

      const w2 = 50
      const h2 = w2 * (w / h)
      canvas[1].setAttribute('width', w2 * upload.files.length)
      canvas[1].setAttribute('height', h2)
      
      Array.from(upload.files).forEach((upload,i)=>{
        const blobURL = window.URL.createObjectURL(upload)
        const eachImage = new Image()   
        eachImage.onload = () => {
          // console.log(w,h,eachImage)  
          ctx.drawImage(eachImage,i * w,0,w,h)
          ctxTwo.drawImage(eachImage,i * w2,0,w2,h2)
        }
        eachImage.src = blobURL
      })
    }
    firstImage.src = window.URL.createObjectURL(upload.files[0])    
    // console.log('u',uploadedFiles)
  })

  downloadButtons[0].addEventListener('click',()=>{
    downloadImage(canvas[0],'sprite')
  })

  // const dataUrlButton = document.querySelector('.url')
  // dataUrlButton.addEventListener('click',()=>{
  //   paintCanvas()
  //   console.log(canvas[0].toDataURL())
  // })

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

}

window.addEventListener('DOMContentLoaded', init)
