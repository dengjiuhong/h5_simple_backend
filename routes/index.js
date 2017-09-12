var express = require('express');
var router = express.Router();
const qiniu = require('qiniu');

//database
const mongoose = require('mongoose');
const conn = mongoose.museum_conn;
const UserSchema = require('../model/user');
const UserModel = conn.model('users', UserSchema);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/pic_storage', function(req, res, next) {
	console.log("进来了");
	var accessKey = 'Hm1G1QAOH_6H-5qlnJAaXkKY9_qbvVseCJEvfjsz';
	var secretKey = '8ivHPx_1nf7ITSwkidRnp_fgL93QcEWOjUNoml70';
	var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

	UserModel.findOne({name: req.body.name}, function(err, user){
		if(err) {
			console.log("寻找用户出错：" + err);
			res.send({
                ok: false,
                mes: "服务器出错"
            });
            return;
		}
		if(user) {
			UserModel.findOneAndUpdate(
			{
				name: req.body.name
			},
			{
				name: req.body.name,
				phone: req.body.phone
			},
			function(err) {
				if(err) {
					console.log("findOneAndUpdate出错：" + err);
					res.send({
                		ok: false,
                		mes: "服务器出错"
            		});
				} else console.log("修改成功");
			})
		} else {
			var newuser = new UserModel();
			newuser.name = req.body.name;
			newuser.phone = req.body.phone;
			newuser.save(function(err){
				if(err){
					console.log("数据上传失败：" + err);
					res.send({
						ok : false,
						mes : "数据上传失败"
					});
				}
			});
			console.log("用户信息上传成功!");
		}
	});


	var options = {
  		scope: "simplepicstor" + ":" + req.body.name + ".jpg", //scope: bucket + ":" + keyToOverwrite var keyToOverwrite = 'qiniu.mp4';
	};
	var putPolicy = new qiniu.rs.PutPolicy(options);
	var uploadToken=putPolicy.uploadToken(mac);
	console.log("token:" + uploadToken);
	console.log(req.body);
	res.send({
		token : uploadToken
	});
});

module.exports = router;
