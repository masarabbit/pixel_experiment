function init() {
  
  const wrapper = document.querySelector('.wrapper')
  const sequenceOutput = document.querySelector('.sequence_output')
  const slotInfo = []
  let sequence = [' ',' ',' ',' ']
  
  const slotContainer = document.querySelector('.square_container')
  const addSlot = document.querySelector('.add_slot')
  const addSquare = document.querySelector('.add_square')

  let slots
  slots = document.querySelectorAll('.slot')

  let squares
  squares = document.querySelectorAll('.square')


  const addSquarePositionActions = square =>{
    let newX
    let newY
    const onDrag = e => {
    square.style.transtion = '0s'
    let originalStyles = window.getComputedStyle(square)
    newX = parseInt(originalStyles.left) + e.movementX
    newY = parseInt(originalStyles.top) + e.movementY
    square.style.left = `${newX}px`
    square.style.top = `${newY}px`
    }

    const tidySequence = () =>{
      sequence = sequence.map(s=>{
        return s === square.innerText ? ' ' : s
      })
    }

    const onLetGo = () => {
      document.removeEventListener('mousemove', onDrag)
      document.removeEventListener('mouseup', onLetGo)
      console.log('slotInfo', slotInfo)
      let matchSlot
      slotInfo.forEach((info,i)=>{
        const openSlot = sequence.map((slot,i)=>{
          if (slot === ' ') return i
          return 'none'
        }).filter(slot=>slot !== 'none')

        const newXC = newX + 50
        const newYC = newY + 50
        if ((newXC > info.x && newXC < info.x + 100) &&
            (newYC > info.y && newYC < info.y + 100)){
          square.style.transition = '0.3s'
          newX = info.x
          newY = info.y
          matchSlot = true
        
        // if slot is full  
        if(!openSlot.length && sequence.indexOf(square.innerText) === -1) {
          squares[sequence[i]-1].style.transition = '0.3s'
          squares[sequence[i]-1].style.left =`${20 * square.innerText}px`
          squares[sequence[i]-1].style.top ='20px'
          sequence = sequence.map(s=>{
            return s === squares[sequence[i]-1].innerText ? ' ' : s
          })
        }

        //swap if square outside slot overlap with square in slot
        if(openSlot.length && sequence.indexOf(square.innerText) === -1 && sequence[i] && sequence[i] !== ' ') {
          squares[sequence[i]-1].style.transition = '0.3s'
          
          // checks for open slot
          let availableSlot
          let offset = 0
          while (!availableSlot) {
            offset++
            if (openSlot.indexOf(i + offset) !== -1) availableSlot = i + offset
            if (openSlot.indexOf(i - offset) !== -1) availableSlot = i - offset
          }
          // console.log('availableSlot',availableSlot)
  
          squares[sequence[i]-1].style.left =`${slotInfo[availableSlot].x}px`
          squares[sequence[i]-1].style.top =`${slotInfo[availableSlot].y}px`
          sequence[availableSlot] = sequence[i]
        }
          
        //swap if square in slot overlap with another square in slot
        else if(sequence.indexOf(square.innerText) !== -1 && sequence[i] && sequence[i] !== ' ') {
          // console.log('testA',sequence[i]-1)
          squares[sequence[i]-1].style.transition = '0.3s'
          squares[sequence[i]-1].style.left =`${slotInfo[sequence.indexOf(square.innerText)].x}px`
          squares[sequence[i]-1].style.top =`${slotInfo[sequence.indexOf(square.innerText)].y}px`
          sequence[sequence.indexOf(square.innerText)] = sequence[i]
        }
          //update sequence
          tidySequence()
          sequence[i] = square.innerText
        }   
      })

      if (!matchSlot) {
        tidySequence()
      }
      sequenceOutput.value = sequence.join(' ')
      square.style.left = `${newX}px`
      square.style.top = `${newY}px`
      setTimeout(()=>{
        squares.forEach(square=>square.style.transition = '0s')
      },200)
    }
    const onGrab = () => {
      document.addEventListener('mousemove', onDrag)
      document.addEventListener('mouseup', onLetGo)
    }
    square.addEventListener('mousedown', onGrab)
  }


  const recordSlotPos = () =>{
    slots.forEach((slot,i)=>{
      slot.dataset.i = i
      slotInfo[i] = {
        x: slot.getBoundingClientRect().x,
        y: slot.getBoundingClientRect().y
      }
    })
  }

  const repositionSquare = () =>{
    recordSlotPos()
    sequence.forEach((square,i)=>{
      if (square !== ' '){
        squares[+square -1].style.left = `${slotInfo[i].x}px`
        squares[+square -1].style.top = `${slotInfo[i].y}px`
      }
    })
  }


  //*events
  squares.forEach(square=>{ 
    addSquarePositionActions(square)
  })
  recordSlotPos()
  
  window.addEventListener('resize',()=>{
    repositionSquare()
  })
}

window.addEventListener('DOMContentLoaded', init)