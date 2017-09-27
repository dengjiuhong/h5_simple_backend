(function(){
    console.log("ready");
})();
var clickTimes = 1;
var requestTimes = 0;
var name = "test";
var Qiniu_UploadUrl = "http://up.qiniu.com";
var panorama = 0;//0~3


$(document).ready(function(){
    $("#in").click(function(){
        $(".p1").fadeOut("fast");
        $(".p2").fadeIn("fast");
        console.log(ImageFile[0]);
        panorama = Math.floor(Math.random()*3);
        page2();        
    });
});


function requestPic() {
    console.log("file = " + picfile);
    if(picfile == null) {
        console.log("文件为空");
    }
    else {
        $.ajax({
            url: 'http://localhost:3000/pic_storage', 
            type: 'POST',
            timeout: 15000,
            data: {
                name: name,
                phone : "tel"
            },
            success: function (data) {
                Qiniu_upload(picfile, data.token, name + ".jpg");
            },
            error: function(xhr, errorType, error) {
                console.log("出错！" + error);
                clickTimes = 1;
            },
        });
    }

}
function upload_click() {
    console.log("click");
    console.log($("#test").val());
    console.log("clickTimes" + clickTimes);
        if(clickTimes == 1) {
            clickTimes++;
            requestTimes++;
            console.log("clickTimes" + clickTimes);
            requestPic();
        }
}

function Qiniu_upload(f, token, key) {
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

function page2(){
    $('body').on('touchmove', function(event) {
      event.preventDefault();
    });

    var border_r = -52,
        border_l = 12,
        border_u = 1.5,
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
        curBgAngleX += (aimAngleX - curBgAngleX) * 0.5;
        curBgAngleY += (aimAngleY - curBgAngleY) * 0.5;
        console.log(curBgAngleX);
        $("#cube").css({
        transform: "rotateX(" + (curBgAngleY) + "deg) rotateY(" + -curBgAngleX + "deg) rotateZ(0)"
        //transform: "rotateX(-1.56685deg) rotateY(55.9531deg) rotateZ(0deg)"
      });
      }
      frameTimer = requestAnimationFrame(go);
    }
  }