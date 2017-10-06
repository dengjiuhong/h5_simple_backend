(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        //AMD
        define(factory);
    } else if (typeof exports === 'object') {
        //Node, CommonJS之类的
        module.exports = factory();
    } else {
        //浏览器全局变量(root 即 window)
        root.xlz = factory(root);
    }
}(this, function () {
    var isFunc = function(f){
        return typeof f === 'function';
    }
    //构造器函数
    function xlz(config){
        this.option = {
            canvasTargetId: null, // 目标画布对象ID（必须）
            framesUrl : [], // 每一帧的url（必须）
            audioUrl: "", // 音频路径
            height: 1138, // 图片的高度（必须）
            width: 640, // 图片的宽度（必须）
            onStart : null, // 加载开始回调函数，传入参数total
            onComplete : null, // 播放完毕回调
            loop: false, // 是否循环
        }
        // 覆盖配置
        if(config){
            for(i in config){
                this.option[i] = config[i];
            }
        }
        else{
            alert('参数错误！');
            return;
        }
        this.status = 0; // 状态，0：未启动   1：正在加载   2：播放中（没写）
        this.total = this.option.framesUrl.length || 0; //资源总数
        this.ctx = document.getElementById(this.option.canvasTargetId).getContext('2d'); // 画布上下文
        
        var that = this;
        this.bgm = new Audio(); // 背景音乐！
        this.bgm.onerror = function() {that.bgm = undefined;}
        this.bgm.src = this.option.audioUrl;
        // 启动缓存
        // this.initialize();
    };

    // 预加载
    xlz.prototype.initialize = function(callback) {
        this.initialize_cb = callback;
        // 启动加载，图片按顺序存起来，加载完毕后开始播放
        this.status = 1;
        var that = this;

        this.frames = []; // 存帧对象的
        this.currentIndex = 0; //当前正在加载的资源索引

        for(var i=0,l=this.option.framesUrl.length; i<l; i++){
            var url = this.option.framesUrl[i];
            var image = new Image();
            image.onload = function(){that.loaded();};
            image.onerror = function(){that.loaded();};
            image.src = url;
            this.frames.push(image);
        }
        // 回调一下启动函数
        if(isFunc(this.option.onStart)){
            this.option.onStart(this.total);
        }
    }

    // 设置封面
    xlz.prototype.setPoster = function() {
        this.calculate();
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.drawImage(this.frames[0],
             this.showX, this.showY, this.sourceWidth, this.sourceHeight,
             0, 0, this.canvasWidth, this.canvasHeight
        );
        // console.log("画好封面了");
        if(isFunc(this.initialize_cb)) {
            this.initialize_cb();
        }
    }

    // 计算一下宽高和显示位置，默认居中靠底部显示（background-position: center bottom）
    // 非默认的没写
    xlz.prototype.calculate = function() {
        this.canvasWidth = $("#" + this.option.canvasTargetId).width();
        this.canvasHeight = $("#" + this.option.canvasTargetId).height();
        var canvasR = 1.0 * this.canvasWidth / this.canvasHeight; // 窗口的宽高比
        var imageR = 1.0 * this.option.width / this.option.height;

        // 用来计算裁剪的宽高
        if(imageR < canvasR) {
            // 宽度相同，高度要裁剪
            this.width = this.canvasWidth;
            this.height = this.canvasWidth / imageR;

            this.sourceWidth = this.option.width;
            this.sourceHeight = this.option.width / canvasR;
            this.showX = 0;
            this.showY = this.option.height - this.sourceHeight;
        } else {
            // 高度相同，宽度要裁剪
            this.width = this.canvasHeight * imageR;
            this.height = this.canvasHeight;

            this.sourceWidth = this.option.height * canvasR;
            this.sourceHeight = this.option.height;

            this.showX = (this.option.width - this.sourceWidth) / 2;
            this.showY = 0;
        }

        // // 裁剪的起始位置
        // this.showX = (this.option.width - this.canvasWidth) / 2;
        // this.showY = this.option.height - this.canvasHeight;


        console.log(this.showX, this.showY, this.canvasWidth, this.canvasHeight);
    }

    xlz.prototype.play = function(){
        // 设置当前播放帧
        this.currentTimes = this.currentTimes || 0;
        this.maxFramesTimes = this.option.framesUrl.length; // 总帧数
        this.lastTimestamp = undefined;
        // 开始播放
        this.status = 2;
        window.requestAnimationFrame(this.nextFrame.bind(this));
    }
    
    // 停止
    xlz.prototype.pause = function() {
        this.status = 3;
        // bgm 也停一下
        if(this.bgm != undefined) {
            this.bgm.pause();
        }
    }

    // 下一帧
    xlz.prototype.nextFrame = function(timestamp) {
        if(this.status === 3) {
            // 提前结束了
            if(isFunc(this.option.onComplete)) {
                this.option.onComplete();
            }
            return false;
        }
        // console.log(timestamp);
        var needRedraw = false; // 需要重绘
        if(this.lastTimestamp === undefined) {
            this.lastTimestamp = timestamp;
            var jumpFrames = 0;
            needRedraw = true;
        } else {
            var jumpFrames = parseInt((timestamp - this.lastTimestamp) / (1000 / 25));
            if(jumpFrames > 0) {
                this.currentTimes += jumpFrames;
                needRedraw = true;
                this.lastTimestamp = timestamp;
            }
        }

        // console.log("准备画第 "+ this.currentTimes + " 帧");
        // 重绘
        if(needRedraw && this.currentTimes < this.maxFramesTimes) {
            // 疯狂更新来监听窗口大小变化
            this.calculate();
            // console.log("画了一帧！现在在第：" + this.currentTimes + "帧！");
            this.ctx.clearRect(0, 0, this.width, this.height);
            // console.log(this.canvasWidth, this.canvasHeight);
            this.ctx.drawImage(this.frames[this.currentTimes],
                 this.showX, this.showY, this.sourceWidth, this.sourceHeight,
                 0, 0, this.canvasWidth, this.canvasHeight
                );
        }

        // 是否继续
        if(this.currentTimes < this.maxFramesTimes) {
            // console.log("下一帧");
            window.requestAnimationFrame(this.nextFrame.bind(this));
        } else if(isFunc(this.option.onComplete)) {
            // console.log("没有下一帧");
            this.option.onComplete();
            if(this.option.loop === true) {
                // 需要循环播放
                this.currentTimes = 0;
                this.lastTimestamp = undefined;
                window.requestAnimationFrame(this.nextFrame.bind(this));
                // 音频也从头开始
                if(this.bgm !=undefined) {
                    this.bgm.currentTime = 0;
                    this.bgm.play();
                }
            } else {
                // 结束了
                this.status = 3;
                if(this.bgm !=undefined) {
                    this.bgm.pause();
                }
            }
        }
        // this.currentTimes++;
    }

    xlz.prototype.loaded = function(){
        this.currentIndex++;
        if(this.currentIndex===this.total){
            // 加载完毕，设置一下封面美滋滋
            this.setPoster();
            
            if(this.bgm !=undefined) {
                this.bgm.play();
            }
        }
    }

    //暴露粗去
    return xlz;
}));