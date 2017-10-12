var name;
var url;
var panorama;
var lock = 0;
var loop_twice = 0;//循环两次后出现离开博物馆
var try_lock = 1; //
var left_lock = 0;
var right_lock = 0;
ion.sound({
  sounds: [
    {
      // bgm
      name: "audio",
      loop: 250 // 好像会自己停止，不能无限循环
    },
    { name: "btn" },
    { name: "up" },
    { name: "down" },
    { name: "close" },
    { name: "in" },
    { name: "open" },
  ],
  path: "/audio/",
  preload: true
});



$(document).ready(function () {
  name = $("#user_name").val();
  url = $("#pic_url").val();
  panorama = $("#museum").val();
  document.getElementsByClassName("share_name")[0].innerHTML = name;
  console.log("url" + url + "panorama:" +panorama);
  // debug //
  // $(".page.p1").show();
  // $(".upload_wrap").animate({"margin-top": "0"}, 1000);
  // $("#in, #welcome").fadeIn();
  // return false;
  // debug //

  // 序列帧视频的画布大小
  $(".xlz_video").attr({
    'width': window.innerWidth,
    'height': window.innerHeight
  }).css({
    'width': window.innerWidth,
    'height': window.innerHeight
  });
  // 全局 用来存放序列帧视频
  window.xlz_videos = {};
  $(".page.loading").show();
  var items = [
    '/image/panorama/' + panorama + '/4.png',
    '/image/panorama/' + panorama + '/5.png',
    '/image/panorama/' + panorama + '/6.png',
    'http://'+url
  ];
  var framesUrl = [];
  // 02. 开门的视频
  for (var i = 51; i < 93; i++) { // 坑爹下标
    items.push('/xlz/02-openin/02-openin_' + i + '.jpg');
    framesUrl.push('/xlz/02-openin/02-openin_' + i + '.jpg');
  }
  xlz_videos['02-openin'] = new xlz({
    canvasTargetId: "my_video_1_x", // 复用画布
    framesUrl: framesUrl,
    loop: false,
    // audio: '/audio/xlz/01-near.mp3',
    // 没设置结束回调函数，下面来
  });
    var loader = new preload({
    items: items,
    // prefix: window.location,
    onStart: function (total) {
      console.log('start:' + total);
    },
    process: function (percent) {
      // console.log(percent);
      if (percent > 5) {
        $('.loading > .progress > .bar').css('width', percent + '%');
      }
    },
    callback: function (total) {
      $(".page.loading").fadeOut();
      // 让视频们也加载一下，可能要按顺序来
      // for(var vi in xlz_videos) {
      //   xlz_videos[vi].initialize();
      // }
      //xlz_videos['01-near'].initialize(function () {
        //$(".wrap").removeClass("p0-fake");
      //});
      main();
      // alert("加载完了！");
    }
  });
  })
