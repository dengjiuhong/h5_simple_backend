var clickTimes = 1;
var requestTimes = 0;
var user_name = "test";
var user_phone = "test";
var Qiniu_UploadUrl = "http://up.qiniu.com";
var panorama = -1;//0~3
var lock = 0;
var audio;
var upload_lock;
var close_lock = 0;
var loop_twice = 0;//循环两次后出现离开博物馆
var try_lock = 1; //
var left_lock = 0;
var right_lock = 0;
// 顶栏高度
var topHeight = window.screen.height - window.innerHeight;

// 随机数
panorama = Math.floor(Math.random() * 3);
// preload(panorama);


// 音频
ion.sound({
  sounds: [
      {
        // bgm
        name: "audio",
        loop: 250 // 好像会自己停止，不能无限循环
      },
      {name: "btn"},
      {name: "up"},
      {name: "down"},
      {name: "close"},
      {name: "in"},
      {name: "open"},
      {name: "panorama_0_close"},
      {name: "panorama_1_close"},
      {name: "panorama_2_close"},
      {name: "panorama_0_exit"},
      {name: "panorama_1_exit"},
      {name: "panorama_2_exit"},
  ],
  path: "/audio/",
  preload: true
});


$(document).ready(function () {
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

  // 开始预加载
  $(".page.loading").show();
  var items = [
    '/image/close.png',
    '/image/new_brand.png',
    '/image/brand_.png',
    '/image/close_.png',
    '/image/try.png',
    '/image/panorama/0/4.png',
    '/image/panorama/0/5.png',
    '/image/panorama/0/6.png',
    '/image/panorama/1/4.png',
    '/image/panorama/1/5.png',
    '/image/panorama/1/6.png',
    '/image/panorama/2/4.png',
    '/image/panorama/2/5.png',
    '/image/panorama/2/6.png',
    '/image/bg/close_0.png',
    '/image/bg/close_1.png',
    '/image/bg/close_2.png',
    '/image/share_my.gif',
    // '/v/02-openin.mp4'
  ];
  var framesUrl = [];
  // 01. 靠近门的视频的资源
  // items.push('/audio/xlz/01-near.mp3');
  framesUrl = []; // 先清空上一个的
  for(var i=0; i<51; i++) {
    items.push('/xlz/01-near/01-near_' + i + '.jpg');
    framesUrl.push('/xlz/01-near/01-near_' + i + '.jpg');
  }
  xlz_videos['01-near'] = new xlz({
    canvasTargetId: "my_video_1_x",
    framesUrl: framesUrl,
    loop: false,
    // audio: '/audio/xlz/01-near.mp3',
    // 没设置结束回调函数，下面来
  });

  // 02. 开门的视频
  framesUrl = []; // 清空
  for(var i=51; i<93; i++) { // 坑爹下标
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

  // 03. 关灯视频
  framesUrl = [];
  // var audio_3_url = "/audio/xlz/panorama_"+ panorama +"_close.mp3";
  // var audio_3 = $("#audio-close-" + panorama).get(0);
  // items.push(audio_3_url);
  if(panorama === 0) {
    for(var i=0; i<75; i++) {
      items.push('/xlz/museum-01-tech-74/museum-tech_' + i + '.jpg');
      framesUrl.push('/xlz/museum-01-tech-74/museum-tech_' + i + '.jpg');
    }
  } else if(panorama === 1) {
    for(var i=0; i<75; i++) {
      items.push('/xlz/museum-02-fashion-74/museum-fashion_' + i + '.jpg');
      framesUrl.push('/xlz/museum-02-fashion-74/museum-fashion_' + i + '.jpg');
    }
  } else if(panorama === 2) {
    for(var i=0; i<90; i++) {
      items.push('/xlz/museum-03-classic-89/museum-classic_' + i + '.jpg');
      framesUrl.push('/xlz/museum-03-classic-89/museum-classic_' + i + '.jpg');
    }
  } else {
    alert("博物馆不存在！");
  }
  xlz_videos['03-close'] = new xlz({
    canvasTargetId: "close_0_c",
    framesUrl: framesUrl,
    loop: true, // 关灯视频是循环播放的
    // audioObject: audio_3,
    audioIonName: "panorama_"+ panorama +"_close",
    // 没设置结束回调函数，下面来
    // onComplete: function() {
    //   console.log("03. 结束了");
    // },
  });

  // 04. 退出房间视频
  framesUrl = [];
  // var audio_4_url = "/audio/xlz/panorama_"+ panorama +"_exit.mp3";
  // var audio_4 = $("#audio-exit-" + panorama).get(0);
  // items.push(audio_4_url);
  if(panorama === 0) {
    for(var i=0; i<63; i++) {
      items.push('/xlz/exit_0/exit_0_' + i + '.jpg');
      framesUrl.push('/xlz/exit_0/exit_0_' + i + '.jpg');
    }
  } else if(panorama === 1) {
    for(var i=0; i<63; i++) {
      items.push('/xlz/exit_1/exit_1_' + i + '.jpg');
      framesUrl.push('/xlz/exit_1/exit_1_' + i + '.jpg');
    }
  } else if(panorama === 2) {
    for(var i=0; i<63; i++) {
      items.push('/xlz/exit_2/exit_2_' + i + '.jpg');
      framesUrl.push('/xlz/exit_2/exit_2_' + i + '.jpg');
    }
  } else {
    alert("博物馆不存在！");
  }
  xlz_videos['04-exit'] = new xlz({
    canvasTargetId: "exit_0_c",
    framesUrl: framesUrl,
    loop: false,
    // audioObject: audio_4,
    audioIonName: "panorama_"+ panorama +"_next",
    // 没设置结束回调函数，下面来
    onComplete: function() {
      console.log("03. 结束了");
    },
  });


  // 防止加载完闪屏
  $(".wrap").addClass("p0-fake");

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
      xlz_videos['01-near'].initialize(function() {
        $(".wrap").removeClass("p0-fake");
      });
      main();
      // alert("加载完了！");
    }
  });
});
function judge() {
  if (picfile == null) {
    $("#welcome").css("background-image", "url('/image/error/err_pic.png')");
    upload_lock = false;
  }
  else if ($("#name").val() == "") {
    $("#welcome").css("background-image", "url('/image/error/err_name.png')");
    upload_lock = false;
  }
  else if ($('#phone').val() == "") {
    $("#welcome").css("background-image", "url('/image/error/err_phone.png')");
    upload_lock = false;
  }
  else upload_lock = true;
}
function main() {

  $(".p0").fadeIn("fast");
  // var v = $("#my_video_1");
  var vx = xlz_videos["01-near"]; // 序列帧动画
  // var v2 = $("#my_video_2");
  var vx2 = xlz_videos["02-openin"];
  // v.fadeIn("fast");
  $("#first_enter_box").click(function () {
    // audio = document.getElementById("audio-bg");
    // audio.play();
    ion.sound.play("audio");
    $("#first_enter_box").fadeOut();
    // $("#audio-btn").get(0).play();
    ion.sound.play("btn");
    // v.get(0).play();
    vx.play(); // 播放序列帧
    $(".wrap").addClass("p1-fake");
  });
  // 第一个视频放完了
  vx.option.onComplete = function () {
    $(".p1").show();
    $(".p0").fadeOut();
    // 加载第二个视频，然后移除防止闪频的东西
    xlz_videos['02-openin'].initialize(function () {
      setTimeout(function() {
        $(".wrap").removeClass("p1-fake");
      }, 1000);
    });

    $(".upload_wrap").animate({ "margin-top": "0" }, 2000);
    // $("#audio-down").get(0).play();
    ion.sound.play("down");
    $("#in, #welcome").fadeIn();
  }
  
  $("#in").click(function () {
    // audio_3 = $("#audio-close-" + panorama).get(0);
    // audio_4 = $("#audio-exit-" + panorama).get(0);
    // audio_3.load();
    // audio_4.load();
    // $("#audio-btn").get(0).play();
    ion.sound.play("btn");
    // 再放一下背景音乐，防止自动停止
    ion.sound.play("audio");
    judge();
    if (!upload_lock) return;
    // v2.get(0).play();
    // v2.get(0).pause();
    setTimeout(function () {
      $(".p1, .p3").hide();
      // 渲染着page2来
      $(".p2").show();
      $(".p2").css("opacity", "0");
      // 加个防止闪屏的东西
      // $(".wrap").addClass("p2-fake-" + panorama);

      $(".p0").show();
      // $("#audio-open").get(0).play();
      ion.sound.play("open");
      vx2.play();
    }, 2000);
    $(".upload_wrap").animate({ "margin-top": "-120vw" }, 2000, function () {
      $(".upload_wrap").hide();
    });
    // $("#audio-up").get(0).play();
    ion.sound.play("up");
    $("#in, #welcome").fadeOut();
    vx2.option.onComplete = function () {
      // v2.css("display", "none");
      //v2.fadeIn("fast");
      // $("#audio-in").get(0).play();
      ion.sound.play("in");
      $(".p0").hide();
      // $(".p2").fadeIn("slow");
      // $(".p2").css("opacity", "0");
      // $(".p2").show();
      $(".p2").animate({ "opacity": "1" }, 3000);
      vx2.reset(); // 重置视频
      if (!lock) { page2(); lock++; }
    }
    if (clickTimes == 1 && upload_lock) {
      clickTimes++;
      requestTimes++;
      console.log("clickTimes" + clickTimes);
      requestPic();
    }
  });
  var wx_data = {};
  $.ajax({
    url: 'http://101.132.91.4:80/wx',
    type: 'GET',
    success: function (data) {
      console.log(JSON.stringify(data));
      wx_data = data;
      wx_process(wx_data);
    }
  });
}

