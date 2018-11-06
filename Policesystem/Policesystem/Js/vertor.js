var vectorSource = new ol.source.Vector({
    features: [] //add an array of features
});
var offset = { x: 0, y: 0 }; //28.6699850000,121.5158010000---28.50921,121.50916

var vectorSourcejwt = new ol.source.Vector({
    features: [] //add an array of features
});
var vectorSourcedjj = new ol.source.Vector({
    features: [] //add an array of features
});
var vectorLayer = new ol.layer.Vector({
    source: vectorSource,
    title: '车载视频',
    visible: true
});
var vectorLayerjwt = new ol.layer.Vector({
    source: vectorSourcejwt,
    title: '警务通',
    visible: true
});
var vectorLayerdjj = new ol.layer.Vector({
    source: vectorSourcedjj,
    title: '对讲机',
    visible: true
});

var traceColors = ["#f2ab22", "#0084ff", "#b45538", "#091e3d"]
var arrow = "../img/arrow.png";
//var idpositionText = ["其它","民警", "辅警", "职工"];

//标记数据集
var tracesource = new ol.source.Vector();
//获取样式
var styleFunction = function (feature,color) {
    var geometry = feature.getGeometry();
    //线段样式
    var styles = [
    new ol.style.Style({
        fill: new ol.style.Fill({
            color: color
        }),
        stroke: new ol.style.Stroke({
            lineDash: [1, 3, 5],
            width: 2,
            color: color
        })
    })
    ];
    //箭头样式
    geometry.forEachSegment(function (start, end) {
        var arrowLonLat = [(end[0] + start[0]) / 2, (end[1] + start[1]) / 2];
        var dx = end[0] - start[0];
        var dy = end[1] - start[1];
        var rotation = Math.atan2(dy, dx);
        styles.push(new ol.style.Style({
            geometry: new ol.geom.Point(arrowLonLat),
            image: new ol.style.Icon({
                src: arrow,
                anchor: [0.75, 0.5],
                rotateWithView: true,
                rotation: -rotation
            })
        }));
    });
    return styles;
};

//标记层
var tracepointlayer = new ol.layer.Vector({
    source: new ol.source.Vector()
});

//标记点集
var tracevector = new ol.layer.Vector({
    source: tracesource
});


function createTrace(data) {
    tracevector.getSource().clear();
    tracepointlayer.getSource().clear();
    var divideNum,textcontent;
    for (var n = 0; n < data.length; n++) {

        if (data[n].data.length == 0) continue;
    
        var geometrytrace = new ol.geom.LineString();
        var feature = new ol.Feature({
            geometry: geometrytrace
        });
        divideNum = Math.ceil(data[n].data.length / 20);
        for (var i = 0; i < data[n].data.length; i++) {
            var coordinate = [parseFloat(data[n].data[i].la), parseFloat(data[n].data[i].lo)];
            if(n==0&&i==0){
            var view = map.getView();
            view.animate({ zoom: view.getZoom() }, { center: ol.proj.transform(coordinate, 'EPSG:4326', 'EPSG:3857') }, function () {
            });
            }
            geometrytrace.appendCoordinate(ol.proj.transform(coordinate, 'EPSG:4326', 'EPSG:3857'));
            // 创建一个Feature，并设置好在地图上的位置
           
            if (i % divideNum != 0 && i != data[n].data.length-1) {
                continue;
            }
            textcontent = Math.ceil(i/ divideNum).toString();
            var anchor = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.transform(coordinate, 'EPSG:4326', 'EPSG:3857'))
            });
            // 设置样式，在样式中就可以设置图标
            anchor.setStyle(new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 10,
                    stroke: new ol.style.Stroke({
                        color: '#fff'
                    }),
                    fill: new ol.style.Fill({
                        color: traceColors[n]
                    })

                }),
                text: new ol.style.Text({ //文本样式
                    font: '12px Calibri,sans-serif',
                    fill: new ol.style.Fill({
                        color: '#fff'
                    }),
                    text: textcontent
                })
            }));
            // 添加到之前的创建的layer中去
           tracepointlayer.getSource().addFeature(anchor);
        }
        feature.setStyle(styleFunction(feature, traceColors[n]));
        tracesource.addFeature(feature);

    }
   
}



