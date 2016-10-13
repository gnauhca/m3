import Time from 'time.js';

class View extends Time {

    constructor(viewManager) {
        super();
        this.viewManager = viewManager;
        this.stages = []; // 3d 对象
        this.active = false;
    }

    // 激活视图，data 为接受的参数
    activate(data) {

    }

    // 冻结视图，data 为接受的参数
    inactivate(data) {}

    addStage(stage) {

    }

    // 窗口大小变化的操作
    resize() {}

    distroy() {
        super.distroy();
        this.viewManager.removeView(this);
    }

}

export default View;





































