/**
 * Created by Zhangyx on 2015/10/15.
 */
var tabledata;
var currentIndex = 0;
var firstload = true;
; (function ($) {
    var Caroursel = function (caroursel) {
        var self = this;
        this.caroursel = caroursel;
        this.posterList = caroursel.find(".poster-list");
        this.posterItems = caroursel.find(".poster-item");
        this.firstPosterItem = this.posterItems.first();
        this.lastPosterItem = this.posterItems.last();
        this.prevBtn = this.caroursel.find(".poster-prev-btn");
        this.nextBtn = this.caroursel.find(".poster-next-btn");
        //默认参数
        this.setting = {
            "width": "985",
            "height": "270",
            "posterWidth": "640",
            "posterHeight": "270",
            "scale": "0.8",
            "speed": "1000",
            "isAutoplay": "true",
            "dealy": "15000"
        }
        //自定义参数与默认参数合并
        $.extend(this.setting, this.getSetting())
        //设置第一帧位置
        this.setFirstPosition();
        //设置剩余帧的位置
        this.setSlicePosition();
        //旋转
        this.rotateFlag = true;
        this.prevBtn.off("click").on("click", function () {
            if (self.rotateFlag) {
                self.rotateFlag = false;
                self.rotateAnimate("left");
                crateItem();

            }
        });
        this.nextBtn.off("click").on("click", function () {
            if (self.rotateFlag) {
                self.rotateFlag = false;
                self.rotateAnimate("right");
                crateItemRight();

            }
        });
        if (this.setting.isAutoplay) {
            this.autoPlay();
            this.caroursel.hover(function () { clearInterval(self.timer) }, function () { self.autoPlay() });
            // crateItem();
        }
    };
    Caroursel.prototype = {
        autoPlay: function () {
            var that = this;
            this.timer = window.setInterval(function () {

                that.prevBtn.click();

            }, that.setting.dealy)
        },
        rotateAnimate: function (type) {
            var that = this;
            var zIndexArr = [];
            if (type == "left") {//向左移动

                this.posterItems.each(function () {
                    var self = $(this),
                     prev = $(this).next().get(0) ? $(this).next() : that.firstPosterItem,
                     width = prev.css("width"),
                     height = prev.css("height"),
                     zIndex = prev.css("zIndex"),
                     opacity = prev.css("opacity"),
                     left = prev.css("left"),
                     top = prev.css("top");
                    zIndexArr.push(zIndex);
                    self.animate({
                        "width": width,
                        "height": height,
                        "left": left,
                        "opacity": that.setVisbility(opacity),
                        "top": top,


                    }, that.setting.speed, function () {
                        that.rotateFlag = true;
                    });
                });
                this.posterItems.each(function (i) {
                    $(this).css("zIndex", zIndexArr[i]);
                });
            }
            if (type == "right") {//向右移动

                this.posterItems.each(function () {
                    var self = $(this),
                    next = $(this).prev().get(0) ? $(this).prev() : that.lastPosterItem,
                        width = next.css("width"),
                        height = next.css("height"),
                        zIndex = next.css("zIndex"),
                        opacity = next.css("opacity"),
                        left = next.css("left"),
                        top = next.css("top");
                    zIndexArr.push(zIndex);
                    self.animate({
                        "width": width,
                        "height": height,
                        "left": left,
                        "opacity": that.setVisbility(opacity),
                        "top": top,

                    }, that.setting.speed, function () {
                        that.rotateFlag = true;
                    });
                });
                this.posterItems.each(function (i) {
                    $(this).css("zIndex", zIndexArr[i]);
                });
            }
        },
        setFirstPosition: function () {
            this.caroursel.css({ "width": this.setting.width, "height": this.setting.height });
            this.posterList.css({ "width": this.setting.width, "height": this.setting.height });
            var width = (this.setting.width - this.setting.posterWidth) / 2;
            //设置两个按钮的样式
            this.prevBtn.css({ "width": width, "height": this.setting.height, "zIndex": Math.ceil(this.posterItems.size() / 2) });
            this.nextBtn.css({ "width": width, "height": this.setting.height, "zIndex": Math.ceil(this.posterItems.size() / 2) });
            this.firstPosterItem.css({
                "width": this.setting.posterWidth,
                "height": this.setting.posterHeight,
                "left": width,
                "zIndex": Math.ceil(this.posterItems.size() / 2) + 1, //修改当前层级
                "top": this.setVertialType(this.setting.posterHeight)
            });
        },
        setSlicePosition: function () {
            var _self = this;
            var sliceItems = this.posterItems.slice(1),
                level = Math.floor(this.posterItems.length / 2),   //修改层级
                leftItems = sliceItems.slice(0, level),
                rightItems = sliceItems.slice(level),
                posterWidth = this.setting.posterWidth,
                posterHeight = this.setting.posterHeight,
                Btnwidth = (this.setting.width - this.setting.posterWidth) / 2,
                gap = Btnwidth / level,
                containerWidth = this.setting.width;
            //设置左边帧的位置
            var i = 1;
            var leftWidth = posterWidth;
            var leftHeight = posterHeight;
            var zLoop1 = level;
            leftItems.each(function (index, item) {
                leftWidth = posterWidth * _self.setting.scale;
                leftHeight = posterHeight * _self.setting.scale;
                $(this).css({
                    "width": leftWidth,
                    "height": leftHeight,
                    "left": Btnwidth - i * gap,
                    "zIndex": zLoop1--,
                    "opacity": _self.setVisbility(1 / (i + 1)),
                    "top": _self.setVertialType(leftHeight),
                });
                i++;
            });
            //设置右面帧的位置
            var j = level;
            var zLoop2 = 1;
            var rightWidth = posterWidth;
            var rightHeight = posterHeight;
            rightItems.each(function (index, item) {
                var rightWidth = posterWidth * _self.setting.scale;
                var rightHeight = posterHeight * _self.setting.scale;
                $(this).css({
                    "width": rightWidth,
                    "height": rightHeight,
                    "left": containerWidth - (Btnwidth - j * gap + rightWidth),
                    "zIndex": zLoop2++,
                    "opacity": _self.setVisbility(1 / (j + 1)),
                    "top": _self.setVertialType(rightHeight),
                });
                j--;
            });
        },
        getSetting: function () {
            var settting = this.caroursel.attr("data-setting");
            if (settting.length > 0) {
                return $.parseJSON(settting);
            } else {
                return {};
            }
        },
        setdisplay: function () {

        },
        setVertialType: function (height) {
            var algin = this.setting.algin;
            if (algin == "top") {
                return 0
            } else if (algin == "middle") {
                return (this.setting.posterHeight - height) / 2
            } else if (algin == "bottom") {
                return this.setting.posterHeight - height
            } else {
                return (this.setting.posterHeight - height) / 2
            }
        },
        setVisbility: function (opcity) {
            return opcity;

        }
    }
    Caroursel.init = function (caroursels) {
        caroursels.each(function (index, item) {
            new Caroursel($(this));
        });
    };
    window["Caroursel"] = Caroursel;
})(jQuery)


