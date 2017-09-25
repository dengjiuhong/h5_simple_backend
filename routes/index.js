var express = require('express');
const qiniu = require('qiniu');


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

	
	  
	  return router;
};