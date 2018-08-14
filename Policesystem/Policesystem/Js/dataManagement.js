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
$("#header").load('top.html', function () { });
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
                createTatolRS(data);
            }
   
        },
        error: function (msg) {
            console.debug("错误:ajax");
        }
    });

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
        $("#ulsysc li:eq(0)").text(formatFloat(intpf1 / 3600,1)+"h");
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

function createtabledetail() {

    tablezd = $('#detailgr-result-table')
                   .on('error.dt', function (e, settings, techNote, message) {
                       console.log('An error has been reported by DataTables: ', message);
                   })
         .on('xhr.dt', function (e, settings, json, xhr) {
             $("#myModaltxzsLabel").text(ssddtext + "设备详情");
             $(".search-result-flooterleft  span:eq(0)").text("共" + json.data.length+"条记录");
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
                        ssddtext: ssddtext
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

            "order": [[1, 'asc']],
            columns: [
                      
                         { "data": "cloum1" },
                         { "data": "cloum2" },
                         { "data": "cloum3" },
                         { "data": "cloum4" },
                         { "data": "cloum5" },
                         { "data": "cloum6" }
                   
            ],
            columnDefs: [
                        ],
            buttons: [
            {
                extend: "print",
                text: "打 印",
                title: "<center></center>",
                footer: true,
                customize: function (win) {
                    $(win.document.body).find('center').text(starttime + "_" + endtime + sbmingc + "报表");
                },
                exportOptions: {
                    columns: function (idx, data, node, h) {
                        var visible = table.column(idx).visible();
                        switch (node.outerText) {
                            case "":
                            case "设备使用率":
                                visible = false;
                                break;


                        }

                        return visible;
                    }


                }


            }
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
                          { "data": "cloum1" },
                          { "data": "cloum2" },
                          { "data": "cloum3" },
                          { "data": "cloum4" },
                          { "data": "cloum5" },
                          { "data": "cloum6" },
                          { "data": "cloum7" },
                          { "data": "cloum8" },
                          { "data": "cloum9", "visible": false },
                          { "data": "cloum10", "visible": false },
                          { "data": "cloum11", "visible": false },
                          { "data": null, "orderable": false }
        ];


        table = $('#search-result-table')
           .on('error.dt', function (e, settings, techNote, message) {
           })
             .on('xhr.dt', function (e, settings, json, xhr) {
                 switch ($("#deviceselect").val()) {
                     case "1":   //车载视频

                         table.column(8).visible(false);
                         table.column(9).visible(false);
                         table.column(10).visible(false);
                         $('#search-result-table tr:eq(0) th:eq(0)').text("序号");
                         $('#search-result-table tr:eq(0) th:eq(1)').text("部门");
                         $('#search-result-table tr:eq(0) th:eq(2)').text("配发数");
                         $('#search-result-table tr:eq(0) th:eq(3)').text("在线时长（h）");
                         $('#search-result-table tr:eq(0) th:eq(4)').text("设备使用数量");
                         $('#search-result-table tr:eq(0) th:eq(5)').text("未使用数量");
                         $('#search-result-table tr:eq(0) th:eq(6)').text("设备使用率（%）");
                         $('#search-result-table tr:eq(0) th:eq(7)').text("使用率名次");
                         break;
                     case "4":  
                         table.column(8).visible(true);
                         table.column(9).visible(true);
                         table.column(10).visible(true);
                         $('#search-result-table tr:eq(0) th:eq(0)').text("序号");
                         $('#search-result-table tr:eq(0) th:eq(1)').text("部门");
                         $('#search-result-table tr:eq(0) th:eq(2)').text("配发数");
                         $('#search-result-table tr:eq(0) th:eq(3)').text("处罚量");
                         $('#search-result-table tr:eq(0) th:eq(4)').text("人均处罚量");
                         $('#search-result-table tr:eq(0) th:eq(5)').text("查询量");
                         $('#search-result-table tr:eq(0) th:eq(6)').text("平均处罚量");
                         $('#search-result-table tr:eq(0) th:eq(7)').text("排名");
                         $('#search-result-table tr:eq(0) th:eq(8)').text("无处罚量");
                         $('#search-result-table tr:eq(0) th:eq(9)').text("未使用");
                         $('#search-result-table tr:eq(0) th:eq(10)').text("无查询量");
                         break;
                     default:
                         break;
                 }
                 $('#search-result-table_paginate').parent().append("<span>共 " + json.data.length + " 条记录</span>");
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
                            requesttype: "查询报表"
                        }
                    }

                },
                Paginate: true,
                pageLength: 10,
                Processing: true, //DataTables载入数据时，是否显示‘进度’提示  
                serverSide: false,   //服务器处理
                responsive: true,
                paging: true,
                autoWidth: true,

                "order": [],
                columns: columns,
                columnDefs: [
                         {
                             targets:11,
                             render: function (a, b, c, d) { var html = "<a  class=\'btn btn-sm btn-primary txzs-btn\' id='addedit' entityid='" + c.cloum12 + "'  >查看详情</a>"; return html; }
                         }
                ],
                buttons: [
            {
                extend: "print",
                text: "打 印",
                title: "<center></center>",
                footer: true,
                customize: function (win) {
                    $(win.document.body).find('center').text(starttime + "_" + endtime + sbmingc + "报表");
                },
                exportOptions: {
                    columns: function (idx, data, node, h) {
                        var visible = table.column(idx).visible();
                        switch (node.outerText) {
                            case "":
                            case "设备使用率":
                                visible = false;
                                break;


                        }

                        return visible;
                    }


                }


            }
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

                dom: "" + "t" + "<'row' p>B",

                initComplete: function () {}
            });
    }