function main() {
  var vx2 = xlz_videos["02-openin"];
  xlz_videos['02-openin'].initialize(function () {})
  $(".share_wrap_").animate({ "margin-top": "0" }, 2000);
  $(".p1").fadeIn("fast");
  $(".pic_")[0].src = "http://" + url;
  //跳转
  $(".build_my").click(function() {
    console.log("build_my");
    window.location.replace("http://oppo10.nplusgroup.net");
  })


  //查看他的博物馆
  $(".share_btn_").click(function() {
    ion.sound.play("btn");
    // 再放一下背景音乐，防止自动停止
    ion.sound.play("audio");
    setTimeout(function () {
      $(".p1").hide();
      // 渲染着page2来
      $(".p2").show();
      $(".p2").css("opacity", "0");
      page2_init();
      // $("#audio-open").get(0).play();
      $(".p0").show();
      ion.sound.play("open");
      vx2.play();
    }, 2000);
    $(".share_wrap_").animate({ "margin-top": "-120vw" }, 2000, function () {
      $(".share_wrap_").hide();
    });
    // $("#audio-up").get(0).play();
    ion.sound.play("up");
    $(".build_my").fadeOut();
    vx2.option.onComplete = function () {
      ion.sound.play("in");
      $(".p0").hide();
      // $(".p2").fadeIn("slow");
      // $(".p2").css("opacity", "0");
      // $(".p2").show();
      $(".p2").animate({ "opacity": "1" }, 3000);
      vx2.reset(); // 重置视频
      if (!lock) { page2(); lock++; }
    }
  })
}
function calTranslateZ(opts) {
  return Math.round(opts.width / (2 * Math.tan(Math.PI / opts.number)))
}
function page2_init() {
  if ($("#bigCube").height() >= 650) {
    var BG_WIDTH = 1000,
      BG_HEIGHT = 1750;
    $("#view").css("perspective", "1060px");
  } else {
    var BG_WIDTH = 670,
      BG_HEIGHT = 1190;
    $("#view").css("perspective", "950px");
  }
  var BG_NUMBER = 9,
    PER_ANGLE = 360 / BG_NUMBER;

  var translateZ = calTranslateZ({
    width: BG_WIDTH,
    number: BG_NUMBER
  })
  // console.log(translateZ);

  var view = $("#bigCube");
  var viewW = view.width();
  var viewH = view.height();

  var container = $(".container"),
    bgItem;

  for (var i = 1; i <= BG_NUMBER; i++) {
    $("<div></div>").css({
      "background": (i == 4 || i == 5 || i == 6) ? ("url(./image/panorama/" + panorama + "/" + i + ".png) no-repeat") : "none",
      "background-size": "100% auto",
      "position": "absolute",
      "opacity": (i == 4 || i == 5 || i == 6) ? "1" : "0",
      "width": BG_WIDTH,
      "height": BG_HEIGHT,
      "z-index": "5",
      "display": "none",
      "left": (viewW - BG_WIDTH) / 2,
      "top": (viewH - BG_HEIGHT) / 2,
      "transform": "rotateY(" + (180 - i * PER_ANGLE) + "deg) translateZ(" + (-translateZ + 2) + "px)", // translateZ + 10 是为了去掉模模块间的缝隙
      // "backface-visibility": "hidden"
    }).attr('id', "panorama_" + i).appendTo(".container");
  }
  $("#panorama_4").css("display", "block");
  $("#panorama_5").css("display", "block");
  $("#panorama_6").css("display", "block");
  //放置图片
  $("<img></img>").attr("src", "http://"+url)
    .css({
      "position": "absolute",
      "width": BG_WIDTH / 3,
      "height": BG_HEIGHT / 3.99,
      "left": BG_WIDTH / 3,
      "top": BG_HEIGHT / 2.75,
      "object-fit": "cover",
      "object-position": "center"
    })
    .appendTo("#panorama_5");

  bgItem = container.find('div');
  // 会回归
  $("#cube").css({
    transform: "rotateX(0deg) rotateY(20deg) rotateZ(0)"
  });
}
function page2() {
  $(".build_my").fadeIn();
  var border_r = -52,
    border_l = 12,
    border_u = 1.5,
    border_d = -1.5;
    
  // 为了解决闪屏问题，重复的代码
  if ($("#bigCube").height() >= 650) {
    var BG_WIDTH = 1000,
      BG_HEIGHT = 1750;
  } else {
    var BG_WIDTH = 670,
      BG_HEIGHT = 1190;
  }
  var translateZ = calTranslateZ({
    width: BG_WIDTH,
    number: 9
  })

  $('body').on('touchmove', function (event) {
    event.preventDefault();
  });
  var lastMouseX = 0,
    lastMouseY = 0,
    curMouseX = 0,
    curMouseY = 0,
    lastAngleX = 0,
    lastAngleY = 0,
    angleX = 0,
    angleY = 0;
  var beyond_1 = false;//left
  var beyond_2 = false;//right
  var beyond_3 = false;//up
  var beyond_4 = false;//down
  var initTranZ = -150,
    tranZDistance = 0;

  var slastMouseX = 0;
  var frameTimer;
  var timeoutTimer;

  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame ||
    function (callback) {
      setTimeout(callback, 1000 / 60)
    };

  $(document).on("mousedown touchstart", mouseDownHandler);
  $(document).on("mouseup touchend", mouseUpHandler);

  function mouseDownHandler(evt) {
    // 由于移动设备支持多指触摸，因此与PC的鼠标不同，返回是一数组touches。
    lastMouseX = evt.pageX || evt.touches[0].pageX;
    lastMouseY = evt.pageY || evt.touches[0].pageY;
    lastAngleX = aimAngleX;
    lastAngleY = aimAngleY;
    curMouseX = evt.pageX || evt.touches[0].pageX;
    curMouseY = evt.pageY || evt.touches[0].pageY;

    slastMouseX = evt.pageX || evt.touches[0].pageX;
    clearTimeout(timeoutTimer)

    $(document).on("mousemove touchmove", mouseMoveHandler);
    window.cancelAnimationFrame(frameTimer);
    frameTimer = requestAnimationFrame(go);
  }

  function mouseMoveHandler(evt) {
    curMouseX = evt.pageX || evt.touches[0].pageX;
    curMouseY = evt.pageY || evt.touches[0].pageY;

    dragRotate({
      pageX: curMouseX,
      pageY: curMouseY
    });
  }
  function mouseUpHandler(evt) {
    // touchend 不具有坐标信息，因此需以touchmove的最后一次点提供
    // http://stackoverflow.com/questions/17957593/how-to-capture-touchend-coordinates
    // curMouseX = evt.pageX || evt.touches[0].pageX;
    // curMouseY = evt.pageY || evt.touches[0].pageY;

    $(document).unbind("mousemove touchmove");
    timeoutTimer = setTimeout(function () {
      window.cancelAnimationFrame(frameTimer)
    }, 2500);
  }



  var aimAngleX = -20, aimAngleY = 0;
  var curBgAngleX = -20, curBgAngleY = 0;
  var curItemAngleX = 0, curItemAngleY = 0;

  function dragRotate(evtInfo) {
    //left right up down:1234
    // 注意：rotateX(Y) 与 鼠标（触摸）的X（Y）轴是交叉对应的
    var tx = (180 / Math.PI * (Math.atan((curMouseX - lastMouseX) / translateZ)) + lastAngleX);
    var ty = Math.max(-60, Math.min((180 / Math.PI * Math.atan((curMouseY - lastMouseY) / (Math.sqrt(Math.pow(BG_HEIGHT / 2, 2) + Math.pow(translateZ, 2)) * 1.5)) + lastAngleY), 60));
    if (beyond_1) {
      if (tx < curBgAngleX) {
        beyond_1 = false;
        aimAngleX = tx;
        aimAngleY = ty;
      }
    } else if (beyond_2) {
      if (tx > curBgAngleX) {
        beyond_2 = false;
        aimAngleX = tx;
        aimAngleY = ty;
      }
    } else if (beyond_3) {
      if (ty < curBgAngleY) {
        beyond_3 = false;
        aimAngleX = tx;
        aimAngleY = ty;
      }
    } else if (beyond_4) {
      if (ty > curBgAngleY) {
        beyond_4 = false;
        aimAngleX = tx;
        aimAngleY = ty;
      }
    }
    else {
      // aimAngleX(Y)的值是通过【拖拽位移换算为相应角度得到】
      aimAngleX = (180 / Math.PI * (Math.atan((curMouseX - lastMouseX) / translateZ)) + lastAngleX)
      // console.log((180 / Math.PI * Math.atan((curMouseY - lastMouseY) / (Math.sqrt(Math.pow(panoBgItemH / 2, 2) + Math.pow(translateZ, 2))*1.5)) + lastAngleY), 30)
      // 限制上下旋转监督在30°以内
      aimAngleY = Math.max(-60, Math.min((180 / Math.PI * Math.atan((curMouseY - lastMouseY) / (Math.sqrt(Math.pow(BG_HEIGHT / 2, 2) + Math.pow(translateZ, 2)) * 1.5)) + lastAngleY), 60))
    }
  }


  // loop
  function go() {

    // bg 与 item 的位移增量速度的不一致，可形成视差运动
    // || (curBgAngleX <= -39.3792) || (curBgAngleX >= 39.7605
    var tempx = curBgAngleX;
    tempx += (aimAngleX - tempx) * 0.5;
    var tempy = curBgAngleY;
    tempy += (aimAngleY - tempy) * 0.5;
    //(tempy > 5.555) || (tempy < -6.38126) || (tempx < -25.8365) || 
    if (tempx > border_l) {
      beyond_1 = true;
    } else if (tempx < border_r) {
      beyond_2 = true;
    }
    else {
      beyond_1 = false;
      beyond_2 = false;
      beyond_3 = false;
      beyond_4 = false;
      curBgAngleX += (aimAngleX - curBgAngleX) * 0.8;
      if ((-curBgAngleX) >= 30) right_lock = 1;
      if ((-curBgAngleX) <= 10) left_lock = 1;
      if (left_lock && right_lock && try_lock) {
        try_lock = 0;
        $("#try").css("opacity", "1");
        $("#try").animate({ "opacity": "0" }, 1000, function () {
          $("#turn_off").css("opacity", "0");
          $("#light_word").css("opacity", "0");
          $("#turn_off").css("display", "block");
          $("#light_word").css("display", "block");
          $("#turn_off").animate({ "opacity": "1" }, 1000);
          $("#light_word").animate({ "opacity": "1" }, 1000);
        });
      }
      //curBgAngleY += (aimAngleY - curBgAngleY) * 0.8;
      $("#cube").css({
        transform: "rotateX(" + (curBgAngleY) + "deg) rotateY(" + -curBgAngleX + "deg) rotateZ(0)"
        //transform: "rotateX(-1.56685deg) rotateY(55.9531deg) rotateZ(0deg)"
      });
    }
    frameTimer = requestAnimationFrame(go);
  }
}