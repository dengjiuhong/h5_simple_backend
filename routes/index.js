var express = require('express');
const qiniu = require('qiniu');
var fetch = require('node-fetch');
var fs = require('fs');
var sha1 = require('sha1');

var routeCache = require('route-cache');

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

module.exports = function (db) {
	// var adminDb = db.admin();
	// var collection = db.collection("museum");
	var collection_museum = db.collection("new_museum");
	var collection_subscribe_user = db.collection("subscribe_user");
	var collection_wx = db.collection("weixin");


	var router = express.Router();
	/* GET home page. */
	router.get('/', function (req, res, next) {
		res.redirect("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxdeb5dc277a2c46bf&redirect_uri=http://wx.oppo.com/oppootherfirm10/weixin&response_type=code&scope=snsapi_base#wechat_redirect");
	});
	router.get('/temp', function(req, res, next) {
		res.redirect("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxdeb5dc277a2c46bf&redirect_uri=http://wx.oppo.com/oppootherfirm10/tempwx&response_type=code&scope=snsapi_base#wechat_redirect");
	});
	router.get('/tempwx', function(req, res, next) {
		res.render('index');
	})
	router.get('/end', function(req, res, next) {
		res.render('end');
	})
	router.get('/weixin', routeCache.cacheSeconds(60), function (req, res, next) {
		res.render('end');
	});
	router.get('/weibo', routeCache.cacheSeconds(60), function (req, res, next) {
		//res.render('index_', {platform_name: "weibo"});
		res.render('end');
	});
	router.get('/oppo', routeCache.cacheSeconds(60), function (req, res, next) {
		//res.render('index_', {platform_name: "oppo"});
		res.render('end');
	});
	router.get('/office', routeCache.cacheSeconds(60), function (req, res, next) {
		//res.render('index_', {platform_name: "office"});
		res.render('end');
	});
	router.get('/brower', routeCache.cacheSeconds(60), function (req, res, next) {
		//res.render('index_', {platform_name: "brower"});
		res.render('end');
	});
	router.post('/pic_storage', function (req, res, next) {
		var accessKey = 'T6Cuwyp-fMp9WFMN6uc8HvG6TB9mOujEmBjF9NxU';
		var secretKey = 'apGpki_F2-Ps7ZtuLjQWBEdy4PmFrTnC1R-vh-aA';
		var timestamp = new Date().getTime();
		collection_museum.count(function (err, count) {
			var id = count;
			id++;
			var doc = {
				name: req.body.name,
				phone: req.body.phone,
				time: timestamp,
				id: id
			};
			collection_museum.insertOne(doc, function (err) {
				//console.log("用户数据"+JSON.stringify(doc));
				if (err) {
					//console.log("创建用户出错：" + err);
					res.send({
						ok: false,
						mes: "服务器出错"
					});
					return;
				}
			});
			var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
			var options = {
				scope: "pic-second" + ":" + req.body.name + timestamp + ".jpg", //scope: bucket + ":" + keyToOverwrite var keyToOverwrite = 'qiniu.mp4';
			};
			var putPolicy = new qiniu.rs.PutPolicy(options);
			var uploadToken = putPolicy.uploadToken(mac);
			//console.log("token:" + uploadToken);
			res.send({
				token: uploadToken,
				time: timestamp,
				id: id
			});
		});
		//console.log("创建用户成功！");
	});
	router.get("/check_wx", function(req, res, next) {
		collection_wx.findOne({name: "wx"}, function(err, wx) {
			var doc = {
				token: wx.access_token,
				time: wx.expires_time,
				datetime: new Date(wx.expires_time) + ""
			}
			res.send(doc);
		})
	});
	router.get('/wx', function (req, res, next) {
		var code = req.query.code;
		if(!code) {
			res.send({});
			return false;
		}
		// console.log(code);
		var result = {};
		var app_id = "wxdeb5dc277a2c46bf";
		var app_secret = "0d26703921a9fa7e001f0128cebe14bc";

		//时间戳
		collection_wx.findOne({name: "wx"}, function(err, wx) {
			var timestamp = new Date().getSeconds();
			var str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
			var random_str = "";
			for (var i = 0; i < 16; i++) {
				random_str += str.substr(Math.round((Math.random() * 10)), 1);
			}
			var signature = "";
			if (req.query.share) {
				if (req.query.isappinstalled == "")
					var string1 = 'jsapi_ticket=' + wx.jsticket + '&noncestr=' + random_str + '&timestamp=' + timestamp + '&url=http://oppo10.nplusgroup.net/my_museum?name=' + encodeURI(req.query.name) + '&museum=' + req.query.panorama + '&time=' + req.query.time + '&id=' + req.query.id + '&code=' + req.query.code + "&from=" + req.query.user_from;
				else var string1 = 'jsapi_ticket=' + wx.jsticket + '&noncestr=' + random_str + '&timestamp=' + timestamp + '&url=http://oppo10.nplusgroup.net/my_museum?name=' + encodeURI(req.query.name) + '&museum=' + req.query.panorama + '&time=' + req.query.time + '&id=' + req.query.id + '&code=' + req.query.code + "&from=" + req.query.user_from + "&isappinstalled=" + req.query.isappinstalled;
			}
			else {
				if (req.query.code != "") {
					var string1 = 'jsapi_ticket=' + wx.jsticket + '&noncestr=' + random_str + '&timestamp=' + timestamp + '&url=http://oppo10.nplusgroup.net/weixin?code=' + code + "&state=";
				}
				else {
					var string1 = 'jsapi_ticket=' + wx.jsticket + '&noncestr=' + random_str + '&timestamp=' + timestamp + '&url=http://oppo10.nplusgroup.net/weixin?from=' + req.query.from;
					if (req.query.isappinstalled != "") string1 += ("&isappinstalled=" + req.query.isappinstalled);
				}
			}
			signature = sha1(string1);
			result.appid = app_id;
			result.signature = signature;
			result.timestamp = timestamp;
			result.random_str = random_str;

			//存一下关注公众号的用户信息
			var subscribe_url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + app_id + "&secret=" + app_secret + "&code=" + code + "&grant_type=authorization_code";
			fetch(subscribe_url).then(function (res) {
				return res.json();
			}).then(function (json) {
				if (json.access_token) {
					// console.log(JSON.stringify(json));
					//access_token = json.access_token;
					var subscribe_access_token = wx.access_token;
					// console.log(subscribe_access_token);
					var openid = json.openid;
					var time = getNowFormatDate();
					var subscribe_url_ = "https://api.weixin.qq.com/cgi-bin/user/info?access_token=" + subscribe_access_token + "&openid=" + openid + "&lang=zh_CN";
					fetch(subscribe_url_).then(function (res) {
						return res.json();
					}).then(function (json) {
						// console.log("data_json:"+JSON.stringify(json));
						if (json.subscribe == 1) {
							// var adminDb = db.admin();
							// var collection = db.collection("subscribe_user");
							var user_data = {
								open_id: openid,
								nickname: json.nickname,
								time: time
							}
							//console.log(JSON.stringify(user_data));
							collection_subscribe_user.update({ open_id: openid }, {$set:user_data}, {upsert: true});
							/*collection_subscribe_user.findOne({ open_id: openid }, function(err, user) {
								//console.log("finding");
								if(user) {
									//console.log("find");
									collection_subscribe_user.update(user, user_data);
								} else collection_subscribe_user.insertOne(user_data);
							});*/
						}
					});
				} else {
					console.log("err json: " + json);
				}
			})
			res.send(result);
		})
	});




	router.get('/my_museum', routeCache.cacheSeconds(60), function (req, res, next) {
		res.render('share');
	});
	return router;
};