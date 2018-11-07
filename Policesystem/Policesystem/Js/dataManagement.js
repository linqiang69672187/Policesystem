var entitydata;
var table;
var starttime;
var endtime;
var ssdd;
var sszd;
var search;
var type;
var ssddtext;
var tablezd;
var seltype;
var pagecount;
var todaytotaldata = [];
var searchtext;
$("#header").load('top.html', function () {
    $("#header ul li:eq(3)").addClass("active");
});

switch (true) {
    case window.screen.height > 910:
        pagecount = 10;
        break;
    case window.screen.height > 850:
        pagecount = 8;
        break;
     default:
         pagecount = 5;
        break;

}
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
        if (data.title != "331000000000") {
            $("#brigadeselect").attr("disabled", "disabled");
        }
        entitydata = data.data; //保存单位数据
        for (var i = 0; i < entitydata.length; i++) {

            if (entitydata[i].SJBM == "331000000000") {
                if (data.title == entitydata[i].BMDM) {
                    $("#brigadeselect").append("<option value='" + entitydata[i].BMDM + "' selected>" + entitydata[i].BMJC + "</option>");
                    changesquadronselect(entitydata[i].BMDM);
                }
                else {
                    $("#brigadeselect").append("<option value='" + entitydata[i].BMDM + "'>" + entitydata[i].BMJC + "</option>");
                }
            }
        }
        switch (data.title) {
            case "331000000000":
            case "331001000000":
            case "331002000000":
            case "331003000000":
            case "331004000000":
            case "33100000000x":
                break;
            default:
                $("#squadronselect").attr("disabled", "disabled");
                changeentitysel(data.title)
                break;
        }

    },
    error: function (msg) {
        console.debug("错误:ajax");
    }
});

$.ajax({
    type: "POST",
    url: "../Handle/dataManagementConfig.ashx",
    data: { 'requesttype': 'Request' },
    dataType: "json",
    success: function (data) {
        if (data.r == "0") {
            var val = data.result[0].val.split("|");
            $("#configmodal input:eq(0)").val(val[0]);
            $("#configmodal input:eq(1)").val(val[1]);
        }
    },
    error: function (msg) {
        console.debug("错误:ajax");
    }
});

$(document).on('click.bs.carousel.data-api', '#configmodal .btn-save', function (e) {
    $(".alainfo").hide();
   var _val1 = $("#configmodal input:eq(0)").val();
   var _val2 = $("#configmodal input:eq(1)").val();
    if (_val1 == "") {
        createUserAlarm($("#configmodal .date:eq(0)"), "设备使用标准不能为空");
        return;
    }
    if (_val2 == "") {
        createUserAlarm($("#configmodal .date:eq(1)"), "设备在线标准不能为空");
        return;
    }

    $.ajax({
        type: "POST",
        url: "../Handle/dataManagementConfig.ashx",
        data: { 'requesttype': 'update', 'val': _val1 +"|"+_val2 },
        dataType: "json",
        success: function (data) {
            
            $("#configmodal").modal("hide");

        },
        error: function (msg) {
            console.debug("错误:ajax");
            $("#configmodal").modal("hide");
        }
    });


});


function createUserAlarm($ele, txt) {
    var $doc = $ele;
    $doc.find("label").show();
}


function changesquadronselect(brigadeselectvalue) {
    $("#squadronselect").empty();
    $("#squadronselect").append("<option value='all'>全部</option>");
    $("#squadronselect").removeAttr("disabled");
    for (var i = 0; i < entitydata.length; i++) {
        if (entitydata[i].SJBM == brigadeselectvalue) {
            $("#squadronselect").append("<option value='" + entitydata[i].BMDM + "'>" + entitydata[i].BMJC + "</option>");
        }
    }
}

