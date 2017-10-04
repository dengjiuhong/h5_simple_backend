var clickTimes = 1;
var requestTimes = 0;
var user_name = "test";
var user_phone = "test";
var Qiniu_UploadUrl = "http://up.qiniu.com";
var panorama = 0;//0~3
var lock = 0;

// 顶栏高度
var topHeight = window.screen.height - window.innerHeight;
alert(topHeight);


$(document).ready(function(){
  panorama = Math.floor(Math.random()*3);
  preload(panorama);

  $(".p0").fadeIn("fast");
  var v = $("#my_video_1");
  var v2 = $("#my_video_2");
  v.fadeIn("fast");
  $(".p0").click(function(){
    v.get(0).play();
  });
  v.get(0).addEventListener("timeupdate",function(){
    if(v.get(0).ended){
        v.css("display", "none");
       //v2.fadeIn("fast");
       $(".p0").css("display", "none");
       $(".p1").css("display", "block");
       $(".upload_wrap").animate({"margin-top": "" + (0-topHeight) + "px"}, 3000);
       $(".upload_wrap_background").css("margin-top", "" + topHeight + "px");
       //v2.get(0).play();
    }
  });
    $("#in").click(function(){
      v2.get(0).play();
      v2.get(0).pause();
      setTimeout(function(){
            $(".p1").css("display", "none");
            $(".p0").css("display", "block");
            v2.css("display", "block");
            v2.get(0).play();
        },3000);
      $(".upload_wrap").animate({"margin-top": "-470px"}, 3000, function(){});
      v2.get(0).addEventListener("timeupdate",function(){
        if(v2.get(0).ended){
          v2.css("display", "none");
           //v2.fadeIn("fast");
          $(".p0").css("display", "none");
          $(".p2").fadeIn("fast");
          if(!lock) {page2(); lock++;}
        }
      })     
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
});

function preload(panorama) {
  for(var i = 4; i < 7; i++) {
    $("<img></img>").attr("src", "./image/panorama/" + panorama + "/"+ i +".png")
    .css("display", "none").appendTo(".p0");

  };

function page2() {
    $('body').on('touchmove', function(event) {
      event.preventDefault();
    });
    $("#close_0").get(0).src = './v/close_' + panorama + '.mp4';
    $("#exit_0").get(0).src = './v/exit_' + panorama + '.mp4';
    var border_r = -52,
        border_l = 12,
        border_u = 3,
        border_d = -1.5;


    var BG_WIDTH = 1000,
      BG_HEIGHT = 1750,
      BG_NUMBER = 9,
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
        "width": BG_WIDTH,
        "height": BG_HEIGHT,
        "left": (viewW - BG_WIDTH) / 2,
        "top": (viewH - BG_HEIGHT) / 2,
        "transform": "rotateY(" + (180 - i * PER_ANGLE) + "deg) translateZ("+ (-translateZ +2 ) +"px)", // translateZ + 10 是为了去掉模模块间的缝隙
        // "backface-visibility": "hidden"
      }).attr('id',"panorama_" + i).appendTo(".container");
    }

    //放置图片
    $("<img></img>").attr("src", ImageFile[0])
    .css({
      "position": "absolute",
      "width": BG_WIDTH / 3,
      "height": BG_HEIGHT / 3.8,
      "left": BG_WIDTH / 3,
      "top": BG_HEIGHT / 2.7,
    })
    .appendTo("#panorama_5");


    bgItem = container.find('div');
    $("#cube").css({
      transform: "rotateX(0deg) rotateY(20deg) rotateZ(0)"
    });
    $("#share_in").css("display", "none");
    document.getElementById("share_in").addEventListener("click", function() {
        console.log(user_name);
        $("#close_0").get(0).pause();
        $("#close_0").css("display", "none");
        $("#exit_0").css("display", "block");
        $("#exit_0").get(0).play();
        $("#exit_0").get(0).addEventListener("timeupdate",function(){
        if($("#exit_0").get(0).ended){
            $(".p2").css("display", "none");
            $(".p3").css("display", "block");
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
    }, true);

    $("#close").click(function() {
      $("#close").css("display", "none");
      $("#close_0").css("display", "block");
      $("#share_in").css("display", "block");
      $("#close_0").get(0).play();
      $("#close_0").get(0).addEventListener("timeupdate",function(){
        if($("#close_0").get(0).ended){
          $("#close_0").get(0).play();
        }
      })   
    });

    $(".change_my").click(function() {
      clickTimes = 1;
      lock = 0;
      $(".upload_wrap").animate({"margin-top": "" + (0-topHeight) + "px"}, 3000, function(){});
      $(".p3").css("display", "none");
      $(".p1").css("display", "block");
      $("#close_0").get(0).pause();
      $("#close_0").css("display", "none");
      $("#exit_0").css("display", "none");
      $("#share_in").css("display", "none");
      $("#close").css("display", "block");
      $(".share_pic").empty();
      $("#panorama_5").empty();
      $(".container").empty();
      panorama = Math.floor(Math.random()*3);
      preload(panorama);
    })
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
      } else if(tempy > border_u) {
        beyond_3 = true;
      } else if(tempy < border_d) {
        beyond_4 = true;
      }
       else {
        beyond_1 = false;
        beyond_2 = false;
        beyond_3 = false;
        beyond_4 = false;
        curBgAngleX += (aimAngleX - curBgAngleX) * 0.8;
        curBgAngleY += (aimAngleY - curBgAngleY) * 0.8;
        $("#cube").css({
        transform: "rotateX(" + (curBgAngleY) + "deg) rotateY(" + -curBgAngleX + "deg) rotateZ(0)"
        //transform: "rotateX(-1.56685deg) rotateY(55.9531deg) rotateZ(0deg)"
      });
      }
      frameTimer = requestAnimationFrame(go);
    }
  }