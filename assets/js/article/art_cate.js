$(function () {

    let layer = layui.layer;
    let form = layui.form;

    getCate();
    function getCate() {
        $.ajax({
            url: "/my/article/cates",
            success: function (res) {

                //把数据 + 模板结合起来得到html字符串==>放到tbody中显示
                let htmlStr = template("trTpl", res);

                $("tbody").html(htmlStr);
            },
        });
    }


    // 添加类别按钮
    let index;
    $("#btnAdd").click(function () {

        index = layer.open({
            // 层类型
            type: 1,
            //定义宽度
            area: "500px",
            // 标题
            title: "添加文章分类",
            // 内容
            content: $("#addForm").html(),
        });
    });



    // 确认添加
    $("body").on("submit", "#form", function (e) {
        e.preventDefault();

        let data = $(this).serialize();

        $.ajax({
            url: "/my/article/addcates",
            type: "POST",
            data,
            success: function (res) {

                if (res.status !== 0) {
                    return layer.msg("新增文章分类失败！");
                }

                layer.msg("新增文章分类成功！");

                layer.close(index);
                getCate();
            },
        });
    });

    // 编辑按钮的点击功能
    let editIndex;
    $("tbody").on("click", ".editBtn", function () {
        //1.获取到存储的id
        let id = $(this).attr("data-id");

        //弹出层
        editIndex = layer.open({
            type: 1,
            area: "500px",
            title: "修改文章分类",
            content: $("#editFormTpl").html(),
        });

        // 发送请求，获取到form里面的数据
        $.ajax({
            url: "/my/article/cates/" + id,
            success: function (res) {
                console.log(res);

                if (res.status !== 0) {
                    return layer.msg("获取文章分类数据失败！");
                }

                // 把数据填充到form表单中
                form.val("editForm", res.data);
            },
        });
    });

    // 编辑符form表单的确认修改功能

    $("body").on("submit", "#editForm", function (e) {
        e.preventDefault();

        // 数据的获取
        let data = $(this).serialize();

        $.ajax({
            url: "/my/article/updatecate",
            type: "POST",
            data,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("更新分类信息失败");
                }

                layer.msg("更新分类成功！");
                // 关闭弹出层
                layer.close(editIndex);
                // 重新获取数据
                getCate();
            },
        });
    });

    $("tbody").on("click", ".delBtn", function () {
        let id = $(this).attr("data-id");

        $.ajax({
            url: "/my/article/deletecate/" + id,
            success: function (res) {
                console.log("res", res)
                if (res.status !== 0) {
                    return layer.msg("删除文章分类失败！");
                }

                layer.msg("删除文章分类成功！");

                // 重新加载所有文章分类
                getCate();
            },
        });
    });

});