function changeentitysel(BMDM) {
    $("#squadronselect").empty();
    $("#brigadeselect").empty();
    var SJBM;
    for (var i = 0; i < entitydata.length; i++) {
        if (BMDM == entitydata[i].BMDM) {
            $("#squadronselect").append("<option value='" + entitydata[i].BMDM + "' selected>" + entitydata[i].BMJC + "</option>");
            SJBM = entitydata[i].SJBM;
        }
    }
    for (var i = 0; i < entitydata.length; i++) {
        if (SJBM == entitydata[i].BMDM) {
            $("#brigadeselect").append("<option value='" + entitydata[i].BMDM + "' selected>" + entitydata[i].BMJC + "</option>");
        }
    }
    if ($("#brigadeselect").size() == 0) {
        $("#brigadeselect").append("<option value='0' selected>其它部门</option>");
    }
    if ($("#squadronselect").size() == 0) {
        $("#squadronselect").append("<option value='" + BMDM + "' selected>" + BMDM + "</option>");
    }
}




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
    $(".tablediv label:eq(0)").text("| " + $("#deviceselect").find("option:selected").text() + "报表")
   
    if (!table) {
        createDataTable();
    } else {

        $("#search-result-table").DataTable().ajax.reload();
    }
});
$(document).on('click.bs.carousel.data-api', '#addedit', function (e) {
    var $doc = $(this).parents('tr');
    //var data = $('#search-result-table').DataTable().row($doc).data();
   // date = data["AlarmDay"];
    $doc.addClass("trselect");
    ssdd = $(this).attr("entityid");
    ssddtext = $doc.find("td:eq(1)").text();
    $(".datadetail").modal("show");
    showetailRS();

});
//参数配置
$(document).on('click.bs.carousel.data-api', '#configbtn', function (e) {
    $("#configmodal").modal("show");

});
$('.datadetail').on('hidden.bs.modal', function () {

    $("#search-result-table").find(".trselect").removeClass("trselect"); //移除选择
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
                joinData(data);
            }
   
        },
        error: function (msg) {
            console.debug("错误:ajax");
        }
    });

}

function joinData(data) {
    var  creadata = {
        result:[]
    }
    var val1 = { Value: {} };
    var val2 = { Value: {} };
    var val3 = { Value: {} };
    var val4 = { Value: {} };
    var val5 = { Value: {} };
    var val6 = { Value: {} };
    var val7 = { Value: {} };
    var val8 = { Value: {} };
    val1.Value = todaytotaldata[0];
    creadata.result.push(val1)
    val2.Value = parseFloat(todaytotaldata[1]) * 3600;
    creadata.result.push(val2)
    val3.Value = todaytotaldata[2];
    creadata.result.push(val3)
    val4.Value = todaytotaldata[3];
    creadata.result.push(val4)
    val5.Value = data.result[0].Value;
    creadata.result.push(val5)
    val6.Value = data.result[1].Value;
    creadata.result.push(val6)
    val7.Value = data.result[2].Value;
    creadata.result.push(val7)
    val8.Value = data.result[3].Value;
    creadata.result.push(val8)
    createTatolRS(creadata);
}

