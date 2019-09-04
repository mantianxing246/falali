let app = getApp()
var {
    request,
} = require("../../utils/util.js")
Page({
    data: {
        imageArr: [{
                imgSrc: "https://ferrari.3tilabs.com/h5/images/list_Banner1.png?date=" + new Date(),
            },
            {
                imgSrc: "https://ferrari.3tilabs.com/h5/images/list_Banner2.png?date=" + new Date(),
            },
            {
                imgSrc: "https://ferrari.3tilabs.com/h5/images/list_Banner3.png?date=" + new Date(),
            },
            {
                imgSrc: "https://ferrari.3tilabs.com/h5/images/list_Banner4.png?date=" + new Date(),
            },
            {
                imgSrc: "https://ferrari.3tilabs.com/h5/images/list_Banner5.png?date=" + new Date(),
            }
        ],
        bannerSrc: [{
            imgSrc: "https://ferrari.3tilabs.com/h5/images/list_Banner1.png",
            active: true
        }, {
            imgSrc: "https://ferrari.3tilabs.com/h5/images/list_Banner2.png",
            active: false
        }, {
            imgSrc: "https://ferrari.3tilabs.com/h5/images/list_Banner3.png",
            active: false
        }, {
            imgSrc: "https://ferrari.3tilabs.com/h5/images/list_Banner4.png",
            active: false
        }, {
            imgSrc: "https://ferrari.3tilabs.com/h5/images/list_Banner5.png",
            active: false
        }],
        videoShow: true,
        videoSrc: "",
        day: 0,
        onloadImage: false,
        imgSrc: "",
        bannerImageLoaded: false,
        imageOnloaded:false
    },
    onLoad(opstion) {
        let _this = this
        request({
            url: "/api/videoUrl",
            method: "post",
            success(res) {
                if (res.data) {
                    app.getImageUrl({
                        vids: res.data[0].split("?")[1].split("=")[1],
                        success(imgUrl) {
                            _this.setData({
                                videoSrc: imgUrl
                            })
                        },
                        fail(res) {

                        }
                    })
                }
            }
        })
        request({
            url: "/api/getDays",
            method: "post",
            success(res) {
                let countArray = `${res}`.split('')
                // console.log(parseInt(countArray[0]+countArray[1]))
                if (parseInt(countArray[0] + countArray[1]) <= 0) {
                    app.global.returnPage = true
                }
            }
        })
        this.pictureUrl()
    },
    bindchangeChange(current, source) {
        let bannerSrcArr = [{
            imgSrc: "https://ferrari.3tilabs.com/h5/images/list_Banner1.png",
            active: false
        }, {
            imgSrc: "https://ferrari.3tilabs.com/h5/images/list_Banner2.png",
            active: false
        }, {
            imgSrc: "https://ferrari.3tilabs.com/h5/images/list_Banner3.png",
            active: false
        }, {
            imgSrc: "https://ferrari.3tilabs.com/h5/images/list_Banner4.png",
            active: false
        }, {
            imgSrc: "https://ferrari.3tilabs.com/h5/images/list_Banner5.png",
            active: false
        }]
        bannerSrcArr[current.detail.current].active = true
        this.setData({
            bannerSrc: bannerSrcArr
        })
    },
    onloadImg() {
        this.setData({
            onloadImage: true
        })
    },
    bindtapClick(e) {
        this.setData({
            videoShow: false
        })
        let videoContent = wx.createVideoContext("video")
        videoContent.play()
    },
    videoBindTap(e) {
        this.setData({
            videoShow: true
        })
        let videoContent = wx.createVideoContext("video")
        videoContent.pause()
    },
    onShareAppMessage(obj) {
        return app.shareAppMessage()
    },
    pictureUrl() {
        var _this = this
        app.pictureUrl(function (res) {
            _this.setData({
                imgSrc: res[0]+"?date="+new Date()
            })
        })
    },
    bannerImageLoad() {
        this.setData({
            bannerImageLoaded: true
        })
    },
    imageOnload(){
        this.setData({
            imageOnloaded:true
        })
    }
})