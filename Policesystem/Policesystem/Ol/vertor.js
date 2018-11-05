var vectorSource = new ol.source.Vector({
    features: [] //add an array of features
});
var offset = { x: 0.006641, y: 0.160775 }; //28.6699850000,121.5158010000---28.50921,121.50916


var vectorSourcejwt = new ol.source.Vector({
    features: [] //add an array of features
});

var vectorSourcedjj = new ol.source.Vector({
    features: [] //add an array of features
});

var idpositionText = ["民警", "辅警", "职工"];

var vectorLayer = new ol.layer.Vector({
    source: vectorSource,
    title: '车载视频',
    visible: true
});

var vectorLayerjwt = new ol.layer.Vector({
    source: vectorSourcejwt,
    title: '警务通',
    visible:  false
});

var vectorLayerdjj = new ol.layer.Vector({
    source: vectorSourcedjj,
    title: '对讲机',
    visible: false
});


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
       vectorLayerdjj
    ]
    }));


function loadmarks() {

    var bounds = ol.proj.transformExtent(map.getView().calculateExtent(map.getSize()), 'EPSG:3857', 'EPSG:4326').toString();
    var boundsarr = bounds.split(",");
    var llo= parseFloat(boundsarr[0]) + offset.x;
    var lla = parseFloat(boundsarr[1]) + offset.y;
    var rlo = parseFloat(boundsarr[2]) + offset.x;
    var rla = parseFloat(boundsarr[3]) +offset.y;
    bounds = llo + "," + lla + "," + rlo + "," + rla;
    var type = 1;
    var val = $("input[name='wuxiaojian']:checked").next().text();
    switch (val) {
        case "警务通":
            type = 4;
            break;
        case "车载视频":
            type = 1;
            break;
        case "对讲机":
            type = 2;
            break;
        default:
            break;

    }
    var data =
        {
            search: $(".seach-box input").val(),
            type: type,
            ssdd: $("#brigadeselect1").val(),
            sszd: $("#squadronselect1").val(),
            sortMode1: $("#sortMode1").val(),
            status: $("#sbstate1").val(),
            bounds:bounds

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
    switch(DevType)
    {
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
});

// change mouse cursor when over marker
map.on('pointermove', function (e) {
    if (e.dragging) {
        $(".zq1").hide();
        $(".table .localtd").removeClass("localtd"); //移出定位
        point_overlay.setPosition([0, 0]);
        return;
    }
    var pixel = map.getEventPixel(e.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);
    map.getTarget().style.cursor = hit ? 'pointer' : '';
});




function addmarks(points) {
    //var features = vectorLayer.getSource().getFeatures().concat(vectorLayerjwt.getSource().getFeatures().concat(vectorLayerdjj.getSource().getFeatures()));
    //var featurein = false;
    //for (var f = 0; f < features.length; f++) {
    //    featurein = false
    //    feature = features[f];
    //    for (var i = 0; i < points.length; i++) {
    //        var point = points[i];

    //        if (feature.getId() == point.ID) {
    //            feature.setGeometry(new ol.geom.Point(ol.proj.transform([parseFloat(point.La-offset.x), parseFloat(point.Lo - offset.y)], 'EPSG:4326', 'EPSG:3857')));
    //            featurein = true;
    //            if (feature.get('IsOnline') != point.IsOnline) {
    //                Seticon(point, feature);
    //                feature.set('IsOnline', point.IsOnline);
    //            }
    //            points.splice(i, 1);
    //            i = points.length;
    //        }
    //    }

    //    if (!featurein) {
    //        switch (features[f].get('DevType')) {
    //            case "1":
    //                vectorLayer.getSource().removeFeature(features[f]);
    //                break;
    //            case "4":
    //                vectorLayerjwt.getSource().removeFeature(features[f]);
    //                break;
    //            case "2":
    //                vectorLayerdjj.getSource().removeFeature(features[f]);
    //                break;
    //        }
          

    //    }
   

    //}
    vectorLayer.getSource().clear();
    vectorLayerjwt.getSource().clear();
    vectorLayerdjj.getSource().clear();

    for (var i = 0; i < points.length; i++) {
        var point = points[i];
        if (point.La < 90) { continue;}
        var iconFeature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.transform([parseFloat(point.La - offset.x), parseFloat(point.Lo - offset.y)], 'EPSG:4326', 'EPSG:3857')),
            IsOnline: point.IsOnline,
            Contacts: point.Contacts,
            DevType: point.DevType,
            Name: point.Name,
            Tel: point.Tel,
            DevId: point.DevId,
            IMEI: point.IMEI,
            UserNum: point.UserNum,
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


      //  point_overlay.setPosition(ol.proj.transform([parseFloat(point.La), parseFloat(point.Lo)], 'EPSG:4326', 'EPSG:3857'));
    }

}

function Seticon(point, feature) {
    switch(point.DevType+point.IsOnline)
    {
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
            else
            {
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
});
view.on('change:center', function (e) {
//    loadmarks();
});