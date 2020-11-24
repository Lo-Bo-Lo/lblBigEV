$(function () {
    $("#gotoRegi").click(function () {
        $(".regiBox").show();
        $(".loginBox").hide();
    });

    $("#gotoLogin").click(function () {
        $(".regiBox").hide();
        $(".loginBox").show();
    });

    //从layui中获取form表单功能
    let form = layui.form;
    let layer = layui.layer;

    // 表单校验
    form.verify({
        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        pass: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],

        //确认密码校验 
        repass: function (value, item) {
            let pwd = $(".regiBox input[name=password]").val();
            // console.log(pwd);
            if (value !== pwd) {

                return "两次输入的密码不一致!";
            }
        },
    });

    //注册的ajax代码
    $("#regiForm").on("submit", function (e) {
        e.preventDefault();

        let data = $(this).serialize();

        $.ajax({
            type: "POST",
            url: "/api/reguser",
            data,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    // return layer.msg("注册失败" + res.message);
                    return layer.msg("注册失败" + res.message);
                }
                //layui
                layer.msg("注册成功")
                // 注册成功，显示登陆form（去登录）
                $("#gotoLogin").click();
            },
        });
    });

    //登录的ajax代码
    $("#loginForm").on("submit", function (e) {
        e.preventDefault();

        let data = $(this).serialize();

        $.ajax({
            type: "POST",
            url: "/api/login",
            data,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg("登录失败！");
                }
                localStorage.setItem("token", res.token);
                layer.msg(
                    "登录成功，即将去后台主页",
                    {
                        time: 2000, //2秒关闭（如果不配置，默认是3秒）
                    },
                    function () {
                        // 关闭后做的事情 ==> 跳转页面
                        location.href = "index.html";
                    }
                );
            },
        });
    });

});