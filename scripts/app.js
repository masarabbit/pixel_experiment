function init() {
  

  //! mouseDown to keep drawState true, to make it possible to draw while dragging.
  //! create map creator
  //! create sprite creator

  let canDraw = false
  let cellSize
  let maxWidth
  
  const canvas = document.querySelector('.canvas_one')
  const ctx = canvas.getContext('2d')
  const canvasTwo = document.querySelector('.canvas_two')
  const ctxTwo = canvasTwo.getContext('2d')
  const draw = document.querySelector('.draw')
  const download = document.querySelector('.download')
  const dotsBox = document.querySelector('.dots')

  const cellSizeInput = document.querySelector('.cell_size')
  const maxWidthInput = document.querySelector('.max_width')
  const colorInput = document.querySelector('#color')
  const colorLabel = document.querySelector('.color_label')

  const grid = document.querySelector('.grid')
  const dots = []

  function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
      throw 'Invalid color component'
    return ((r << 16) | (g << 8) | b).toString(16)
  }

  const colorCell = e =>{
    console.log(e.target)
    e.target.style.backgroundColor = colorInput.value
  }

  const continuousColorCell = e =>{
    if (!canDraw) return
    colorCell(e)
    e.target.classList.add('enlarge')
    setTimeout(()=>e.target.classList.remove('enlarge'),200)
  }

  const output = ()=>{
    const upload = document.querySelector('#upload')
    const uploadedFiles = upload.files[0]
    const blobURL = window.URL.createObjectURL(uploadedFiles)
    const imageTarget = new Image()

    cellSize = cellSizeInput.value ? cellSizeInput.value : 10
    maxWidth = maxWidthInput.value ? maxWidthInput.value : 400

    let iHeight
    let iWidth

    imageTarget.onload = () => {
      iWidth = imageTarget.naturalWidth 
      iHeight = imageTarget.naturalHeight 
      calcHeight = maxWidth * (iHeight / iWidth)
      calcWidth = calcHeight * (iWidth / iHeight)
      canvas.setAttribute('width', calcWidth)
      canvas.setAttribute('height', calcHeight - (calcHeight % cellSize))

      grid.style.height = `${calcHeight - (calcHeight % cellSize)}px`
      grid.style.width = `${calcWidth}px`
      
      dots.length = 0

      //* cellX x cellY
      const column = maxWidth / cellSize //! this could be refactored to allow user to specify column rather than maxWidth
      const row = (calcHeight - (calcHeight % cellSize)) / cellSize //! give option to user to specify?
      

      ctx.drawImage(imageTarget, 0, 0, calcWidth, calcHeight)

      for (let i = 0; i < row * column; i++) {
        const y = Math.floor(i / column) * cellSize
        const x = i % column * cellSize
        const c = ctx.getImageData(x, y , 1, 1).data

        var hex = '#' + ('000000' + rgbToHex(c[0], c[1], c[2])).slice(-6)
        
        dots.push(hex)
        // console.log(dots)
      }
      

      //! this could be updated when user draws?
      dotsBox.value = dots.map(dot=>{
        return dot
      }).join('')


      const arr = new Array(row * column).fill('').map((ele,i)=>ele = i)
      arr.forEach(ele=>{
        const x = ele % column * cellSize
        const y = Math.floor(ele / column) * cellSize
        ctx.fillStyle = dots[ele]
        ctx.fillRect(x, y, cellSize, cellSize)
      })

      canvasTwo.setAttribute('width', (calcWidth / cellSize))
      canvasTwo.setAttribute('height', (calcHeight - (calcHeight % cellSize)) / cellSize)
      
      arr.forEach(ele=>{
        const x = ele % column
        const y = Math.floor(ele / column)
        ctxTwo.fillStyle = dots[ele]
        ctxTwo.fillRect(x, y, 1, 1)
      })
      

      //* populate grid and make it reactive
      grid.innerHTML=dots.map(dot=>{
        return `
          <div class="cell" style="background-color:${dot};">
          </div>
        `
      }).join('')

      const cells = document.querySelectorAll('.cell')
      cells.forEach(c=>{
        c.style.height = `${cellSize}px`
        c.style.width = `${cellSize}px`
        c.addEventListener('click',(e)=>colorCell(e))
        c.addEventListener('mousemove',(e)=>continuousColorCell(e))
      })
    }

    imageTarget.src = blobURL
  }

  const downloadImage = () =>{
    var link = document.createElement('a')
    link.download = 'filename.png';
    link.href = canvas.toDataURL()
    link.click()
  }



  const copy = document.querySelector('.copy') 
  const copyText = () =>{
    dotsBox.select()
    dotsBox.setSelectionRange(0, 99999) // For mobile devices 
    document.execCommand('copy')
  }
  

  //* eventlistener
  download.addEventListener('click',downloadImage)
  draw.addEventListener('click',output)
  copy.addEventListener('click',copyText)
  grid.addEventListener('mousedown',()=>canDraw = true)
  grid.addEventListener('mouseup',()=>canDraw = false)
  colorInput.addEventListener('change',()=>{
    colorLabel.style.backgroundColor = colorInput.value
  })

}

window.addEventListener('DOMContentLoaded', init)