//app.js
let {
  showLoadingFun,
  request
} = require("./utils/util")
App({
  global: {
    returnPage: false, //是否要跳转到开屏页
    lastTime: new Date().getMinutes(),
    find:"/images/icon-find.png?date="+new Date()
  },
  onLaunch: function () {
    this.isNetWork()
  },
  onShow() {
    const nowTime = new Date().getMinutes()
    var pages = getCurrentPages()
    if (pages && pages.length >= 0) {
      const lastPage = pages[pages.length - 1]
      if (pages.length != 0) {
        // console.log(this.global.returnPage)
        if (this.global.returnPage) {

        }else if (lastPage.route != 'pages/countDown/countDown' && (nowTime - this.global.lastTime >= 5)) {
          console.log(1)
          this.global.lastTime = new Date().getMinutes()
          wx.reLaunch({
            url: "/pages/countDown/countDown"
          })
        }
      }
    }
  },
  isNetWork() {
    //没有网络的时候显示loading
    wx.getNetworkType({
      success: function (res) {
        if (res.networkType == "none") {
          showLoadingFun("当前无网络")
        }
      }
    })
    //当网络变化的时候
    wx.onNetworkStatusChange(function (res) {
      if (!res.isConnected) {
        showLoadingFun("当前无网络")
      } else {
        wx.hideLoading()
      }
    })
  },
  shareAppMessage() {
    return {
      title: "2019最终站—浙江站倒计时",
      imageUrl: "/images/share.png",
      path:"/pages/countDown/countDown"
    }
  },
  getImageUrl({
    vids,
    success,
    fail
  }) {
    wx.request({
      url: `https://vv.video.qq.com/getinfo`,
      data: {
        vids: vids,
        platform: "101001",
        charge: "0",
        otype: "json"
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        let QZOutputJson = (res.data.split("=")[1]).substring(0, res.data.split("=")[1].length - 1)
        QZOutputJson = JSON.parse(QZOutputJson)

        let imgUrl = QZOutputJson.vl.vi[0].ul.ui[0].url + QZOutputJson.vl.vi[0].fn + "?vkey=" + QZOutputJson.vl.vi[0].fvkey
        success(imgUrl)
        console.log(QZOutputJson)
      },
      fail: function () {
        fail(res)
      },
      complete: function () {

      }
    })
  },
  pictureUrl(success) {
    var _this = this
    request({
      url: "/api/pictureUrl?date=" + new Date(),
      method: "post",
      success(res) {
        if (res.data) {
          success(res.data)
        }
      }
    })
  }
})