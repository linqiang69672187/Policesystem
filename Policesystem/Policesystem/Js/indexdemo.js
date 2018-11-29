var indexconfigdata;
var hchart = 400;
var chartdata;
var zf_gfscl, zf_zxshj, djj_jrzx, djj_gfscl, djj_zxshj, jwt_jrzx, jwt_cxl, jwt_rjcf, jwt_jrcl, jwt_pjcf;
setInterval(function () {
    var date = new Date();
    var year = date.getFullYear();
    var month = Appendzero(date.getMonth() + 1);
    var day = Appendzero(date.getDate());
    var weekday 
    var hour = Appendzero(date.getHours());
    var min = Appendzero(date.getMinutes());
    var sencond = Appendzero(date.getSeconds());
    switch (date.getDay()) {
        case 0:
            weekday = "星期天";
            break;
        case 1:
            weekday = "星期一";
            break;
        case 2:
            weekday = "星期二";
            break;
        case 3:
            weekday = "星期三";
            break;
        case 4:
            weekday = "星期四";
            break;
        case 5:
            weekday = "星期五";
            break;
        case 6:
            weekday = "星期六";
            break;
    }
    $(".timebanner label").text(year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sencond+" "+ weekday);
}, 50);

$("#header").load('top.html', function () {
    $("#header ul li:eq(0)").addClass("active");
});
function Appendzero(obj) {
    if (obj < 10) return "0" + "" + obj;
    else return obj;
}

switch (true) {

    case window.screen.width > 2600:
        hchart = 400;
        datalabelsize = '28px';//
        baseWidth = '8';
        distance = -40;
        minorTickLength = 10;
        minorTickWidth = 2;
        titley = 300;
        titlefontsize = '28px';
        columtitlefontSize = '18px';
        tickLength = 28;
        doublecount = 2;
        break;
    default:
        hchart = 110;
        datalabelsize='12px';//28px
        baseWidth = '2';
        distance = -20;
        minorTickLength = 5;
        minorTickWidth = 1;
        titley = 80;
        tickLength = 10;
        titlefontsize = '12px';
        columtitlefontSize = '8px';
        doublecount = 1;
        break;

}

function createdata(data, types) {

    var charttype = types;
    var ddata = new Array();
    var ddatacolumn = new Array();
    var totalvalue = 0;
    var color = ['#4c8afa', '#f2ab22', '#43db89', '#38e8e8', '#a24cfa', '#fa4cae', '#59bfa1', '#d7ce56', '#b45538', '#c48b6c', '#c56377', '#86c36a'];
    var colorcount = 0;
    createTextLabel(data, color);
    for (var i1 = 0; i1 < charttype.length; i1++) {
        totalvalue = 0;
        ddata = [];
        ddatacolumn = [];
        colorcount = 0;
        for (var i = 0; i < data.length; i++) {
            for (var i2 = 0; i2 < data[i]["data"].length; i2++) {
                if (data[i]["data"][i2]["TypeName"] == charttype[i1]) {
                    var obj1 = JSON.parse('{"name":"' + data[i]["Name"] + '","y":' + data[i]["data"][i2]["count"] + '}');
                    totalvalue += parseInt(data[i]["data"][i2]["count"]);
                    ddata.push(obj1);

                    var obj2 = JSON.parse('{"name":"' + data[i]["Name"] + '","color":"' + color[colorcount] + '","y":' + data[i]["data"][i2]["Isused"] * 100 / data[i]["data"][i2]["count"] + '}');
                    ddatacolumn.push(obj2);
                    colorcount += 1;
                }

            }

        }
     
        switch(charttype[i1]){
            case "警务通":
                    createChart("jwtchart", "pie", ddata, color, totalvalue);//创建饼图
                    createcolum("jwtcolumn", "column", ddatacolumn, color);
                    break;
            case "拦截仪":
                createChart("ljychart", "pie", ddata, color, totalvalue);//创建饼图
                createcolum("ljycolumn", "column", ddatacolumn, color);
                break;
            case "对讲机":
                createChart("djjchart", "pie", ddata, color, totalvalue);//创建饼图
                createcolum("djjcolumn", "column", ddatacolumn, color);
                break;
            case "车载视频":
                createChart("czchart", "pie", ddata, color, totalvalue);//创建饼图
                createcolum("czcolumn", "column", ddatacolumn, color);
                break;
            case "执法记录仪":
                createChart("zfchart", "pie", ddata, color, totalvalue);//创建饼图
                createcolum("zfcolumn", "column", ddatacolumn, color);
                break;
            default:
                break;
          }
    }

}

function createTextLabel(data, colors) {
    $(".entitylist ul").empty();
    for (var i = 0; i < data.length&&i<4; i++) {
        $(".entitylist ul").append("<li><span class='glyphicon glyphicon-stop'><label class='ddlabel'>"+data[i]['Name']+"</label></span></li>")
    }
    if (data.length > 4) {
        $(".entitylist ul").append("<li><label class='ddlabel moreinfo'>更多...</label></span></li>")

    }
}

function createdatadetail(data, types) {

    var charttype = types;
    var ddata = new Array();
    var ddatacolumn = new Array();
    var totalvalue = 0;
    var color = ['#4c8afa', '#f2ab22', '#43db89', '#38e8e8', '#a24cfa', '#fa4cae', '#59bfa1', '#d7ce56', '#b45538', '#c48b6c', '#c56377', '#86c36a'];
    var colorcount = 0;
    for (var i1 = 0; i1 < charttype.length; i1++) {
        totalvalue = 0;
        ddata = [];
        ddatacolumn = [];
        colorcount=0;
        for (var i = 0; i < data.length; i++) {
            for (var i2 = 0; i2 < data[i]["data"].length; i2++) {
                if (data[i]["data"][i2]["TypeName"] == charttype[i1]) {
                    var obj1 = JSON.parse('{"name":"' + data[i]["Name"] + '","y":' + data[i]["data"][i2]["count"] + '}');
                    totalvalue += parseInt(data[i]["data"][i2]["count"]);
                    ddata.push(obj1);

                    var obj2 = JSON.parse('{"name":"' + data[i]["Name"] + '","color":"' + color[colorcount] + '","y":' + data[i]["data"][i2]["Isused"] * 100 / data[i]["data"][i2]["count"] + '}');
                    ddatacolumn.push(obj2);
                    colorcount += 1;
                }

            }

        }
        $(".modal-header div:eq(0)").text(types[0]+"设备配发及使用率");
          createChart("chart", "pie", ddata, color, totalvalue,'L');//创建饼图
          createcolum("column", "column", ddatacolumn, color,'L');
        
    }

}

