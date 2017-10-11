var express = require('express');
const qiniu = require('qiniu');
var fetch = require('node-fetch');
var fs = require('fs');
var sha1 = require('sha1');

module.exports = function (db) {
	var router = express.Router();
	/* GET home page. */
	router.get('/', function(req, res, next) {
		res.render('index', { title: 'Express' });
	  });
	  
	router.post('/pic_storage', function(req, res, next) {
		var accessKey = 'Hm1G1QAOH_6H-5qlnJAaXkKY9_qbvVseCJEvfjsz';
		var secretKey = '8ivHPx_1nf7ITSwkidRnp_fgL93QcEWOjUNoml70';
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
		var app_id = "wx9741a9cc9dd1f2dc";
		var app_secret = "b815b49903dd9ef43e5267c70ca44342";
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
		var name = req.query.name;
		var museum = req.query.museum;
		var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
		var config = new qiniu.conf.Config();
		var bucketManager = new qiniu.rs.BucketManager(mac, config);
		var publicBucketDomain = 'oxm6vcxz3.bkt.clouddn.com';
		var publicDownloadUrl = bucketManager.publicDownloadUrl(publicBucketDomain, name + "jpg");
		console.log(publicDownloadUrl);
		res.render('share', { pic_url: publicDownloadUrl,  museum: museum});
	})
	return router;
	};