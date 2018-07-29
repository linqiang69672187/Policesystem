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

function formatSeconds(value,y) {
    var result = Math.floor((value / 60 / 60) * Math.pow(10, y)) / Math.pow(10, y);
    return result;
}