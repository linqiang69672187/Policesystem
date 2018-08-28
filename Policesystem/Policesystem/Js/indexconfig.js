
$(document).on('change.bs.carousel.data-api', '#cloum2select,#cloum3select,#cloum5select', function (e) {

    switch (e.target.value) {
        case "1":
        case "2":
        case "3":
            $(this).parent().parent().find('li').each(function (index,ele) {
                switch (index) {
                    case 0:
                    case 1:
                        $(this).removeClass("none");
                        break;
                    default:
                        $(this).addClass("none");
                        break;
                }
            });
            break;
        case "4":
        case "6":
            $(this).parent().parent().find('li').each(function (index, ele) {
                switch (index) {
                    case 0:
                    case 1:
                    case 2:
                        $(this).removeClass("none");
                        break;
                    default:
                        $(this).addClass("none");
                        break;
                }
            });
            break;
        case "5":
            $(this).parent().parent().find('li').each(function (index, ele) {
                switch (index) {
                    case 1:
                    case 3:
                    case 4:
                        $(this).removeClass("none");
                        break;
                    default:
                        $(this).addClass("none");
                        break;
                }
            });
            break;

    }

});