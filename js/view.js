/*** 页面切换对象，负责页面之间的切换 切换效果在effects里面定义、扩展***/
var ViewChanger = function($firstPage) {
    this.$firstPage = $($firstPage);
    this.$currentPage = $($firstPage);
    this.$nextPage = null;
    this.duration = 0.5;
}

ViewChanger.prototype.goTo = function($page, effect, duration) {
    //说明上次切换还未完成
    if (this.$nextPage || $page[0] == this.$currentPage[0]) return;

    $page = $($page);
    effect = effect || "right";
    duration = duration || this.duration;
    this.$nextPage = $page;

    ViewChanger.effects[effect](this.$currentPage, this.$nextPage);
    this.$currentPage.addClass("animating").css3({"transition": "all " + duration + "s"});
    this.$nextPage.addClass("animating").css3({"transition": "all " + duration + "s"}).removeClass("none");

    var that = this;
    setTimeout(function() {
        that.$currentPage.removeClass("animating").addClass("none");
        that.$currentPage = $page;
        that.$nextPage = null;         
    }, duration*1000);
};

ViewChanger.prototype.goToInitialPage = function() {
    this.goTo(this.$firstPage, "left");
};

ViewChanger.effects = {
    "left": function($page1, $page2) {
        $page2.css3({"transform": "translate(-100%)"});
        setTimeout(function() {
            $page1.css3({"transform": "translate(100%)"});
            $page2.css3({"transform": "none"});
        }, 100);
    },
    "right": function($page1, $page2) {
        $page2.css3({"transform": "translate(100%)"});
        setTimeout(function() {
            $page1.css3({"transform": "translate(-100%)"});
            $page2.css3({"transform": "none"});
        }, 100);
    }
}

var goToPage = (function() {
    var ViewChanger = null;

    return function($page, effect, duration) {
        if (!ViewChanger) {
            ViewChanger = new ViewChanger($(".page").not(".none"));
        }
        ViewChanger.goTo.apply(ViewChanger, arguments);
    };
})();


var View = function($viewContainer) {
    this.$viewContainer = $viewContainer;
}

View.prototype.activate = function(data) {

}

View.prototype.goto = function(targetView) {

}







































