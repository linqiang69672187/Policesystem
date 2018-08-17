var table;
$.ajax({
    type: "POST",
    url: "../Handle/GetEntitys.ashx",
    data:  
   {      
       requesttype: "所有单位"
   },
    dataType: "json",
    success: function (data) {
        entitydata = data.data; //保存单位数据
        for (var i = 0; i < entitydata.length; i++) {
            if (entitydata[i].SJBM == "331000000000") {
                $("#brigadeselect").append("<option value='" + entitydata[i].BMDM + "'>" + entitydata[i].BMMC + "</option>");
            }
        }
    },
    error: function (msg) {
        console.debug("错误:ajax");
    }
});
function createtableentity() {
    table = $('#entitytable')
        .on('error.dt', function (e, settings, techNote, message) {
                       console.log('An error has been reported by DataTables: ', message);
                   })
        .on('preXhr.dt', function (e, settings, data) {
            $('.progresshz').show();
            $('#entitytable').hide();
             })
        .on('xhr.dt', function (e, settings, json, xhr) {
            $('.progresshz').hide();
            $('#entitytable').show();
            if (json) {
                $(".tablefoot span").text("共" + json.data.length + "条记录");
            }
         })
        .DataTable({
            ajax: {
                url: "../Handle/entitymanage.ashx",
                type: "POST",
                data: function () {
                    return data = {
                        search: $(".search input").val(),
                        ssdd: $("#brigadeselect").val()
                    };

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
            columns: [
                         { "data": "BMMC", "orderable": false},
                         { "data": "SJMC", "orderable": false},
                         { "data": "LXDZ", "orderable": false },
                         { "data": "position", "orderable": false },
                         { "data": "BMDM", "orderable": false },
                         { "data": "FZR", "orderable": false },
                         { "data": "LXDH", "orderable": false },
                         { "data": "JKYH", "orderable": false },
                         { "data": "FY", "orderable": false },
                         { "data": "FYJG", "orderable": false }
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
$(document).on('click.bs.carousel.data-api', '.send', function (e) {
    if (!table) {
        createtableentity();
    } else {

        $("#entitytable").DataTable().ajax.reload();
    }
});

