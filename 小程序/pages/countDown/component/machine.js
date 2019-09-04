export default class Machine {
  constructor(pageContext, opts) {
    this.page = pageContext
    this.height = opts.height
    this.len = opts.len
    this.transY1 = opts.transY1 //倒计时左边的垂直偏移

    this.transY2 = opts.transY2 //倒计时右边的垂直偏移



    this.num1 = opts.num1 //倒计时左边的数字
    this.num2 = opts.num2 //倒计时右边的数字
    this.speed = opts.speed //动画运行的时间
    this.isStart = false //是否开始
    this.page.start = this.start.bind(this)
  }

  start() {
    let {
      isStart,
      len,
      height,
      transY1,
      transY2,
      num1,
      num2,
      speed
    } = this

    if (isStart) return
    this.isStart = true
    let totalHeight = height * len
    let halfSpeed = speed / 2
    let endDis1 = num1 == 0 ? 10 * height : num1 * height
    let endDis2 = num2 == 0 ? 10 * height : num2 * height
    let x=0,
    y=0

    setTimeout(() => {
      this.timer = setInterval(() => {
        if (x<=2) {
          transY1 += speed
          if (transY1 >= 0) {
            transY1 = -totalHeight
            x++
          }
        } 
        // else if (new Date().getTime() - lastData < 1500) {
        //   transY1 += halfSpeed
        //   if (transY1 >= 0) {
        //     transY1 = -totalHeight
        //   }
        // }
         else {
          if (Math.abs(transY1) >= endDis1) {
            clearInterval(this.timer)
            this.page.setData({
              machine: {
                transY1: -(endDis1 - num1)
              }
            })
            return
          }

          // let dropSpeed = (endDis1 + transY1) / halfSpeed
          // dropSpeed = dropSpeed > halfSpeed ? halfSpeed : dropSpeed < 1 ? 1 : dropSpeed
          // transY1 += dropSpeed
          // transY1 = Math.abs(transY1) > endDis1 ? transY1 = endDis1 : transY1
        }

        this.page.setData({
          machine: {
            transY1: transY1,
          }
        })
      }, 1000 / 60)
    }, 100)

    this.timer1 = setInterval(() => {
      if (y<=2) {
        transY2 += speed
        if (transY2 > 0) {
          transY2 = -totalHeight
          y++
        }
      } 
      // else if (new Date().getTime() - lastData < 1500) {
      //   transY2 += halfSpeed
      //   if (transY2 > 0) {
      //     transY2 = -totalHeight
      //   }
      // } 
      else {
        if (Math.abs(transY2) >= endDis2) {
          clearInterval(this.timer1)
          this.page.setData({
            machine: {
              transY2: -(endDis2 - num2)
            }
          })
          return
        }

        // let dropSpeed = (endDis2 + transY2) / halfSpeed
        // dropSpeed = dropSpeed > halfSpeed ? halfSpeed : dropSpeed < 1 ? 1 : dropSpeed
        // transY2 -= dropSpeed
        // transY2 = Math.abs(transY2) > endDis2 ? transY2 = -endDis2 : transY2
      }
      this.page.setData({
        machine: {
          transY2: transY2
        }
      })
    }, 1000 / 70)

  }

  reset() {
    this.transY1 = 0
    this.transY2 = 0

    this.page.setData({
      machine: {
        transY1: 0,
        transY2: 0,
      }
    })
  }

}