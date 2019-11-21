
//当页面一加载，我们就需要获取到文字分类信息，在页面渲染

$(function () {
    //发起ajax请求，获取到分类信息
    getData();
    function getData() {
        $.get({
            url: BigNew.category_list,
            success: function (res) {
                // console.log(res);
                var htmlStr = template('list', res);
                // console.log(htmlStr);
                $('tbody').html(htmlStr);
            }
        })
    }

    //模态框取消按钮注册点击事件，点击的时候，将表单中的数据全部清空
    $('#btn-cancel').on('click', function () {
        //原生的表单对象上有一个方法： reset()用来重置表单的。
        $('.modal-body form')[0].reset();
    })


    //当点击某个按钮的时候显示模态框，会触发一个事件show.bs.modal
    $('#myModal').on('show.bs.modal', function (e) {
        //    var el = e.relatedTarget;
        //    console.log(el);
        if (e.relatedTarget == $('#xinzengfenlei')[0]) {
            //表示我们点击的新增
            $('#exampleModalLabel').text('新增文章分类');
            $('#btn-confirm').text('新增').addClass('btn-success').removeClass('btn-primary');
            //当点击新增分类的时候，将模态框中的表单全部重置一次
            $('.modal-body form')[0].reset();

        } else {
            //表示我们点击的了编辑
            $('#exampleModalLabel').text('编辑文章分类');
            $('#btn-confirm').text('编辑').addClass('btn-primary').removeClass('btn-success');

            // $('#recipient-name').val()
            // 点击某一个编辑按钮的时候需要获得存在这个编辑按钮中的id
            // console.log(e.relatedTarget);
            var cateId = $(e.relatedTarget).attr('data-id');
            // console.log(cateId);
            $.get({
                url: BigNew.category_search,
                data: {
                    id: cateId
                },
                success: function (res) {
                    // console.log(res);
                    if (res.code == 200) {
                        $('#recipient-name').val(res.data[0].name);
                        $('#message-text').val(res.data[0].slug);
                        $('#categoryId').val(res.data[0].id);
                    }

                }
            })

        }


        //给新增/编辑按钮注册点击事件
        $('#btn-confirm').on('click', function () {
            if ($(this).hasClass('btn-success')) {
                // alert('新增');
                //1.先获取到表单中的信息
                var name = $('#recipient-name').val();
                var slug = $('#message-text').val();
                //2.发送ajax请求，将新增的数据添加后台数据库中
                $.post({
                    url: BigNew.category_add,
                    data: {
                        name: name,
                        slug: slug
                    },
                    success: function (res) {
                        if (res.code == 201) {
                            $('#myModal').modal('hide');
                            getData();
                        }
                    }
                })
            } else {
                // alert('编辑');
                var name = $('#recipient-name').val();
                var slug = $('#message-text').val();
                var id = $('#categoryId').val();

                $.post({
                    url: BigNew.category_edit,
                    data: {
                        id: id,
                        name: name,
                        slug: slug
                    },
                    success: function (res) {
                        // console.log(res);
                        $('#myModal').modal('hide');
                        getData();
                    }
                })
            }
        })
    })



    //给删除按钮注册点击事件
    // $('.btn-delete').on('click',function() {
    //     console.log('我被点击了');
    // })

    $('tbody').on('click', '.btn-delete', function () {
        // console.log('我被点击了');
        //当要删除的时候，给用户一个选择提示
        var ans = confirm('亲，你真的要删除吗？');
        var deleteId = $(this).attr('data-id');
        // console.log(deleteId);
        // confirm会根据用户的选择返回结果： 确定： true     取消： false
        if (ans) {
            $.post({
                url: BigNew.category_delete,
                data: {
                    id: deleteId
                },
                success: function (res) {
                    // console.log(res);
                    if (res.code == 204) {
                        getData();
                    }
                }
            })
        }
    })




})
