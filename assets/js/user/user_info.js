$(function () {

    // 发送ajax获取用户的基本信息
    let form = layui.form;
    let layer = layui.layer;
    getInfo();
    function getInfo() {
        $.ajax({
            url: "/my/userinfo",
            success: function (res) {
                console.log(res);

                if (res.status !== 0) {
                    return layer.msg("获取用户基本信息失败!")
                }
                form.val("usefForm", res.data);
            },

        });
    }
    //   重置功能
    $("#resetBtn").click(function (e) {
        e.preventDefault();

        getInfo();
    });

    //提交表单数据-修改用户信息
    $("#userForm").submit(function (e) {
        e.preventDefault();
        let data = $(this).serialize();

        $.ajax({
            url: "/my/userinfo",
            type: "POST",
            data,
            success: function (res) {

                if (res.status !== 0) {
                    return layer.msg("修改用户信息失败！");
                }

                layer.msg("修改用户信息成功");

                window.parent.getAvatarAndName();
            }
        })
    });

    //添加表单校验功能
    form.verify({
        // 昵称长度限制

        nickname: function (value, itme) {
            if (value.length > 6) {
                return "昵称长度必须在1-6字符之间";
            }
        },
    })
});