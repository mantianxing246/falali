$(function () {
    // console.log(!/MicroMessenger/i.test(navigator.userAgent))
    // if (location.search && !(/MicroMessenger/i.test(navigator.userAgent))) {
    //     var search = location.search.split("?")[1]
    //     var pointStartLng = search.split("&")[0].split("=")[1]
    //     var pointStartLat = search.split("&")[1].split("=")[1]
    //     var pointEndLng = search.split("&")[2].split("=")[1]
    //     var pointEndLat = search.split("&")[3].split("=")[1]
    //     var destination = search.split("&")[4].split("=")[1]
    //     if (/iPhone/.test(navigator.userAgent)) {
    //         location.href = `iosamap://path?sourceApplication=applicationName&sid=
    //                     BGVIS1&slat=${pointStartLat}&slon=${pointStartLng}&sname=A&did=BGVIS2&dlat=${pointEndLat}&dlon=${pointEndLng}&dname=B&dev=0&t=0`

    //         setTimeout(function () {
    //             location.href = `baidumap://map/direction?origin=${pointStartLng},${pointStartLat}&destination=${destination}&mode=driving&src=ios.baidu.openAPIdemo`
    //         }, 1000)
    //     } else {

    //         location.href = `
    //                 baidumap://map/direction?origin=name:起始位置|latlng:${pointStartLng},${pointStartLat}&destination=${destination}&mode=transit&sy=3&index=0&target=1&src=andr.baidu.openAPIdemo
    //                 `

    //         setTimeout(function () {
    //             location.href = `
    //                 amapuri://route/plan/?sid=BGVIS1&slat=${pointStartLat}&slon=${pointStartLng}
    //                 sname=A&did=BGVIS2&dlat=${pointEndLat}&dlon=${pointEndLng}&dname=目标位置&dev=0&t=0
    //                 `
    //         }, 1000)
    //     }

    // }


    var elAmap = $('#amap-wrapper'), //地图 
        elLogo = $('#company-logo'), //最上面logo
        elCompany = $('#company'), //最上面logo的父组件
        elCompanyInfo = $('#company-info'), //选择经销商后出现相关图片和文字的父组件
        elCompanyTel = $('#company-tel'), //电话
        elNavigator = $('#navigator'), //当前位置图片
        elSelectDistributor = $('#select-distributor'); //选择我经销商
    var API = location.protocol + "//" + location.host,
        destination = null

    var elAlert = $('#alert-panel'); //定位的弹框
    elAlert.find('.alert-close').on('click', function (e) { //关闭按钮
        elAlert.find('.alert-text').html('');
        elAlert.removeClass('active');
    });


    //设置海报图片高度
    var bannerHeight = $(window).width() * 9 / 16;
    elCompany.height(50 + bannerHeight);
    elCompanyInfo.find('img').height(bannerHeight);

    // 设置地图高度	
    var windowHeight = $(window).height();
    elAmap.height(windowHeight - 153 - bannerHeight);

    // 初始化地图与驾车路线查询
    var pointStartLng = '',
        pointStartLat = '',
        pointEndLng = '',
        pointEndLat = '';


    var map = new AMap.Map('amap-wrapper', {
        zoom: 13
    });
    var driving = new AMap.Driving({
        map: map
    });


    elNavigator.on('click', function () {
        if (pointStartLng === '') {
            elAlert.find('.alert-text').html('定位中，请稍后尝试');
            elAlert.addClass('active');
            return;
        } else if (pointEndLng === '') {
            elAlert.find('.alert-text').html('请选择经销商');
            elAlert.addClass('active');
            return;
        }

        // 根据起终点经纬度规划驾车导航路线
        driving.search(new AMap.LngLat(pointStartLng, pointStartLat), new AMap.LngLat(pointEndLng, pointEndLat));
    });

    // 选择经销商处理函数
    function selectDistributorHandle(data) {
        // elSelectDistributor.html(data.dealer_short);
        elLogo.addClass('hide');
        elCompanyInfo.find('img').attr('src', data.picture);
        elCompanyInfo.find('h3').html(data.dealer_name);
        elCompanyInfo.find('p').html(data.address);
        elCompanyInfo.addClass('active');
        elCompanyTel.attr('href', 'tel:' + data.tel).html(data.tel).addClass('active');
        pointEndLng = data.gps.split(",")[0];
        pointEndLat = data.gps.split(",")[1];
        destination = data.address

        //重新设置地图终点坐标
        map.setZoomAndCenter(11, [pointEndLng, pointEndLat]); //同时设置地图层级与中心点
        marker = new AMap.Marker({
            position: new AMap.LngLat(pointEndLng, pointEndLat)
        })
        map.add(marker)
    }

    // 初始化选择插件
    var selectCity = new MobileSelect({
        trigger: '#select-city',
        title: '',
        wheels: [{
            data: city
        }],
        callback: function (indexArr, data) {
            // 根据城市获取经销商
            ajax({
                type: 'post',
                url: '/api/getDealer',
                data: {
                    city: data[0].value
                },
                success: function (res) {
                    if (res.msg == 200) {
                        selectDistributor.updateWheel(0, res.data)
                        if (res.data.length == 1) {
                            elSelectDistributor.text(res.data[0].dealer_short)
                            getDealerInfo(res.data[0].autoId)
                        }
                    }
                }
            })
        }
    });

    //经销商初始化
    var selectDistributor = new MobileSelect({
        trigger: '#select-distributor',
        title: '',
        wheels: [{
            data: [{
                id: 1,
                dealer_short: "选择市"
            }]
        }],
        keyMap: {
            autoId: 'id',
            value: 'dealer_short'
        },
        callback: function (indexArr, data) {
            elSelectDistributor.text(data[0].dealer_short)
            getDealerInfo(data[0].autoId)
        },
        triggerDisplayData: false
    });


    function getDealerInfo(id) {
        ajax({
            type: 'post',
            url: '/api/getDealerInfo',
            data: {
                id: id
            },
            success: function (r) {
                if (r.msg == 200) {
                    selectDistributorHandle(r.data)
                }
            }
        })
    }


    map.plugin('AMap.Geolocation', function () {
        var geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, //是否使用高精度定位，默认:true
            timeout: 10000, //超过10秒后停止定位，默认：无穷大
            maximumAge: 0, //定位结果缓存0毫秒，默认：0
            buttonPosition: 'LB', //定位按钮停靠位置，默认：'LB'，左下角
        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
        AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息

        function onComplete(obj) {
            var res = '经纬度：' + obj.position + '\n精度范围：' + obj.accuracy +
                '米\n定位结果的来源：' + obj.location_type + '\n状态信息：' + obj.info + '\n地址：' + obj.formattedAddress + '\n地址信息：' + JSON.stringify(obj.addressComponent, null, 4);
            console.log(obj.position)
            pointStartLng = obj.position.lng
            pointStartLat = obj.position.lat
            marker = new AMap.Marker({
                position: new AMap.LngLat(pointStartLng, pointStartLat)
            })
            console.log(pointStartLng, pointStartLat)
            map.add(marker)
        }


        function onError(obj) {
            console.log(obj);
        }
    });

    //分享
    ajax({
        type: 'post',
        url: "/api/share",
        data: {
            url: location.href,
        },
        success: function (res) {
            var json_res = JSON.parse(res)
            wx.config({
                appId: json_res.appid, // 必填，公众号的唯一标识
                timestamp: json_res.timestamp, // 必填，生成签名的时间戳
                nonceStr: json_res.nonceStr, // 必填，生成签名的随机串
                signature: json_res.signature, // 必填，签名
                jsApiList: [
                    'onMenuShareAppMessage',
                ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            })
            // console.log(json_res)

            wx.ready(function () {
                wx.onMenuShareAppMessage({
                    title: '法拉利车主服务|查找经销商', // 分享标题
                    desc: '点击查找距您最近的法拉利官方授权经销商', // 分享描述
                    link: 'https://ferrari.3tilabs.com/h5/index.html', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: 'http://ferrari.3tilabs.com/h5/images/share.jpg', // 分享图标
                    success: function () {
                        // 用户点击了分享后执行的回调函数
                    }
                });
            })
        },
        error() {

        }
    })
});


var city = [{
        id: 1,
        value: "北京市"
    },
    {
        id: 11,
        value: "武汉市"
    },
    {
        id: 12,
        value: "长沙市"
    },
    {
        id: 13,
        value: "广州市"
    },
    {
        id: 14,
        value: "深圳市"
    },
    {
        id: 15,
        value: "重庆市"
    },
    {
        id: 16,
        value: "成都市"
    },
    {
        id: 17,
        value: "昆明市"
    }, {
        id: 2,
        value: "沈阳市"
    }, {
        id: 3,
        value: "上海市"
    }, {
        id: 4,
        value: "南京市"
    }, {
        id: 5,
        value: "苏州市"
    }, {
        id: 6,
        value: "杭州市"
    }, {
        id: 7,
        value: "合肥市"
    }, {
        id: 8,
        value: "福州市"
    }, {
        id: 9,
        value: "厦门市"
    }, {
        id: 10,
        value: "青岛市"
    }
]