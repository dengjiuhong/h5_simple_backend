var clickTimes = 1;
var requestTimes = 0;
var user_name = "test";
var user_phone = "test";
var Qiniu_UploadUrl = "http://up.qiniu.com";
var panorama = 0;//0~3
var lock = 0;
var audio;
var upload_lock;
var close_lock = 0;
// 顶栏高度
var topHeight = window.screen.height - window.innerHeight;
$(document).ready(function() {
  // debug //
  // $(".page.p1").show();
  // $(".upload_wrap").animate({"margin-top": "0"}, 1000);
  // $("#in, #welcome").fadeIn();
  // return false;
  // debug //

  $(".page.loading").show();
  var loader = new preload({
    items : [
      '/image/close.png',
      '/image/brand.png',
      '/image/brand_.png',
      '/image/brand_.png',
      '/image/panorama/0/4.png',
      '/image/panorama/0/5.png',
      '/image/panorama/0/6.png',
      '/image/panorama/1/4.png',
      '/image/panorama/1/5.png',
      '/image/panorama/1/6.png',
      '/image/panorama/2/4.png',
      '/image/panorama/2/5.png',
      '/image/panorama/2/6.png',
      '/v/02-openin.mp4'
    ],
    // prefix: window.location,
    onStart : function(total){
         console.log('start:' + total);
    },
    process : function(percent){
      // console.log(percent);
      if(percent > 5) {
        $('.loading > .progress > .bar').css('width', percent+'%');
      }
    },
    callback : function(total){
      $(".page.loading").fadeOut();
      main();
      // alert("加载完了！");
    }
  });
});
function judge() {
  if(picfile == null) {
    $("#welcome").css("background-image", "url('/image/error/err_pic.png')");
    upload_lock =  false;
  }
  else if($("#name").val() == ""){
    $("#welcome").css("background-image", "url('/image/error/err_name.png')");
    upload_lock =  false;
  }
  else if($('#phone').val() == "") {
    $("#welcome").css("background-image", "url('/image/error/err_phone.png')");
    upload_lock =  false;
  }
  else upload_lock =  true;
}
function main() {
  panorama = Math.floor(Math.random()*3);
  preload(panorama);
  $(".p0").fadeIn("fast");
  var v = $("#my_video_1");
  var v2 = $("#my_video_2");
  v.fadeIn("fast");
  $("#first_enter_box").click(function(){
    audio = document.getElementById("audio-bg");
    audio.play();
    v.get(0).play();
    $(".wrap").addClass("p1-fake");
    $("#first_enter_box").fadeOut();
  });
  v.get(0).addEventListener("timeupdate",function(){
    if(v.get(0).ended){
      $(".p1").css("display", "block");
      $(".p0").css("display", "none");
      // 移除防止闪频的东西
      setTimeout(function() {
        $(".wrap").removeClass("p1-fake");
      }, 1000);
      $(".upload_wrap").animate({"margin-top": "0"}, 3000);
      $("#in, #welcome").fadeIn();
      //v2.get(0).play();
    }
  });
    $("#in").click(function(){
      judge();
      if(!upload_lock) return;
      v2.get(0).play();
      v2.get(0).pause();
      setTimeout(function(){
            $(".p1").css("display", "none");
            $(".p3").css("display", "none");
            $(".p0").css("display", "block");
            v2.css("display", "block");
            v2.get(0).play();
        },2000);
      $("#in").fadeOut();
      $("#welcome").fadeOut();
      $(".upload_wrap").animate({"margin-top": "-120vw"}, 2000, function(){
        $(".upload_wrap").css("display", "none");
      });
      $("#in, #welcome").fadeOut();
      v2.get(0).addEventListener("timeupdate",function(){
        if(v2.get(0).ended){
          v2.css("display", "none");
           //v2.fadeIn("fast");
          $(".p0").css("display", "none");
          $(".p2").css("display", "block");
          $(".p2").animate({"opacity": "1"}, 750);
          if(!lock) {page2(); lock++;}
        }
      })
      if(clickTimes == 1 && upload_lock) {
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
      success: function(data){
        console.log(JSON.stringify(data));
        wx_data = data;
        wx_process(wx_data);
      }
    });
}

function preload(panorama) {
  for(var i = 4; i < 7; i++) {
    $("<img></img>").attr("src", "./image/panorama/" + panorama + "/"+ i +".png")
    .css("display", "none").appendTo(".p0");
  }
};
function wx_process(data) {
  wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appid, // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.random_str, // 必填，生成签名的随机串
            signature: data.signature,// 必填，签名，见附录1
            jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
  wx.ready(function(){
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
    if(picfile == null) {
        console.log("文件为空");
    }
    else {
        $.ajax({
            url: 'http://101.132.91.4:80/pic_storage', 
            type: 'POST',
            timeout: 15000,
            data: {
                name: $("#name").val(),
                phone : $("#phone").val()
            },
            success: function (data) {
                Qiniu_upload(picfile, data.token, $("#name").val() + ".jpg");
            },
            error: function(xhr, errorType, error) {
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
            
            

            xhr.onreadystatechange = function(response) {
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
    $('body').on('touchmove', function(event) {
      event.preventDefault();
    });
    $("#close_0").get(0).src = './v/close_' + panorama + '.mp4';
    $("#exit_0").get(0).src = './v/exit_' + panorama + '.mp4';
    var border_r = -52,
        border_l = 12,
        border_u = 1.5,
        border_d = -1.5;

    if($("#bigCube").height() >= 650) {
      var BG_WIDTH = 1000,
      BG_HEIGHT = 1750;
      $("#view").css("perspective", "1060px");
    }else {
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
        "background": "url(./image/panorama/" + panorama + "/"+ i +".png) no-repeat",
        "background-size": "100% auto",
        "position": "absolute",
        "opacity": "0",
        "width": BG_WIDTH,
        "height": BG_HEIGHT,
        "left": (viewW - BG_WIDTH) / 2,
        "top": (viewH - BG_HEIGHT) / 2,
        "transform": "rotateY(" + (180 - i * PER_ANGLE) + "deg) translateZ("+ (-translateZ +2 ) +"px)", // translateZ + 10 是为了去掉模模块间的缝隙
        // "backface-visibility": "hidden"
      }).attr('id',"panorama_" + i).appendTo(".container");
    }
    $("#panorama_4").css("opacity", "1");
    $("#panorama_5").css("opacity", "1");
    $("#panorama_6").css("opacity", "1");
    //放置图片
    $("<img></img>").attr("src", ImageFile[0])
    .css({
      "position": "absolute",
      "width": BG_WIDTH / 3,
      "height": BG_HEIGHT / 3.9,
      "left": BG_WIDTH / 3,
      "top": BG_HEIGHT / 2.75,
    })
    .appendTo("#panorama_5");


    bgItem = container.find('div');
    $("#cube").css({
      transform: "rotateX(0deg) rotateY(20deg) rotateZ(0)"
    });
    $("#share_in").css("display", "none");
    var temp_func = function() {
          if($("#close_0").get(0).ended){
                $("#close_0").get(0).play();
              }
        }
    var temp_func_2 = function() {
          if($("#close_0").get(0).ended){
            $("#close_0").get(0).pause();
            $("#close").css("display", "none");
            $("#light_word").css("display", "none");
            $("#close_0").css("display", "none");//关灯视频消失，退出视频出来
            $("#exit_0").css("display", "block");
            $("#exit_0").get(0).play();
            $("#exit_0").get(0).addEventListener("timeupdate",function(){
            if($("#exit_0").get(0).ended){
                audio.currentTime = 0;//音频重新播放
                audio.play();
                $(".p2").css("display", "none");
                $(".p3").css("display", "block");//p3出来，渲染
                $(".share_wrap").animate({"margin-top": "" + (0-topHeight) + "px"}, 3000, function(){});
                $(".share_pic").empty();
                $(".share_name").html(user_name);
                $(".share_id").innerHTML = "00002";
                $("<img></img>").attr("src", ImageFile[0])
                .css({
                  "width" : "100%",
                  "height" : "100%"
                }).appendTo(".share_pic");
              }
            }) 
          }
    }
    //点击分享之后
    document.getElementById("share_in").addEventListener("click", function() {
        //$("#close_0").removeAttr("loop");
        $("#close_0").get(0).removeEventListener("timeupdate",temp_func);//关灯视频不再循环
        $("#close_0").get(0).addEventListener("timeupdate", temp_func_2); 
    }, true);
    //点击关灯之后
    $("#close").click(function() {
      if(close_lock != 0) return;
      close_lock++;
      $("#close").css("background-image", "url('/image/close_light.png')")
      $("#close_0").get(0).play();//加载两个视频
      $("#close_0").get(0).pause();
      $("#exit_0").get(0).play();
      $("#exit_0").get(0).pause();
      //全景消失
      $("#panorama_4").animate({"opacity": "0"}, 1500);
      $("#panorama_5").animate({"opacity": "0"}, 1500);
      $("#panorama_6").animate({"opacity": "0"}, 1500);
      setTimeout(function() {
          $("#close_0").css("opacity", "0"); //视频渐亮
          $("#close_0").css("display", "block");
          $("#close_0").animate({"opacity": "1"}, 750, function() {
            $("#share_in").css("display", "block");
            audio.pause();
            $("#close_0").get(0).play();
            $("#close_0").get(0).addEventListener("timeupdate", temp_func)
        });
      }, 1500);  
    });
    //点击换张照片之后
    $(".change_my").click(function() {
      //解锁p2的渲染与p1的按钮
      clickTimes = 1;
      lock = 0;
      //分享UI向上动
      $(".share_wrap").animate({"margin-top": "-470px"}, 3000, function(){
        $(".p3").css("display", "none");//p3消失，p1出来
        $(".p1").css("display", "block");
        $(".upload_wrap").css("display", "block");//首页ui动
        $(".upload_wrap").animate({"margin-top": "0px"}, 3000);
        $("#in").fadeIn();
        $("#welcome").fadeIn();
        $("#close").css("display", "block");
        $("#light_word").css("display", "block");
        $("#close_0").get(0).removeEventListener("timeupdate",temp_func_2);//关灯视频不再循环
        $("#close_0").get(0).addEventListener("timeupdate", temp_func);
        $("#close_0").css("display", "none");
        $("#exit_0").css("display", "none");
        $("#share_in").css("display", "none");
        $(".share_pic").empty();
        $("#panorama_5").empty();
        $(".container").empty();
        $(".p2").css("opacity","0");
        close_lock = 0;
        panorama = Math.floor(Math.random()*3);
      });
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
      function(callback) {
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
      timeoutTimer = setTimeout(function(){
        window.cancelAnimationFrame(frameTimer)
      }, 2500);
    }

    

    var aimAngleX = -20,aimAngleY = 0;
    var curBgAngleX = -20, curBgAngleY = 0;
    var curItemAngleX = 0, curItemAngleY = 0;
        
    function dragRotate(evtInfo) {
      //left right up down:1234
      // 注意：rotateX(Y) 与 鼠标（触摸）的X（Y）轴是交叉对应的
      var tx = ( 180 / Math.PI * (Math.atan((curMouseX - lastMouseX) / translateZ)) + lastAngleX );
      var ty = Math.max(-60, Math.min((180 / Math.PI * Math.atan((curMouseY - lastMouseY) / (Math.sqrt(Math.pow(BG_HEIGHT / 2, 2) + Math.pow(translateZ, 2))*1.5)) + lastAngleY), 60));
      if(beyond_1) {
        if(tx < curBgAngleX) {
          beyond_1 = false;
          aimAngleX = tx;
          aimAngleY = ty;
        }
      } else if(beyond_2) {
        if(tx > curBgAngleX) {
          beyond_2 = false;
          aimAngleX = tx;
          aimAngleY = ty;
        }
      } else if(beyond_3) {
        if(ty < curBgAngleY) {
          beyond_3 = false;
          aimAngleX = tx;
          aimAngleY = ty;
        }
      } else if(beyond_4) {
        if(ty > curBgAngleY) {
          beyond_4 = false;
          aimAngleX = tx;
          aimAngleY = ty;
        }
      }
       else {
        // aimAngleX(Y)的值是通过【拖拽位移换算为相应角度得到】
        aimAngleX = ( 180 / Math.PI * (Math.atan((curMouseX - lastMouseX) / translateZ)) + lastAngleX )
        // console.log((180 / Math.PI * Math.atan((curMouseY - lastMouseY) / (Math.sqrt(Math.pow(panoBgItemH / 2, 2) + Math.pow(translateZ, 2))*1.5)) + lastAngleY), 30)
        // 限制上下旋转监督在30°以内
        aimAngleY = Math.max(-60, Math.min((180 / Math.PI * Math.atan((curMouseY - lastMouseY) / (Math.sqrt(Math.pow(BG_HEIGHT / 2, 2) + Math.pow(translateZ, 2))*1.5)) + lastAngleY), 60))
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
      if(tempx > border_l) {
        beyond_1 = true;
      } else if(tempx < border_r) {
        beyond_2 = true;
      }
       else {
        beyond_1 = false;
        beyond_2 = false;
        beyond_3 = false;
        beyond_4 = false;
        curBgAngleX += (aimAngleX - curBgAngleX) * 0.8;
        //curBgAngleY += (aimAngleY - curBgAngleY) * 0.8;
        $("#cube").css({
        transform: "rotateX(" + (curBgAngleY) + "deg) rotateY(" + -curBgAngleX + "deg) rotateZ(0)"
        //transform: "rotateX(-1.56685deg) rotateY(55.9531deg) rotateZ(0deg)"
      });
      }
      frameTimer = requestAnimationFrame(go);
    }
  }