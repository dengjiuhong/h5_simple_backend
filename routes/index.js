var express = require('express');
const qiniu = require('qiniu');
var fetch = require('node-fetch');
var fs = require('fs');
var sha1 = require('sha1');

module.exports = function (db) {
	var router = express.Router();
	/* GET home page. */
	router.get('/login', function(req, res, next){
		res.redirect("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxdeb5dc277a2c46bf&redirect_uri=http://wx.oppo.com/oppootherfirm10/&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect");
	})
	router.get('/', function(req, res, next) {
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
}
		var openid;
		var nickname;
		var time;

		var access_token;
		var app_id = "wxdeb5dc277a2c46bf";
		var app_secret = "0d26703921a9fa7e001f0128cebe14bc";
		var code = req.query.code;
		var url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid="+ app_id +"&secret="+app_secret+"&code="+code+"&grant_type=authorization_code";
		fetch(url).then(function(res){
            	return res.json();
        	}).then(function(json){
        		if(json.access_token){
        			console.log(JSON.stringify(json));
        			var config = require('./config');
        			//access_token = json.access_token;
        			access_token = config.access_token;
        			openid = json.openid;
        			time = getNowFormatDate();
        			var url_ = "https://api.weixin.qq.com/cgi-bin/user/info?access_token="+access_token+"&openid="+openid+"&lang=zh_CN";
        			fetch(url_).then(function(res){
        				return res.json();
        			}).then(function(json){
        				console.log("data_json:"+JSON.stringify(json));
        				if(json.subscribe == 1) {
        					var adminDb = db.admin();
							var collection = db.collection("subscribe_user");
							var user_data = {
								open_id : openid,
								nickname: nickname,
								time: time
							}
							console.log(JSON.stringify(user_data));
							collection.insertOne(user_data, function(err){console.log("在插入subscribe用户出错！")})
        				}
        			})
        			}
        		})

		res.render('index', { title: 'Express' });
	  });
	  
	router.post('/pic_storage', function(req, res, next) {
		var accessKey = 'T6Cuwyp-fMp9WFMN6uc8HvG6TB9mOujEmBjF9NxU';
		var secretKey = 'apGpki_F2-Ps7ZtuLjQWBEdy4PmFrTnC1R-vh-aA';
		var username = "root";
		var password = "Oppo-ZBC-db1";

		var adminDb = db.admin();
		var collection = db.collection("museum");
		var doc = {
			name: req.body.name,
			phone: req.body.phone
		};
		collection.findOne({name: req.body.name}, function(err, user) {
            if(err) {
				console.log("寻找用户出错：" + err);
				res.send({
					ok: false,
					mes: "服务器出错"
				});
				return;
			}
			if(user){
				console.log("findone!");
				collection.findOneAndUpdate({name: req.body.name}, doc, function(err) {
					if(err) {
						console.log("更新用户出错：" + err);
						res.send({
							ok: false,
							mes: "服务器出错"
						});
						return;
					} else console.log("更新成功");
				});
			} else {
				collection.insertOne(doc, function(err) {
					if(err) {
						console.log("创建用户出错：" + err);
						res.send({
							ok: false,
							mes: "服务器出错"
						});
						return;
					} 
				});
				console.log("创建用户成功！");
			}
		});
		var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
		var options = {
			scope: "pic-second" + ":" + req.body.name + ".jpg", //scope: bucket + ":" + keyToOverwrite var keyToOverwrite = 'qiniu.mp4';
		  };
		  var putPolicy = new qiniu.rs.PutPolicy(options);
		  var uploadToken=putPolicy.uploadToken(mac);
		  console.log("token:" + uploadToken);
		  res.send({
			  token : uploadToken
		  });
	  });

	router.get('/wx', function(req, res, next) {
		var result = {};
		var app_id = "wxdeb5dc277a2c46bf";
		var app_secret = "0d26703921a9fa7e001f0128cebe14bc";
		var url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + app_id + "&secret=" + app_secret;
		var currentTime = new Date().getTime();
		var config = require('./config');
		console.log("config:" + config);
		console.log("wx debug-------------------------");
		if(config.access_token === "" || config.expires_time < currentTime){ //过期了,取新的access_token与jsticket并保存
			console.log("过期");
        	fetch(url).then(function(res){
            	return res.json();
        	}).then(function(json){
        		console.log("data:" + JSON.stringify(json));
        		config.access_token = json.access_token;
        		config.expires_time = new Date().getTime() + (parseInt(json.expires_in) - 200) * 1000;
        		var ticketurl = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+ config.access_token +'&type=jsapi';
        		fetch(ticketurl).then(function(res){
            		return res.json();
        		}).then(function(json){
        			config.jsticket = json.ticket;
        			console.log("jsticket = " + config.jsticket)
        			fs.writeFile('routes/config.json',JSON.stringify(config), function(err) {
        				if(err) console.log(err);
        				console.log("新的token存储完毕!");
        			});
        		});
        	})
        }
        var config = require('./config');
        //时间戳
        var timestamp = new Date().getSeconds();
        //随机字符串
        var str= "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var random_str = ""; 
        for (var i = 0; i < 16; i++) {  
            random_str += str.substr(Math.round((Math.random() * 10)), 1);  
        }
        var signature = "";
        var string1 = 'jsapi_ticket='+config.jsticket+'&noncestr=' + random_str +'&timestamp=' + timestamp + '&url=http://oppo10.nplusgroup.net/';
        console.log("string1 = " + string1);
        signature = sha1(string1);
        console.log("signature = " + signature);
        result.appid = app_id;
        result.signature = signature;
        result.timestamp = timestamp;
        result.random_str = random_str;
        res.send(result);
	  })

	
	  

	router.get('/my_museum', function(req, res, next) {
		var accessKey = 'Hm1G1QAOH_6H-5qlnJAaXkKY9_qbvVseCJEvfjsz';
		var secretKey = '8ivHPx_1nf7ITSwkidRnp_fgL93QcEWOjUNoml70';
		var name = decodeURI(req.query.name);
		var museum = req.query.museum;
		console.log(name);
		console.log(req.query.name);
		var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
		var config = new qiniu.conf.Config();
		var bucketManager = new qiniu.rs.BucketManager(mac, config);
		var publicBucketDomain = 'oxm6vcxz3.bkt.clouddn.com';
		var publicDownloadUrl = bucketManager.publicDownloadUrl(publicBucketDomain, req.query.name + ".jpg");
		console.log(publicDownloadUrl);
		console.log(museum);
		res.render('share', { pic_url: publicDownloadUrl,  museum: museum, user_name: name});
	})
	return router;
	};