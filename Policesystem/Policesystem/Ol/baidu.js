// 自定义分辨率和瓦片坐标系11
var resolutions = [];
var maxZoom = 18;

// 计算百度使用的分辨率
for (var i = 0; i <= maxZoom; i++) {
    resolutions[i] = Math.pow(2, maxZoom - i);
}
var tilegrid = new ol.tilegrid.TileGrid({
    origin: [0, 0],
    resolutions: resolutions    // 设置分辨率
});

// 创建百度地图的数据源
//var baiduSource = new ol.source.TileImage({
//    projection: 'EPSG:3857',
//    tileGrid: tilegrid,
//    tileUrlFunction: function (tileCoord, pixelRatio, proj) {
//        var z = tileCoord[0];
//        var x = tileCoord[1];
//        var y = tileCoord[2];

//        // 百度瓦片服务url将负数使用M前缀来标识
//        if (x < 0) {
//            x = -x;
//        }
//        if (y < 0) {
//            y = -y;
//        }

//        return "../baidu/tiles/" + z + "/" + x + "/" + y + ".jpg";
//    }
//});

var url = "../baidu/tiles/" + "{z}/{x}/{-y}" + ".jpg";
// 创建百度地图的数据源

var baiduSource = new ol.layer.Tile({
    source: new ol.source.XYZ({
        minZoom: 2,
        maxZoom: 14,
        tileSize: 256,
        projection: 'EPSG:3857',
        url: url
    })
})

var controls = new Array();
/**
var mousePositionControl = new ol.control.MousePosition({
    className: 'custom-mouse-position',
    target: document.getElementById('location'),
    coordinateFormat: ol.coordinate.createStringXY(5),//保留5位小数  
    undefinedHTML: ' ',
    projection: 'EPSG:4326'
});

controls.push(mousePositionControl);
**/

//controls.push(new ol.control.OverviewMap({}));
//controls.push(new ol.control.FullScreen());
//缩放至范围  
//var zoomToExtentControl = new ol.control.ZoomToExtent({
//    extent: bounds,
//    className: 'zoom-to-extent',
//    tipLabel: "全图"
//});
//controls.push(zoomToExtentControl);

//比例尺  
var scaleLineControl = new ol.control.ScaleLine({});
controls.push(scaleLineControl);



//缩放控件  
//var zoomSliderControl = new ol.control.ZoomSlider({});
//controls.push(zoomSliderControl);
/**
var mousePositionControl = new ol.control.MousePosition({
    className: 'custom-mouse-position',
    target: document.getElementById('location'),
    coordinateFormat: ol.coordinate.createStringXY(5),//保留5位小数  
    undefinedHTML: ' ',
    projection: 'EPSG:4326'
});

controls.push(mousePositionControl);
**/

//controls.push(new ol.control.OverviewMap({}));
//controls.push(new ol.control.FullScreen());
//缩放至范围  
//var zoomToExtentControl = new ol.control.ZoomToExtent({
//    extent: bounds,
//    className: 'zoom-to-extent',
//    tipLabel: "全图"
//});
//controls.push(zoomToExtentControl);

//比例尺  
//var scaleLineControl = new ol.control.ScaleLine({});
//controls.push(scaleLineControl);



//缩放控件  
//var zoomSliderControl = new ol.control.ZoomSlider({});
//controls.push(zoomSliderControl);

//图层控件  
//var layerSwitcher = new ol.control.LayerSwitcher({
   // tipLabel: 'Légende' // Optional label for button
//});
//controls.push(layerSwitcher);


// 百度地图层
//var baiduMapLayer2 = new ol.layer.Tile({
//    source: baiduSource,
//    title: '百度',
//    type: 'base',
//    visible: true,
//});
var url = "../baidu/tiles/" + "{z}/{x}/{-y}" + ".jpg";

var baiduMapLayer2 = new ol.layer.Tile({
    source: new ol.source.XYZ({
        minZoom: 2,
        maxZoom: 14,
        projection: 'EPSG:3857',
        tileSize: 256,
        url: url
    })
})



// 创建地图
var map = new ol.Map({
    layers: [new ol.layer.Group({
        'title': '基础图层',
        layers: [baiduMapLayer2]
    })
    ],
    controls: ol.control.defaults({
        attribution: false,
        rotate: false,
        zoom:false
    }).extend(controls),
    view: new ol.View({
        // 设置地图中心
        center: ol.proj.transform([121.26303583068851, 28.652394518616234], 'EPSG:4326', 'EPSG:3857'),
        zoom: 12,
        maxZoom: 17,
        minZoom: 10

    }),
    target: document.getElementById('mapdraw')
});





$(function () {
    // setboxsize();
    //setInterval("loadmarks()", 15000);
   // loadmarks();

});

