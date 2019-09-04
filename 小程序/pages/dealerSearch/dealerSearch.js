var {
    request,
    showLoadingFun
} = require("../../utils/util.js")
var app = getApp()
Page({
    data: {
        selectCity: ["北京市", "武汉市", "长沙市", "广州市", "深圳市", "重庆市", "成都市", "昆明市", "沈阳市", "上海市", "南京市",
            "苏州市", "杭州市", "合肥市", "福州市", "厦门市", "青岛市"
        ],
        selectDistributor: [],
        userAdress: {
            longitude: 0,
            latitude: 0,
        },
        dealerAdress: {
            longitude: 0,
            latitude: 0,
        },
        index: -1,
        index1: -1,
        index2: -1,
        index22: -1,
        dealer_info: {
            h3Text: "意特汽车商业（上海）有限公司",
            pText: "上海市南京西路1818号首层",
            phone: "021-60971212",
            picture: "/images/390410539651531932.png",
            english_name: "",
            hiddenShow: true,
            dealer_short: "", //经销商简称
        },
        hideFlag: true, //电话遮盖层
        cityFlag: true, //城市遮盖层
        distributorFlag: true, //经销商遮盖层
        animation: {},
        animation2: {},
        dwz: false,
        imgLoaded:false
    },
    onLoad() {
        this.location()
    },
    bindPickerChange(options) {
        let _this = this
        // console.log(options)
        if (options.type == "tap") {
            this.setData({
                index: this.data.index == this.data.index1 ? 0 : this.data.index1
            })
            _this.bindPickerChange2()

        }
        request({
            url: "/api/getDealer",
            data: {
                city: this.data.selectCity[this.data.index]
            },
            method: "post",
            success(res) {
                _this.setData({
                    selectDistributor: res.data
                })
                if (_this.data.dealer_info.dealer_short && options.type != "tap") {
                    _this.setData({
                        index2: _this.getSelectDistributorIndex(_this.data.dealer_info.dealer_short)
                    })
                }
                _this.bindPickerChange2()
                if (res.data && res.data.length > 0) {

                } else {
                    _this.setData({
                        dealer_info: {
                            h3Text: "",
                            pText: "",
                            picture: "",
                            phone: "",
                            hiddenShow: false,
                            english_name: ""
                        },
                        dealerAdress: {
                            longitude: "",
                            latitude: ""
                        },
                        dwz: true
                    })
                }
            },
            fail(res) {
                showLoadingFun("当前网络不好")
                setTimeout(() => {
                    wx.hideLoading()
                }, 2000);
            }
        })
    },
    bindPickerChange2() {
        let _this = this
        this.setData({
            index2: this.data.index22 == -1 ? 0 : this.data.index22
        })

        request({
            url: "/api/getDealerInfo",
            data: {
                id: this.data.selectDistributor[this.data.index2].autoId
            },
            method: "post",
            success(res) {
                _this.setData({
                    dealer_info: {
                        h3Text: res.data.dealer_name,
                        pText: res.data.address,
                        picture: res.data.picture,
                        phone: res.data.tel,
                        hiddenShow: false,
                        english_name: res.data.english_name
                    },
                    dwz: true,
                    dealerAdress: {
                        longitude: parseFloat(res.data.gps.split(",")[0]),
                        latitude: parseFloat(res.data.gps.split(",")[1])
                    }
                })
            },
            fail(res) {
                showLoadingFun("当前网络不好")
                setTimeout(() => {
                    wx.hideLoading()
                }, 2000);
            }
        })
    },
    //导航按钮
    navigationClick() {
        // wx.navigateTo({
        //     url: "/pages/map/map?userAdress=" + JSON.stringify(this.data.userAdress) + "&dealerAdress=" + JSON.stringify(this.data.dealerAdress)
        // })
        // 25.921256 119.38408
        // console.log(this.data.dealerAdress.latitude,this.data.dealerAdress.longitude)
        wx.openLocation({
            latitude: this.data.dealerAdress.latitude, // 纬度，范围为-90~90，负数表示南纬
            longitude: this.data.dealerAdress.longitude, // 经度，范围为-180~180，负数表示西经
            address: this.data.dealer_info.pText,
            name: this.data.dealer_info.h3Text
        })

        // console.log(this.data.dealerAdress.longitude,this.data.dealerAdress.latitude)
        // wx.openLocation({
        //     latitude: 30.253778,
        //     longitude: 120.16097,
        //     name:"经销商名字",
        //     address: "经销商地址"
        // })
    },
    //地理位置
    location() {
        var that = this
        //判断用户有没有允许获取地理位置
        wx.getLocation({
            type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
            success: function (res) {
                that.setData({
                    userAdress: {
                        longitude: res.longitude,
                        latitude: res.latitude
                    }
                })
                that.getDeaultCity(res.longitude, res.latitude)
            },
            fail: function (res) {
                wx.getSetting({
                    success(res) {
                        if (res.authSetting["scope.userLocation"]) {
                            that.getLocationMessage()
                        }else{
                            wx.showModal({
                                content:"请打开您的定位，以获取最近的经销商",
                                confirmText:"确定",
                                cancelText:"取消",
                                success(res){
                                    if(res.confirm){
                                        wx.openSetting({
                                            success(res){
                                                that.getLocationMessage()
                                            }
                                        })
                                    }
                                },
                                fail(res){
                                    that.getLocationMessage()
                                }
                            })
                        }
                    }
                })
            }
        })
    },
    getLocationMessage() {
        var that = this
        wx.getLocation({
            type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
            success: function (res) {
                console.log(res)
                that.setData({
                    userAdress: {
                        longitude: res.longitude,
                        latitude: res.latitude
                    }
                })
                that.getDeaultCity(res.longitude, res.latitude)
            },
            fail: function () {
                that.setData({
                    userAdress: {
                        longitude: 121.47,
                        latitude: 31.23
                    },
                    index: 9
                })
                that.getDeaultCity(121.47, 31.23)
            }
        })
    },
    phoneFun() {
        wx.makePhoneCall({
            phoneNumber: this.data.dealer_info.phone,
            success(res) {
                console.log(res)
            }
        })
    },
    //打电话
    phoneClick() {
        let _this = this
        let animation = this.slide()

        _this.setData({
            hideFlag: false
        })
        setTimeout(function () {
            animation.translateY(0).step()
            _this.setData({
                animation: animation.export()
            })
        }, 200)
    },
    //电话取消
    cancel() {
        let _this = this
        let animation = this.slide()

        animation.translateY(180).step()
        _this.setData({
            animation: animation.export()
        })
        setTimeout(function () {
            _this.setData({
                hideFlag: true
            })
        }, 200)
    },
    getDeaultCity(longitude, latitude) {
        let that = this
        request({
            url: "/api/distance",
            data: {
                gps: longitude + "," + latitude
            },
            method: "post",
            success(res) {
                if (res.data) {
                    that.setData({
                        dealer_info: {
                            h3Text: res.data.dealer_name,
                            pText: res.data.address,
                            phone: res.data.tel,
                            picture: res.data.picture,
                            english_name: res.data.english_name,
                            hiddenShow: true,
                            dealer_short: res.data.dealer_short
                        },
                        dealerAdress: {
                            longitude: parseFloat(res.data.gps.split(",")[0]),
                            latitude: parseFloat(res.data.gps.split(",")[1])
                        },
                        index: that.getCityIndex(res.data.city),
                        index1: that.getCityIndex(res.data.city),
                        index22: that.getSelectDistributorIndex(that.data.dealer_info.dealer_short)
                    })
                    that.bindPickerChange({
                        type: true
                    })
                }
            },
            fail() {
                showLoadingFun("当前网络不好")
                setTimeout(() => {
                    wx.hideLoading()
                }, 2000);
            }
        })
    },
    bindchange1(e) {
        this.setData({
            index1: e.detail.value[0]
        })
    },
    bindchange2(e) {
        this.setData({
            index22: e.detail.value[0]
        })
    },
    getCityIndex(city) {
        for (let i = 0; i < this.data.selectCity.length; i++) {
            if (city == this.data.selectCity[i]) {
                return i
            }
        }
        return 9
    },
    getSelectDistributorIndex(distributor) {
        for (let i = 0; i < this.data.selectDistributor.length; i++) {
            if (distributor == this.data.selectCity[i].dealer_short) {
                return i
            }
        }
        return 0
    },
    selectCityButton() {
        let _this = this
        let animation2 = this.slide()

        _this.setData({
            cityFlag: false
        })
        setTimeout(function () {
            animation2.translateY(0).step()
            _this.setData({
                animation2: animation2.export()
            })
        }, 200)
    },
    selectDistributor() {
        let _this = this
        let animation2 = this.slide()

        _this.setData({
            distributorFlag: false
        })
        setTimeout(function () {
            animation2.translateY(0).step()
            _this.setData({
                animation2: animation2.export()
            })
        }, 200)
    },
    cancelCity() {
        let _this = this
        let animation = this.slide()
        animation.translateY(300).step()
        _this.setData({
            animation2: animation.export()
        })
        setTimeout(function () {
            _this.setData({
                cityFlag: true
            })
        }, 200)
    },
    cancelDistributor() {
        let _this = this
        let animation = this.slide()
        animation.translateY(300).step()
        _this.setData({
            animation2: animation.export()
        })
        setTimeout(function () {
            _this.setData({
                distributorFlag: true
            })
        }, 200)
    },
    slide() {
        let animation = wx.createAnimation({
            duration: 400,
            timingFunction: "ease"
        })
        return animation
    },
    onShareAppMessage(obj) {
        return app.shareAppMessage()
    },
    imgLoad(){
        this.setData({
            imgLoaded:true
        })
    }
})