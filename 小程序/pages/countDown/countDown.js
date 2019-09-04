import {
  checkLessDay
} from '../../utils/check.js';
import Machine from "./component/machine.js"
var {
  request,
} = require("../../utils/util.js")
let app = getApp()

Page({
  data: {
    defaultStatus: false,
    loaded: false,
    ajaxLoaded: false,
    keyLoaded: false,
    countTimeLogoLoaded: false,
    day: 0,
    myAudio: "",
    lastVideo: "",
    imgLoaded: false
  },

  onLoad: function (e) {
    const _this = this
    request({
      url: "/api/getDays",
      method: "post",
      success(res) {
        let countArray = `${res}`.split('')
        if (countArray.length <= 1) {
          countArray[1] = countArray[0]
          countArray[0] = 0
        }
        if (parseInt(countArray[0] + countArray[1]) <= 0) {
          app.global.returnPage = true
          _this.gotoNext()
        } else {
          _this.setData({
            ajaxLoaded: true,
            day: countArray[0] + countArray[1],
            myAudio: "http://www.zhanglongdream.com/img/one.mp3",
            lastVideo: "http://www.zhanglongdream.com/img/two.mp3"
          })

          _this.numAnimation()
        }
      }
    })
  },
  gotoNext() {
    // if (!this.data.defaultStatus) return
    wx.redirectTo({
      url: `/pages/drivingCourse/drivingCourse`
    })
  },
  //天空图片加载完成
  keyLoad() {
    this.setData({
      keyLoaded: true
    })
    this.numAnimation()
  },
  //道路图片加载完成
  roadLoad() {
    this.setData({
      loaded: true
    })
    this.numAnimation()
  },
  img_car_onload() {
    this.setData({
      imgLoaded: true
    })

    this.numAnimation()
  },
  onShareAppMessage() {
    return app.shareAppMessage()
  },
  countTimeLogo() {
    this.setData({
      countTimeLogoLoaded: true
    })
    this.numAnimation()
  },
  numAnimation() {
    let _this = this
    if (this.data.ajaxLoaded && this.data.loaded  && this.data.countTimeLogoLoaded&&this.data.keyLoaded) {
      // if (this.data.ajaxLoaded &&this.data.imgLoaded) {
      let countArray = `${this.data.day}`.split('')
      _this.machine = new Machine(_this, {
        height: 340,
        len: 10,
        transY1: 0,
        num1: countArray[0],
        transY2: 0,
        num2: countArray[1],
        speed: 80,
      })
      _this.machine.start()
      _this.carAnimationFun(0)
    }
  },
  carAnimationFun(top) {
    var canvasCtx = wx.createCanvasContext('firstCanvas')
    let _this = this
    let width = 70
    let height = width * 0.667
    let left = 100

    let clientWidth = wx.getSystemInfoSync().windowWidth
    //先定义位置
    canvasCtx.drawImage('/images/car.png', (clientWidth - width) / 2, top, width, height);
    canvasCtx.draw()

    setTimeout(function () {
      let timer = setInterval(() => {
        if (width < 340) {
          width += 20
          height = width * 0.7
          left = (clientWidth - width) / 2
          // top += 0.5
        } else {
          // speedUp(left, top, width, height)
          clearInterval(timer)


          // setTimeout(function () {
          //   _this.gotoNext()
          // }, 1000)
        }
        canvasCtx.drawImage('/images/car.png', left, top, width, height);
        canvasCtx.draw()
      }, 20)
    }, 1000)
  }
})