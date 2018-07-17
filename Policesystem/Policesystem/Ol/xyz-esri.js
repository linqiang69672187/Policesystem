

var url=""

var tileLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        tileUrlFunction: function (tileCoord) {
          
            //  return 'data/_alllayers/' + z + '/' + y + '/' + x + '.png';
      
            x = 'C' + zeroPad(tileCoord[1], 8, 16);
            y = 'R' + zeroPad(-tileCoord[2], 8, 16);
            // z = 'L' + this.zeroPad(z, 2, 16);
            z = 'L' + zeroPad(tileCoord[0], 2, 10); // 改用10进制，否则第10级，转换后变为0a，无法找到对应级别切片


            return '../v101/Layers/_alllayers'+ '/' + z + '/' + y + '/' + x + '.jpg';
        },
        projection: 'EPSG:3857'
    })
});


var map = new ol.Map({
  target: 'mapdraw',
  layers: [tileLayer],
  view: new ol.View({
      center: ol.proj.fromLonLat([121.41071, 28.49096 ]),//- 121.1, 47.5
    zoom:8
  })
});

function zeroPad(num, len, radix) {
    var str = num.toString(radix || 10);
    while (str.length < len) {
        str = "0" + str;
    }
    console.debug(str);
    return str;
  
}
