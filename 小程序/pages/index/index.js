let app = getApp()
Page({
    data: {
        carVideoArr: [{
            videoSrc: "",
            imageSrc: "/images/Sports_piaoyi.png",
            videoShow: true,
            video: "video1",
            imgSrc:"",
            height:350,
            imgLoaded:false
        }, {
            videoSrc: "",
            imageSrc: "/images/Sports_jingzhunzhidong.png",
            videoShow: true,
            video: "video2",
            imgSrc:"",
            height:350,
            imgLoaded:false
        }, {
            videoSrc: "",
            imageSrc: "/images/Sports_quanqingjiasu.png",
            videoShow: true,
            video: "video3",
            imgSrc:"",
            height:380,
            imgLoaded:false
        }],
        imgLoaded:false,
        imgSrc:""
    },
    playVideo(e) {
        var index = e.target.dataset.index
        let video = e.target.dataset.video
        let videoContent = wx.createVideoContext(video)
        let changeCarVideoArr = this.data.carVideoArr
        changeCarVideoArr[index].videoShow = false
        this.setData({
            carVideoArr: changeCarVideoArr
        })
        videoContent.play()
    },
    videoBindTap(e) {
        var index = e.target.dataset.index
        let video = e.target.dataset.video
        let videoContent = wx.createVideoContext(video)
        let changeCarVideoArr = this.data.carVideoArr
        changeCarVideoArr[index].videoShow = true
        this.setData({
            carVideoArr: changeCarVideoArr
        })
        videoContent.pause()
    },
    onShareAppMessage(obj) {
        return app.shareAppMessage()
    },
    onLoad() {
        let _this=this
        app.getImageUrl({
            vids: "z0910kd0gyx",
            success(imgUrl) {
                let carVideoArr=_this.data.carVideoArr
                carVideoArr[0].videoSrc=imgUrl
                _this.setData({
                    carVideoArr:carVideoArr
                })
            },
            fail(res) {

            }
        })
        app.getImageUrl({
            vids: "k09109b5d2x",
            success(imgUrl) {
                let carVideoArr=_this.data.carVideoArr
                carVideoArr[1].videoSrc=imgUrl
                _this.setData({
                    carVideoArr:carVideoArr
                })
            },
            fail(res) {

            }
        })
        app.getImageUrl({
            vids: "g0910peot8e",
            success(imgUrl) {
                let carVideoArr=_this.data.carVideoArr
                carVideoArr[2].videoSrc=imgUrl
                _this.setData({
                    carVideoArr:carVideoArr 
                })
            },
            fail(res) {

            }
        })
        this.pictureUrl()
    },
    pictureUrl(){
        var _this=this
        var carVideoArr=this.data.carVideoArr
        app.pictureUrl(function(res){
            carVideoArr[0].imgSrc=res[3]
            carVideoArr[1].imgSrc=res[4]
            carVideoArr[2].imgSrc=res[5]
            _this.setData({
                imgSrc:res[2],
                carVideoArr:carVideoArr
            })
        })
    },
    imgLoad(e){
        var index=parseInt(e.currentTarget.id),n=0
        let carVideoArr=JSON.parse(JSON.stringify(this.data.carVideoArr))
        for(let i=0;i<carVideoArr.length;i++){
            if(carVideoArr[i].imgLoaded){
                n++
            }else{
                break
            }
        }
        if(n>=1){
            this.setData({
                imgLoaded:true
            })
            console.log(n)
        }else{
            carVideoArr[index].imgLoaded=true
            this.setData({
                carVideoArr:carVideoArr
            })
        }
    }
})