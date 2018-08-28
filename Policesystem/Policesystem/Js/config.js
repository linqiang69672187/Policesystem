$("#header").load('top.html', function () {
    $("#header ul li:eq(6)").addClass("active");
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
    //$(".rightbody").load('configs/entitymanage.html')
});
$(document).on('click.bs.carousel.data-api', '#exprotIn', function (e) {
    $("#daochumodal").modal("show");
});
