var express = require('express');
const qiniu = require('qiniu');


module.exports = function (db) {
	var router = express.Router();
	/* GET home page. */
	router.get('/', function(req, res, next) {
		res.render('index', { title: 'Express' });
	  });
	  
	router.post('/pic_storage', function(req, res, next) {
		console.log("进来了");
		var accessKey = 'Hm1G1QAOH_6H-5qlnJAaXkKY9_qbvVseCJEvfjsz';
		var secretKey = '8ivHPx_1nf7ITSwkidRnp_fgL93QcEWOjUNoml70';
		var username = "root";
		var password = "Oppo-ZBC-db1";

		var adminDb = db.admin();
		adminDb.authenticate(username, password, function(err, result) {
				if(err) {
					console.error("authenticate err:", err);
					return 1;
				}
		});
		var collection = db.collection("museum");
		var doc = {
			name: req.body.name,
			phone: req.body.phone
		}
		collection.insertOne(doc, function(err, data) {
            if(err) {
                console.error("insert err:", err);
                return 1;
			} else {
				console.log("插入成功！");
			}
		});
		var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
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
	  
	  return router;
};

	/*UserModel.findOne({name: req.body.name}, function(err, user){
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
	});*/
 
/*var adminDb = db.admin();
adminDb.authenticate(username, password, function(err, result) {
        if(err) {
            console.error("authenticate err:", err);
            return 1;
        }
//取得Collecton句柄
var collection = db.collection(demoColl);
var demoName = "NODE:" + uuid.v1();
var doc = {"DEMO": demoName, "MESG": "Hello AliCoudDB For MongoDB"};
console.info("ready insert document: ", doc);
// 插入数据
 collection.insertOne(doc, function(err, data) {
            if(err) {
                console.error("insert err:", err);
                return 1;
            }
            console.info("insert result:", data["result"]);
 // 读取数据
 var filter = {"DEMO": demoName};
 collection.find(filter).toArray(function(err, items) {
                if(err) {
                    console.error("find err:", err);
                    return 1;
                }
                console.info("find document: ", items);
//关闭Client，释放资源
                db.close();
            });
        });
    });*/