function createcolum(id, type, data, color, fontweight) {
    return;
    var chart = Highcharts.chart(id, {
        chart: {
            backgroundColor: 'rgba(0,0,0,0)'
        },
      
        credits: {
            enabled: false
        },
        xAxis: {
            labels: {
                style: {
                    color: '#fff',
                    fontSize: (fontweight=='L')?doublecount*14+'px':columtitlefontSize
                }
            },
            type: 'category',
        
        },
        yAxis: {
            max:100,
            labels: {
                style: {
                    color: '#fff',
                    fontSize: (fontweight == 'L') ? doublecount*14+'px' : columtitlefontSize
                }
            },
            title: {
                text: '',
                style: {
                    color: '#fff',
                    fontSize: (fontweight == 'L') ? doublecount*24+'px' : columtitlefontSize
                }
            },
            gridLineDashStyle: 'Dash', //Dash,Dot,Solid,默认Solid
        },
        
        title: {
            floating: true,
            text:  '',
            style: {
                color: '#fff',
                fontSize: (fontweight == 'L') ? doublecount * 24 + 'px' : columtitlefontSize
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> 使用率<br/>'
        },
        legend: {
            enabled: false
        },
        colors: color,
        plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y:.1f}%',
                        style: {
                            color:  '#fff'
                        }
                    }
                }
                
        },
        series: [{
            type: type,
            innerSize: '80%',
            name: '配发数',
            data: data
        }]
    });
}
function createChart(id, type, data, color, totalvalue, fontweight) {
    return;
    var chart = Highcharts.chart(id, {
        chart: {
            backgroundColor: 'rgba(0,0,0,0)'
        },
        credits: {
            enabled: false
        },
        xAxis: {
            labels: {
                style: {
                    color: '#fff'
                }
            },
            type: 'category',

        },
        yAxis: {
            labels: {
                style: {
                    color: '#fff'
                }
            },
            title: {
                text: '',

            },
            gridLineDashStyle: 'Dash', //Dash,Dot,Solid,默认Solid
        },
        title: {
            floating: true,
            text: totalvalue,
            style: {
                color: '#fff',
                fontSize: (fontweight == 'L' || datalabelsize == '28px') ? '50px' : '12px'
            }
        },
        tooltip: {
            headerFormat: (fontweight == 'L' || datalabelsize == '28px') ? '<span style="font-size:20px">{series.name}</span><br>' : '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: (fontweight == 'L' || datalabelsize == '28px') ? '<span style="color:{point.color};font-size:12px">{point.name}: {point.y}个</span> <br/>':'<span style="color:{point.color};font-size:12px">{point.name}: {point.y}个</span> <br/>'
        },
        legend: {
            enabled: false
        },
        colors: color,
        plotOptions: {

            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false,
                    format: '{point.y}'
                },
                point: {
                    events: {
                        mouseOver: function (e) {  // 鼠标滑过时动态更新标题
                            chart.setTitle({
                                text: e.target.y
                            });
                        },
                        mouseOut: function (e) {  // 鼠标滑过时动态更新标题
                            chart.setTitle({
                                text: totalvalue
                            });
                        }
                        //, 
                        // click: function(e) { // 同样的可以在点击事件里处理
                        //     chart.setTitle({
                        //         text: e.point.name+ '\t'+ e.point.y + ' %'
                        //     });
                        // }
                    }
                },
            }


        },
        series: [{
            type: type,
            innerSize: '80%',
            name: '配发数',
            data: data
        }]
    }, function (c) { // 图表初始化完毕后的会掉函数
        // 环形图圆心
        if (type != "pie") return;
        var centerY = c.series[0].center[1],
            titleHeight = parseInt(c.title.styles.fontSize);
        // 动态设置标题位置
        c.setTitle({
            y: centerY + titleHeight / 2
        });
    });
}


