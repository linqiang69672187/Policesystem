var entitydata;
var selectdevid;
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
$(document).on('click.bs.carousel.data-api', '#cz-ck,.input-group-btn .btn-default', function (e) {
    loaddata();
})

function loaddata() {

    var data =
     {
         search: $(".seach-box input").val(),
         type: $("#deviceselect").val(),
         ssdd: $("#brigadeselect").val(),
         sszd: $("#squadronselect").val(),
         status: $("#sbstate").val()
     }
    $.ajax({
        type: "POST",
        url: "../Handle/map.ashx",
        data: data,
        dataType: "json",
        success: function (data) {
         
            if (data.r == "0") {

                createtable(data.result);


            }
        },
        error: function (msg) {
            console.debug("错误:ajax");
        }
    });

}



function createtable(data) {
    var $doc = $(".table tbody");
    var total = data.length;
    var zx = 0;
    var sc = 0;
    var lx = 0;
    var coumm1 = "";
    var coumm2 = "";
    var type = $("#deviceselect").val();
    var labeltext = "记录条数";
    $(".table thead tr").empty();
    switch (type) {
        case "0":    //人员
            $(".table thead tr").append("<th style='width:46px;'></th><th style='width:113px;'>所属单位</th><th style='width:113px;'>联系人</th><th style='width:80px;'>在线时长</th><th></th>")
            coumm2 = "data[i].XM";

            break;
        case "1": //车载视频
            break;
        case "2": //对讲机
            break;
        case "3": //拦截仪
            break;
        case "4": //警务通
            break;
        case "5": //执法记录仪
            break;
        case "6": //辅警通
            break;
        case "7": //测速仪
            break;
        case "8": //酒精测试仪
            break;
        default:
            break;

    }

    for (var i = 0; i < data.length; ++i) {

        switch (data[i].IsOnline) {
            case "1":
                $doc.append(" <tr title='设备编号：" + data[i].DevId + "'><td ><i class='fa fa-square-o'></i></td><td class='simg' style='width: 113px;text-align: left;padding-left:5px'><span>" + data[i].BMJC + "</span></td><td style='text-align:center;width:113px;'><span>" + eval(coumm2) + "</span></td><td style='text-align:center;width:80px;'><span>" + formatSeconds(data[i].OnlineTime, 1) + "</span></td><td><i class='fa fa-map-marker fa-2x fa-map-marker-color-online' aria-hidden='true'  bh='" + data[i].DevId + "'></i></td></tr>");
                sc +=(data[i].OnlineTime!="")? parseInt(data[i].OnlineTime):0;
                zx += 1;
                break;
            case "0":
                $doc.append(" <tr title='设备编号：" + data[i].DevId + "'><td ><i class='fa fa-square-o'></i></td><td class='simg' style='width: 113px;text-align: left;padding-left:5px'><span>" + data[i].BMJC + "</span></td><td style='text-align:center;width:113px;'><span>" + eval(coumm2) + "</span></td><td style='text-align:center;width:80px;'><span>" + formatSeconds(data[i].OnlineTime, 1) + "</span></td><td><i class='fa fa-map-marker fa-2x fa-map-marker-color-online' aria-hidden='true'  bh='" + data[i].DevId + "'></i></td></tr>");
                sc +=(data[i].OnlineTime!="")? parseInt(data[i].OnlineTime):0;
                lx +=1
                break;
   
                $doc.append(" <tr title='设备编号：" + data[i].DevId + "'><td ><i class='fa fa-square-o'></i></td><td class='simg' style='width: 113px;text-align: left;padding-left:5px'><span>" + data[i].BMJC + "</span></td><td style='text-align:center;width:113px;'><span>" + eval(coumm2) + "</span></td><td style='text-align:center;width:80px;'><span>" + formatSeconds(data[i].OnlineTime, 1) + "</span></td><td><i class='fa fa-map-marker fa-2x fa-map-marker-color-online' aria-hidden='true'  bh='" + data[i].DevId + "'></i></td></tr>");
                sc +=(data[i].OnlineTime!="")? parseInt(data[i].OnlineTime):0;

            default:
                $doc.append(" <tr title='设备编号：" + data[i].DevId + "'><td ><i class='fa fa-square-o'></i></td><td class='simg' style='width: 113px;text-align: left;padding-left:5px'><span>" + data[i].BMJC + "</span></td><td style='text-align:center;width:113px;'><span>" + eval(coumm2) + "</span></td><td style='text-align:center;width:80px;'><span>" + formatSeconds(data[i].OnlineTime, 1) + "</span></td><td></td></tr>");
                sc += (data[i].OnlineTime != "") ? parseInt(data[i].OnlineTime) : 0;

                break;
        }
    }
  
    $(".equipmentNumb").append("<label>" + labeltext + ":<span>" + total + "</span></label>总在线时长:<span>" + formatSeconds(sc,1) + "(h)</span><label>在线数:<span>" + zx + "</span></label><label>离线数:<span>" + lx + "</span></label>")



    $(".table").on("click", function (e) {
        var devid;
        if (e.target.nodeName == "I") { devid = $(e.target).attr("bh") }
        else {
            devid = $(e.target).children().attr("bh");
        }
        if (devid == "" || devid == undefined) { return; }
      //  $(".zq1").hide();
        $(".table .localtd").removeClass("localtd"); //移出定位
        selectdevid = devid;
        var feature = vectorLayer.getSource().getFeatureById(devid);
        if (feature) {
            var coordinates = feature.getGeometry().getCoordinates();
            point_overlay.setPosition(coordinates);
            var view = map.getView();
            view.animate({ zoom: view.getZoom() }, { center: coordinates }, function () {
                localFeatureInfo();
                setTimeout(function () { point_overlay.setPosition([0, 0]) }, 30000)
            });

         return;
        }
        return;
        $.ajax({
            type: "POST",
            url: "../Handle/GetcoordinateBydevid.ashx",
            data: { 'devid': devid },
            dataType: "json",
            success: function (data) {

                var view = map.getView();
                view.animate({ zoom: view.getZoom() }, { center: ol.proj.transform([parseFloat(data.data[0].La - offset.x), parseFloat(data.data[0].Lo - offset.y)], 'EPSG:4326', 'EPSG:3857') }, function () {
                    point_overlay.setPosition(ol.proj.transform([parseFloat(data.data[0].La - offset.x), parseFloat(data.data[0].Lo - offset.y)], 'EPSG:4326', 'EPSG:3857'));

                    localFeatureInfo();
                    setTimeout(function () { point_overlay.setPosition([0, 0]) }, 30000)
                });
            },
            error: function (msg) {
                console.debug("错误:ajax");
            }
        });
    })

    $(".table tbody").on("mouseover", function (e) {
        $(".fa-map-marker-color-mouseover").removeClass("fa-map-marker-color-mouseover");
        $(e.target).parent().find("i").addClass("fa-map-marker-color-mouseover");
    });
    $(".table tbody").on("mouseout", function (e) {
        $(".fa-map-marker-color-mouseover").removeClass("fa-map-marker-color-mouseover");
    });
}

function formatSeconds(value, y) {
    var result = Math.floor((value / 60 / 60) * Math.pow(10, y)) / Math.pow(10, y);
    return result;
}