//定位层
var point_div = document.createElement('div');
point_div.className = "css_animation";
point_overlay = new ol.Overlay({
    element: point_div,
    positioning: 'center-center'
});
map.addOverlay(point_overlay);

map.addLayer(
    new ol.layer.Group({
        title: '五小件',
        layers: [
           vectorLayer,
           vectorLayerjwt,
           vectorLayerdjj,
           tracevector,
           tracepointlayer
        ]
    }));


function loadmarks() {

    var bounds = ol.proj.transformExtent(map.getView().calculateExtent(map.getSize()), 'EPSG:3857', 'EPSG:4326').toString();
    var boundsarr = bounds.split(",");
    var llo = parseFloat(boundsarr[0]) + offset.x;
    var lla = parseFloat(boundsarr[1]) + offset.y;
    var rlo = parseFloat(boundsarr[2]) + offset.x;
    var rla = parseFloat(boundsarr[3]) + offset.y;
    bounds = llo + "," + lla + "," + rlo + "," + rla;
    var type = $("#deviceselect").val();;
    var data =
        {
            search: $(".seach-box input").val(),
            type: type,
            ssdd: $("#brigadeselect").val(),
            sszd: $("#squadronselect").val(),
            status: $("#sbstate").val(),
            bounds: bounds

        }

    $.ajax({
        type: "POST",
        url: "../Handle/GetaMarksbyBound.ashx",
        data: data,
        dataType: "json",
        success: function (data) {
            if (data.r == "0") {
                if (data.result == "0") {
                    vectorLayer.getSource().clear();
                    vectorLayerjwt.getSource().clear();
                    vectorLayerdjj.getSource().clear();
                }
                else {
                    addmarks(data.result);
                }
            } else {
                vectorLayer.getSource().clear();
                vectorLayerjwt.getSource().clear();
                vectorLayerdjj.getSource().clear();
            }


        },
        error: function (msg) {
            console.debug("错误:ajax");

        }
    });

}


function showfeatureinfo(IsOnline, Contacts, Name, Tel, devid, PlateNumber, DevType, pixel, IMEI, UserNum, IdentityPosition) {
    $(".zq-cwrap1 .col-md-7:eq(0)").text(devid);
    $(".zq-cwrap1 .col-md-7:eq(3)").text(Contacts);
    switch (DevType) {
        case "1":
            $(".zq-cwrap1 .col-md-7:eq(4)").text(PlateNumber);
            $(".zq-cwrap1 .row:eq(4)").show();
            $(".zq-cwrap1 .row:eq(1)").hide();
            $(".zq-cwrap1 .row:eq(7)").hide();
            $(".zq-cwrap1 .row:eq(2)").hide();
            break;
        case "4":
            $(".zq-cwrap1 .row:eq(4)").hide();
            $(".zq-cwrap1 .row:eq(1)").show()
            $(".zq-cwrap1 .col-md-7:eq(1)").text(IMEI);
            $(".zq-cwrap1 .row:eq(2)").show()
            $(".zq-cwrap1 .row:eq(7)").show()
            $(".zq-cwrap1 .col-md-7:eq(2)").text(UserNum);
            break;
        case "2":
            $(".zq-cwrap1 .row:eq(4)").hide();
            $(".zq-cwrap1 .row:eq(1)").hide()

            $(".zq-cwrap1 .row:eq(2)").show()
            $(".zq-cwrap1 .row:eq(7)").show()
            $(".zq-cwrap1 .col-md-7:eq(2)").text(UserNum);

            break;

    }

    $(".zq-cwrap1 .col-md-7:eq(5)").text(Tel);
    $(".zq-cwrap1 .col-md-7:eq(6)").text(Name);
    $(".zq-cwrap1 .col-md-7:eq(7)").text(IdentityPosition);
    $(".zq-cwrap1 .col-md-7:eq(8)").text(IsOnline);


    $(".zq1").show();
    var x = pixel[0] - $(".zq1").width() / 2;
    var y = pixel[1] - $(".zq1").height() - 55;
    $(".zq1").css("left", x + "px");
    $(".zq1").css("top", y + "px");
    $(".table .localtd").removeClass("localtd");
    $(".table td:contains(" + devid + ")").addClass("localtd");
}





