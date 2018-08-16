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

function createtableentity() {

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
             $("#myModaltxzsLabel").text(ssddtext + "设备详情");
             $(".search-result-flooterleft  span:eq(0)").text("共" + json.data.length + "条记录");
             $('.daochumx').html("<a class='buttons-excel'  href='../Handle/upload/" + json.title + "'><span>导 出</span></a>");
         })
        .DataTable({
            ajax: {
                url: "../Handle/dataManagementdetail.ashx",
                type: "POST",
                data: function () {
                    return data = {
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