function formatSeconds(value, y) {
    if (isNaN(value)) {
        return "0";
    }
    var result = Math.floor((value * 100) * Math.pow(10, y)) / Math.pow(10, y);
    return result;
}
function createChar() {
    $.ajax({
        type: "POST",
        url: "../../Handle/Jqueryflipster.ashx",
        data: "",
        dataType: "json",
        success: function (data) {
            tabledata = data;
            var n = 0;
            var sumonline, sumisused, total, img;
            if (firstload) {
                if (data.length == 1) {
                    setintervalofCarouse(500000000);
                }
                else {
                    $(".none").each(function (index, el) {
                        $(this).removeClass("none");
                    });

                }
                for (var i = 0; i < data.length && i < 3; i++) {

                    switch (i) {
                        case 0:
                            n = 0;
                            break;
                        case 1:
                            n = 4;
                            break;
                        case 2:
                            n = 1;
                            break;
                    }
                    sumonline = 0; sumisused = 0; total = 0;
                    $(".lbtitle:eq(" + i + ")").html("<i class='fa fa-minus  fa-rotate-90 " + data[n]["Name"] + "'></i>" + data[n]["Name"]);
                    $(".lbtitle:eq(" + i + ")").attr("data-BMDM", data[n]["BMDM"])
                    $(".divcontentrt:eq(" + i + ") ul").empty();
                    for (var i1 = 0; i1 < data[n]["data"].length; i1++) {
                        total += parseInt(data[n]["data"][i1]["count"]);
                        if (data[n]["data"][i1]["online"] != "") { sumonline += parseInt(data[n]["data"][i1]["online"]) };//在线终端总数
                        if (data[n]["data"][i1]["Isused"] != "") { sumisused += parseInt(data[n]["data"][i1]["Isused"]) };//当日使用终端数

                        switch (data[n]["data"][i1]["TypeName"]) {
                            case "车载视频":
                                img = "../Image/index_chezaiship.png";
                                break;
                            case "警务通":
                                img = "../Image/index_jingwutong.png";
                                break;
                            case "拦截仪":
                                img = "../Image/index_lanjieyi.png";
                                break;
                            case "对讲机":
                                img = "../Image/index_duijiangji.png";
                                break;
                            case "执法记录仪":
                                img = "../Image/index_zhifajiluyi.png";
                                break;
                            default:
                                img = "../Image/index_fujingtong.png";
                                break;
                        }
                        $(".divcontentrt:eq(" + i + ") ul").append("<li><img src='" + img + "' /><span>" + data[n]["data"][i1]["TypeName"] + ":</span><span>" + data[n]["data"][i1]["count"] + "</span></li>")
                    }
                    $(".divcontentlf:eq(" + i + ") div:eq(3)").text(total);
                    $(".divcontentlf:eq(" + i + ") div:eq(7)").text(formatSeconds(sumisused / total, 2) + "%");
                    $(".divcontentlf:eq(" + i + ") div:eq(11)").text(sumonline);
                };
              
                currentIndex = 2;
                Caroursel.init($('.caroursel'));
                firstload = false;
            }
            else
            {
                $(".lbtitle").each(function (index, ele) {
                    for (var i = 0; i < data.length; i++) {
                        switch (i) {
                            case 0:
                                n = 0;
                                break;
                            case 1:
                                n = 4;
                                break;
                            case 2:
                                n = 1;
                                break;
                        }
                        sumonline = 0; sumisused = 0; total = 0;
                        if ($(this).attr("data-BMDM") == data[n]["BMDM"]) {
                            $(".divcontentrt:eq(" + index + ") ul").empty();
                            for (var i1 = 0; i1 < data[n]["data"].length; i1++) {
                                total += parseInt(data[n]["data"][i1]["count"]);
                                if (data[n]["data"][i1]["online"] != "") { sumonline += parseInt(data[n]["data"][i1]["online"]) };//在线终端总数
                                if (data[n]["data"][i1]["Isused"] != "") { sumisused += parseInt(data[n]["data"][i1]["Isused"]) };//当日使用终端数

                                switch (data[n]["data"][i1]["TypeName"]) {
                                    case "车载视频":
                                        img = "../Image/index_chezaiship.png";
                                        break;
                                    case "警务通":
                                        img = "../Image/index_jingwutong.png";
                                        break;
                                    case "拦截仪":
                                        img = "../Image/index_lanjieyi.png";
                                        break;
                                    case "对讲机":
                                        img = "../Image/index_duijiangji.png";
                                        break;
                                    case "执法记录仪":
                                        img = "../Image/index_zhifajiluyi.png";
                                        break;
                                    default:
                                        img = "../Image/index_fujingtong.png";
                                        break;
                                }
                                $(".divcontentrt:eq(" + index + ") ul").append("<li><img src='" + img + "' /><span>" + data[n]["data"][i1]["TypeName"] + ":</span><span>" + data[n]["data"][i1]["count"] + "</span></li>")
                            }
                            $(".divcontentlf:eq(" + index + ") div:eq(3)").text(total);
                            $(".divcontentlf:eq(" + index + ") div:eq(7)").text(formatSeconds(sumisused / total, 2) + "%");
                            $(".divcontentlf:eq(" + index + ") div:eq(11)").text(sumonline);


                            break;

                        }

                    }
                    


                });

            }

            var senddata = [].concat(data);
            senddata.shift();
            window.parent.createdata(senddata);
            window.parent.chartdata = senddata;
            
        },
        error: function (msg) {
            console.debug("错误:ajax");
        }
    });

}
$(function () {

    $.ajax({
        type: "POST",
        url: "../../Handle/loadfreshTime.ashx",
        data: "",
        dataType: "json",
        success: function (data) {
            var second;
            for (var i = 0; i < data.data.length; i++) {
                second = parseInt(data.data[i].DevType) * 1000;
                switch (data.data[i].val) {
                    case "全局设备更新周期":
                        window.parent.setInterloadTotalDevices(second);
                        break;
                    case "仪表盘信息栏更新周期":
                        window.parent.setInterloadGaugeData(second);
                        break;
                    case "轮播及右侧图形数据更新周期":
                        setInterval(createChar, second); //10分钟刷新

                        break;
                    case "轮播周期":
                        setintervalofCarouse(second);
                        break;

                    default:
                        break;
                }
            }
            createChar();

        },
        error: function (msg) {
            console.debug("错误:ajax");
        }
    });


});

