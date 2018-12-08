$(document).on('change.bs.carousel.data-api', '#cloum2select,#cloum3select,#cloum4select,#cloum5select', function (e) {
    switchDevtype(e.target.value,this)

});
$.ajax({
    type: "POST",
    url: "../Handle/indexconfig.ashx",
    data: "",
    dataType: "json",
    success: function (data) {
  
        if (data.data.length == 5) {
            //判断选中设备类型
            $("#cloum2select").val(data.data[0].DevType);
            $("#cloum3select").val(data.data[1].DevType);
            $("#cloum4select").val(data.data[2].DevType);
            $("#cloum5select").val(data.data[3].DevType);
            //判断指标哪几种
            switchDevtype(data.data[0].DevType, $("#cloum2select"));
            switchDevtype(data.data[1].DevType, $("#cloum3select"));
            switchDevtype(data.data[2].DevType, $("#cloum4select"));
            switchDevtype(data.data[3].DevType, $("#cloum5select"));
            //判断中值
            setToggleVal(data.data[0].val, $(".cloum2:eq(0)"));
            setToggleVal(data.data[1].val, $(".cloum3:eq(0)"));
            setToggleVal(data.data[2].val, $(".cloum3:eq(1)"));
            setToggleVal(data.data[3].val, $(".cloum2:eq(1)"));
            //判断选中左侧轮播柱状图
            setTogglecloumnVal(data.data[4].val);
        }

    },
    error: function (msg) {
        console.debug("错误:ajax");
    }
});
function switchDevtype(typeid, $ele) {
    switch (typeid) {
        case "1":
        case "2":
        case "3":
            $($ele).parent().parent().find('.device_vale_type').each(function (index, ele) {

                $(this).children().each(function (i, e) {
                    switch (i) {
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            $(this).removeClass("none");
                            break;
                        default:
                            $(this).addClass("none");
                            break;
                    }

                })
                
            });
            break;
        case "4":
        case "6":
            $($ele).parent().parent().find('.device_vale_type').each(function (index, ele) {
                $(this).children().each(function (i,e) {
                    switch (i) {
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                            $(this).removeClass("none");
                            break;
                        default:
                            $(this).addClass("none");
                            break;
                    }
                });
               
            });
            break;
        case "5":
            $($ele).parent().parent().find('.device_vale_type').each(function (index, ele) {
                $(this).children().each(function (i, e) {
                   
                    switch (i) {
                        case 1:
                        case 2:
                        case 3:
                        case 6:
                        case 7:
                        case 8:
                            $(this).removeClass("none");
                            break;
                        default:
                            $(this).addClass("none");
                            break;
                    }
                });
               
            });
            break;
        default:
            break;
    }
}
function setToggleVal(vals,ele) {
    var arr = vals.split(",");
    $(ele).find("i").each(function (index, el) {
        if (arr[index] == "0") {
            $(this).removeClass("fa-toggle-off").removeClass("fa-toggle-on").addClass("fa-toggle-off");
        }
        else
        {
            $(this).removeClass("fa-toggle-off").removeClass("fa-toggle-on").addClass("fa-toggle-on");
            $(ele).find(".device_vale_type:eq("+index+")").val(arr[index].substring(0, 1));
            $(ele).find(".char_type:eq(" + index + ")").val(arr[index].substring(1, 2));
        }

     });

}
$(document).on('click.bs.carousel.data-api', '.fa-toggle-off,.fa-toggle-on', function (e) {
    if ($(this).hasClass("fa-toggle-off")) {
        $(this).removeClass("fa-toggle-off").addClass("fa-toggle-on");
    }
    else
    {
        $(this).removeClass("fa-toggle-on").addClass("fa-toggle-off");
    }
});

$(document).on('click.bs.carousel.data-api', '#savebtn', function (e) {
    $('.progresshz').show();
    var val1="";
    $(".cloum2:eq(0) i").each(function (index, ele) {
        val1 += (index > 0) ? "," : "";
        val1 += ($(this).hasClass("fa-toggle-off")) ? "0" : $(this).parent().find(".device_vale_type").val() + $(this).parent().find(".char_type").val();
    });
    var val2 = "";
    $(".cloum3:eq(0) i").each(function (index, ele) {
        val2 += (index > 0) ? "," : "";
        val2 += ($(this).hasClass("fa-toggle-off")) ? "0" : $(this).parent().find(".device_vale_type").val() + $(this).parent().find(".char_type").val();
    });
    var val4 = "";
    $(".cloum2:eq(1) i").each(function (index, ele) {
        val4 += (index > 0) ? "," : "";
        val4 += ($(this).hasClass("fa-toggle-off")) ? "0" : $(this).parent().find(".device_vale_type").val() + $(this).parent().find(".char_type").val();
    });
    var val3 = "";
    $(".cloum3:eq(1) i").each(function (index, ele) {
        val3 += (index > 0) ? "," : "";
        val3 += ($(this).hasClass("fa-toggle-off")) ? "0" : $(this).parent().find(".device_vale_type").val() + $(this).parent().find(".char_type").val();
    });
    var val5 = "";
    $(".rightbox select").each(function (index,ele) {
        val5 += (index > 0) ? "," : "";
        val5 += ($(".rightbox i:eq(" + index + ")").hasClass("fa-toggle-off")) ? "0" : $(this).find("option:selected").text();  //.find("option:selected").text()
    })

    var data =
    {
    Row1: $("#cloum2select").val(),
    val1: val1,
    Row2: $("#cloum3select").val(),
    val2: val2,
    Row3: $("#cloum4select").val(),
    val3: val3,
    Row4: $("#cloum5select").val(),
    val4: val4,
    val5:val5

    }
    $.ajax({
        type: "POST",
        url: "../Handle/saveindexconfig.ashx",
        data: data,
        dataType: "json",
        success: function (data) {
            $('.progresshz').hide();
            $('.buttonrow div:eq(1)').text("保存成功");
            clearInterval(clinter);
            clinter = setInterval(clearintet, 10000);//10秒清除保存
        },
        error: function (msg) {
            $('.buttonrow div:eq(1)').text("保存失败");
            clearInterval(clinter);
            clinter = setInterval(clearintet, 10000);//10秒清除保存
            console.debug("错误:ajax");
        }
    });
});
var clinter = setInterval(clearintet, 5000);//10秒清除保存
function clearintet() {
     $('.buttonrow div:eq(1)').text("");
}

function setTogglecloumnVal(val) {
    var arr = val.split(",");
    $(".rightbox select").each(function (i, ele) {
        if (arr[i] != "0") {
            $(".rightbox i:eq(" + i + ")").removeClass("fa-toggle-off").addClass("fa-toggle-on");
        }
        $(this).find("option").each(function () {
            if ($(this).text() == arr[i]) {
                $(this).attr('selected', true);
            }

        });


    });
}