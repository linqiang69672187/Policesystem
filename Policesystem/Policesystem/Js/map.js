$("#header").load('top.html', function () {


});
$('.start_form_datetime').datetimepicker({
    format: 'yyyy/m/d',
    autoclose: true,
    todayBtn: true,
    minView: 2
});
$(document).on('click.bs.carousel.data-api', '.boxleft > .row li > div', function (e) {
    $('.leftactive').removeClass();
    $(this).addClass('leftactive');

});