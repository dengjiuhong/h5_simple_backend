var platform;
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
    { name: "panorama_0_close" },
    { name: "panorama_1_close" },
    { name: "panorama_2_close" },
    { name: "panorama_0_exit" },
    { name: "panorama_1_exit" },
    { name: "panorama_2_exit" },
  ],
  path: "http://oppofans-1252859479.file.myqcloud.com/public/audio/",
  // path: "/audio/",
  preload: true
});
function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}
function GetQueryString(name) { 
var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i"); 
var r = window.location.search.substr(1).match(reg); 
if (r!=null) return (r[2]); return null; 
}
function platform_tongji (i1, i2, i3, i4, i5) {
  if(platform == "weixin") {
    (function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?" + i1;
    var s = document.getElementsByTagName("script")[0]; 
    s.parentNode.insertBefore(hm, s);
    })();
  } else if(platform == "weibo") {
    (function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?" + i2;
    var s = document.getElementsByTagName("script")[0]; 
    s.parentNode.insertBefore(hm, s);
    })();
  } else if(platform == "oppo") {
    (function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?" + i3;
    var s = document.getElementsByTagName("script")[0]; 
    s.parentNode.insertBefore(hm, s);
    })();
  } else if(platform == "office") {
    (function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?" + i4;
    var s = document.getElementsByTagName("script")[0]; 
    s.parentNode.insertBefore(hm, s);
    })();
  } else if(platform == "brower") {
    (function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?" + i5;
    var s = document.getElementsByTagName("script")[0]; 
    s.parentNode.insertBefore(hm, s);
    })();
  }
}
$(document).ready(function () {
  if(IsPC()) {
    $("#pc_qrcode").css("display", "block");
    return;
  }
    var wx_data = {};
  $.ajax({
    url: 'http://101.132.91.4:80/wx',
    type: 'GET',
    data: {
        code: GetQueryString("code"),
        from: GetQueryString("from"),
        isappinstalled: GetQueryString("isappinstalled")
    },
    success: function (data) {
      console.log(JSON.stringify(data));
      wx_data = data;
      wx_init(wx_data);
    }
  });
  platform_tongji('67cf89986a8e57fb5379acf7703a9307', 
                  '815407bda8688533777910567dbd043b',
                  'bdb94e6419f0b4afbf08b72afd2b53ed',
                  'b3f12f40f2e21e8affcd7fa06f3a4f4e',
                  'e3cc7607feeff034aade4f25958e872d');
  $(".wrap").addClass("p0-fake");
   $(".page.loading").show();
  var items = [
    'http://oppofans-1252859479.file.myqcloud.com/public/image/end/end_wrap.png',
    "http://oppofans-1252859479.file.myqcloud.com/public/image/first_enter.png"
  ];
  setTimeout(function() {
    var loader = new preload({
    items: items,
    timeout: 120,
    // prefix: window.location,
    onStart: function (total) {
      console.log('start:' + total);
    },
    process: function (percent) {
      // console.log(percent);
      if (percent > 5) {
        $('.loading .progress > .bar').css('width', percent + '%');
      }
    },
    callback: function (total) {
      $(".page.loading").fadeOut();
      main();
      // alert("加载完了！");
    }
  });
  }, 1000);
});
function main() {
  $(".p0").fadeIn("fast");
  $("#first_enter_box").click(function () {
   $("#end_page").show();
  });
  $("#end_page_btn").click(function() {
    if(isWeiXin()) {
      WeixinJSBridge.call('closeWindow');
    }
    else {
      CloseWebPage();
    }
  })
}
function wx_init(data) {
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
      title: 'R11s新品发布会招募中', // 分享标题
      link: 'http://wx.oppo.com/oppootherfirm10/',
      imgUrl: "http://oppo10.nplusgroup.net/image/500px.jpg", // 分享图标
      success: function () {
        // 用户确认分享后执行的回调函数
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
      }
    });
    wx.onMenuShareAppMessage({
      title: 'R11s新品发布会招募中', // 分享标题
      desc: '你确定不来吗？', // 分享描述
      link: 'http://wx.oppo.com/oppootherfirm10/',
      imgUrl: "http://oppo10.nplusgroup.net/image/500px.jpg", // 分享图标
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
function isWeiXin(){ 
var ua = window.navigator.userAgent.toLowerCase(); 
if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
return true; 
}else{ 
return false; 
} 
} 
function CloseWebPage(){
var userAgent = navigator.userAgent;
if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") !=-1) { 
window.location.href="about:blank";window.close();
}else if(userAgent.indexOf('Android') > -1 || userAgent.indexOf('Linux') > -1){ 
window.opener=null;window.open("about:blank",'_self','').close();
}else { 
window.opener = null;
window.open("about:blank", '_self'); 
window.close();
} 
}