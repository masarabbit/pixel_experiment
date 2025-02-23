import { px } from '../utils.js'

class PageObject {
  constructor(props) {
    Object.assign(this, {
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
}

export default PageObject