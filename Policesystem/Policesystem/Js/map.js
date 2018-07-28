var entitydata;

$("#header").load('top.html', function () {

});
$('.start_form_datetime').datetimepicker({
    format: 'yyyy/m/d',
    autoclose: true,
    todayBtn: true,
    minView: 2
});
$(document).on('click.bs.carousel.data-api', '.boxleft > .row li > div', function (e) {
    $('.leftactive').removeClass();
    $(this).addClass('leftactive');
    switch (e.target.id) {
        case "ry": //人员
            $("#deviceselect").val("0");
            $(".seach-box input").attr('placeholder', '请输入姓名或警员编号');
            break;
        case "czsp": //车载视频
            $("#deviceselect").val("1");
            $(".seach-box input").attr('placeholder', '请输入车辆号码或设备编号');
            break;
        case "zfjly": //执法记录仪
            $(".seach-box input").attr('placeholder', '请输入警员姓名或设备编号');
            $("#deviceselect").val("5");
            break;
        case "fjt": //辅警通
            $(".seach-box input").attr('placeholder', '请输入警员姓名或设备编号');
            $("#deviceselect").val("6");
            break;
        case "jwt": //警务通
            $(".seach-box input").attr('placeholder', '请输入警员姓名或设备编号');
            $("#deviceselect").val("4");
            break;
        case "ljy": //拦截仪
            $(".seach-box input").attr('placeholder', '请输入警员姓名或设备编号');
            $("#deviceselect").val("3");
            break;
        case "djj": //对讲机
            $(".seach-box input").attr('placeholder', '请输入警员姓名或设备编号');
            $("#deviceselect").val("2");
            break;
        default:
            break;

    }
});

$.ajax({
    type: "POST",
    url: "../Handle/GetEntitys.ashx",
    data: "",
    dataType: "json",
    success: function (data) {

        entitydata = data; //保存单位数据
        for (var i = 0; i < data.length; i++) {

            if (data.SJBM == "331000000000") {  
            $("#brigadeselect").append("<option value='" + data[i].BMDM + "'>" + data[i].Name + "</option>");
            }
        }
    },
    error: function (msg) {
        console.debug("错误:ajax");
    }
});