// function preload(panorama) {
//   for (var i = 4; i < 7; i++) {
//     $("<img></img>").attr("src", "./image/panorama/" + panorama + "/" + i + ".png")
//       .css("display", "none").appendTo(".p0");
//   }
// };
function wx_process(data) {
  wx.config({
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: data.appid, // 必填，公众号的唯一标识
    timestamp: data.timestamp, // 必填，生成签名的时间戳
    nonceStr: data.random_str, // 必填，生成签名的随机串
    signature: data.signature,// 必填，签名，见附录1
    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
  });
  wx.ready(function () {
    wx.onMenuShareTimeline({
      title: 'test', // 分享标题
      link: 'www.google.com', // 分享链接
      imgUrl: '', // 分享图标
      success: function () {
        // 用户确认分享后执行的回调函数
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
      }
    });
    wx.onMenuShareAppMessage({
      title: 'JasonFF', // 分享标题
      desc: 'JasonFF的主页', // 分享描述
      link: 'www.google.com', // 分享链接
      imgUrl: '', // 分享图标
      type: 'link', // 分享类型,music、video或link，不填默认为link
      dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
      success: function () {
        // 用户确认分享后执行的回调函数
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
      }
    });
  });
}
function requestPic() {
  user_phone = $("#phone").val();
  user_name = $("#name").val();
  console.log("file = " + picfile);
  if (picfile == null) {
    console.log("文件为空");
  }
  else {
    $.ajax({
      url: 'http://101.132.91.4:80/pic_storage',
      type: 'POST',
      timeout: 15000,
      data: {
        name: $("#name").val(),
        phone: $("#phone").val()
      },
      success: function (data) {
        Qiniu_upload(picfile, data.token, $("#name").val() + ".jpg");
      },
      error: function (xhr, errorType, error) {
        console.log("出错！" + error);
        clickTimes = 1;
      },
    });
  }

}

