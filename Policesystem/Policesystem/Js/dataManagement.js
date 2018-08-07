$("#header").load('top.html', function () { });
var entitydata;
function transferDate(date) {
    // 年  
    var year = date.getFullYear();
    // 月  
    var month = date.getMonth() + 1;
    // 日  
    var day = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (day >= 0 && day <= 9) {
        day = "0" + day;
    }
    var dateString = year + '/' + month + '/' + day;
    return dateString;
}
$('.start_form_datetime,.end_form_datetime').datetimepicker({
    format: 'yyyy/mm/dd',
    autoclose: true,
    todayBtn: true,
    minView: 2
});

function startdatetimedefalute() {
    var curDate = new Date();
    var preDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000); //前一天
    var beforepreDate = new Date(curDate.getTime() - 48 * 60 * 60 * 1000); //前一天
    $('.start_form_datetime').val(transferDate(beforepreDate));
    $('.end_form_datetime').val(transferDate(preDate));
}

function hbdatetime(date) {
    var curDate = new Date(date);
    return transferDate(new Date(curDate.getTime() - 7 * 24 * 60 * 60 * 1000));
}

startdatetimedefalute();
$.ajax({
    type: "POST",
    url: "../Handle/GetEntitys.ashx",
    data: "",
    dataType: "json",
    success: function (data) {
        entitydata = data.data; //保存单位数据
        for (var i = 0; i < entitydata.length; i++) {
            if (entitydata[i].SJBM == "331000000000") {
                $("#brigadeselect").append("<option value='" + entitydata[i].BMDM + "'>" + entitydata[i].BMJC + "</option>");
            }
        }
    },
    error: function (msg) {
        console.debug("错误:ajax");
    }
});
//更换大队选择
$(document).on('change.bs.carousel.data-api', '#brigadeselect', function (e) {
    //所属中队逻辑
    $("#squadronselect").empty();
    $("#squadronselect").append("<option value='all'>全部</option>");
    $("#squadronselect").removeAttr("disabled");
    if (e.target.value == "all") {
        $("#squadronselect").attr("disabled", "disabled");
        return;
    }
    for (var i = 0; i < entitydata.length; i++) {
        if (entitydata[i].SJBM == e.target.value) {
            $("#squadronselect").append("<option value='" + entitydata[i].BMDM + "'>" + entitydata[i].BMJC + "</option>");
        }
    }
});
//重置按钮
$(document).on('click.bs.carousel.data-api', '#resetbtn', function (e) {
    $("#deviceselect").val("1");
    $("#brigadeselect").val("all");
    $("#squadronselect").val("all");
    $("#squadronselect").attr("disabled", "disabled");
    startdatetimedefalute();
    $(".search input").val("");
});
$(document).on('click.bs.carousel.data-api', '#requestbtn', function (e) {
    if ($('.end_form_datetime').val() < $('.start_form_datetime').val()) {
        $("#alertmodal").modal("show");
        return;
    };
    loadTatolData();//加载汇总数
});
function loadTatolData() {
    var data =
   {
       search: $(".search input").val(),
       type: $("#deviceselect").val(),
       ssdd: $("#brigadeselect").val(),
       sszd: $("#squadronselect").val(),
       begintime: $(".start_form_datetime").val(),
       endtime: $(".end_form_datetime").val(),
       hbbegintime: hbdatetime($(".start_form_datetime").val()),
       hbendtime: hbdatetime($(".end_form_datetime").val()),
       dates: datecompare($(".end_form_datetime").val(), $(".start_form_datetime").val()),
       requesttype: "查询汇总"
   }
    $.ajax({
        type: "POST",
        url: "../Handle/dataManagement.ashx",
        data: data,
        dataType: "json",
        success: function (data) {
            if (data.r=="0"){
                createTatolRS(data);
            }
   
        },
        error: function (msg) {
            console.debug("错误:ajax");
        }
    });

}

function createTatolRS(data) {
    if (data.result[0] != "0" || data.result[0] != "" || data.result[4] != "" || data.result[4] != "0") {
        var intpf1 = parseInt(data.result[0]);
        var intpf2 = parseInt(data.result[4]);
        var tbpf = (intpf1 - intpf2) * 100 / intpf2;
        $("#ulsbpf li:eq(0)").text(intpf1);

    }
}
function datecompare(end, start) {
    start = new Date(start).getTime();
    end = new Date(end).getTime();
    var time = 0
    time = end - start;
    return Math.floor(time / 86400000) + 1;
};
function formatFloat(value, y) {
    var result = Math.floor((value) * Math.pow(10, y)) / Math.pow(10, y);
    return result;
};