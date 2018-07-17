function currentBasePathGet() {  
    var strFullPath = window.document.location.href;
    var strPath = window.document.location.pathname;
    var pos = strFullPath.indexOf(strPath);
    var prePath = strFullPath.substring(0, pos + 1);
    //var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1); 
    return prePath; //+"publish/";
}

var basePath = currentBasePathGet();
includesrcipt(basePath + "comjs/jquery.js");
includesrcipt(basePath + 'comjs/apiv2.0.my.js');
includesrcipt(basePath + 'comjs/bootstrap-datetimepicker.js');
includesrcipt(basePath + "comjs/ion.rangeSlider.js");

includesrcipt(basePath + "comjs/jquery.orgchart.js");
includesrcipt(basePath + "comjs/jquery.pagination.js");
includesrcipt(basePath + 'comjs/moment-with-locales.js');
includesrcipt(basePath + "comjs/moment.js");
includesrcipt(basePath + "comjs/myHeatmap2.0.min.js");





function includesrcipt(src) {
    var HTMLCode = "<script language='javascript' src='" + src + "'>" + "<\/script>";
    document.write(HTMLCode);
}
