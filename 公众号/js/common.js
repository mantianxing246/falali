'use strict';

// var API = "http://scrm.3tilabs.com:80/";
var API=location.protocol + "//" + location.host
// var URL = window.location.href;

var $body = $('#body');
// $.ajax({
// 	type: 'post',
// 	url: API + '/index.php/register/getgeren',
// 	data: {},
// 	success: function(r) {
// 		r = JSON.parse(r);
// 		if(r.error_code == 100) {
// 			var _url =encodeURIComponent(URL);
// 			window.location.replace(API + '/index.php/register/wx?error_url=' + _url + '&register_url=' + (API+'/home/authentication.html') + '&notknow_url=' + (API+'/home/authentication.html') + '&nota_url=' + (API + '/home/foc.html') + '&knownota_url=' + (API + '/home/foc.html') + '&index_url=' + (API + '/home/focsuccess.html'));
// 		} else if(r.error_code == 200 || r.error_code == 300) {
// 			if(window.location.pathname != '/home/authentication.html') {
// 				window.location.replace(API + '/home/authentication.html');
// 			} else {
// 				$body.addClass('active');
// 			}
// 		} else if(r.error_code == 400) {
// 			if(window.location.pathname == '/home/authentication.html') {
// 				window.location.replace(API + '/home/authsuccess.html');
// 			} else if(window.location.pathname != '/home/foc.html' && window.location.pathname != '/home/userinfo.html') {
// 				window.location.replace(API + '/home/foc.html');
// 			} else {
// 				$body.addClass('active');
// 			}
// 		} else if(r.error_code == 500) {
// 			if(window.location.pathname != '/home/focreview.html') {
// 				window.location.replace(API + '/home/focreview.html');
// 			} else {
// 				$body.addClass('active');
// 			}
// 		} else if(r.error_code == 700) {
// 			if(window.location.pathname == '/home/foc.html' || window.location.pathname == '/home/focreview.html') {
// 				window.location.replace(API + '/home/focfail.html');
// 			}
// 		} else {
// 			if(window.location.pathname != '/home/focsuccess.html') {
// 				window.location.replace(API + '/home/focsuccess.html');
// 			}
// 		}
// 	}
// });

var Toast = function() {
    if ($('#toast').length == 0) {
        var _dom = '<div class="toast" id="toast"><span></span></div>';
        $(document.body).append(_dom);
    }
}
Toast.prototype.show = function(txt) {
    if ($('#toast').hasClass('active')) return;
    $('#toast').addClass('active').find('span').html(txt);
    setTimeout(function() {
        $('#toast').removeClass('active').find('span').html('');
    }, 2500);
}
Toast.prototype.hide = function() {
    $('#toast').removeClass('active').find('span').html('');
}