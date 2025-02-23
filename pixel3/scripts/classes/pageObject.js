import { px, nearestN, roundedClient, mouse } from '../utils.js'
import { settings } from '../elements.js'
class PageObject {
  constructor(props) {
    Object.assign(this, {
      grabPos: { a: { x: 0, y: 0 }, b: { x: 0, y: 0 } },
      ...props,
    })
  }
  // syncSize() {
  //   const { width, height } = this.el
  //     .querySelector('div')
  //     .getBoundingClientRect()
  //   this.w = width
  //   this.h = height
  // }
  get pos() {
    return {
      x: this.x,
      y: this.y,
    }
  }
  get size() {
    return {
      w: this.w,
      h: this.h,
    }
  }
  setStyles() {
    Object.assign(this.el.style, {
      left: px(this.x || 0),
      top: px(this.y || 0),
      width: px(this.w),
      height: px(this.h || this.w),
    })
  }
  addToPage() {
    // this.setStyles()
    this.container.appendChild(this.el)
  }
  remove() {
    this.el.remove()
  }
  makeDraggable() {
    mouse.down(this.el, 'add', this.onGrab)
  }
  drag = (e, x, y) => {
    if (e.type[0] === 'm') e.preventDefault()
    this.grabPos.a.x = this.grabPos.b.x - x
    this.grabPos.a.y = this.grabPos.b.y - y
    this.x -= this.grabPos.a.x
    this.y -= this.grabPos.a.y
    console.log('drag')
    this.setStyles()
  }
  onGrab = e => {
    this.grabPos.b.x = nearestN(roundedClient(e, 'X'), settings.d)
    this.grabPos.b.y = nearestN(roundedClient(e, 'Y'), settings.d)
    mouse.up(document, 'add', this.onLetGo)
    mouse.move(document, 'add', this.onDrag)
  }
  onDrag = e => {
    const x = nearestN(roundedClient(e, 'X'), settings.d)
    const y = nearestN(roundedClient(e, 'Y'), settings.d)
    this.canMove
      ? this.drag(e, x, y)
      : this.dragAction(e)
    this.grabPos.b.x = x
    this.grabPos.b.y = y
  }
  dragAction(e) {
    console.log('drag')
  }
  onLetGo = () => {
    mouse.up(document, 'remove', this.onLetGo)
    mouse.move(document, 'remove', this.onDrag)
  }
}

export default PageObject