function myGaugeChart(containerId, label, value) {
    var chart
    var oper = '环比增加' + value + '%<i class="fa fa-arrow-up" aria-hidden="true"></i><br/> <span style="hbclasslabel">● ' + label + ' ● </span>';
    var colorarray = ['#467ddf', '#964edf', '#ff0000', '#008000']

    if (value < 0) {
        value = Math.abs(value);
        oper = '环比减少' + value + '%<i class="fa fa-arrow-down" aria-hidden="true"></i><br/> <span style="hbclasslabel">● ' + label + ' ● </span>';
         colorarray = ['#467ddf', '#964edf', '#ff0000', '#FF0000']

    }
    switch (containerId) {
        case "zf_gfscl":
            chart = zf_gfscl;
            break;
        case "zf_zxshj":
            chart = zf_zxshj;
            break;
        case "djj_jrzx":
            chart = djj_jrzx;
            break;
        case "djj_gfscl":
            chart = djj_gfscl;
            break;
        case "djj_zxshj":
            chart = djj_zxshj;
            break;
        case "jwt_jrzx":
            chart = jwt_jrzx;
            break;
        case "jwt_cxl":
            chart = jwt_cxl;
            break;
        case "jwt_rjcf":
            chart = jwt_rjcf;
            break;
        case "jwt_jrcl":
            chart = jwt_jrcl;
            break;
        case "jwt_pjcf":
            chart = jwt_pjcf;
            break;
        default:
            break;

    }
    if (chart) {
        var point = chart.series[0].points[0];
        chart.update({
            title: {
                text: oper
            }
        })
        point.update(value);
        return;
    }

    chart= Highcharts.chart(containerId, {
        chart: {
            type: 'gauge',
            plotBackgroundColor: 'rgba(0,0,0,0)',
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            backgroundColor: 'rgba(0,0,0,0)',//设置背景透明
            plotShadow: false,
            margin: [0, 0, 0, 0],
            height: hchart
        },
        credits: {
            enabled: false
        },
        title: {
            useHTML: true,
            text: oper,
            y: titley,
            style: { color: '#fff', fontSize: titlefontsize }
        },
        pane: {
            startAngle: -120,
            endAngle: 120,
            background: null,
        },
        // the value axis
        yAxis: {
            min: 0,
            max: 100,
            minorTickInterval: 'auto',
            minorTickWidth: minorTickWidth,
            minorTickLength: minorTickLength,
            minorTickPosition: 'inside',
            minorTickColor: '#fff',
            tickPixelInterval: 20,
            tickWidth: 1,
            tickPosition: 'inside',
            tickLength: tickLength,
            tickColor: '#fff',
            labels: {
                step: 2,
                distance: distance,
                rotation: 'auto',
                style: {color: '#fff' }
            },
            title: {
                text: ''
            },
            plotBands: [{
                from: 0,
                to: 30,
                innerRadius: '100%',
                outerRadius: '80%',
                color: colorarray[0] // 1
            }, {
                from: 30,
                to: 80,
                innerRadius: '100%',
                outerRadius: '80%',
                color: colorarray[1] // 2
            }, {
                from: 80,
                to: 100,
                innerRadius: '100%',
                outerRadius: '80%',
                color: colorarray[2] // 3
            }]
        },

        series: [{
            name: '使用率',
            data: [value],
            tooltip: {
                valueSuffix: ' %'
            },
            dial: {
                backgroundColor: colorarray[3],//指针背景色4
                radius: '78%',// 半径：指针长度
                rearLength: '10%',//尾巴长度
                baseWidth: baseWidth,
                borderColor:'#cccccc',
                borderWidth:'0',
                topWidth:'1'
            },
            backgroundColor:null,
            dataLabels: {
                formatter: function () {
                    var kmh = this.y
                    return kmh+'%';
                },
                style: {
                    color: '#467ddf', //1
                    fontSize: datalabelsize
                }
            }
        }]
    }, function (chart) {
        return;
        //if (!chart.renderer.forExport) {
            
        //    setInterval(function () {
        //        var point = chart.series[0].points[0],
        //            newVal,
        //            inc = Math.round((Math.random() - 0.5) * 20);
        //        newVal = point.y + inc;
        //        if (newVal < 0 || newVal > 200) {
        //            newVal = point.y - inc;
        //        }
        //        point.update(newVal);
        //    }, 3000);
        //}
    });

    switch (containerId) {
        case "zf_gfscl":
            zf_gfscl = chart;
            break;
        case "zf_zxshj":
            zf_zxshj = chart;
            break;
        case "djj_jrzx":
            djj_jrzx = chart;
            break;
        case "djj_gfscl":
            djj_gfscl = chart;
            break;
        case "djj_zxshj":
            djj_zxshj = chart;
            break;
        case "jwt_jrzx":
            jwt_jrzx = chart;
            break;
        case "jwt_cxl":
            jwt_cxl = chart;
            break;
        case "jwt_rjcf":
            jwt_rjcf = chart;
            break;
        case "jwt_jrcl":
            jwt_jrcl  = chart;
            break;
        case "jwt_pjcf":
            jwt_pjcf = chart;
            break;
        default:
            break;

    }
}

function loadGaugeData() {
    var value = 0;
    var data1 = 0;
    var data2 = 0;
    var data3 = 0;
    $.ajax({
        type: "POST",
        url: "Handle/index.ashx",
        data: "",
        dataType: "json",
        success: function (data) {
            createGauge(data);
        },
        error: function (msg) {
            console.debug("错误:ajax");
        }
    });



}

function formatSeconds(value,y) {
    var result = Math.floor((value / 60 / 60) * Math.pow(10, y)) / Math.pow(10, y);
    return result;
}
function formatFloat(value, y) {
    var result = Math.floor((value ) * Math.pow(10, y)) / Math.pow(10, y);
    return result;
}
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
}
function loadTotalDevices() {
    $.ajax({
        type: "POST",
        url: "Handle/TotalDevices.ashx",
        data: "",
        dataType: "json",
        success: function (data) {

            $(".qjxinxi label:eq(0)").text(data.data["0"].value);
            $(".qjxinxi label:eq(2)").text(data.data["1"].value);
            $(".qjxinxi label:eq(4)").text(data.data["2"].value);
            $(".qjxinxi label:eq(6)").text(formatSeconds(data.data["1"].value2, 1));
        },
        error: function (msg) {
            console.debug("错误:ajax");
        }
    });
}
$(function () {
    loadTotalDevices()//加载顶部全局设备数据
    loadindexconfigdata();//加载仪表盘数据
});
var Totalinter = setInterval(loadTotalDevices, 60000);//一分钟重新加载全局设备情况
var Gaugeinter = setInterval(loadGaugeData, 120000);//2分钟加载仪表盘