function Qiniu_upload(f, token, key) {
  console.log(key);
  console.log(token);
  console.log(f);
  var xhr = new XMLHttpRequest();
  xhr.open('POST', Qiniu_UploadUrl, true);
  var formData, startDate;
  formData = new FormData();
  if (key !== null && key !== undefined) formData.append('key', key);
  formData.append('token', token);
  formData.append('file', f);

  xhr.onreadystatechange = function (response) {
    if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText != "") {
      var blkRet = JSON.parse(xhr.responseText);
      console && console.log("blkRet" + blkRet);
    } else if (xhr.status != 200 && xhr.responseText) {

    }
  };
  startDate = new Date().getTime();
  xhr.send(formData);
};
function page2() {
  $("#close_0_c").hide(); // 把画布先藏好
  $("#exit_0_c").hide(); // 把画布先藏好

  $('body').on('touchmove', function (event) {
    event.preventDefault();
  });

  // 关灯视频
  // $("#close_0").get(0).src = './v/close_' + panorama + '.mp4';
  var vx3 = xlz_videos['03-close'];
  vx3.initialize(); // 偷偷初始化

  // $("#exit_0").get(0).src = './v/exit_' + panorama + '.mp4';
  
  var vx4 = xlz_videos['04-exit'];
  vx4.initialize(); // 偷偷初始化

  var border_r = -52,
    border_l = 12,
    border_u = 1.5,
    border_d = -1.5;

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

  var translateZ = (function calTranslateZ(opts) {
    return Math.round(opts.width / (2 * Math.tan(Math.PI / opts.number)))
  })({
    width: BG_WIDTH,
    number: BG_NUMBER
  })
  console.log(translateZ);


  var view = $("#bigCube");
  var viewW = view.width();
  var viewH = view.height();

  var container = $(".container"),
    bgItem;

  for (var i = 1; i <= BG_NUMBER; i++) {
    $("<div></div>").css({
      "background": (i==4 || i==5 || i==6)?("url(./image/panorama/" + panorama + "/" + i + ".png) no-repeat"):"none",
      "background-size": "100% auto",
      "position": "absolute",
      "opacity": (i==4 || i==5 || i==6)?"1":"0",
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
  $("<img></img>").attr("src", ImageFile[0])
    .css({
      "position": "absolute",
      "width": BG_WIDTH / 3,
      "height": BG_HEIGHT / 4,
      "left": BG_WIDTH / 3,
      "top": BG_HEIGHT / 2.75,
      "object-fit": "cover",
      "object-position": "center"
    })
    .appendTo("#panorama_5");
  //放置动画中的图片（不需要了）
  // $("<img></img>").attr("src", ImageFile[0])
  // .css({
  //   "position": "fixed",
  //   "width": "34.5vw",
  //   "height": "45.5vw",
  //   "left": "calc(50vw - 34.5vw / 2)",
  //   "bottom": window.screen.width * (1334/750) * 0.39 + "px",
  //   "object-fit": "cover",
  //   "object-position": "center"
  // })
  // .appendTo("#bigCube").hide();


  bgItem = container.find('div');
  // 会回归
  $("#cube").css({
    transform: "rotateX(0deg) rotateY(20deg) rotateZ(0)"
  });
  $("#share_in").css("display", "none");
  var already_ended = false;
  // 无限循环的
  var temp_func = function () {
    if(already_ended) {
      return false;
    }
    // if ($("#close_0").get(0).ended) {
    if (loop_twice == 1) {
      loop_twice++;
      $("#share_in").css("display", "block");
      $("#share_in").css("opacity", "0");
      $("#share_in").animate({ "opacity": "1" }, 1500);
      // $("#close_0").get(0).play();
    } else {
      loop_twice++;
      // $("#close_0").get(0).play();
    }
    // }
  }
  var temp_func_2 = function () {
    if(already_ended) {
      return false;
    }
    console.log("vx3 停止");
    vx3.pause();
    vx3.reset();
    // if ($("#close_0").get(0).ended) {
    already_ended = true;
    $("#view").css("background-image", "url('/image/bg/close_"+ panorama +".png')");
    //关灯视频消失，退出视频出来
    // $("#exit_0").css("display", "block");
    $("#exit_0_c").show();
    $("#close_0_c").fadeOut(1000, () => {
      // $("#audio-open").get(0).play();
      ion.sound.play("open");
      // $("#exit_0").get(0).play();
      vx4.play();
      // $("#exit_0").get(0).addEventListener("timeupdate", function () {
      vx4.option.onComplete = function () {
        vx4.reset();
        // audio.currentTime = 0;//音频重新播放
        // audio.play();
        ion.sound.play("audio");
        $(".wrap").addClass("p1-fake");
        $("#view").css("background-image", "url('/image/close_.png')");
        $(".p3").css("display", "block");//p3出来，渲染
        $(".p3 > .share_my, .p3 > .change_my").hide();
        $(".p2").fadeOut(500, ()=>{  
          $(".share_wrap").animate({ "margin-top": "0px" }, 2000, function () { });
          // $("#audio-down").get(0).play();
          ion.sound.play("down");
          $(".share_pic").empty();
          if (user_name.length > 4) {
            user_name = user_name.substr(0, 3);
            user_name = user_name + "...";
          }
          $(".share_name").html(user_name);
          $(".share_id").innerHTML = "00002";
          $("<img></img>").attr("src", ImageFile[0])
            .css({
              "width": "100%",
              "height": "100%",
              "object-fit": "cover",
              "object-position": "center"
            }).appendTo(".share_pic");
          $(".p3 > .share_my, .p3 > .change_my").fadeIn(600);
          setTimeout(()=>{$(".wrap").removeClass("p1-fake");}, 500);
          // 清理一下
          $(".p2").css('opacity', '0');
          $("#cube .container").html("");
        });
      };
    });

    // 中间照片消失
    $("#bigCube > img").fadeOut(500, ()=>{
      $("#bigCube > img").remove();
    });
      
    // }
  }
  //点击分享之后
  document.getElementById("share_in").addEventListener("click", function () {
    // $("#audio-btn").get(0).play();
    ion.sound.play("btn");
    // $("#view").css("background-image", "url('/image/bg/close_" + panorama + ".png')");
    //$("#close_0").removeAttr("loop");
    // $("#close_0").get(0).removeEventListener("timeupdate", temp_func);//关灯视频不再循环
    // $("#close_0").get(0).addEventListener("timeupdate", temp_func_2);
    vx3.option.onComplete = temp_func_2;
    $("#share_in").animate({ "opacity": "0" }, 500, function () {
      $("#share_in").css("display", "none");
    });
  });
  //点击关灯之后
  // console.log("绑定点击事件", $("#turn_off"));
  document.getElementsByClassName("p2")[0].addEventListener("click", function(e){
        var e = e || window.event;
        var elem = e.target || e.srcElement;
        while (elem) { //循环判断至跟节点，防止点击的是div子元素 
          console.log(elem);
          if (elem.id=='turn_off') { 
            console.log("!!!");
          } 
          elem = elem.parentNode; 
        }
      });
  $("#turn_off").click(function (e) {
    console.log(e.target);
    $("#view").css({
      "background-color": "black",
      "background-image": "none",
    });
    // 关灯音效
    // $("#audio-close").get(0).play();
    ion.sound.play("close");
    if (close_lock != 0) return;
    close_lock++;
    $("#turn_off").css("background-image", "url('/image/close_light.png')");
    //全景消失
    $("#turn_off").css("opacity", "1");
    $("#turn_off").animate({ "opacity": "0" }, 1500);
    $("#light_word").css("opacity", "1");
    $("#light_word").animate({ "opacity": "0" }, 1500);
    $("#panorama_4").animate({ "opacity": "0" }, 1500);
    $("#panorama_5").animate({ "opacity": "0" }, 1500);
    $("#panorama_6").animate({ "opacity": "0" }, 1500);
    setTimeout(function () {
      $("#turn_off").css("display", "none");
      $("#turn_off").css("opacity", "1");
      $("#light_word").css("display", "none");
      $("#light_word").css("opacity", "1");
      // $("#close_0").css("opacity", "0"); //视频渐亮
      // $("#close_0").css("display", "block");
      // $("#bigCube > img").fadeIn(750); // 照片不回来
      vx3.option.onComplete = temp_func;
      $("#close_0_c").fadeIn("slow", function () {
        // audio.pause();
        ion.sound.stop("audio");
        // $("#close_0").get(0).play();
        vx3.play();
        // $("#close_0").get(0).addEventListener("timeupdate", temp_func);
        already_ended = false;
      });
    }, 1500);
  });
  //点击换张照片之后
  $(".change_my").click(function () {
    // $("#audio-btn").get(0).play();
    ion.sound.play("btn");
    //解锁p2的渲染与p1的按钮
    clickTimes = 1;
    lock = 0;
    //分享UI向上动
    // $("#audio-up").get(0).play();
    ion.sound.play("up");
    $(".p3 > .share_my, .p3 > .change_my").fadeOut();
    
    $(".share_wrap").animate({ "margin-top": "-150vw" }, 2000, function () {
      $(".p3").css("display", "none");//p3消失，p1出来
      $(".p1").css("display", "block");
      $(".upload_wrap").css("display", "block");//首页ui动
      // $("#audio-down").get(0).play();
      ion.sound.play("down");
      $(".upload_wrap").animate({ "margin-top": "0px" }, 2000);
      $("#in").fadeIn();
      $("#welcome").fadeIn();
      $("#turn_off").css("display", "block");
      $("#light_word").css("display", "block");
      $("#try").css({
        "display": "block",
        "opacity": "1"
      });
      // $("#close_0").get(0).removeEventListener("timeupdate", temp_func_2);//关灯视频不再循环
      // $("#close_0").get(0).addEventListener("timeupdate", temp_func);
      vx3.option.onComplete = temp_func;
      $("#close_0_c").hide;
      // $("#exit_0").css("display", "none");
      $("#exit_0_c").hide();
      $("#share_in").css("display", "none");
      $(".share_pic").empty();
      // $("#panorama_5").empty();
      // $(".container").empty();
      $("#turn_off").css("background-image", "url('/image/turn_light.png')");
      $(".p2").css("opacity", "0");
      // $(".p2").hide();
      close_lock = 0;
      loop_twice = 0;
      right_lock = 0;
      left_lock = 0;
      try_lock = 1;
      $("#turn_off").css("display", "none");
      $("#light_word").css("display", "none");
      $("#try").css("display", "block");
      $("#try").css("opacity", "1");
      // 暂时注释掉再次随机
      // panorama = Math.floor(Math.random() * 3);
    });
  });
  $(".share_my").click(function () {
    $("#shareit").show();
    $("#share_gif").css("display", "block");
  });
  $("#shareit").on("click", function () {
    $("#shareit").hide();
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