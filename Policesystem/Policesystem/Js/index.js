$("#header").load('top.html', function () {

});
$(function () {
    $.ajax({
        type: "POST",
        url: "Handle/TotalDevices.ashx",
        data: "",
        dataType: "json",
        success: function (data) {
            
            $(".qjxinxi label:eq(0)").text(data.data["0"].value);
            $(".qjxinxi label:eq(2)").text(data.data["1"].value);
            $(".qjxinxi label:eq(4)").text(data.data["2"].value);
            $(".qjxinxi label:eq(6)").text(formatSeconds(data.data["1"].value2,1));
        },
        error: function (msg) {
            console.debug("错误:ajax");
        }
    });





   
  
   
});





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

function myGaugeChart(containerId) {
    var chart = Highcharts.chart(containerId, {
        chart: {
            type: 'gauge',
            plotBackgroundColor: 'rgba(0,0,0,0)',
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            backgroundColor: 'rgba(0,0,0,0)',//设置背景透明
            plotShadow: false
        },
        credits: {
            enabled: false
        },
        title: {
            text: ''
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
                color: '#467ddf' // 
            }, {
                from: 60,
                to: 80,
                innerRadius: '100%',
                outerRadius: '80%',
                color: '#45d5d5' // 
            }, {
                from: 80,
                to: 100,
                innerRadius: '100%',
                outerRadius: '80%',
                color: '#964edf' // red
            }]
        },
        series: [{
            name: '使用率',
            data: [80],
            tooltip: {
                valueSuffix: ' %'
            },
            style: { color: '#fff' },
            backgroundColor:null,
            dataLabels: {
                formatter: function () {
                    var kmh = this.y
                    return kmh+'%';
                }
            }
        }]
    }, function (chart) {
        return;
        if (!chart.renderer.forExport) {
            
            setInterval(function () {
                var point = chart.series[0].points[0],
                    newVal,
                    inc = Math.round((Math.random() - 0.5) * 20);
                newVal = point.y + inc;
                if (newVal < 0 || newVal > 200) {
                    newVal = point.y - inc;
                }
                point.update(newVal);
            }, 3000);
        }
    });
}

myGaugeChart("zf_gfscl");

function formatSeconds(value,y) {
    var result = Math.floor((value / 60 / 60) * Math.pow(10, y)) / Math.pow(10, y);
    return result;
}