function createGaugeTile(domid,type) {
    switch (type) {
        case "1":
            if (domid == 0) {
                $(".xixi1").html("<img src='image/index_chezaiship.png'><label>车载视频</label>")
            }
            if (domid == 1) {
                $(".xixi2").html("<img src='image/index_chezaiship.png'><label>车载视频</label>")
            }
            if (domid == 2) {
                $(".xixi3").html("<img src='image/index_chezaiship.png'><label>车载视频</label>")
            }
            break;
        case "2":
            if (domid == 0) {
                $(".xixi1").html("<img src='image/index_duijiangji.png'><label>对讲机</label>")
            }
            if (domid == 1) {
                $(".xixi2").html("<img src='image/index_duijiangji.png'><label>对讲机</label>")
            }
            if (domid == 2) {
                $(".xixi3").html("<img src='image/index_duijiangji.png'><label>对讲机</label>")
            }
            break;
        case "3":
            if (domid == 0) {
                $(".xixi1").html("<img src='image/index_lanjieyi.png'><label>拦截仪</label>")
            }
            if (domid == 1) {
                $(".xixi2").html("<img src='image/index_lanjieyi.png'><label>拦截仪</label>")
            }
            if (domid == 2) {
                $(".xixi3").html("<img src='image/index_lanjieyi.png'><label>拦截仪</label>")
            }
            break;
        case "4":
            if (domid == 0) {
                $(".xixi1").html("<img src='image/index_jingwutong.png'><label>警务通</label>")
            }
            if (domid == 1) {
                $(".xixi2").html("<img src='image/index_jingwutong.png'><label>警务通</label>")
            }
            if (domid == 2) {
                $(".xixi3").html("<img src='image/index_jingwutong.png'><label>警务通</label>")
            }
            break;
        case "5":
            if (domid == 0) {
                $(".xixi1").html("<img src='image/index_zhifajiluyi.png'><label>执法记录仪</label>")
            }
            if (domid == 1) {
                $(".xixi2").html("<img src='image/index_zhifajiluyi.png'><label>执法记录仪</label>")
            }
            if (domid == 2) {
                $(".xixi3").html("<img src='image/index_zhifajiluyi.png'><label>执法记录仪</label>")
            }
            break;
        case "6":
            if (domid == 0) {
                $(".xixi1").html("<img src='image/index_jingwutong.png'><label>辅警通</label>")
            }
            if (domid == 1) {
                $(".xixi2").html("<img src='image/index_jingwutong.png'><label>辅警通</label>")
            }
            if (domid == 2) {
                $(".xixi3").html("<img src='image/index_jingwutong.png'><label>辅警通</label>")
            }
            break;
    }
}
function createGauge(data) {
    var todayvalue, yesdayvalue;
    var numchart = 0;
    var arrayval;
    var data1=0;
    var data2=0;
    var value=0
    for (var i = 0; i < indexconfigdata.length; i++) {
        todayvalue = data.data[2 * parseInt(indexconfigdata[i].DevType) - 1];
        yesdayvalue = data.data[2 * parseInt(indexconfigdata[i].DevType) - 2];
        arrayval = indexconfigdata[i].val.split(",");
        numchart = 0;
        createGaugeTile(i, indexconfigdata[i].DevType);
        if (i == 0) {   //第一个栏仪盘
          
            switch (indexconfigdata[i].DevType) {
                case "1":
                case "2":
                case "3":
                    if (arrayval[0] == "1") {
                        data1 = parseFloat(yesdayvalue.在线总时长);
                        data2 = parseFloat(todayvalue.在线总时长);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        myGaugeChart("zf_gfscl", "在线总时长", value);
                        numchart += 1;
                    }
                    if (arrayval[1] == "1") {
                        data1 = parseFloat(yesdayvalue.在线数);
                        data2 = parseFloat(todayvalue.在线数);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        if (numchart > 0) {
                            myGaugeChart("zf_zxshj", "今日在线量", value);
                        } else {
                            myGaugeChart("zf_gfscl", "今日在线量", value);
                        }
                        numchart += 1;
                    }
                    if (arrayval[2] == "1") {
                        data1 = parseFloat(yesdayvalue.设备数量);
                        data2 = parseFloat(todayvalue.设备数量);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        if (numchart > 0) {
                            myGaugeChart("zf_zxshj", "设备配发数", value);
                        } else {
                            myGaugeChart("zf_gfscl", "设备配发数", value);
                        }
                        numchart += 1;
                    }
                    if (arrayval[3] == "1") {
                        data1 = parseFloat(yesdayvalue.在线数) / parseFloat(yesdayvalue.设备数量);
                        data2 = parseFloat(todayvalue.在线数) / parseFloat(todayvalue.设备数量);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        if (numchart > 0) {
                            myGaugeChart("zf_zxshj", "设备使用率", value);
                        } else {
                            myGaugeChart("zf_gfscl", "设备使用率", value);
                        }
                        numchart += 1;
                    }
                    break;
                case "4":
                case "6":
                    if (arrayval[0] == "1") {
                        data1 = parseFloat(yesdayvalue.在线总时长);
                        data2 = parseFloat(todayvalue.在线总时长);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        myGaugeChart("zf_gfscl", "在线总时长", value);
                        numchart += 1;
                    }
                    if (arrayval[1] == "1") {
                        data1 = parseFloat(yesdayvalue.在线数);
                        data2 = parseFloat(todayvalue.在线数);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        if (numchart > 0) {
                            myGaugeChart("zf_zxshj", "今日在线量", value);
                        } else {
                            myGaugeChart("zf_gfscl", "今日在线量", value);
                        }
                        numchart += 1;
                    }
                    if (arrayval[2] == "1") {
                        data1 = parseFloat(yesdayvalue.设备数量);
                        data2 = parseFloat(todayvalue.设备数量);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        if (numchart > 0) {
                            myGaugeChart("zf_zxshj", "设备配发数", value);
                        } else {
                            myGaugeChart("zf_gfscl", "设备配发数", value);
                        }
                        numchart += 1;
                    }
                    if (arrayval[3] == "1") {
                        data1 = parseFloat(yesdayvalue.在线数) / parseFloat(yesdayvalue.设备数量);
                        data2 = parseFloat(todayvalue.在线数) / parseFloat(todayvalue.设备数量);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        if (numchart > 0) {
                            myGaugeChart("zf_zxshj", "设备使用率", value);
                        } else {
                            myGaugeChart("zf_gfscl", "设备使用率", value);
                        }
                        numchart += 1;
                    }
                    if (arrayval[4] == "1") {
                        data1 = parseFloat(yesdayvalue.处理量) ;
                        data2 = parseFloat(todayvalue.处理量) ;
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        if (numchart > 0) {
                            myGaugeChart("zf_zxshj", "处理量", value);
                        } else {
                            myGaugeChart("zf_gfscl", "处理量", value);
                        }
                        numchart += 1;
                    }
                    if (arrayval[5] == "1") {
                        data1 = parseFloat(yesdayvalue.查询量);
                        data2 = parseFloat(todayvalue.查询量);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        if (numchart > 0) {
                            myGaugeChart("zf_zxshj", "查询量", value);
                        } else {
                            myGaugeChart("zf_gfscl", "查询量", value);
                        }
                        numchart += 1;
                    }
                    break;
                case "5":
                    if (arrayval[2] == "1") {
                        data1 = parseFloat(yesdayvalue.设备数量);
                        data2 = parseFloat(todayvalue.设备数量);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        if (numchart > 0) {
                            myGaugeChart("zf_zxshj", "设备配发数", value);
                        } else {
                            myGaugeChart("zf_gfscl", "设备配发数", value);
                        }
                        numchart += 1;
                    }
                    if (arrayval[3] == "1") {
                        data1 = parseFloat(yesdayvalue.在线数) / parseFloat(yesdayvalue.设备数量);
                        data2 = parseFloat(todayvalue.在线数) / parseFloat(todayvalue.设备数量);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        if (numchart > 0) {
                            myGaugeChart("zf_zxshj", "设备使用率", value);
                        } else {
                            myGaugeChart("zf_gfscl", "设备使用率", value);
                        }
                        numchart += 1;
                    }
                    if (arrayval[6] == "1") {
                        data1 = parseFloat(yesdayvalue.在线总时长);
                        data2 = parseFloat(todayvalue.在线总时长);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        if (numchart > 0) {
                            myGaugeChart("zf_zxshj", "视频长度", value);
                        } else {
                            myGaugeChart("zf_gfscl", "视频长度", value);
                        }
                        numchart += 1;
                    }
                    if (arrayval[7] == "1") {
                        data1 = parseFloat(yesdayvalue.文件大小);
                        data2 = parseFloat(todayvalue.文件大小);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        if (numchart > 0) {
                            myGaugeChart("zf_zxshj", "视频文件大小", value);
                        } else {
                            myGaugeChart("zf_gfscl", "视频文件大小", value);
                        }
                        numchart += 1;
                    }
                    if (arrayval[8] == "1") {
                        data1 = parseFloat(yesdayvalue.规范上传率);
                        data2 = parseFloat(todayvalue.规范上传率);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        if (numchart > 0) {
                            myGaugeChart("zf_zxshj", "规范上传率", value);
                        } else {
                            myGaugeChart("zf_gfscl", "规范上传率", value);
                        }
                        numchart += 1;
                    }
                    break;

            }

        }
        if (i == 1) {   //第二个栏仪盘
            switch (indexconfigdata[i].DevType) {
                case "1":
                case "2":
                case "3":
                    if (arrayval[0] == "1") {
                        data1 = parseFloat(yesdayvalue.在线总时长);
                        data2 = parseFloat(todayvalue.在线总时长);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        switch (numchart) {
                            case 0:
                                myGaugeChart("djj_jrzx", "在线总时长", value);
                                break;
                            case 1:
                                myGaugeChart("djj_gfscl", "在线总时长", value);
                                break;
                            case 2:
                                myGaugeChart("djj_zxshj", "在线总时长", value);
                                break;
                        }
                        numchart += 1;
                    }
                    if (arrayval[1] == "1") {
                        data1 = parseFloat(yesdayvalue.在线数);
                        data2 = parseFloat(todayvalue.在线数);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        switch (numchart) {
                            case 0:
                                myGaugeChart("djj_jrzx", "今日在线量", value);
                                break;
                            case 1:
                                myGaugeChart("djj_gfscl", "今日在线量", value);
                                break;
                            case 2:
                                myGaugeChart("djj_zxshj", "今日在线量", value);
                                break;
                        }
                        numchart += 1;
                    }
                    if (arrayval[2] == "1") {
                        data1 = parseFloat(yesdayvalue.设备数量);
                        data2 = parseFloat(todayvalue.设备数量);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }

                        switch (numchart) {
                            case 0:
                                myGaugeChart("djj_jrzx", "设备配发数", value);
                                break;
                            case 1:
                                myGaugeChart("djj_gfscl", "设备配发数", value);
                                break;
                            case 2:
                                myGaugeChart("djj_zxshj", "设备配发数", value);
                                break;
                        }
                        numchart += 1;
                    }
                    if (arrayval[3] == "1") {
                        data1 = parseFloat(yesdayvalue.在线数) / parseFloat(yesdayvalue.设备数量);
                        data2 = parseFloat(todayvalue.在线数) / parseFloat(todayvalue.设备数量);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        switch (numchart) {
                            case 0:
                                myGaugeChart("djj_jrzx", "设备使用率", value);
                                break;
                            case 1:
                                myGaugeChart("djj_gfscl", "设备使用率", value);
                                break;
                            case 2:
                                myGaugeChart("djj_zxshj", "设备使用率", value);
                                break;
                        }
                        numchart += 1;
                    }
                    break;
                case "4":
                case "6":
                    if (arrayval[0] == "1") {
                        data1 = parseFloat(yesdayvalue.在线总时长);
                        data2 = parseFloat(todayvalue.在线总时长);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        switch (numchart) {
                            case 0:
                                myGaugeChart("djj_jrzx", "在线总时长", value);
                                break;
                            case 1:
                                myGaugeChart("djj_gfscl", "在线总时长", value);
                                break;
                            case 2:
                                myGaugeChart("djj_zxshj", "在线总时长", value);
                                break;
                        }
                        numchart += 1;
                    }
                    if (arrayval[1] == "1") {
                        data1 = parseFloat(yesdayvalue.在线数);
                        data2 = parseFloat(todayvalue.在线数);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        switch (numchart) {
                            case 0:
                                myGaugeChart("djj_jrzx", "今日在线量", value);
                                break;
                            case 1:
                                myGaugeChart("djj_gfscl", "今日在线量", value);
                                break;
                            case 2:
                                myGaugeChart("djj_zxshj", "今日在线量", value);
                                break;
                        }
                        numchart += 1;
                    }
                    if (arrayval[2] == "1") {
                        data1 = parseFloat(yesdayvalue.设备数量);
                        data2 = parseFloat(todayvalue.设备数量);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        switch (numchart) {
                            case 0:
                                myGaugeChart("djj_jrzx", "设备配发数", value);
                                break;
                            case 1:
                                myGaugeChart("djj_gfscl", "设备配发数", value);
                                break;
                            case 2:
                                myGaugeChart("djj_zxshj", "设备配发数", value);
                                break;
                        }
                        numchart += 1;
                    }
                    if (arrayval[3] == "1") {
                        data1 = parseFloat(yesdayvalue.在线数) / parseFloat(yesdayvalue.设备数量);
                        data2 = parseFloat(todayvalue.在线数) / parseFloat(todayvalue.设备数量);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        switch (numchart) {
                            case 0:
                                myGaugeChart("djj_jrzx", "设备使用率", value);
                                break;
                            case 1:
                                myGaugeChart("djj_gfscl", "设备使用率", value);
                                break;
                            case 2:
                                myGaugeChart("djj_zxshj", "设备使用率", value);
                                break;
                        }
                        numchart += 1;
                    }
                    if (arrayval[4] == "1") {
                        data1 = parseFloat(yesdayvalue.处理量);
                        data2 = parseFloat(todayvalue.处理量);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        switch (numchart) {
                            case 0:
                                myGaugeChart("djj_jrzx", "处理量", value);
                                break;
                            case 1:
                                myGaugeChart("djj_gfscl", "处理量", value);
                                break;
                            case 2:
                                myGaugeChart("djj_zxshj", "处理量", value);
                                break;
                        }
                        numchart += 1;
                    }
                    if (arrayval[5] == "1") {
                        data1 = parseFloat(yesdayvalue.查询量);
                        data2 = parseFloat(todayvalue.查询量);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
          
                        switch (numchart) {
                            case 0:
                                myGaugeChart("djj_jrzx", "查询量", value);
                                break;
                            case 1:
                                myGaugeChart("djj_gfscl", "查询量", value);
                                break;
                            case 2:
                                myGaugeChart("djj_zxshj", "查询量", value);
                                break;
                        }
                        numchart += 1;
                    }
                    break;
                case "5":
                    if (arrayval[2] == "1") {
                        data1 = parseFloat(yesdayvalue.设备数量);
                        data2 = parseFloat(todayvalue.设备数量);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        switch (numchart) {
                            case 0:
                                myGaugeChart("djj_jrzx", "设备配发数", value);
                                break;
                            case 1:
                                myGaugeChart("djj_gfscl", "设备配发数", value);
                                break;
                            case 2:
                                myGaugeChart("djj_zxshj", "设备配发数", value);
                                break;
                        }
                        numchart += 1;
                    }
                    if (arrayval[3] == "1") {
                        data1 = parseFloat(yesdayvalue.在线数) / parseFloat(yesdayvalue.设备数量);
                        data2 = parseFloat(todayvalue.在线数) / parseFloat(todayvalue.设备数量);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        switch (numchart) {
                            case 0:
                                myGaugeChart("djj_jrzx", "设备使用率", value);
                                break;
                            case 1:
                                myGaugeChart("djj_gfscl", "设备使用率", value);
                                break;
                            case 2:
                                myGaugeChart("djj_zxshj", "设备使用率", value);
                                break;
                        }
                        numchart += 1;
                    }
                    if (arrayval[6] == "1") {
                        data1 = parseFloat(yesdayvalue.在线总时长);
                        data2 = parseFloat(todayvalue.在线总时长);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        switch (numchart) {
                            case 0:
                                myGaugeChart("djj_jrzx", "视频长度", value);
                                break;
                            case 1:
                                myGaugeChart("djj_gfscl", "视频长度", value);
                                break;
                            case 2:
                                myGaugeChart("djj_zxshj", "视频长度", value);
                                break;
                        }
                        numchart += 1;
                    }
                    if (arrayval[7] == "1") {
                        data1 = parseFloat(yesdayvalue.文件大小);
                        data2 = parseFloat(todayvalue.文件大小);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        switch (numchart) {
                            case 0:
                                myGaugeChart("djj_jrzx", "视频文件大小", value);
                                break;
                            case 1:
                                myGaugeChart("djj_gfscl", "视频文件大小", value);
                                break;
                            case 2:
                                myGaugeChart("djj_zxshj", "视频文件大小", value);
                                break;
                        }
                        numchart += 1;
                    }
                    if (arrayval[8] == "1") {
                        data1 = parseFloat(yesdayvalue.规范上传率);
                        data2 = parseFloat(todayvalue.规范上传率);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        switch (numchart) {
                            case 0:
                                myGaugeChart("djj_jrzx", "规范上传率", value);
                                break;
                            case 1:
                                myGaugeChart("djj_gfscl", "规范上传率", value);
                                break;
                            case 2:
                                myGaugeChart("djj_zxshj", "规范上传率", value);
                                break;
                        }
                        numchart += 1;
                    }
                    break;

            }


        }

        if (i == 2) {   //第三个栏仪盘
            switch (indexconfigdata[i].DevType) {
                case "1":
                case "2":
                case "3":
                    if (arrayval[0] == "1") {
                        data1 = parseFloat(yesdayvalue.在线总时长);
                        data2 = parseFloat(todayvalue.在线总时长);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        switch (numchart) {
                            case 0:
                                myGaugeChart("jwt_jrzx", "在线总时长", value);
                                break;
                            case 1:
                                myGaugeChart("jwt_cxl", "在线总时长", value);
                                break;
                            case 2:
                                myGaugeChart("jwt_rjcf", "在线总时长", value);
                                break;
                            case 3:
                             //   myGaugeChart("jwt_jrcl", "在线总时长", value);
                                break;
                            case 4:
                              //  myGaugeChart("jwt_pjcf", "在线总时长", value);
                                break;
                        }
                        numchart += 1;
                    }
                    if (arrayval[1] == "1") {
                        data1 = parseFloat(yesdayvalue.在线数);
                        data2 = parseFloat(todayvalue.在线数);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        switch (numchart) {
                            case 0:
                                myGaugeChart("jwt_jrzx", "今日在线量", value);
                                break;
                            case 1:
                                myGaugeChart("jwt_cxl", "今日在线量", value);
                                break;
                            case 2:
                                myGaugeChart("jwt_rjcf", "今日在线量", value);
                                break;
                            case 3:
                             //   myGaugeChart("jwt_jrcl", "今日在线量", value);
                                break;
                            case 4:
                             //   myGaugeChart("jwt_pjcf", "今日在线量", value);
                                break;
                        }
                        numchart += 1;
                    }
                    if (arrayval[2] == "1") {
                        data1 = parseFloat(yesdayvalue.设备数量);
                        data2 = parseFloat(todayvalue.设备数量);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }

                        switch (numchart) {
                            case 0:
                                myGaugeChart("jwt_jrzx", "设备配发数", value);
                                break;
                            case 1:
                                myGaugeChart("jwt_cxl", "设备配发数", value);
                                break;
                            case 2:
                                myGaugeChart("jwt_rjcf", "设备配发数", value);
                                break;
                            case 3:
                              //  myGaugeChart("jwt_jrcl", "设备配发数", value);
                                break;
                            case 4:
                              //  myGaugeChart("jwt_pjcf", "设备配发数", value);
                                break;
                        }
                        numchart += 1;
                    }
                    if (arrayval[3] == "1") {
                        data1 = parseFloat(yesdayvalue.在线数) / parseFloat(yesdayvalue.设备数量);
                        data2 = parseFloat(todayvalue.在线数) / parseFloat(todayvalue.设备数量);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        switch (numchart) {
                            case 0:
                                myGaugeChart("jwt_jrzx", "设备使用率", value);
                                break;
                            case 1:
                                myGaugeChart("jwt_cxl", "设备使用率", value);
                                break;
                            case 2:
                                myGaugeChart("jwt_rjcf", "设备使用率", value);
                                break;
                            case 3:
                             //   myGaugeChart("jwt_jrcl", "设备使用率", value);
                                break;
                            case 4:
                              //  myGaugeChart("jwt_pjcf", "设备使用率", value);
                                break;
                        }
                        numchart += 1;
                    }
                    break;
                case "4":
                case "6":
                    if (arrayval[0] == "1") {
                        data1 = parseFloat(yesdayvalue.在线总时长);
                        data2 = parseFloat(todayvalue.在线总时长);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        switch (numchart) {
                            case 0:
                                myGaugeChart("jwt_jrzx", "在线总时长", value);
                                break;
                            case 1:
                                myGaugeChart("jwt_cxl", "在线总时长", value);
                                break;
                            case 2:
                                myGaugeChart("jwt_rjcf", "在线总时长", value);
                                break;
                            case 3:
                              //  myGaugeChart("jwt_jrcl", "在线总时长", value);
                                break;
                            case 4:
                              //  myGaugeChart("jwt_pjcf", "在线总时长", value);
                                break;
                        }
                        numchart += 1;
                    }
                    if (arrayval[1] == "1") {
                        data1 = parseFloat(yesdayvalue.在线数);
                        data2 = parseFloat(todayvalue.在线数);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        switch (numchart) {
                            case 0:
                                myGaugeChart("jwt_jrzx", "今日在线量", value);
                                break;
                            case 1:
                                myGaugeChart("jwt_cxl", "今日在线量", value);
                                break;
                            case 2:
                                myGaugeChart("jwt_rjcf", "今日在线量", value);
                                break;
                            case 3:
                             //   myGaugeChart("jwt_jrcl", "今日在线量", value);
                                break;
                            case 4:
                              //  myGaugeChart("jwt_pjcf", "今日在线量", value);
                                break;
                        }
                        numchart += 1;
                    }
                    if (arrayval[2] == "1") {
                        data1 = parseFloat(yesdayvalue.设备数量);
                        data2 = parseFloat(todayvalue.设备数量);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        
                        switch (numchart) {
                            case 0:
                                myGaugeChart("jwt_jrzx", "设备配发数", value);
                                break;
                            case 1:
                                myGaugeChart("jwt_cxl", "设备配发数", value);
                                break;
                            case 2:
                                myGaugeChart("jwt_rjcf", "设备配发数", value);
                                break;
                            case 3:
                             //   myGaugeChart("jwt_jrcl", "设备配发数", value);
                                break;
                            case 4:
                              //  myGaugeChart("jwt_pjcf", "设备配发数", value);
                                break;
                        }
                        numchart += 1;
                    }
                    if (arrayval[3] == "1") {
                        data1 = parseFloat(yesdayvalue.在线数) / parseFloat(yesdayvalue.设备数量);
                        data2 = parseFloat(todayvalue.在线数) / parseFloat(todayvalue.设备数量);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        switch (numchart) {
                            case 0:
                                myGaugeChart("jwt_jrzx", "设备使用率", value);
                                break;
                            case 1:
                                myGaugeChart("jwt_cxl", "设备使用率", value);
                                break;
                            case 2:
                                myGaugeChart("jwt_rjcf", "设备使用率", value);
                                break;
                            case 3:
                              //  myGaugeChart("jwt_jrcl", "设备使用率", value);
                                break;
                            case 4:
                               // myGaugeChart("jwt_pjcf", "设备使用率", value);
                                break;
                        }
                        numchart += 1;
                    }
                    if (arrayval[4] == "1") {
                        data1 = parseFloat(yesdayvalue.处理量);
                        data2 = parseFloat(todayvalue.处理量);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        switch (numchart) {
                            case 0:
                                myGaugeChart("jwt_jrzx", "处理量", value);
                                break;
                            case 1:
                                myGaugeChart("jwt_cxl", "处理量", value);
                                break;
                            case 2:
                                myGaugeChart("jwt_rjcf", "处理量", value);
                                break;
                            case 3:
                              //  myGaugeChart("jwt_jrcl", "处理量", value);
                                break;
                            case 4:
                              //  myGaugeChart("jwt_pjcf", "处理量", value);
                                break;
                        }
                        numchart += 1;
                    }
                    if (arrayval[5] == "1") {
                        data1 = parseFloat(yesdayvalue.查询量);
                        data2 = parseFloat(todayvalue.查询量);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        switch (numchart) {
                            case 0:
                                myGaugeChart("jwt_jrzx", "查询量", value);
                                break;
                            case 1:
                                myGaugeChart("jwt_cxl", "查询量", value);
                                break;
                            case 2:
                                myGaugeChart("jwt_rjcf", "查询量", value);
                                break;
                            case 3:
                             //   myGaugeChart("jwt_jrcl", "查询量", value);
                                break;
                            case 4:
                              //  myGaugeChart("jwt_pjcf", "查询量", value);
                                break;
                        }
                        numchart += 1;
                    }
                    break;
                case "5":
                    if (arrayval[2] == "1") {
                        data1 = parseFloat(yesdayvalue.设备数量);
                        data2 = parseFloat(todayvalue.设备数量);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                    
                        switch (numchart) {
                            case 0:
                                myGaugeChart("jwt_jrzx", "设备配发数", value);
                                break;
                            case 1:
                                myGaugeChart("jwt_cxl", "设备配发数", value);
                                break;
                            case 2:
                                myGaugeChart("jwt_rjcf", "设备配发数", value);
                                break;
                            case 3:
                             //   myGaugeChart("jwt_jrcl", "设备配发数", value);
                                break;
                            case 4:
                              //  myGaugeChart("jwt_pjcf", "设备配发数", value);
                                break;
                        }
                        numchart += 1;
                    }
                    if (arrayval[3] == "1") {
                        data1 = parseFloat(yesdayvalue.在线数) / parseFloat(yesdayvalue.设备数量);
                        data2 = parseFloat(todayvalue.在线数) / parseFloat(todayvalue.设备数量);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        switch (numchart) {
                            case 0:
                                myGaugeChart("jwt_jrzx", "设备使用率", value);
                                break;
                            case 1:
                                myGaugeChart("jwt_cxl", "设备使用率", value);
                                break;
                            case 2:
                                myGaugeChart("jwt_rjcf", "设备使用率", value);
                                break;
                            case 3:
                               // myGaugeChart("jwt_jrcl", "设备使用率", value);
                                break;
                            case 4:
                               // myGaugeChart("jwt_pjcf", "设备使用率", value);
                                break;
                        }
                        numchart += 1;
                    }
                    if (arrayval[6] == "1") {
                        data1 = parseFloat(yesdayvalue.在线总时长);
                        data2 = parseFloat(todayvalue.在线总时长);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        switch (numchart) {
                            case 0:
                                myGaugeChart("jwt_jrzx", "视频长度", value);
                                break;
                            case 1:
                                myGaugeChart("jwt_cxl", "视频长度", value);
                                break;
                            case 2:
                                myGaugeChart("jwt_rjcf", "视频长度", value);
                                break;
                            case 3:
                              //  myGaugeChart("jwt_jrcl", "视频长度", value);
                                break;
                            case 4:
                               // myGaugeChart("jwt_pjcf", "视频长度", value);
                                break;
                        }
                        numchart += 1;
                    }
                    if (arrayval[7] == "1") {
                        data1 = parseFloat(yesdayvalue.文件大小);
                        data2 = parseFloat(todayvalue.文件大小);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        switch (numchart) {
                            case 0:
                                myGaugeChart("jwt_jrzx", "视频文件大小", value);
                                break;
                            case 1:
                                myGaugeChart("jwt_cxl", "视频文件大小", value);
                                break;
                            case 2:
                                myGaugeChart("jwt_rjcf", "视频文件大小", value);
                                break;
                            case 3:
                               // myGaugeChart("jwt_jrcl", "视频文件大小", value);
                                break;
                            case 4:
                               // myGaugeChart("jwt_pjcf", "视频文件大小", value);
                                break;
                        }
                        numchart += 1;
                    }
                    if (arrayval[8] == "1") {
                        data1 = parseFloat(yesdayvalue.规范上传率);
                        data2 = parseFloat(todayvalue.规范上传率);
                        if (data1 == "0" || data2 == "0"  || isNaN(data1)  || isNaN(data2) ) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
                        switch (numchart) {
                            case 0:
                                myGaugeChart("jwt_jrzx", "规范上传率", value);
                                break;
                            case 1:
                                myGaugeChart("jwt_cxl", "规范上传率", value);
                                break;
                            case 2:
                                myGaugeChart("jwt_rjcf", "规范上传率", value);
                                break;
                            case 3:
                              //  myGaugeChart("jwt_jrcl", "规范上传率", value);
                                break;
                            case 4:
                              //  myGaugeChart("jwt_pjcf", "规范上传率", value);
                                break;
                        }
                        numchart += 1;
                    }
                    break;

            }


        }

    }
}

