import { convertCameCase } from '../utils.js'
import { settings, elements } from './elements.js'

class Input {
  constructor(props) {
    const label = convertCameCase(props.inputName)
    const isColorInput = props.inputName.includes('color')
    Object.assign(this, {
      el: Object.assign(document.createElement('div'), {
        className: isColorInput ? '' : 'input-wrap',
        innerHTML: `
          <label class="${isColorInput ? 'color-label' : ''}" for="${props.inputName}">
            ${isColorInput ? '' : label}
          </label>
          <input 
            id="${props.inputName}" 
            class="${props?.className || ''} ${props.inputName} input" 
            type="${isColorInput ? 'color' : 'text'}" 
            placeholder="${label}"
          >
        `
      }),
      ...props,
    })
    props.container.appendChild(this.el)
    this.input = this.el.querySelector('input')
    this.input.addEventListener('change', e => {
      settings[this.key] = e.target.value
      if (isColorInput || this.inputName.includes('hex')) this.updateColor()
      if (this.update) this.update() 
    })
    if (this.default) settings[this.inputName] = this.default
    if (isColorInput) {
      this.label = this.el.querySelector('label')
      this.updateColor()
    } else {
      this.input.value = settings[props.inputName]
    }
  }
  get key() {
    return this.inputName.replace('color', 'hex')
  }
  updateColor() {
    const label = this.label || settings.inputs[this.inputName.replace('hex', 'color')].label
    label.style.backgroundColor = settings[this.key]
    if (settings?.inputs[this.key]) settings.inputs[this.key].input.value = settings[this.key]
  }
}

class TextArea {
  constructor(props) {
    Object.assign(this, {
      input: Object.assign(document.createElement('textarea'), {
        className: props.className,
        spellcheck: false,
      }),
      ...props
    })
    this.container.append(this.input)
    this.input.addEventListener('change', this.action)
    const buttonWrapper = Object.assign(document.createElement('div'), {
      className: 'mini-wrap',
    })
    this.container.append(buttonWrapper)
    this.buttons.forEach(b => {
      new Button({
        ...b,
        container: buttonWrapper,
        action: () => b.action(this)
      })
    })
    settings.inputs[this.className] = this
  }
  copyText() {
    this.input.select()
    this.input.setSelectionRange(0, 999999) // For mobile devices 
    document.execCommand('copy')
  }
}

class Upload {
  constructor(props) {
    Object.assign(this, {
      el: Object.assign(document.createElement('div'), {
        className: 'upload-wrapper',
        innerHTML: `
          <input id="upload" type="file" single/>
          <label for="upload" data-alt="upload image file" class="upload icon alt"></label>
          <div></div>
        `
      }),
      ...props
    })
    this.container.appendChild(this.el)
      ;['input', 'label', 'display'].forEach(key => this[key] = this.el.querySelector(`${key === 'display' ? 'div' : key}`))

    this.pixeliseBtn = new Button({
      container: this.container,
      className: 'pixelise icon d-none',
      action: () => elements.artboard.output()
    })
    this.el.addEventListener('change', () => {
      elements.artboard.uploadedFile = this.input.files[0]
      this.display.innerHTML = elements.artboard.uploadedFile.name
      this.pixeliseBtn.el.classList.remove('d-none')
    })
  }
}

class Button {
  constructor(props) {
    Object.assign(this, {
      el: Object.assign(document.createElement('button'), {
        className: `btn ${props?.className || ''}`,
        innerHTML: props?.btnText || '',
      }),
      ...props,
    })
    props.container.appendChild(this.el)
    this.el.addEventListener('click', this.action)
  }
}


export {
  Input,
  TextArea,
  Button,
  Upload
}