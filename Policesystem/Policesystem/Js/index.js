var indexconfigdata;
var hchart = 400;
var chartdata;
var zf_gfscl, zf_zxshj, djj_jrzx, djj_gfscl, djj_zxshj, jwt_jrzx, jwt_cxl, jwt_rjcf, jwt_jrcl, jwt_pjcf;
var alarmindex = 0;
var alarmdays = 30;
var historydata;
var Totalinter;//一分钟重新加载全局设备情况
var Gaugeinter;//2分钟加载仪表盘
var carouselEntity;//轮播单位
var color = ['#4c8afa', '#f2ab22', '#43db89', '#38e8e8', '#a24cfa', '#fa4cae', '#59bfa1', '#d7ce56', '#b45538', '#c48b6c', '#c56377', '#86c36a'];

Highcharts.setOptions({ global: { useUTC: false } });
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
    $(".timebanner label").text(year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sencond);
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
        distance = -60;
        minorTickLength = 10;
        minorTickWidth = 2;
        titley = 300;
        titlefontsize = '28px';
        columtitlefontSize = '18px';
        tickLength = 28;
        doublecount = 2;

        realheight = 370;
        realaxisLabelfontsize = '24px'
        realxAxis = 25;
        realtickLength = 10;
        realtickPixelInterval = 150;
        realtickPixelIntervalY = 100;
        realtyAxisy = 10;
        realsymbolWidth = 40;
        cloumntickPixelInterval = 100;
        cloumnborderRadius = 40;
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

        realheight = 130;
        realaxisLabelfontsize = '12px';
        realxAxis = 15;
        realtickLength = 5;
        realtickPixelInterval = 70;
        realtickPixelIntervalY = 50;
        realtyAxisy = 5;
        realsymbolWidth = 20;
        cloumntickPixelInterval = 30;
        cloumnborderRadius = 10;
        break;

}

function createdata(data) {

    var charttype = data[0]["squee"].split(",");
    var ddata = new Array();
    var ddatacolumn = new Array();
    var totalvalue = 0;
    var colorcount = 0;
    //createTextLabel(data, color);
    $(".listtitle").each(function (i1, element) {
        totalvalue = 0;
        ddata = [];
        ddatacolumn = [];
        colorcount = 0;
        //var lab = $.trim(charttype[i1]);
        //$(".listtitle:eq(" + i1 + ")").text(lab);
        //switch (lab) {
        //    case "对讲机":
        //        $(".imglable:eq(" + i1 + ")").attr('src', 'Image/index_duijiangji.png');
        //        break;
        //    case "执法记录仪":
        //        $(".imglable:eq(" + i1 + ")").attr('src', 'Image/index_zhifajiluyi.png');
        //        break;
        //    case "警务通":
        //        $(".imglable:eq(" + i1 + ")").attr('src', 'Image/index_jingwutong.png');
        //        break;
        //    case "辅警通":
        //        $(".imglable:eq(" + i1 + ")").attr('src', 'Image/index_fujingtong.png');
        //        $(".imglable:eq(" + i1 + ")").width(30);
        //        break;
        //    case "车载视频":
        //        $(".imglable:eq(" + i1 + ")").attr('src', 'Image/index_chezaiship.png');
        //        break;
        //    case "拦截仪":
        //        $(".imglable:eq(" + i1 + ")").attr('src', 'Image/index_lanjieyi.png');
        //        break;
        //    default:
        //        break;
        //}

        for (var i = 0; i < data.length; i++) {
            for (var i2 = 0; i2 < data[i]["data"].length; i2++) {
                if (data[i]["data"][i2]["TypeName"] == $(this).text()) {
                    var obj1 = JSON.parse('{"name":"' + data[i]["Name"] + '","y":' + data[i]["data"][i2]["count"] + '}');
                    totalvalue += parseInt(data[i]["data"][i2]["count"]);
                    ddata.push(obj1);

                    var obj2 = JSON.parse('{"name":"' + data[i]["Name"] + '","color":"' + color[colorcount] + '","y":' + data[i]["data"][i2]["Isused"] * 100 / data[i]["data"][i2]["count"] + '}');
                    ddatacolumn.push(obj2);
                    colorcount += 1;
                }

            }

        }


        createChart(i1, "pie", ddata, color, totalvalue);//创建饼图
        createcolum(i1, "column", ddatacolumn, color);//创建柱图

    });


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
    try {
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
    catch (e) {
        console.log(e);
    }
}

function createcolum(index, type, data, color, fontweight) {
    var id =(index=="chart"||index=="column")?index: $(".rlchars:eq(" + index + ") div:eq(2)").attr('id');
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
            gridLineWidth: 2,
            gridLineColor: '#ded44e',
            gridLineDashStyle: 'ShortDot',
            gridZIndex: 4,
            tickPixelInterval: (fontweight == 'L')?100:cloumntickPixelInterval,
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
            headerFormat: '<span >{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> 使用率<br/>',
            style: {
                fontSize: realaxisLabelfontsize
            }

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
            data: data,
            borderRadius: (fontweight == 'L') ? 40 : cloumnborderRadius
        }]
    },
     function (chart) {
         SetEveryOnePointColor(chart);
    }
    );
}


