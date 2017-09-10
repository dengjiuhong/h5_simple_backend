var express = require('express');
var router = express.Router();
const qiniu = require('qiniu');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/pic_storage', function(req, res, next) {
	console.log("进来了");
	var accessKey = 'Hm1G1QAOH_6H-5qlnJAaXkKY9_qbvVseCJEvfjsz';
	var secretKey = '8ivHPx_1nf7ITSwkidRnp_fgL93QcEWOjUNoml70';
	var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
	var options = {
  	scope: "simplepicstor", //scope: bucket + ":" + keyToOverwrite var keyToOverwrite = 'qiniu.mp4';
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