function crateItem() {
    var data = tabledata;

    if (!data) { return; }
    var sumonline, sumisused, total, img;
    sumonline = 0; sumisused = 0; total = 0;
    for (var i1 = 0; i1 < 30; i1++) {
        if ($("." + data[currentIndex]["Name"]).length > 0) {
            if (currentIndex == data.length - 1) {
                currentIndex = 0;
            }
            else {
                currentIndex += 1;
            }
        }
        else {
            break;
        }
    }

    $("ul.poster-list>li").each(function (index, ele) {
        if ($(this).position().left == 0) {

            $(".lbtitle:eq(" + index + ")").html("<i class='fa fa-minus  fa-rotate-90 " + data[currentIndex]["Name"] + "'></i>" + data[currentIndex]["Name"]);
            $(".lbtitle:eq(" + index + ")").attr("data-BMDM", data[currentIndex]["BMDM"]);
            $(".divcontentrt:eq(" + index + ") ul").html("");
            for (var i1 = 0; i1 < data[currentIndex]["data"].length; i1++) {
                total += parseInt(data[currentIndex]["data"][i1]["count"]);
                if (data[currentIndex]["data"][i1]["online"] != "" && data[currentIndex]["data"][i1]["online"] != undefined) { sumonline += parseInt(data[currentIndex]["data"][i1]["online"]) };//在线终端总数
                if (data[currentIndex]["data"][i1]["Isused"] != "" && data[currentIndex]["data"][i1]["Isused"] != undefined) { sumisused += parseInt(data[currentIndex]["data"][i1]["Isused"]) };//当日使用终端数

                switch (data[currentIndex]["data"][i1]["TypeName"]) {
                    case "车载视频":
                        img = "../Image/index_chezaiship.png";
                        break;
                    case "警务通":
                        img = "../Image/index_jingwutong.png";
                        break;
                    case "拦截仪":
                        img = "../Image/index_lanjieyi.png";
                        break;
                    case "对讲机":
                        img = "../Image/index_duijiangji.png";
                        break;
                    case "执法记录仪":
                        img = "../Image/index_zhifajiluyi.png";
                        break;
                    default:
                        img = "../Image/index_fujingtong.png";
                        break;
                }

                $(".divcontentrt:eq(" + index + ") ul").append("<li><img src='" + img + "' /><span>" + data[currentIndex]["data"][i1]["TypeName"] + ":</span><span>" + data[currentIndex]["data"][i1]["count"] + "</span></li>")
            }
            $(".divcontentlf:eq(" + index + ") div:eq(3)").text(total);
            $(".divcontentlf:eq(" + index + ") div:eq(7)").text(formatSeconds(sumisused / total, 2) + "%");
            $(".divcontentlf:eq(" + index + ") div:eq(11)").text(sumonline);
        }

    });

    //if (data.length - i - currentIndex > 0) {
    //    $(".lbtitle:eq(" + i + ")").html("<i class='fa fa-minus  fa-rotate-90'></i>" + data[i + currentIndex]["Name"]);
    //}

    setTimeout(function () { window.parent.changeCarouseEntity() }, 500);


}

