setInterval(function() {
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
},50);
function Appendzero(obj) {
    if (obj < 10) return "0" + "" + obj;
    else return obj;
}
function createdata(data) {

    var charttype = ["警务通", "拦截仪", "对讲机", "车载视频", "执法记录仪"];
    var ddata = new Array();
    var ddatacolumn = new Array();
    var totalvalue = 0;
    var color = ['#a24cfa', '#fa4cae', '#f2ab22', '#43db89'];
    for (var i1 = 0; i1 < charttype.length; i1++) {
        totalvalue = 0;
        ddata = [];
        ddatacolumn = [];
        for (var i = 0; i < data.length; i++) {
            for (var i2 = 0; i2 < data[i]["data"].length; i2++) {
                if (data[i]["data"][i2]["TypeName"] == charttype[i1]) {
                    var obj1 = JSON.parse('{"name":"' + data[i]["Name"] + '","y":' + data[i]["data"][i2]["count"] + '}');
                    totalvalue += parseInt(data[i]["data"][i2]["count"]);
                    ddata.push(obj1);

                    var obj2 = JSON.parse('{"name":"' + data[i]["Name"] + '","color":"' + color [i] + '","y":' + data[i]["data"][i2]["Isused"]*100 / data[i]["data"][i2]["count"] + '}');
                    ddatacolumn.push(obj2);
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
function createcolum(id, type, data, color) {
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
            text:  '',
            style: {
                color: '#fff',
                fontSize: '18px'
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
function createChart(id, type, data, color, totalvalue) {
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
            text: '合计：'+ totalvalue,
            style: {
                color: '#fff',
                fontSize: '18px'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b>个 <br/>'
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
                                text: e.target.name + '\t' + e.target.y + ''
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
    var oper = '环比昨日增加' + value + '%<i class="fa fa-arrow-up" aria-hidden="true"></i><br/> <span style="font-size:32px;">● ' + label + ' ● </span>';
    var colorarray = ['#467ddf', '#45d5d5', '#964edf', '#F8DE43']

    if (value < 0) {
        value = Math.abs(value);
        oper = '环比昨日减少' + value + '%<i class="fa fa-arrow-down" aria-hidden="true"></i><br/> <span style="font-size:32px;">● ' + label + ' ● </span>';
        colorarray = ['#63869e', '#45d5d5', '#FF0000', '#FF0000']
    }

    var chart = Highcharts.chart(containerId, {
        chart: {
            type: 'gauge',
            plotBackgroundColor: 'rgba(0,0,0,0)',
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            backgroundColor: 'rgba(0,0,0,0)',//设置背景透明
            plotShadow: false,
            margin: [0, 0, 0, 0],
            height:'400'
        },
        credits: {
            enabled: false
        },
        title: {
            useHTML: true,
            text: oper,
            y: 300,
            style:{color:'#fff',fontSize:'28px'}
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
            minorTickWidth: 2,
            minorTickLength: 28,
            minorTickPosition: 'inside',
            minorTickColor: '#fff',
            tickPixelInterval: 28,
            tickWidth: 1,
            tickPosition: 'inside',
            tickLength: 10,
            tickColor: '#fff',
            labels: {
                step: 2,
                distance:-40,
                rotation: 'auto',
                style: {color: '#fff' }
            },
            title: {
                text: ''
            },
            plotBands: [{
                from: 0,
                to: 60,
                innerRadius: '100%',
                outerRadius: '80%',
                color: colorarray[0] // 1
            }, {
                from: 60,
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
                baseWidth:'8',
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
                    fontSize: '28px'
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
            //执法记录仪规范上传率
            data1 = parseFloat(data.data["4"].规范上传率);
            data2 = parseFloat(data.data["5"].规范上传率);
            if (data1 == "0" || data2 == "0") { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1,1) }
            myGaugeChart("zf_gfscl", "规范上传率", value);
            //执法记录仪在线时长
            data1 = parseFloat(data.data["4"].在线总时长);
            data2 = parseFloat(data.data["5"].在线总时长);
            if (data1 == "0" || data2 == "0") { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
            myGaugeChart("zf_zxshj", "在线总时长", value);
            //对讲机今日在线
            data1 = parseFloat(data.data["0"].在线数);
            data2 = parseFloat(data.data["1"].在线数);
            if (data1 == "0" || data2 == "0") { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
            myGaugeChart("djj_jrzx", "今日在线数", value);
            //对讲机设备使用率
            data1 = parseFloat(data.data["0"].在线数) / parseFloat(data.data["0"].设备数量);
            data2 = parseFloat(data.data["1"].在线数) / parseFloat(data.data["1"].设备数量);
            if (data1 == "0" || data2 == "0") { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
            myGaugeChart("djj_gfscl", "设备使用率", value);
            //对讲机在线总时长
            data1 = parseFloat(data.data["0"].在线总时长);
            data2 = parseFloat(data.data["1"].在线总时长);
            if (data1 == "0" || data2 == "0") { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
            myGaugeChart("djj_zxshj", "在线总时长", value);
            //警务通在线数
            data1 = parseFloat(data.data["2"].在线数);
            data2 = parseFloat(data.data["3"].在线数);
            if (data1 == "0" || data2 == "0") { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
            myGaugeChart("jwt_jrzx", "今日在线数", value);
            //警务通今日查询量
            data1 = parseFloat(data.data["2"].查询量);
            data2 = parseFloat(data.data["3"].查询量);
            if (data1 == "0" || data2 == "0") { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
            myGaugeChart("jwt_cxl", "今日查询量", value);
            //警务通人均处罚量
            data1 = parseFloat(data.data["2"].处理量) / parseFloat(data.data["2"].人数);
            data2 = parseFloat(data.data["3"].处理量) / parseFloat(data.data["3"].人数);
            if (data1 == "0" || data2 == "0") { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
            myGaugeChart("jwt_rjcf", "人均处罚量", value);

            //警务通今日处理量
            data1 = parseFloat(data.data["2"].处理量);
            data2 = parseFloat(data.data["3"].处理量);
            if (data1 == "0" || data2 == "0") { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
            myGaugeChart("jwt_jrcl", "今日处理量", value);

            //警务通设备平均处罚量
            data1 = parseFloat(data.data["2"].处理量) / parseFloat(data.data["2"].设备数量);
            data2 = parseFloat(data.data["3"].处理量) / parseFloat(data.data["3"].设备数量);
            if (data1 == "0" || data2 == "0") { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
            myGaugeChart("jwt_pjcf", "设备平均处罚量", value);

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
   // loadGaugeData();//加载仪表盘数据
});
var Totalinter = setInterval(loadTotalDevices, 60000);//一分钟重新加载全局设备情况
//var Gaugeinter = setInterval(loadGaugeData, 180000);//3分钟加载仪表盘