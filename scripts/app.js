function init() {

  const combineCanvas = document.getElementById('combineCanvas')
  const context = combineCanvas.getContext('2d')
  const head = document.querySelector('.head')
  // const body = document.querySelector('.body')
  const randomHead = document.createElement('img')
  // const randomBody = document.createElement('img')
  const fileNameInput = document.getElementById('file_name_input')
  const downloadIconButton = document.getElementById('download_icon_button')
  let filenum = 0

  const file = document.getElementById('file')
  const draw = document.getElementById('draw')

  const dotsBox = document.querySelector('.dots')


  // drawImage()

  setup()

  function setup(){
    combineCanvas.setAttribute('height','320px') 
    combineCanvas.setAttribute('width','320px')
    
  }

  function shuffle(){
    head.innerHTML = ''
    const uploadedFiles = file.files[0]
    // console.log(uploadedFiles)
    // const blobURL = window.URL.createObjectURL(uploadedFiles).toDataURL()
    // randomHead.src = blobURL

    const reader = new FileReader()
    reader.readAsDataURL(uploadedFiles)
    reader.addEventListener('load', function () {
      // convert image file to base64 string
      randomHead.src = reader.result
    }, false)

    // console.log(blobURL)
    head.appendChild(randomHead)
    
    // body.innerHTML = ''
    // randomBody.src = `./assets/body/body${Math.ceil(Math.random() * 48)}.png`
    // body.appendChild(randomBody)
  }

  function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
      throw 'Invalid color component'
    return ((r << 16) | (g << 8) | b).toString(16)
  }


  function drawImage(){
    shuffle()



    //!test
    // const uploadedFiles = file.files[0]

    // let img

    // const reader = new FileReader()
    // reader.readAsDataURL(uploadedFiles)
    // reader.addEventListener('load', function () {
    //   img = reader.result
    // }, false)

    // console.log(uploadedFiles)


    //!test




    setTimeout(()=>{
      combineCanvas.setAttribute('height','320px') 
      combineCanvas.setAttribute('width','320px')
      
      context.fillStyle = 'white'
      context.fillRect(0, 0, 320, 320)

      // context.filter = `hue-rotate(${Math.floor(Math.random() * 360)}deg) contrast(${Math.floor(Math.random() * 100) + 100}%) saturate(${Math.floor(Math.random() * 100) + 60}%)`    
      // context.drawImage(randomHead, 0, 0, 20, 20)
      const arr = []
      const dots = []

      for (let i = 0; i < 256; i++){
        arr.push(i)
      }

      arr.forEach(ele=>{
        const x = ele % 16 * 20
        const y = Math.floor(ele / 16) * 20
        // const x2 = x === 0 ? 1 : x
        // const y2 = y === 0 ? 1 : y  //! this bit not required
        
        // context.drawImage(blobURL, x2, y2, 20, 20, x, y, 20, 20)
        context.drawImage(randomHead, x, y, 20, 20, x, y, 1, 1)
        const c = context.getImageData(x, y, 1, 1).data
        var hex = '#' + ('000000' + rgbToHex(c[0], c[1], c[2])).slice(-6)
        console.log(`${ele} - ${hex}`)
        dots.push(hex)
      })

      // dotsBox.innerHTML = JSON.stringify(dots)
      dotsBox.innerHTML = dots.map(dot=>{
        if (dot[1] === '0') return '1'
        return '0'
      }).join('')

      // dotsBox.innerHTML = JSON.stringify(dots.map(dot=>{
      //   if (dot === '#000000') return '1'
      //   return '0'
      // }))
      
      dotsBox.style.padding = '10px'

      // context.fillStyle = 'white'
      // context.fillRect(0, 0, 320, 320)

      arr.forEach(ele=>{
        const x = ele % 16 * 20
        const y = Math.floor(ele / 16) * 20
        context.fillStyle = dots[ele]
        context.fillRect(x, y, 20, 20)
      })

      // context.drawImage(randomHead, 1,1,1,1, 0, 0, 20, 20)
      
      // context.filter = `hue-rotate(${Math.floor(Math.random() * 360)}deg) contrast(${Math.floor(Math.random() * 100) + 100}%) saturate(${Math.floor(Math.random() * 100) + 60}%)`
      // context.drawImage(randomBody, 20, 120, 160, 60)
    },200)
  }


  function downloadSprite() {
    drawImage()
    filenum++

    const fileName = fileNameInput.value === '' ? 'icon' : fileNameInput.value
    const link = document.createElement('a')
    
    link.href = combineCanvas.toDataURL('image/png')
    link.download = `${fileName}${filenum}.png`
    link.click()
  }
  
  draw.onclick = drawImage
  downloadIconButton.onclick = downloadSprite
}

window.addEventListener('DOMContentLoaded', init)