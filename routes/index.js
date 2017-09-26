var express = require('express');
const qiniu = require('qiniu');
var fetch = require('node-fetch');

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
		console.log(collection);
		var doc = {
			name: req.body.name,
			phone: "123"
		};
		collection.findOne({name: req.body.name}, function(err, user) {
			console.log("2");
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
			scope: "simplepicstor" + ":" + req.body.name + ".jpg", //scope: bucket + ":" + keyToOverwrite var keyToOverwrite = 'qiniu.mp4';
		  };
		  var putPolicy = new qiniu.rs.PutPolicy(options);
		  var uploadToken=putPolicy.uploadToken(mac);
		  console.log("token:" + uploadToken);
		  res.send({
			  token : uploadToken
		  });
	  });

	  router.get('/wx', function(req, res, next) {
		var app_id = "wx9741a9cc9dd1f2dc";
		var app_secret = "b815b49903dd9ef43e5267c70ca44342";
		var url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + app_id + "&secret=" + app_secret;
		var currentTime = new Date().getTime();
		var config = require('./config');
		console.log("config:" + config);
		config.log("wx debug-------------------------");
		if(config.access_token === "" || config.expires_time < currentTime){ //过期了
			config.log("no find");
        	fetch(url).then(function(res){
            	return res.json();
        	}).then(function(json){
        		config.log("data:" + json);
        		config.access_token = json.access_token;
        		config.expires_time = new Date().getTime() + (parseInt(json.expires_in) - 200) * 1000;
        		fs.writeFile('routes/config.json',JSON.stringify(config), function(err) {
        			if(err) console.log(err);
        			console.log("access_token change!");
        		});
        	})
        }
	  })

	
	  
	  return router;


	};