map.on('click', function (evt) {
    point_overlay.setPosition([0, 0]);
    $(".zq1").hide();
    $(".table .localtd").removeClass("localtd"); //移出定位
    var feature = map.forEachFeatureAtPixel(evt.pixel,
        function (feature) {
            return feature;
        });
    createfeatureinfo(feature);
});
function createfeatureinfo(feature) {
    if (feature) {
        var coordinates = feature.getGeometry().getCoordinates();
        var pixel = map.getPixelFromCoordinate(coordinates);


        var IsOnline = feature.get('IsOnline') == "0" ? "离线" : "在线";
        var Contacts = feature.get('Contacts');
        var Name = feature.get('Name');
        var Tel = feature.get('Tel');
        var devid = feature.get('DevId');
        var PlateNumber = feature.get('PlateNumber');
        var DevType = feature.get('DevType');
        var IMEI = feature.get('IMEI');
        var UserNum = feature.get('UserNum');
        var IdentityPosition = feature.get('IdentityPosition');
        showfeatureinfo(IsOnline, Contacts, Name, Tel, devid, PlateNumber, DevType, pixel, IMEI, UserNum, IdentityPosition);

    }
}

// change mouse cursor when over marker
map.on('pointermove', function (e) {
    if (e.dragging) {
        $(".table .localtd").removeClass("localtd"); //移出定位
        point_overlay.setPosition([0, 0]);
        return;
    }
    var pixel = map.getEventPixel(e.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);
    map.getTarget().style.cursor = hit ? 'pointer' : '';
});



function createinfovisible(){

    if ($(".zq1").is(':visible')) {
        var devid = $(".zq-cwrap1 .col-md-7:eq(0)").text();
        var feature = vectorLayer.getSource().getFeatureById(devid);
        //$(".zq1").hide();
        if (!feature) {
            feature = vectorLayerjwt.getSource().getFeatureById(devid);
        }
        if (!feature) {
            feature = vectorLayerdjj.getSource().getFeatureById(devid);
        }
        createfeatureinfo(feature);
    }
}



function addmarks(points) {
    vectorLayer.getSource().clear();
    vectorLayerjwt.getSource().clear();
    vectorLayerdjj.getSource().clear();

    for (var i = 0; i < points.length; i++) {
        var point = points[i];
        if (point.La < 90) { continue; }
        var iconFeature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.transform([parseFloat(point.La - offset.x), parseFloat(point.Lo - offset.y)], 'EPSG:4326', 'EPSG:3857')),
            IsOnline: point.IsOnline,
            Contacts: point.Contacts,
            DevType: point.DevType,
            Name: point.Name,
            Tel: point.Tel,
            DevId: point.DevId,
            IMEI: point.IMEI,
            UserNum: point.JYBH,
            PlateNumber: point.PlateNumber,
            IdentityPosition: point.IdentityPosition
        });
        Seticon(point, iconFeature);
        iconFeature.setId(point.DevId);
        iconFeature.on()

        switch (point.DevType) {

            case "1":
                vectorLayer.getSource().addFeature(iconFeature);
                break;
            case "4":
                vectorLayerjwt.getSource().addFeature(iconFeature);
                break;
            case "2":
                vectorLayerdjj.getSource().addFeature(iconFeature);
                break;
        }

         // point_overlay.setPosition(ol.proj.transform([parseFloat(point.La), parseFloat(point.Lo)], 'EPSG:4326', 'EPSG:3857'));
    }

}

function Seticon(point, feature) {
    switch (point.DevType + point.IsOnline) {
        case "41":
            feature.setStyle(markicon.jingwutong_1);
            break;
        case "40":
            feature.setStyle(markicon.jingwutong_2);
            break;
        case "10":
            if (point.Cartype == "摩托车") {
                feature.setStyle(markicon.moto_2);
            }
            else {
                feature.setStyle(markicon.car_2);
            }


            break;

        case "11":
            if (point.Cartype == "摩托车") {
                feature.setStyle(markicon.moto_1);
            }
            else {
                feature.setStyle(markicon.car_1);
            }

            break;

        case "21":
            feature.setStyle(markicon.djj_1);
            break;
        case "20":
            feature.setStyle(markicon.djj_2);
            break

        default:
            feature.setStyle(markicon.jingwutong_1);
            break;
    }

}


var view = map.getView();

view.on('change:resolution', function (e) {
    //   loadmarks();
    createinfovisible();
});
view.on('change:center', function (e) {
    //    loadmarks();
    createinfovisible();
});