function createTatolRS(data) {
    //配发量
    if (data.result[0].Value != "0" && data.result[0].Value != "" && data.result[4].Value != "" && data.result[4].Value != "0") {
        var intpf1 = parseInt(data.result[0].Value);
        var intpf2 = parseInt(data.result[4].Value);
        var tbpf = (intpf1 - intpf2) * 100 / intpf2;
        $("#ulsbpf li:eq(0)").text(intpf1);
        if (tbpf < 0) {
            $("#ulsbpf li:eq(2)").html("同比上周减少" + formatFloat(tbpf,1) + "%<i class='fa fa-arrow-down' aria-hidden='true'>");
        }
        else
        {
            $("#ulsbpf li:eq(2)").html("同比上周增加" + formatFloat(tbpf, 1) + "%<i class='fa fa-arrow-up' aria-hidden='true'>");
        }
    }
    else
    {
        $("#ulsbpf li:eq(0)").text("0");
        $("#ulsbpf li:eq(2)").html("同比上周减少 --%");

    }
    //在线时长
    if (data.result[1].Value != "0" && data.result[1].Value != "" && data.result[5].Value != "" && data.result[5].Value != "0") {
        var intpf1 = parseInt(data.result[1].Value);
        var intpf2 = parseInt(data.result[5].Value);
        var tbpf = (intpf1 - intpf2) * 100 / intpf2;

       $("#ulsysc li:eq(0)").text(formatFloat(intpf1 / 3600, 1) + "h");
       $("#ulsysc li:eq(1)").text("使用时长");

        if (tbpf < 0) {
            $("#ulsysc li:eq(2)").html("同比上周减少" + formatFloat(tbpf, 1) + "%<i class='fa fa-arrow-down' aria-hidden='true'>");
        }
        else {
            $("#ulsysc li:eq(2)").html("同比上周增加" + formatFloat(tbpf, 1) + "%<i class='fa fa-arrow-up' aria-hidden='true'>");
        }
    }
    else {
        $("#ulsysc li:eq(0)").text("0");
        $("#ulsysc li:eq(2)").html("同比上周 --%");

    }
    //设备使用数量
    if (data.result[2].Value != "0" && data.result[2].Value != "" && data.result[6].Value != "" && data.result[6].Value != "0") {
        var intpf1 = parseInt(data.result[2].Value);
        var intpf2 = parseInt(data.result[6].Value);
        var tbpf = (intpf1 - intpf2) * 100 / intpf2;
        $("#ulsysl li:eq(0)").text(intpf1);
        if (tbpf < 0) {
            $("#ulsysl li:eq(2)").html("同比上周减少" + formatFloat(tbpf, 1) + "%<i class='fa fa-arrow-down' aria-hidden='true'>");
        }
        else {
            $("#ulsysl li:eq(2)").html("同比上周增加" + formatFloat(tbpf, 1) + "%<i class='fa fa-arrow-up' aria-hidden='true'>");
        }
    }
    else {
        $("#ulsysl li:eq(0)").text("0");
        $("#ulsysl li:eq(2)").html("同比上周 --%");

    }
    //设备在线数
    if (data.result[3].Value != "0" && data.result[3].Value != "" && data.result[7].Value != "" && data.result[7].Value != "0") {
        var intpf1 = parseInt(data.result[3].Value);
        var intpf2 = parseInt(data.result[7].Value);
        var tbpf = (intpf1 - intpf2) * 100 / intpf2;
        $("#ulzxsb li:eq(0)").text(intpf1);
        if (tbpf < 0) {
            $("#ulzxsb li:eq(2)").html("同比上周减少" + formatFloat(tbpf, 1) + "%<i class='fa fa-arrow-down' aria-hidden='true'>");
        }
        else {
            $("#ulzxsb li:eq(2)").html("同比上周增加" + formatFloat(tbpf, 1) + "%<i class='fa fa-arrow-up' aria-hidden='true'>");
        }
    }
    else {
        $("#ulzxsb li:eq(0)").text("0");
        $("#ulzxsb li:eq(2)").html("同比上周 --%");

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

function eachbrigadeselect() {
    var entitys="";
    $("#brigadeselect option").each(function (index, el) {
        if (index > 0) {
            entitys += (index > 1) ? ","+($(this).val()) : $(this).val()
        }
    });
    return entitys;
}
function showetailRS() {
    if (!tablezd) {
        createtabledetail();
    } else {
        $('#detailgr-result-table').DataTable().ajax.reload(function () {
        });
    }
  
}

function resizetbwidth() {
    switch ($("#deviceselect").val()) {
        case "1":   //车载视频
        case "2":
        case "3":
        case "7":
            $('#search-result-table tr:eq(0) th:eq(0)').css('width', '40px');
            $('#search-result-table tr:eq(0) th:eq(1)').css('width', '200px');
            $('#search-result-table tr:eq(0) th:eq(2)').css('width', '100px');
            $('#search-result-table tr:eq(0) th:eq(3)').css('width', '100px');
            $('#search-result-table tr:eq(0) th:eq(4)').css('width', '100px');
            $('#search-result-table tr:eq(0) th:eq(5)').css('width', '100px');
            $('#search-result-table tr:eq(0) th:eq(6)').css('width', '100px');
            break;
        case "4":   //车载视频
        case "6":
            $('#search-result-table tr:eq(0) th:eq(0)').css('width', '40px');
            $('#search-result-table tr:eq(0) th:eq(1)').css('width', '200px');
            $('#search-result-table tr:eq(0) th:eq(2)').css('width', '60px');
            $('#search-result-table tr:eq(0) th:eq(3)').css('width', '60px');
            $('#search-result-table tr:eq(0) th:eq(4)').css('width', '60px');
            $('#search-result-table tr:eq(0) th:eq(5)').css('width', '60px');
            $('#search-result-table tr:eq(0) th:eq(6)').css('width', '60px');
            $('#search-result-table tr:eq(0) th:eq(7)').css('width', '80px');
            $('#search-result-table tr:eq(0) th:eq(8)').css('width', '60px');
            $('#search-result-table tr:eq(0) th:eq(9)').css('width', '110px');
            break;
        case "5":
            $('#search-result-table tr:eq(0) th:eq(0)').css('width', '40px');
            $('#search-result-table tr:eq(0) th:eq(1)').css('width', '200px');

            break;
    }
}

function createtabledetail() {

    tablezd = $('#detailgr-result-table')
                   .on('error.dt', function (e, settings, techNote, message) {
                       console.log('An error has been reported by DataTables: ', message);
                   })
             .on('preXhr.dt', function (e, settings, data) {
                 $('.progressdt').show();
                 $('#detailgr-result-table').hide();
             })
         .on('xhr.dt', function (e, settings, json, xhr) {
             $('.progressdt').hide();
             $('#detailgr-result-table').show();
             var typename;
             switch (seltype) {
                 case "1":
                     typename = "车载视频";
                     break;
                 case "2":
                     typename = "对讲机";
                     break;
                 case "3":
                     typename = "拦截仪";
                     break;
                 case "5":
                     typename = "执法记录仪";
                     break;
                 case "4":
                     typename = "警务通";
                     break;
                 case "6":
                     typename = "辅警通";
                     break;
             }
             $("#myModaltxzsLabel").text(ssddtext + typename + "设备详情");
             $(".search-result-flooterleft  span:eq(0)").text("共" + json.data.length + "条记录");
             $('.daochumx').html("<a class='buttons-excel'  href='../Handle/upload/" + json.title + "'><span>导 出</span></a>");
             switch (seltype) {
                 case "5":
                     tablezd.column(5).visible(false);
                     tablezd.column(6).visible(true);
                     tablezd.column(7).visible(true);
                     $('#detailgr-result-table tr:eq(0) th:eq(4)').text("设备编号");
                     $('#detailgr-result-table tr:eq(0) th:eq(5)').text("视频时长总和(小时)");
                     $('#detailgr-result-table tr:eq(0) th:eq(6)').text("视频大小(GB)");
                     break;
                 case "4":
                     tablezd.column(5).visible(false);
                     tablezd.column(6).visible(true);
                     tablezd.column(7).visible(true);
                     $('#detailgr-result-table tr:eq(0) th:eq(4)').text("设备编号");
                     $('#detailgr-result-table tr:eq(0) th:eq(5)').text("警务通处罚数");
                     $('#detailgr-result-table tr:eq(0) th:eq(6)').text("查询量");
                  
                     break;
                 case "6":
                     tablezd.column(5).visible(false);
                     tablezd.column(6).visible(true);
                     tablezd.column(7).visible(true);
                     $('#detailgr-result-table tr:eq(0) th:eq(4)').text("PDAID");
                     $('#detailgr-result-table tr:eq(0) th:eq(5)').text("违停采集量");
                     $('#detailgr-result-table tr:eq(0) th:eq(6)').text("查询量");
                 
                     break;
                 case "2":
                     tablezd.column(5).visible(true);
                     tablezd.column(6).visible(false);
                     tablezd.column(7).visible(false);
                     $('#detailgr-result-table tr:eq(0) th:eq(4)').text("呼号");
               
                     break;

                 default:
                     tablezd.column(5).visible(true);
                     tablezd.column(6).visible(false);
                     tablezd.column(7).visible(false);
                     $('#detailgr-result-table tr:eq(0) th:eq(4)').text("设备编号");
                     $('#detailgr-result-table tr:eq(0) th:eq(5)').text("在线时长");
                 
                     break;

             }
         })
        .DataTable({
            ajax: {
                url: "../Handle/dataManagementdetail.ashx",
                type: "POST",
                data: function () {
                    return    data = {
                        search: search,
                        type: type,
                        entityid: ssdd,
                        starttime: starttime,
                        endtime: endtime,
                        ssddtext: ssddtext,
                        searchtext: searchtext
                    };

                }
            },
            Paginate: true,
            pageLength: 6,
            Processing: true, //DataTables载入数据时，是否显示‘进度’提示  
            serverSide: false,   //服务器处理
            responsive: true,
            paging: true,
            autoWidth: true,

            "order":"",
            columns: [
                      
                         { "data": "cloum1","orderable": false },
                         { "data": "cloum2","orderable": false },
                         { "data": "cloum3","orderable": false },
                         { "data": "cloum4", "orderable": false },
                         { "data": "cloum5", "orderable": false },
                         { "data": "cloum6", "orderable": false },
                         { "data": "cloum7", "orderable": false },
                         { "data": "cloum8", "orderable": false },
                   
            ],
            columnDefs: [
                        ],
            buttons: [
            ],
            "language": {
                "lengthMenu": "_MENU_每页",
                "zeroRecords": "没有找到记录",
                "info": "第 _PAGE_ 页 ( 总共 _PAGES_ 页 )",
                "infoEmpty": "无记录",
                "infoFiltered": "(从 _MAX_ 条记录过滤)",
                "search": "查找设备:",
                "paginate": {
                    "previous": "上一页",
                    "next": "下一页"
                }
            },

            dom: "" + "t" + "<'row' p>B"
        });
   
}
function createDataTable() {

        var columns = [
                          { "data": "cloum1","orderable": false },
                          { "data": "cloum2" },
                          { "data": "cloum3" },
                          { "data": "cloum4" },
                          { "data": "cloum9" },
                          { "data": "cloum5" },
                          { "data": "cloum4" },
                          { "data": "cloum7" },
                          { "data": "cloum6" },
                          { "data": "cloum8" },
                          { "data": "cloum9", "visible": false},
                          { "data": "cloum10", "visible": false},
                          { "data": "cloum11", "visible": false },
                          { "data": null, "orderable": false }
        ];


        table = $('#search-result-table')
           .on('error.dt', function (e, settings, techNote, message) {
           })
            .on('preXhr.dt', function (e, settings, data) {
                $('.progresshz').show()
                $('.btnsjx').attr("disabled", "disabled");
                $('#search-result-table').hide();
            })

             .on('xhr.dt', function (e, settings, json, xhr) {
                 if (json.data.length > 0) {
                     var n = json.data.length - 1;
                     todaytotaldata.length = 0;
                     todaytotaldata.push(json.data[n]["cloum3"]);

                     switch ($("#deviceselect").val()) {
                         case "1":   //车载视频
                         case "2":
                         case "3":
                         case "7":
                             todaytotaldata.push(json.data[n]["cloum4"]);
                             todaytotaldata.push(json.data[n]["cloum5"]);
                             break;
                         case "5":
                             todaytotaldata.push(json.data[n]["cloum7"]);
                             todaytotaldata.push(json.data[n]["cloum5"]);

                             break;
                         case "4":
                         case "6":
                             todaytotaldata.push(json.data[n]["cloum13"]);
                             todaytotaldata.push(parseInt(json.data[n]["cloum3"]) - parseInt(json.data[n]["cloum10"]));
                             break;

                     }
                
                     todaytotaldata.push(json.data[n]["cloum14"]);
                 }
                 $('.progresshz').hide();
                 $('#search-result-table').show();
                 $('.btnsjx').removeAttr("disabled");

                 seltype = $("#deviceselect").val();

                 switch ($("#deviceselect").val()) {
                     case "1":   //车载视频
                     case "2":  
                     case "3":   
                     case "7":
                         table.column(0).visible(true);
                         table.column(1).visible(true);
                         table.column(2).visible(true);
                         table.column(5).visible(true);
                         table.column(6).visible(true);
                         table.column(7).visible(true);
                         table.column(3).visible(false);
                         table.column(4).visible(false);
                         table.column(8).visible(false);
                         table.column(9).visible(true);
                         table.column(10).visible(false);
                         table.column(11).visible(false);
                         table.column(12).visible(false);
                         $('#search-result-table tr:eq(0) th:eq(0)').text("序号");
                         $('#search-result-table tr:eq(0) th:eq(1)').text("部门");
                         $('#search-result-table tr:eq(0) th:eq(2)').text("设备配发数（台）");
                         $('#search-result-table tr:eq(0) th:eq(3)').text("设备使用数量（台）");
                         $('#search-result-table tr:eq(0) th:eq(4)').text("在线时长（小时）");
                         $('#search-result-table tr:eq(0) th:eq(5)').text("设备使用率（%）");
                         $('#search-result-table tr:eq(0) th:eq(6)').text("使用率排名");
                       
                         break;

                     case "5":
                         table.column(0).visible(true);
                         table.column(1).visible(true);
                         table.column(2).visible(true);
                         table.column(5).visible(true);
                         table.column(6).visible(true);
                         table.column(7).visible(true);
                         table.column(8).visible(true);
                         table.column(9).visible(true);
                         table.column(10).visible(false);
                         table.column(11).visible(false);
                         table.column(12).visible(false);
                         table.column(3).visible(true);
                         table.column(4).visible(true);
                         $('#search-result-table tr:eq(0) th:eq(0)').text("序号");
                         $('#search-result-table tr:eq(0) th:eq(1)').text("部门");
                         $('#search-result-table tr:eq(0) th:eq(2)').text("设备配发数（台）");
                         $('#search-result-table tr:eq(0) th:eq(3)').text("设备使用数量（台）");
                         $('#search-result-table tr:eq(0) th:eq(4)').text("设备未使用数量（台）");
                         $('#search-result-table tr:eq(0) th:eq(5)').text("视频时长总和（小时）");
                         $('#search-result-table tr:eq(0) th:eq(7)').text("视频大小（GB）");
                         $('#search-result-table tr:eq(0) th:eq(8)').text("设备使用率（%）");
                         $('#search-result-table tr:eq(0) th:eq(9)').text("使用率排名");
                         table.column(6).visible(false);

                         break;
                     case "4":
                         table.column(0).visible(true);
                         table.column(1).visible(true);
                         table.column(2).visible(true);
                         table.column(3).visible(true);
                         table.column(4).visible(true);
                         table.column(5).visible(true);
                         table.column(6).visible(false);
                         table.column(7).visible(true);
                         table.column(8).visible(true);
                         table.column(9).visible(true);
                         table.column(10).visible(false);
                         table.column(11).visible(false);
                         table.column(12).visible(true);
                         $('#search-result-table tr:eq(0) th:eq(0)').text("序号");
                         $('#search-result-table tr:eq(0) th:eq(1)').text("部门");
                         $('#search-result-table tr:eq(0) th:eq(2)').text("配发数");
                         $('#search-result-table tr:eq(0) th:eq(3)').text("警员数");
                         $('#search-result-table tr:eq(0) th:eq(4)').text("警务通处罚数");
                         $('#search-result-table tr:eq(0) th:eq(5)').text("人均处罚量");
                         $('#search-result-table tr:eq(0) th:eq(6)').text("查询量");
                         $('#search-result-table tr:eq(0) th:eq(7)').text("设备平均处罚量");
                         $('#search-result-table tr:eq(0) th:eq(8)').text("排名");
                         $('#search-result-table tr:eq(0) th:eq(9)').text("无处罚数量");
                         break;
                     case "6":
                         table.column(0).visible(true);
                         table.column(1).visible(true);
                         table.column(2).visible(true);
                         table.column(3).visible(true);
                         table.column(4).visible(true);
                         table.column(5).visible(true);
                         table.column(6).visible(false);
                         table.column(7).visible(true);
                         table.column(8).visible(true);
                         table.column(9).visible(true);
                         table.column(10).visible(false);
                         table.column(11).visible(false);
                         table.column(12).visible(true);
                         $('#search-result-table tr:eq(0) th:eq(0)').text("序号");
                         $('#search-result-table tr:eq(0) th:eq(1)').text("部门");
                         $('#search-result-table tr:eq(0) th:eq(2)').text("配发数");
                         $('#search-result-table tr:eq(0) th:eq(3)').text("辅警数");
                         $('#search-result-table tr:eq(0) th:eq(4)').text("违停采集(例)");
                         $('#search-result-table tr:eq(0) th:eq(5)').text("人均处罚量");
                         $('#search-result-table tr:eq(0) th:eq(6)').text("查询量");
                         $('#search-result-table tr:eq(0) th:eq(7)').text("设备平均处罚量");
                         $('#search-result-table tr:eq(0) th:eq(8)').text("排名");
                         $('#search-result-table tr:eq(0) th:eq(9)').text("无违停采集设备（台）");
                         break;
                     default:
                         break;
                 }
                 $('.infodiv').html("<span>共 " + json.data.length + " 条记录</span>");
                 $('.daochu').html("<a class='buttons-excel'  href='../Handle/upload/" + json.title + "'><span>导 出</span></a>");
                 rebuildsjx();
                 loadTatolData();
             })
            .on('draw.dt', function () {
                //给第一列编号
                setTimeout(resizetbwidth, 50);
          
            })

            .DataTable({
                ajax: {
                    url: "../Handle/getDataManagement.ashx",
                    type: "POST",
                    data: function () {
                        starttime = $(".start_form_datetime").val();
                        endtime = $(".end_form_datetime").val()
                        ssdd = $("#brigadeselect").val();
                        sszd = $("#squadronselect").val();
                        search = $(".seach-box input").val();
                        type = $("#deviceselect").val();
                        searchtext = $(".search input").val();
                       
                        return data = {
                            search: $(".search input").val(),
                            type: $("#deviceselect").val(),
                            ssdd: $("#brigadeselect").val(),
                            sszd: $("#squadronselect").val(),
                            ssdd1: eachbrigadeselect(),
                            begintime: $(".start_form_datetime").val(),
                            endtime: $(".end_form_datetime").val(),
                            dates: datecompare($(".end_form_datetime").val(), $(".start_form_datetime").val()),
                            ssddtext: $("#brigadeselect").find("option:selected").text(),
                            sszdtext:$("#squadronselect").find("option:selected").text(),
                            requesttype: "查询报表",
                            onlinevalue: $("#configmodal input:eq(1)").val(),
                            usedvalue:$("#configmodal input:eq(0)").val()
                        }
                    }

                },
                Paginate: true,
                pageLength: pagecount,
                Processing: true, //DataTables载入数据时，是否显示‘进度’提示  
                serverSide: false,   //服务器处理
                responsive: true,
                paging: true,
                autoWidth: true,
                "order": [],
                columns: columns,
                columnDefs: [
                         {
                             targets:13,
                             render: function (a, b, c, d) { var html = "<a  class=\'btn btn-sm btn-primary txzs-btn\' id='addedit' entityid='" + c.cloum12 + "'  >查看详情</a>"; return html; }
                         }
                ],
                buttons: [ ],
                "language": {
                    "lengthMenu": "_MENU_每页",
                    "zeroRecords": "没有找到记录",
                    "info": "第 _PAGE_ 页 ( 总共 _PAGES_ 页 )",
                    "infoEmpty": "无记录",
                    "infoFiltered": "(从 _MAX_ 条记录过滤)",
                    "search": "查找设备:",
                    "paginate": {
                        "previous": "上一页",
                        "next": "下一页"
                    }
                },

                dom: "" + "t" + "<'row'p><'row infodiv'>",

                initComplete: function () {}
            });
}

$(document).on('click.bs.carousel.data-api', '.btnsjx', function (e) {
    if ($(this).attr("disabled") == "disabled") {
        return;
    }
    var $doc = $(this).text();
    if ($doc == "显示数据项") {
        $('#shujuxiang').css("display", "inline-block");
        $(this).text("隐藏数据项");
        rebuildsjx();
    }
    else
    {
        $('#shujuxiang').css("display", "none");
        $(this).text("显示数据项");
    }
});

function rebuildsjx() {
    $('#shujuxiang li').remove();
    switch (seltype) {
        case "1":   //车载视频
        case "2":
        case "3":
        case "7":
            $('#shujuxiang').html('<li><i class="fa fa-check-square-o" aria-hidden="true"></i>部门</li><li><i class="fa fa-check-square-o" aria-hidden="true"></i>配发数</li><li><i class="fa fa-check-square-o" aria-hidden="true"></i>设备使用数量</li><li><i class="fa fa-check-square-o" aria-hidden="true"></i>在线时长</li><li><i class="fa fa-check-square-o" aria-hidden="true"></i>设备使用率</li><li><i class="fa fa-check-square-o" aria-hidden="true"></i>使用率排名</li>')
            break;
        case "5":
            $('#shujuxiang').html('<li><i class="fa fa-check-square-o" aria-hidden="true"></i>部门</li><li><i class="fa fa-check-square-o" aria-hidden="true"></i>配发数</li><li><i class="fa fa-check-square-o" aria-hidden="true"></i>设备使用数量</li><li><i class="fa fa-check-square-o" aria-hidden="true"></i>设备未使用数量</li><li><i class="fa fa-check-square-o" aria-hidden="true"></i>视频时长</li><li><i class="fa fa-check-square-o" aria-hidden="true"></i>视频大小</li><li><i class="fa fa-check-square-o" aria-hidden="true"></i>设备使用率</li><li><i class="fa fa-check-square-o" aria-hidden="true"></i>使用率排名</li>')
            break;
        case "4":
            $('#shujuxiang').html('<li><i class="fa fa-check-square-o" aria-hidden="true"></i>部门</li><li><i class="fa fa-check-square-o" aria-hidden="true"></i>配发数</li><li><i class="fa fa-check-square-o" aria-hidden="true"></i>警员数</li><li><i class="fa fa-check-square-o" aria-hidden="true"></i>警务通处罚数</li><li><i class="fa fa-check-square-o" aria-hidden="true"></i>人均处罚量</li><li><i class="fa fa-check-square-o" aria-hidden="true"></i>查询量</li><li><i class="fa fa-check-square-o" aria-hidden="true"></i>设备平均处罚量</li><li><i class="fa fa-check-square-o" aria-hidden="true"></i>设备平均处罚量排名</li><li><i class="fa fa-check-square-o" aria-hidden="true"></i>无处罚量设备</li>')
            break;
        case "6":
            $('#shujuxiang').html('<li><i class="fa fa-check-square-o" aria-hidden="true"></i>部门</li><li><i class="fa fa-check-square-o" aria-hidden="true"></i>配发数</li><li><i class="fa fa-check-square-o" aria-hidden="true"></i>辅警数</li><li><i class="fa fa-check-square-o" aria-hidden="true"></i>违停采集（例）</li><li><i class="fa fa-check-square-o" aria-hidden="true"></i>人均处罚量</li><li><i class="fa fa-check-square-o" aria-hidden="true"></i>查询量</li><li><i class="fa fa-check-square-o" aria-hidden="true"></i>设备平均处罚量</li><li><i class="fa fa-check-square-o" aria-hidden="true"></i>设备平均处罚量排名</li><li><i class="fa fa-check-square-o" aria-hidden="true"></i>无违停采集设备</li>')
            break;
    }
}
$(document).on('click.bs.carousel.data-api', '#shujuxiang li', function (e) {
    var $doc = $(this).text();
    var ischeck = $(this).children("i").hasClass("fa-check-square-o");
    if (ischeck) {
        $(this).children("i").removeClass("fa-check-square-o").addClass("fa-square-o");
    }
    else {
        $(this).children("i").removeClass("fa-square-o").addClass("fa-check-square-o");
    }
    switch (seltype) {
        case "1":   //车载视频
        case "2":
        case "3":
        case "7":
            switch ($doc) {
                case "部门":
                    table.column(1).visible(!ischeck);
                    break;
                case "配发数":
                    table.column(2).visible(!ischeck);
                    break;
                case "设备使用数量":
                    table.column(5).visible(!ischeck);
                    break;
                case "在线时长":
                    table.column(6).visible(!ischeck);
                    break;
                case "设备使用率":
                    table.column(7).visible(!ischeck);
                    break;
                case "使用率排名":
                    table.column(9).visible(!ischeck);
                    break;
                default:
                    break;
            }
            break;
        case "5":
            switch ($doc) {
                case "部门":
                    table.column(1).visible(!ischeck);
                    break;
                case "配发数":
                    table.column(2).visible(!ischeck);
                    break;
                case "视频时长":
                    table.column(5).visible(!ischeck);
                    break;
                case "视频大小":
                    table.column(7).visible(!ischeck);
                    break;
                case "设备使用数量":
                    table.column(3).visible(!ischeck);
                    break;
                case "设备使用率":
                    table.column(8).visible(!ischeck);
                    break;
                case "设备未使用数量":
                    table.column(4).visible(!ischeck);
                    break;
                case "使用率排名":
                    table.column(9).visible(!ischeck);
                    break;
                default:
                    break;
            }
            break;
        case "4":
        case "6":
            switch ($doc) {
                case "部门":
                    table.column(1).visible(!ischeck);
                    break;
                case "配发数":
                    table.column(2).visible(!ischeck);
                    break;
                case "警员数":
                case "辅警数":
                    table.column(3).visible(!ischeck);
                    break;
                case "警务通处罚数":
                case "违停采集（例）":
                    table.column(4).visible(!ischeck);
                    break;
                case "人均处罚量":
                    table.column(5).visible(!ischeck);
                    break;
                case "查询量":
                    table.column(7).visible(!ischeck);
                    break;
                case "设备平均处罚量":
                    table.column(8).visible(!ischeck);
                    break;
                case "设备平均处罚量排名":
                    table.column(9).visible(!ischeck);
                    break;
                case "无处罚量设备":
                case "无违停采集设备":
                    table.column(12).visible(!ischeck);
                    break;
                default:
                    break;
            }
            break;
    }
    

    resizetbwidth()
});
