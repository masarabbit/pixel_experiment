function init() {
  
  const canvas = document.querySelector('canvas')
  const upload = document.querySelector('#upload')
  const download = document.querySelector('.download')
  let uploadFiles

  const resizeCanvas = (canvas, w, h) =>{
    canvas.setAttribute('width', w)
    canvas.setAttribute('height', h)
  }

  // const width = 600
  // const width = 16
  // const column = 6

  // const width = 36
  // const column = 3
  const width = 320
  const column = 4

  const renderOtherImages = (uploadFiles, width, height) =>{
    for (let i = 1; i < uploadFiles.length; i++ ){
      const img = new Image()
      img.onload = () => {
        const offsetX = (i % column) * width
        const offsetY = (Math.floor(i / column)) * height
        canvas.getContext('2d').drawImage(img, offsetX, offsetY, width, height)
      }
      img.src = window.URL.createObjectURL(uploadFiles[i])
    }
  }

  
  const uploadImage = () =>{
    uploadFiles = upload.files
    let height
    let canvasHeight

    if (!uploadFiles) return

    const firstImg = new Image()
    firstImg.onload = () => {
      const { naturalWidth: w, naturalHeight: h } = firstImg
      canvasHeight = Math.floor(uploadFiles.length / column) < 1 
        ? 1 
        : Math.ceil(uploadFiles.length / column)
      height = width * (h / w)
      resizeCanvas(canvas, width * column, height * canvasHeight)
      canvas.getContext('2d').drawImage(firstImg, 0, 0, width, height)
      renderOtherImages(uploadFiles, width, height)
    }
    firstImg.src = window.URL.createObjectURL(uploadFiles[0])

    

  }

  upload.addEventListener('change', uploadImage )
  download.addEventListener('click', ()=>{
    console.log('download')
    const link = document.createElement('a')
    link.download = `combined_${new Date().getTime()}.png`
    link.href = canvas.toDataURL()
    link.click()
  })
}

window.addEventListener('DOMContentLoaded', init)
