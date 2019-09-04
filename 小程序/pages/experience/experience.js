let app=getApp()
Page({
    data: {
        videoShow: true,
        videoSrc:"",
        imgSrc:"",
        imgSrc2:""
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
    searchDealer(){
        wx.navigateTo({
            url: '/pages/dealerSearch/dealerSearch'
        })
    },
    onShareAppMessage(obj){
        return app.shareAppMessage()
    },
    onLoad(){
        let _this=this
        app.getImageUrl({
            vids: "e0910cxjkoi",
            success(imgUrl) {
                _this.setData({
                    videoSrc:imgUrl
                })
            },
            fail(res) {
    
            }
        })
        this.pictureUrl()
    },
    pictureUrl(){
        var _this=this
        app.pictureUrl(function(res){
            console.log(res)
            _this.setData({
                imgSrc:res[1]
            })
        })
    }
})