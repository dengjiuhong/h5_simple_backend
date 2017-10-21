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

$(document).ready(function () {
  if(IsPC()) {
    $("#pc_qrcode").css("display", "block");
    return;
  }
  $(".wrap").addClass("p0-fake");
   $(".page.loading").show();
  var items = [
    'http://oppofans-1252859479.file.myqcloud.com/public/image/close.png',
    'http://oppofans-1252859479.file.myqcloud.com/public/image/new_brand.png',
    'http://oppofans-1252859479.file.myqcloud.com/public/image/brand_.png',
    'http://oppofans-1252859479.file.myqcloud.com/public/image/close_.png',
    'http://oppofans-1252859479.file.myqcloud.com/public/image/try.png',
    'http://oppofans-1252859479.file.myqcloud.com/public/image/enter_mu.png',
    'http://oppofans-1252859479.file.myqcloud.com/public/image/share_my.gif',
    // '/v/02-openin.mp4'
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
  $("#first_enter_box").click(function () {
   alert("end1");
  });
}