function crateItemRight() {
    var data = tabledata;

    if (!data) { return; }
    var sumonline, sumisused, total, img;
    sumonline = 0; sumisused = 0; total = 0;
    for (var i1 = 0; i1 < 30; i1++) {
        if ($("." + data[currentIndex]["Name"]).length > 0) {
            if (currentIndex == 0) {
                currentIndex = data.length - 1;
            }
            else {
                currentIndex -= 1;
            }
        }
        else {
            break;
        }
    }

    $("ul.poster-list>li").each(function (index, ele) {
        if ($(this).position().left > 0 && $(this).position().top != 0) {

            $(".lbtitle:eq(" + index + ")").html("<i class='fa fa-minus  fa-rotate-90 " + data[currentIndex]["Name"] + "'></i>" + data[currentIndex]["Name"]);
            $(".lbtitle:eq(" + index + ")").attr("data-BMDM", data[currentIndex]["BMDM"]);
            $(".divcontentrt:eq(" + index + ") ul").html("");
            for (var i1 = 0; i1 < data[currentIndex]["data"].length; i1++) {
                total += parseInt(data[currentIndex]["data"][i1]["count"]);
                if (data[currentIndex]["data"][i1]["online"] != "" && data[currentIndex]["data"][i1]["online"] != undefined) { sumonline += parseInt(data[currentIndex]["data"][i1]["online"]) };//在线终端总数
                if (data[currentIndex]["data"][i1]["Isused"] != "" && data[currentIndex]["data"][i1]["Isused"] != undefined) { sumisused += parseInt(data[currentIndex]["data"][i1]["Isused"]) };//当日使用终端数

                switch (data[currentIndex]["data"][i1]["TypeName"]) {
                    case "车载视频":
                        img = "../Image/index_chezaiship.png";
                        break;
                    case "警务通":
                        img = "../Image/index_jingwutong.png";
                        break;
                    case "拦截仪":
                        img = "../Image/index_lanjieyi.png";
                        break;
                    case "对讲机":
                        img = "../Image/index_duijiangji.png";
                        break;
                    case "执法记录仪":
                        img = "../Image/index_zhifajiluyi.png";
                        break;
                    default:
                        img = "../Image/index_chezaiship.png";
                        break;
                }

                $(".divcontentrt:eq(" + index + ") ul").append("<li><img src='" + img + "' /><span>" + data[currentIndex]["data"][i1]["TypeName"] + ":</span><span>" + data[currentIndex]["data"][i1]["count"] + "</span></li>")
            }
            $(".divcontentlf:eq(" + index + ") div:eq(3)").text(total);
            $(".divcontentlf:eq(" + index + ") div:eq(7)").text(formatSeconds(sumisused / total, 2) + "%");
            $(".divcontentlf:eq(" + index + ") div:eq(11)").text(sumonline);
        }

    });
    setTimeout(function () { window.parent.changeCarouseEntity() }, 500);

}

function setintervalofCarouse(second) {
    $('.caroursel').attr('data-setting', '{"width":2670,"height":620,"posterWidth":985,"posterHeight":620,"scale":0.8,"dealy":"' + second + '","algin":"middle"}');
}