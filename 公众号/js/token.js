var URL = "https://ferrari.3tilabs.com"

function getToken(success) {
    $.ajax({
        url: "https://ferrari.3tilabs.com/api/getToken",
        type: "post",
        data: {
            from: "ferrari",
        },
        success(res) {
            // alert(res)
            success(res.data)
        },
        error(res){
           
        }
    })
}

function ajax({
    type,
    url,
    data,
    success
}) {
    getToken(function (res) {
        let Data = null
        if (data) {
            Data = Object.assign({}, data, {
                token: res
            })
        } else {
            Data = {
                token: res
            }
        }
        $.ajax({
            type: type,
            url: "https://ferrari.3tilabs.com" + url,
            data: Data,
            // data:  Object.assign(data,{token:"c97e90dc4658618bc2e5a4152510620b"}),
            success: function (res) {
                success(res)
                // alert(JSON.stringify(res))
            },
            error() {

            }
        });
    })
}