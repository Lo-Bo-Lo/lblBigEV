$(function () {
    let layer = layui.layer

    // 来获取头像和昵称
    getAvatarAndName();

    // 退出功能
    $("#logoutBtn").click(function () {
        layer.confirm(
            "确定退出登录?",
            { icon: 3, title: "提 示" },
            function (index) {
                //do something

                localStorage.removeItem("token");
                location.href = "login.html";

                layer.close(index); // 关闭当前询问框
            })
    })
});

function getAvatarAndName() {
    //获取用户头像和昵称基本信息
    $.ajax({
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem("token"),
        // },
        success: function (res) {
            // console.log(res);

            if (res.status !== 0) {
                return layer.msg("获取用户信息失败！");
            }

            // layer.msg("获取用户信息成功");

            //需要处理昵称和头像

            // 1.先处理名字（优先展示昵称，其次在是用户名）
            let name = res.data.nickname || res.data.username;
            // console.log(name);
            let first = name[0].toUpperCase();

            $("#welcome").text("欢迎" + name);

            //2.处理头像

            if (res.data.user_pic) {
                $(".layui-nav-img").show().attr("src", res.data.user_pic);
                $(".text-avatar").hide();
            } else {
                $(".layui-nav-img").hide();
                $(".text-avatar").text(first).show();
            }
        },
        // complete: function (xhr) {
        //     if (
        //         xhr.responseJSON.status === 1 &&
        //         xhr.responseJSON.message === "身份认证失败！"
        //     ) {
        //         //回到登录页面重新登录
        //         localStorage.removeItem("token");
        //         location.href = "login.html";
        //     }
        // },
    });
}