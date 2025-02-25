import PageObject from './pageObject.js'
import { px, roundedClient, convertCameCase, mouse } from '../utils.js'
import { elements } from '../elements.js'

class NavWindow extends PageObject {
  constructor(props) {
    super({
      window: Object.assign(document.createElement('div'), {
        className: `nav-window ${props.className || ''}`,
        innerHTML: `
          <div class="handle">${`<p>${convertCameCase(props.name)}</p>` || '<span></span>'}<button class="arrow"></button></div>
          <div class="content-wrapper ${props.column ? 'column' : '' }"></div>
        `
      }),
      canMove: true,
      ...props
    })
    this.container.appendChild(this.window)
    this.el = this.window.querySelector('.handle')
    this.contentWrapper = this.window.querySelector('.content-wrapper')
    this.window.querySelector('button').addEventListener('click', this.toggleState)

    if (this.content) this.content(this)

    this.setStyles()
    this.addDragEvent()

    mouse.up(document, 'add', ()=> elements.saveData())
  }
  toggleState = () => {
    this.isOpen = !this.isOpen
    this.window.classList[this.isOpen ? 'remove' : 'add']('close')
    elements.saveData()
  }
  touchPos(e) {
    return {
      x: roundedClient(e, 'X'),
      y: roundedClient(e, 'Y'),
    }
  }
  setStyles() {
    Object.assign(this.window.style, {
      left: px(this.x || 0),
      top: px(this.y || 0),
      width: px(this.w),
      height: px(this.h || this.w),
      zIndex: 1 + this.y
    })
  }
  setUp() {
    this.window.classList[this.isOpen ? 'remove' : 'add']('close')
    this.setStyles()
  }
}

export {
  NavWindow
}