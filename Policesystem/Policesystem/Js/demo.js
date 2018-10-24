$(function () {
 
    $.getJSON('data.html', function (data) {
        $('#container').highcharts({
            chart: {
                zoomType: 'x',
                panning: true,
                panKey: 'shift',
                events: {
                    load: function () {
                        var series = this.series[0],
							chart = this;
                        setInterval(function () {
                            var x = (new Date()).getTime(), // 当前时间
								y = Math.random();          // 随机值
                            series.addPoint([x, y], true, true);
                        }, 5000);
                    }
                }
            },
            mapNavigation: {
                enabled: true,
                enableButtons: false
            },
            title: {
                text: null
            },
            subtitle: {
                text: null
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
                    text: ''
                }
            },
            legend: {
                enabled: false
            },
            series: [{
                type: 'area',
                name: '美元兑欧元',
                data: data
            }]
        });
    });
});