function loadindexconfigdata() {
  
    $.ajax({
        type: "POST",
        url: "../Handle/indexconfig.ashx",
        data: "",
        dataType: "json",
        success: function (data) {
            if (data.data.length == 3) {
                indexconfigdata = data.data;
                loadGaugeData();
            }
        },
        error: function (msg) {
            console.debug("错误:ajax");
        }
    });

}


$(document).on('click.bs.carousel.data-api', '.row2n,.row1n', function (e) {
    $("#alertmodal").modal("show");
    createdatadetail(chartdata, new Array($(this).children().children("label").text()));
    return;

});

$(document).on('click.bs.carousel.data-api', '.moreinfo', function (e) {
    $("#infomodal ul").empty();
    for (var i = 0; i < chartdata.length; i++) {
        $("#infomodal ul").append("<li><span class='glyphicon glyphicon-stop'><label class='ddlabel'>" + chartdata[i]['Name'] + "</label></span></li>")
    }


    $("#infomodal").modal("show");

    return;

});



$(function () {

    $.getJSON('HtmlPage1.html', function (data) {
        $('#jwt_pjcf').highcharts({
            chart: {
                zoomType: 'x',
                height: 130,
                type: 'area',
                backgroundColor: 'rgba(0,0,0,0)',//设置背景透明
            },
            mapNavigation: {
                enabled: true,
                enableButtons: false
            },
            title: {
                text: "<span class='hbclasslabel sslable'>● 警务通上传率 ● </span>",
        verticalAlign: 'bottom',
        style:{
            color:'#ffffff'
        }
            },
            credits: {
                enabled: false
            },
        
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    millisecond: '%H:%M:%S.%L',
                    second: '%H:%M:%S',
                    minute: '%H:%M',
                    hour: '%H:%M',
                    day: '%m-%d',
                    week: '%m-%d',
                    month: '%Y-%m',
                    year: '%Y'
                },
                labels: {
                    style: {
                        color: '#ffffff'
                    }
                }
            },
            tooltip: {
                dateTimeLabelFormats: {
                    millisecond: '%H:%M:%S.%L',
                    second: '%H:%M:%S',
                    minute: '%H:%M',
                    hour: '%H:%M',
                    day: '%Y-%m-%d',
                    week: '%m-%d',
                    month: '%Y-%m',
                    year: '%Y'
                }
            },
            yAxis: {
                title: {
                    text: '上传率',
                    style: {
                        color: '#ffffff'
                    }

                },
                labels: {
                    style: {
                        color: '#ffffff'
                    }
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    marker: {
                        enabled: false
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
            series: [{
                type: 'area',
                name: '上传率',
                data: data,
                color: '#FF0000'
            }]
        });
    });
});

var myChart1 = echarts.init(document.getElementById('zf_gfscl'));
var myChart2 = echarts.init(document.getElementById('zf_zxshj'));
var myChart3 = echarts.init(document.getElementById('djj_jrzx'));
var myChart4 = echarts.init(document.getElementById('djj_gfscl'));
var myChart5 = echarts.init(document.getElementById('djj_zxshj'));

function randomData() {
    now = new Date();
    value = value + Math.random() * 21 - 10;
    return {
        name: now.toString(),
        value: [
            now,
            Math.round(value)
        ]
    }
}

var data = [];
var now = +new Date(1997, 9, 3);
var oneDay = 24 * 3600 * 1000;
var value = Math.random() * 1000;
  data.push(randomData());


option = {
    title: {
        text:null
    },
    tooltip:null,
    xAxis: {
        type: 'time',
        axisLabel:{
            formatter:function (value)
            {
                return echarts.format.formatTime('ss:mm', new Date(value));
            },
            interval:0
        },
        splitLine: {
            show: false
        }
    },
    
    yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
            show: false
        },
        width: '100%',
        axisLabel: {
            fontSize:'18px'
        }
    },
    series: [{
        name: '模拟数据',
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        data: data
    }]
};

myChart1.setOption(option);
myChart2.setOption(option);
myChart3.setOption(option);
myChart4.setOption(option);
myChart5.setOption(option);
setInterval(function () {

    for (var i = 0; i < 1; i++) {
        //data.shift();
        data.push(randomData());
    }

    myChart1.setOption({
        series: [{
            data: data
        }]
    });
    myChart2.setOption({
        series: [{
            data: data
        }]
    });
    myChart3.setOption({
        series: [{
            data: data
        }]
    });
    myChart4.setOption({
        series: [{
            data: data
        }]
    });
    myChart5.setOption({
        series: [{
            data: data
        }]
    });

}, 1000);


