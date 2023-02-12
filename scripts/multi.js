function init() {

  const elements = {
    canvas: document.querySelector('canvas'),
    fileName: document.querySelector('.file_name'),
    upload: document.querySelector('#upload'),
    download: document.querySelector('.download'),
    numberInputs: document.querySelectorAll('.no'),
    split: document.querySelector('.split'),
    downloadSplit: document.querySelector('.download_split'),
    canvasOutput: document.querySelector('.canvas_output')
  }

  const resizeCanvas = (canvas, w, h) =>{
    canvas.setAttribute('width', w)
    canvas.setAttribute('height', h)
  }

  const settings = {
    width: 320,
    height: null,
    column: 4,
    row: null,
    uploadFiles: null,
  }

  const renderOtherImages = (uploadFiles, width, height, column) =>{
    for (let i = 1; i < uploadFiles.length; i++ ){
      const img = new Image()
      img.onload = () => {
        const offsetX = (i % column) * width
        const offsetY = (Math.floor(i / column)) * height
        elements.canvas.getContext('2d').drawImage(img, offsetX, offsetY, width, height)
      }
      img.src = window.URL.createObjectURL(uploadFiles[i])
    }
  }

  
  const uploadImage = () =>{
    settings.uploadFiles = elements.upload.files
    let canvasHeight
    const { uploadFiles, width, column } = settings
    const { canvas } = elements

    if (!uploadFiles) return

    const firstImg = new Image()
    firstImg.onload = () => {
      const { naturalWidth: w, naturalHeight: h } = firstImg
      canvasHeight = Math.floor(uploadFiles.length / column) < 1 
        ? 1 
        : Math.ceil(uploadFiles.length / column)
      settings.height = width * (h / w)
      const { height } = settings
      resizeCanvas(canvas, width * column, height * canvasHeight)
      canvas.getContext('2d').drawImage(firstImg, 0, 0, width, height)
      renderOtherImages(uploadFiles, width, height, column)
    }
    firstImg.src = window.URL.createObjectURL(uploadFiles[0])
  }


  const downloadImage = (canvas, name) => {
    const link = document.createElement('a')
    link.download = `${name}_${new Date().getTime()}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  upload.addEventListener('change', uploadImage )
  elements.download.addEventListener('click', ()=>{
    downloadImage(elements.canvas, elements.fileName.value || 'sprite-sheet')
  })

  elements.numberInputs.forEach(input => {
    input.addEventListener('change', () => {
      settings[input.dataset.type] = +input.value
    })
    input.value = settings[input.dataset.type]
  })

  const outputTile = ({ ctx, x, y, w, h, img }) =>{
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(img, x, y, w, h, 0, 0, w, h)
  }

  elements.split.addEventListener('click', () => {
    const { column, row, width, height } = settings
    
    if (!height) return
    elements.canvasOutput.innerHTML = ''
    const w = width / column
    const h = height / row

    new Array(column * row).fill('').forEach((_file, i) => {    
      const newCanvas = document.createElement('canvas')
      newCanvas.classList.add('split_tile')
      elements.canvasOutput.append(newCanvas)
      resizeCanvas(newCanvas, w, h)
      const x = i % column * w
      const y = Math.floor(i / column) * h
      outputTile({
        ctx: newCanvas.getContext('2d'),
        x, y, w, h,
        img: elements.canvas
      })
      elements.canvasOutput.appendChild(newCanvas)
    })
  })

  elements.downloadSplit.addEventListener('click', ()=> {
    document.querySelectorAll('.split_tile')?.forEach((c, i) => {
      setTimeout(() => {
        downloadImage(c, `${elements.fileName.value || 'split-img'}-${i + 1}`)
      }, i * 200)
    })
  })


}

window.addEventListener('DOMContentLoaded', init)
