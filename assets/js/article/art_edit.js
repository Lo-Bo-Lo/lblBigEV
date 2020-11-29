$(function () {

    let form = layui.form;
    let layer = layui.layer;

    //  发布文章的状态
    let state = '';

    // 需要同意过locati的search来获取id的值，从而根据id的值去发送ajax请求，获取到文章的信息（放到页面中）
    let id = location.search.split("?id=")[1];

    // 获取类别
    $.ajax({
        url: "/my/article/cates",
        success: function (res) {
            // console.log("res", res)

            let htmlStr = "";

            res.data.forEach(item => {
                htmlStr += `
                <option value="${item.Id}">${item.name}</option>
                `
            });

            //把option添加到下拉框中
            $("[name=cate_id]").append(htmlStr);
            // 坑：需要让form重新渲染
            form.render();

            //发送ajax获取到对应的id文章信息
            getArtInfo();
        },
    });

    function getArtInfo() {
        $.ajax({
            url: "/my/article/" + id,
            success: function (res) {
                console.log(res);

                //修改文章的发布状态
                state = res.data.state;

                form.val("form", res.data);

                // 3. 初始化裁剪区域
                $image
                    .attr("src", "http://ajax.frontend.itheima.net" + res.data.cover_img)
                    .cropper(options)
            },
        });
    }

    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }



    $("#chooseBtn").click(function () {
        $("#file").click();
    });

    // 选择好之后替换的封面
    $("#file").on("change", function () {
        // 获取用户选择的图片
        let file = this.files[0];
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper("destroy") // 销毁旧的裁剪区域
            .attr("src", newImgURL) // 重新设置图片路径
            .cropper(options); // 重新初始化裁剪区域
    });

    // 点击发布和存为草稿，修改文章的状态
    $("#pubBtn").click(function () {
        state = "已发布";
    });
    $("#pubBtn2").click(function () {
        state = "草稿";
    });

    // 提交form表单数据
    $("#form").on("submit", function (e) {
        e.preventDefault();

        // 把裁切的图片转成对应的文件
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob((blob) => {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作

                // 收集表单数据
                // let data = $(this).serialize(); // 不行
                // 因为由于此接口涉及到文件上传的功能，因此提交的请求体，必须是 FormData 格式！

                let fd = new FormData(this); // 参数需要form这个DOM对象

                //fd实例可以通过append方法来追加数据
                fd.append("state", state);

                // 收集封面数据
                fd.append("cover_img", blob);

                // fd可以使用forEach来遍历，查看存储form的数据
                // fd.forEach(item => console.log(item))

                //后续写ajax发布设置
                pubArt(fd);
            });
    });

    // 发送ajax实现发布文章
    function pubArt(fd) {
        $.ajax({
            url: "/my/article/add",
            type: "POST",
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                console.log(res);

                if (res.status !== 0) {
                    return layer.msg("发布文章失败！");
                }

                layer.msg("发布文章成功！");

                location.href = "/article/art_list.html";
            },
        });
    }
});