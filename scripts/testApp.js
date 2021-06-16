function init() {
  
  const wrapper = document.querySelector('.bubble_wrapper')
  const bubbleBox = document.querySelector('.speech_wrapper')

  let count = 0

  const createNewBox = ()=>{
    const newBox = document.createElement('div')
 

    newBox.classList.add('box')
    newBox.innerHTML = `
    <div class="message">
      hello ${count}
    </div>
  `
    wrapper.appendChild(newBox)
    
    if (count >= 5) return

    setTimeout(()=>{
      bubbleBox.classList.remove('animate')   
    },900)
    
    setTimeout(()=>{
      count++
      createNewBox()     
    },1100)
    
    setTimeout(()=>{
      bubbleBox.classList.add('animate') 
    },1500)
  }
  
  setTimeout(()=>{
    bubbleBox.classList.add('animate') 
    createNewBox() 
  },800)



}

window.addEventListener('DOMContentLoaded', init)