function SetEveryOnePointColor(chart) {
    //获得第一个序列的所有数据点
    var pointsList = chart.series[0].points;
    //遍历设置每一个数据点颜色
    for (var i = 0; i < pointsList.length; i++) {
        chart.series[0].points[i].update({
            color: {
                linearGradient: { x1: 0, y1: 1, x2: 0, y2: 0 }, //横向渐变效果 如果将x2和y2值交换将会变成纵向渐变效果
                stops: [
                            [0, Highcharts.Color('#09c1ff').setOpacity(1).get('rgba')],
                            [0.3, Highcharts.Color('#6961fd').setOpacity(1).get('rgba')],
                            [0.5, Highcharts.Color('#6961fd').setOpacity(1).get('rgba')],
                            [1, '#bd17fd']
                ]
            }
        });
    }
}

function createChart(index, type, data, color, totalvalue, fontweight) {
    var id = (index == "chart" || index == "column") ? index : $(".rlchars:eq(" + index + ") div:eq(0)").attr('id');
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



function myRealtimeChart(label, value, index, chartnum, rebuildchar) {

    var chart;
    var containerId;
    switch (index) {
        case 0:
            if (chartnum > 1) return;
            switch (chartnum) {
                case 0:
                    containerId = "zf_gfscl";
                    break;
                default:
                    containerId = "zf_zxshj";
                    break;
            }

            break;
        case 1:
            if (chartnum > 2) return;
            switch (chartnum) {
                case 0:
                    containerId = "djj_jrzx";
                    break;
                case 1:
                    containerId = "djj_gfscl";
                    break;
                default:
                    containerId = "djj_zxshj";
                    break;
            }
            break;
        case 2:
            if (chartnum > 2) return;
            switch (chartnum) {
                case 0:
                    containerId = "jwt_jrzx";
                    break;
                case 1:
                    containerId = "jwt_cxl";
                    break;
                default:
                    containerId = "jwt_rjcf";
                    break;
            }
            break;
        case 3:
            if (chartnum > 1) return;
            switch (chartnum) {
                case 0:
                    containerId = "jwt_jrcl";
                    break;
                default:
                    containerId = "jwt_pjcf";
                    break;
            }
            break;
        default:
            return;
            break;
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
        var series = chart.series[0];
        var time = (new Date()).getTime();
        if (rebuildchar) {
            var datascount = series.data.length;
            for (i = 0; i < datascount; i += 1) {
                series.removePoint(0);
            }
            for (i = -4; i <= 0; i += 1) {
                x = time + i * 1000;
                series.addPoint([x, value]);
            }
            series.update(true);
        }
        else
        {
            series.addPoint([time, value],true,true);
        }


        return;
    }

    var areacolor;
    switch (label) {
        case "在线总时长":
            areacolor = '#5d3b9d';
            maxvalue = value*1.5;
            break;
        case "设备配发数":
            areacolor = '#3d4a82';
            maxvalue = value * 1.5;
            break;
        case "设备使用率":
            areacolor = '#51e97c';
            maxvalue = 1;
            break;
        case "今日在线量":
            areacolor = '#884646';
            maxvalue = value * 1.5;
            break;
        case "处理量":
            areacolor = '#806e47';
            maxvalue = value * 1.5;
            break;
        case "查询量":
            areacolor = '#5c389a';
            maxvalue = value * 1.5;
            break;
        case "视频长度":
            areacolor = '#823f76';
            maxvalue = value * 1.5;
            break;
        case "视频文件大小":
            areacolor = '#2c559b';
            maxvalue = value * 1.5;
            break;
        case "规范上传率":
            areacolor = '#2c559b';
            maxvalue = 1;
            break;
    }


    var chart = Highcharts.chart(containerId, {
        chart: {
            type: 'area',
            marginRight: 0,
            events: {},
            backgroundColor: 'rgba(0,0,0,0)',//设置背景透明
            marginRight: 0,
            height: realheight
        },
        legend: {
            title: {

                style: {
                    "color": "#ffffff",
                    "fontSize": realaxisLabelfontsize
                }
            },
            floating:true,
            align: 'center',
            y: -15,
            x:10,
            verticalAlign: 'top',
            itemStyle: { "color": "#ffffff", "cursor": "pointer", "fontSize": realaxisLabelfontsize, "fontWeight": "normal" },
            lineHeight: 20,
            itemHoverStyle: {
                color: '#fff'
            },
            squareSymbol: false,
            symbolWidth: realsymbolWidth,
            symbolRadius: 4

        },
        title:null,
        credits: {
            enabled: false
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: realtickPixelInterval,
            dateTimeLabelFormats: {
                second: '%M:%S'
            },
            tickLength: realtickLength,
            labels: {
                style: {
                    "color": "#ffffff",
                    "fontSize": realaxisLabelfontsize
                },
                y: realxAxis

            }
        },
        yAxis: {
            title: {
                text: null
            },
            lineWidth: 1,
            gridLineWidth: 1,
            tickPixelInterval: 30,
            gridLineColor:'#ded44e',
            gridLineDashStyle: 'ShortDot',
            tickPixelInterval: realtickPixelIntervalY,
            max:maxvalue,
            labels: {
                style: {
                    "color": "#ffffff",
                    "fontSize": realaxisLabelfontsize
                },

                x: -5,
                y: realtyAxisy
   

            }
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.series.name + '</b><br/>' +
                    Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' + this.y;
            },
            style: {
                fontSize: realaxisLabelfontsize
			}
        },
        
        series: [{
            name:label,
           // lineColor: areacolor,
            color: areacolor,
            fillOpacity: 0.8,
            marker: {
                enabled:false
            },
            data: (function () {
                // 生成随机值
                var data = [],
                    time = (new Date()).getTime(),
                    i;
                for (i = -4; i <= 0; i += 1) {
                    data.push({
                        x: time + i * 1000,
                        y: value
                    });
                }
                return data;
            }())
        }]
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
            jwt_jrcl = chart;
            break;
        case "jwt_pjcf":
            jwt_pjcf = chart;
            break;
        default:
            break;

    }

}

function myGaugeChart(label, value,index,chartnum,rebuildchar) {
    var chart
    var oper = '环比增加' + value + '%<i class="fa fa-arrow-up" aria-hidden="true"></i><span class="hbclasslabel">● ' + label + ' ● </span>';
    var colorarray = ['#df3a20', '#dccf1d', '#1cd618', '#63869e']

    if (value < 0) {
        value = Math.abs(value);
        oper = '环比减少' + value + '%<i class="fa fa-arrow-down" aria-hidden="true"></i><span class="hbclasslabel">● ' + label + ' ● </span>';
        colorarray = ['#df3a20', '#dccf1d', '#1cd618', '#63869e']
    }
    var containerId;
    switch (index) {
        case 0:
            if (chartnum > 1) return;
            switch (chartnum) {
                case 0:
                    containerId = "zf_gfscl";
                    break;
                default:
                    containerId = "zf_zxshj";
                    break;
            }

            break;
        case 1:
            if (chartnum > 2) return;
            switch (chartnum) {
                case 0:
                    containerId = "djj_jrzx";
                    break;
                case 1:
                    containerId = "djj_gfscl";
                    break;
                default:
                    containerId = "djj_zxshj";
                    break;
            }
            break;
        case 2:
            if (chartnum > 2) return;

            switch (chartnum) {
                case 0:
                    containerId = "jwt_jrzx";
                    break;
                case 1:
                    containerId = "jwt_cxl";
                    break;
                default:
                    containerId = "jwt_rjcf";
                    break;
            }
            break;
        case 3:
            if (chartnum > 1) return;
            switch (chartnum) {
                case 0:
                    containerId = "jwt_jrcl";
                    break;
                default:
                    containerId = "jwt_pjcf";
                    break;
            }
            break;
        default:
            return;
            break;
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
        tooltip: {
            style: {
                fontSize: realaxisLabelfontsize
            }
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
                step: baseWidth,
                distance: distance,
                rotation: 'auto',
                style: { color: '#fff', fontSize: titlefontsize }
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
                baseWidth: baseWidth,
                borderColor:'#cccccc',
                borderWidth:'0',
                topWidth:'1'
            },
            backgroundColor: null,

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
    var entityBMDM;
    $("#ifr").contents().find(".lbtitle").each(function () {
        if ($(this).parent().parent().css("opacity") == 1) {
            entityBMDM = $(this).attr("data-BMDM");
        }
    });
    var value = 0;
    var data1 = 0;
    var data2 = 0;
    var data3 = 0;
    $.ajax({
        type: "POST",
        url: "Handle/index.ashx",
        data: { carouselEntity: entityBMDM },
        dataType: "json",
        success: function (data) {
            createGauge(data,false);
        },
        error: function (msg) {
            console.debug("错误:ajax");
        }
    });



}


function loadHistoryData() {

    $.ajax({
        type: "POST",
        url: "Handle/index_24histroy.ashx",
        data: "",
        dataType: "json",
        success: function (data) {
            historydata = data;
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
            $(".count-time").each(function (index, element) {
                var from = $(this).attr("data-to");
                var to;
                switch (index) {
                    case 0:
                    case 1:
                    case 2:
                        to = data.data[index].value;
                        break;
                    case 3:
                        to = formatSeconds(data.data[1].value2, 1);
                        break;
                    case 4:
                    case 5:
                    case 6:
                        to = data.data[index-1].value;
                        break;
                    case 7:
                        to = formatSeconds(data.data[3].value2, 1);
                        break;
                    default:
                        break;
                }
                if (to != from){
                $(this).attr("data-from", from);
                $(this).attr("data-to", to);
                $(this).each(count);
                }

            })
            switch (data.title) {
                case "331000000000":
                    $(".textxinxi1 label:eq(0)").text("全市");
                    $(".textxinxi2 label:eq(0)").text("支队");
                    break;
                case "331001000000":
                case "331002000000":
                case "331003000000":
                case "331004000000":
                    $(".textxinxi1 label:eq(0)").text("支队");
                    $(".textxinxi2 label:eq(0)").text("大队");
                    break;
                default:
                    $(".textxinxi1 label:eq(0)").text("大队");
                    $(".textxinxi2 label:eq(0)").text("中队");
                    break;

            }



        },
        error: function (msg) {
            console.debug("错误:ajax");
        }
    });
}
$(function () {
    loadindexconfigdata();//加载仪表盘数据
 //   loadHistoryData();
});

function changeCarouseEntity() {
    var entityBMDM;
    $("#ifr").contents().find(".lbtitle").each(function () {
        if ($(this).parent().parent().css("opacity") == 1) {
            entityBMDM = $(this).attr("data-BMDM");
        }
    });
    $.ajax({
        type: "POST",
        url: "Handle/index.ashx",
        data: { carouselEntity: entityBMDM },
        dataType: "json",
        success: function (data) {
            createGauge(data, true);
        },
        error: function (msg) {
            console.debug("错误:ajax");
        }
    });
   // alert($("#ifr").contents().find(".lbtitle:eq(1)").attr("data-BMDM"));
}


function createGaugeTile(domid,type) {
    switch (type) {
        case "1":
            if (domid == 0) {
                $(".xixi1").html("<img src='image/index_chezaiship.png'><label>车载视频</label>")
            }
            if (domid == 1) {
                $(".xixi2").html("<img src='image/index_chezaiship.png'><label>车载视频</label>")
            }
            if (domid == 3) {
                $(".xixi3").html("<img src='image/index_chezaiship.png'><label>车载视频</label>")
            }
            if (domid == 2) {
                $(".xixi4").html("<img src='image/index_chezaiship.png'><label>车载视频</label>")
            }
            break;
        case "2":
            if (domid == 0) {
                $(".xixi1").html("<img src='image/index_duijiangji.png'><label>对讲机</label>")
            }
            if (domid == 1) {
                $(".xixi2").html("<img src='image/index_duijiangji.png'><label>对讲机</label>")
            }
            if (domid == 3) {
                $(".xixi3").html("<img src='image/index_duijiangji.png'><label>对讲机</label>")
            }
            if (domid == 2) {
                $(".xixi4").html("<img src='image/index_duijiangji.png'><label>对讲机</label>")
            }
            break;
        case "3":
            if (domid == 0) {
                $(".xixi1").html("<img src='image/index_lanjieyi.png'><label>拦截仪</label>")
            }
            if (domid == 1) {
                $(".xixi2").html("<img src='image/index_lanjieyi.png'><label>拦截仪</label>")
            }
            if (domid == 3) {
                $(".xixi3").html("<img src='image/index_lanjieyi.png'><label>拦截仪</label>")
            }
            if (domid == 2) {
                $(".xixi4").html("<img src='image/index_lanjieyi.png'><label>拦截仪</label>")
            }
            break;
        case "4":
            if (domid == 0) {
                $(".xixi1").html("<img src='image/index_jingwutong.png'><label>警务通</label>")
            }
            if (domid == 1) {
                $(".xixi2").html("<img src='image/index_jingwutong.png'><label>警务通</label>")
            }
            if (domid == 3) {
                $(".xixi3").html("<img src='image/index_jingwutong.png'><label>警务通</label>")
            }
            if (domid == 2) {
                $(".xixi4").html("<img src='image/index_jingwutong.png'><label>警务通</label>")
            }
            break;
        case "5":
            if (domid == 0) {
                $(".xixi1").html("<img src='image/index_zhifajiluyi.png'><label>执法记录仪</label>")
            }
            if (domid == 1) {
                $(".xixi2").html("<img src='image/index_zhifajiluyi.png'><label>执法记录仪</label>")
            }
            if (domid == 3) {
                $(".xixi3").html("<img src='image/index_zhifajiluyi.png'><label>执法记录仪</label>")
            }
            if (domid == 2) {
                $(".xixi4").html("<img src='image/index_zhifajiluyi.png'><label>执法记录仪</label>")
            }
            break;
        case "6":
            if (domid == 0) {
                $(".xixi1").html("<img src='image/index_fujingtong.png' style='width: 30px;'><label>辅警通</label>")
            }
            if (domid == 1) {
                $(".xixi2").html("<img src='image/index_fujingtong.png' style='width: 30px;'><label>辅警通</label>")
            }
            if (domid == 3) {
                $(".xixi3").html("<img src='image/index_fujingtong.png' style='width: 30px;'><label>辅警通</label>")
            }
            if (domid == 2) {
                $(".xixi4").html("<img src='image/index_fujingtong.png' style='width: 30px;'><label>辅警通</label>")
            }
            break;
    }
}

function dataValue(data1,data2) {
    if (data1 == "0" || data2 == "0" || isNaN(data1) || isNaN(data2)) { value = 0 } else { value = formatFloat((data2 - data1) * 100 / data1, 1) }
    return value;
}

function createGauge(data,rebuildchar) {
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
        if (!todayvalue) return;//没有数据
        for (var i1 = 0; i1 < arrayval.length; i1++) {
            switch (arrayval[i1]) {
                case "00":
                    value = dataValue(parseFloat(yesdayvalue.在线总时长), parseFloat(todayvalue.在线总时长))
                    myGaugeChart("在线总时长", value, i, numchart, rebuildchar);
                    numchart += 1;
                    break;
                case "10":
                    value = dataValue(parseFloat(yesdayvalue.在线数), parseFloat(todayvalue.在线数))
                    myGaugeChart("今日在线量", value, i, numchart, rebuildchar);
                    numchart += 1;
                    break;
                case "20":
                    value = dataValue(parseFloat(yesdayvalue.设备数量), parseFloat(todayvalue.设备数量))
                    myGaugeChart("设备配发数", value, i, numchart, rebuildchar);
                    numchart += 1;
                    break;
                case "30":
                    data1 = parseFloat(yesdayvalue.在线数) / parseFloat(yesdayvalue.设备数量);
                    data2 = parseFloat(todayvalue.在线数) / parseFloat(todayvalue.设备数量);
                    value = dataValue(data1, data2)
                    myGaugeChart("设备使用率", value, i, numchart, rebuildchar);
                    numchart += 1;
                    break;
                case "40":
                    value = dataValue(parseFloat(yesdayvalue.处理量), parseFloat(todayvalue.处理量))
                    myGaugeChart("处理量", value, i, numchart, rebuildchar);
                    numchart += 1;
                    break;
                case "50":
                    value = dataValue(parseFloat(yesdayvalue.查询量), parseFloat(todayvalue.查询量));
                    myGaugeChart("查询量", value, i, numchart, rebuildchar);
                    numchart += 1;
                    break;
                case "60":
                    value = dataValue(parseFloat(yesdayvalue.在线总时长), parseFloat(todayvalue.在线总时长));
                    myGaugeChart("视频长度", value, i, numchart, rebuildchar);
                    numchart += 1;
                    break;
                case "70":
                    value = dataValue(parseFloat(yesdayvalue.在线总时长), parseFloat(todayvalue.在线总时长));
                    myGaugeChart("视频长度", value, i, numchart, rebuildchar);
                    numchart += 1;
                    break;
                case "80":
                    value = dataValue(parseFloat(yesdayvalue.规范上传率), parseFloat(todayvalue.规范上传率));
                    myGaugeChart("规范上传率", value, i, numchart, rebuildchar);
                    numchart += 1;
                    break;
                case "01":
                    myRealtimeChart("在线总时长", parseFloat(todayvalue.在线总时长), i, numchart, rebuildchar);
                    numchart += 1;
                    break;
                case "11":
                    myRealtimeChart("今日在线量", parseFloat(todayvalue.在线数), i, numchart, rebuildchar)
                    numchart += 1;
                    break;
                case "21":
                    myRealtimeChart("设备配发数", parseFloat(todayvalue.设备数量), i, numchart, rebuildchar);
                    numchart += 1;
                    break;
                case "31":
                    value = parseFloat(todayvalue.在线数) / parseFloat(todayvalue.设备数量);
                    value = formatFloat(value, 2)
                    myRealtimeChart("设备使用率", value, i, numchart, rebuildchar);
                    numchart += 1;
                    break;
                case "41":
                    myRealtimeChart("处理量", parseFloat(todayvalue.处理量), i, numchart, rebuildchar);
                    numchart += 1;
                    break;
                case "51":
                    myRealtimeChart("查询量", parseFloat(todayvalue.查询量), i, numchart, rebuildchar);
                    numchart += 1;
                    break;
                case "61":
                    myRealtimeChart("视频长度", parseFloat(todayvalue.在线总时长), i, numchart, rebuildchar);
                    numchart += 1;
                    break;
                case "71":
                    myRealtimeChart("视频文件大小", parseFloat(todayvalue.文件大小), i, numchart, rebuildchar);
                    numchart += 1;
                    break;
                case "81":
                    myRealtimeChart("规范上传率", parseFloat(todayvalue.规范上传率), i, numchart, rebuildchar);
                    numchart += 1;
                    break;
                default:
                    break;
            }


        }

    

    }
}

function setInterloadTotalDevices(interval) {
    Totalinter = setInterval(loadTotalDevices, interval);//一分钟重新加载全局设备情况
    loadTotalDevices();
}

function setInterloadGaugeData(interval) {
    Gaugeinter = setInterval(loadGaugeData, interval);//2分钟加载仪表盘
    loadGaugeData();
}

function loadindexconfigdata() {
  
    $.ajax({
        type: "POST",
        url: "../Handle/indexconfig.ashx",
        data: "",
        dataType: "json",
        success: function (data) {
            if (data.data.length == 4) {
                indexconfigdata = data.data;
               // loadGaugeData();
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
    $('#alarmlist').vTicker({
        showItems: 5,
        pause: 5000
    });
    $('.devicelist').vTicker({
            showItems: 4,
            pause: 10000
        });
    $.ajax({
        type: "POST",
        url: "Handle/getAlarmdays.ashx",
        data: { 'alarmindex': alarmindex },
        dataType: "json",
        success: function (data) {
            for (var i = 0; i < data.data.length; i++) {
                alarmdays = data.data[i]["val"];
            }
            loadAlarmUser();
            setInterval(loadAlarmUser, 60000);

        },
        error: function (msg) {
            console.debug("错误:ajax");
        }
    });
    
});


function loadAlarmUser() {
    $.ajax({
        type: "POST",
        url: "Handle/getAlarmuser.ashx",
        data: { 'alarmindex': alarmindex, 'alarmdays': alarmdays },
        dataType: "json",
        success: function (data) {
            $(".entitylist ul").empty();
            for (var i = 0; i < data.data.length; i++) {
                alarmindex = data.data[i]["ID"];
                $(".entitylist ul ").append('<li class="news-item"><i class="fa fa-exclamation-circle"></i> ' + data.data[i]["BMMC"] + data.data[i]["XM"]  + '已经' + datecompare(data.data[i]["QQSJ"]) + '天未登录</li>')
            }
           
        },
        error: function (msg) {
            console.debug("错误:ajax");
        }
    });
}

function datecompare(start) {
    start = new Date(start).getTime();
   var end = new Date().getTime();
    var time = 0
    time = end - start;
    return Math.floor(time / 86400000) + 1;
};



