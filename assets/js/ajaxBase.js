// ajax的基本配置

$.ajaxPrefilter(function (options) {
    // 在每次jQ发送ajax请求前会执行该函数，通过该函数的形参options可以获取到每次ajax的配置项
    // 来修改每次请求的配置项
    options.url = "http://ajax.frontend.itheima.net" + options.url;
    // console.log(options.url);

    // 处理请求头信息（token）

    if (options.url.indexOf("/my/") !== -1) {
        options.headers = {
            Authorization: localStorage.getItem("token"),
        };
    }

    //控制用户登录权限
    options.complete = function (xhr) {
        if (
            xhr.responseJSON.status === 1 &&
            xhr.responseJSON.message === "身份认证失败！"
        ) {
            //回到登录页面重新登录
            localStorage.removeItem("token");
            location.href = "login.html";
        }
    };

});
