'use strict';

var $submit = $('#submit'); //车主认证按钮
var $tel = $('#usertel'); //手机号输入框
var $veri = $('#userveri'); //获取短信吗输入框
var $btnVeri = $('#btn-userveri'); //获取验证码按钮
var $username1 = $('#username1'); //姓
var $username2 = $('#username2'); //名

var $alert = $('#alert-error'); //车主认证未通过提示框
var $alertSuccess = $('#alert-success'); //车主认证通过提示框
var $alertClose = $('.alert-close'); //车主认证未通过提示框内弹框消失的按钮
// var $unverifiedAlert = $("#unverified") //选择未认证经销商 
var API = location.protocol + "//" + location.host
// var API="https://ferrari.3tilabs.com"
var toast = new Toast();
var validateCode = null,
    dealer_en_name = null,
    open_id = null

// https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx813e6c4051c7c4d0&redirect_uri=http://ferrari.3tilabs.com/api/getCode&response_type=code&scope=snsapi_base&state=1#wechat_redirect
//判断出现什么页面
// if (!location.href.split("?")[1]) {
//     location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe020dbc15e1fcc05&redirect_uri=http://ferrari.3tilabs.com/api/getCode?appid=wxe020dbc15e1fcc05,secs=f34b749b144092f447a83b86ca8ba5c9&response_type=code&scope=snsapi_base&state=1#wechat_redirect"
// } else {
let key = location.href.split("?")[1].split("=")[1]
ajax({
    url: "/api/getOpenIdByKey",
    type: "post",
    data: {
        key: key
    },
    success(res) {
        if (res.data && res.data.openid) {
            open_id = res.data.openid

            ajax({
                url: "/api/isAuthentication",
                type: "post",
                data: {
                    open_id: open_id
                },
                success(res) {
                    $(".loading").hide()
                    if (res.msg == 200 && res.data && res.data.indexOf("已认证") != -1) {
                        $(".rz").show()
                        $(".authentication").hide()
                        $("body").attr({
                            style: "background:white"
                        })
                    } else {
                        $(".rz").hide()
                        $(".authentication").show()
                    }
                },
                error() {
                    toast.show('请在微信服务号中重新打开');
                }
            })
        }
    },
    error() {

    }
})

/**
 * @description 发送验证码倒计时
 */
var countNum = 60;
var countClick = false;
var countDown = function () {
    setTimeout(function () {
        countNum--;
        $btnVeri.html('已发送(' + countNum + 's)');
        if (countNum > 0) {
            countDown();
        } else {
            $btnVeri.html('获取验证码');
            countNum = 60;
            countClick = false;
        }
    }, 1000);
}

//验证码不要重复点击
$btnVeri.on('click', function (e) {
    if (countClick) {
        return toast.show('请不要重复点击');
    }

    if ($tel.val() === '') {
        return toast.show('请填写手机号码');
    } else if (isNaN($tel.val()) || $tel.val().length != 11) {
        return toast.show('手机号码格式错误');
    }
    ajax({
        type: 'post',
        url:'/api/message',
        data: {
            mobile: $tel.val()
        },
        success: function (res) {
            if (res.msg) {
                countDown()
                countClick = true

                validateCode = res.data.validateCode
                return toast.show('发送成功');

            } else {
                return toast.show('发送失败，请重新发送');
            }
        }
    });
});

//点击取消按钮
$alertClose.on('click', function (e) {
    $(this).parents(".alert").removeClass("active")
});

//新增
$('#submit').on('click', function (e) {
    console.log($tel.val())
    if ($tel.val() === '') {
        return toast.show('手机号格式不正确，请重新输入');
    } else if (isNaN($tel.val()) || $tel.val().length != 11) {
        return toast.show('手机号码格式错误');
    }
    if ($veri.val() === '') {
        return toast.show('请填写短信验证码');
    }
    if ($username1.val() === '') {
        return toast.show('请填写姓');
    }
    if ($username2.val() === '') {
        return toast.show('请填写名');
    }
    if (validateCode != $veri.val()) {
        return toast.show('验证码不正确');
    }

    // alert(open_id)

    ajax({
        type: 'post',
        url: '/api/authentication',
        data: {
            mobile: $tel.val(),
            nickname: "",
            surname: $username1.val(),
            lastname: $username2.val(),
            open_id: open_id,
            dealer_en_name: dealer_en_name
        },
        success: function (r) {
            if (r.msg && r.msg.indexOf("已认证") != -1) {
                // $alertSuccess.addClass('active');
                location.replace("./success.html")
            } else {
                $alert.addClass('active');
            }
        },
        error() {
            $alert.addClass('active');
        }
    })


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
            //分享
            wx.onMenuShareAppMessage({
                title: '法拉利车主服务|车主认证', // 分享标题
                desc: '邀您完成车主认证，尊享法拉利优质服务', // 分享描述
                link: 'https://ferrari.3tilabs.com/api/redi', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: 'https://ferrari.3tilabs.com/h5/images/share.jpg', // 分享图标
                success: function () {
                    // 用户点击了分享后执行的回调函数
                }
            });
        })
    },
    error() {

    }
})