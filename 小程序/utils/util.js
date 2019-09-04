// import md5 from './md5'
function getToken(success) {
  wx.request({
    url: "https://ferrari.3tilabs.com/api/getToken",
    method: "post",
    data: {
      from: "ferrari",
    },
    success: function (res) {
      success(res.data)
      // console.log(res)
    }
  })
}

function request({
  url,
  data,
  method,
  success,
  fail
}) {
  let baseURL = "http://scrm.3tilabs.com",
    URL = 'https://ferrari.3tilabs.com'
  let httpUrl = ''
  if (url.indexOf('http') > -1) {
    httpUrl = baseURL + url
  } else {
    httpUrl = URL + url
  }


  getToken(function (res) {
    let Data = null
    if (data) {
      Data = Object.assign({},data, {
        token: res.data
      })
    } else {
      Data = {
        token: res.data
      }
    }
    // console.log(Data)
    wx.request({
      url: httpUrl,
      data: Data,
      method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        success(res.data)
      },
      fail: function (res) {
        fail(res.data)
      },
      complete: function () {
        // complete
      }
    })
  })
}

//随机生成0-9的数
function RandomNum() {
  return Math.floor(Math.random() * 9)
}

function showLoadingFun(title) {
  wx.showLoading({
    title: title,
    mask: true
  })
}

module.exports = {
  request: request,
  showLoadingFun: showLoadingFun,
  RandomNum: RandomNum
}