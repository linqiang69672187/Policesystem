$("#header").load('top.html', function () {
    $("#header ul li:eq(6)").addClass("active");
    $(".rightbody").load('configs/indexconfig.html');
});
$(document).on('mouseover.bs.carousel.data-api', '.leftbanner ul li', function (e) {
    var $doc = $(this);
    $doc.addClass("leftbannerover");
});
$(document).on('mouseout.bs.carousel.data-api', '.leftbanner ul li', function (e) {
    var $doc = $(this);
    $doc.removeClass("leftbannerover");
});
$(document).on('click.bs.carousel.data-api', '.leftbanner ul li', function (e) {
    var $doc = $(this);
    $(".leftbanner ul li").removeClass("leftbanneractive");
    $doc.addClass("leftbanneractive");
    switch ($doc[0].innerText)
    {
        case "部门管理":
            $(".rightbody").load('configs/entitymanage.html');
            break;
        case "首页参数设置":
            $(".rightbody").load('configs/indexconfig.html');
            break;
    }
});
$(document).on('click.bs.carousel.data-api', '#exprotIn', function (e) {
    $("#daochumodal").modal("show");
});
