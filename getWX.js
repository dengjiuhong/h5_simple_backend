var mongoClient = require('mongodb').MongoClient;
var schedule = require('node-schedule');
var fetch = require('node-fetch');

var app_id = "wxdeb5dc277a2c46bf";
var app_secret = "0d26703921a9fa7e001f0128cebe14bc";
// var wxurl = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + app_id + "&secret=" + app_secret;

var collection_wx = null;
var db_url = "mongodb://root:Oppo-ZBC-db1@dds-uf6a1325246e89e41.mongodb.rds.aliyuncs.com:3717,dds-uf6a1325246e89e42.mongodb.rds.aliyuncs.com:3717/admin?replicaSet=mgset-4528113";
// var db_url = "mongodb://localhost";

function update_token() {
    console.log('Invoke update token');
    var token_url = 'http://wx.oppo.com/accesstoken/accesstoken.do?appkey=salewechat&token=NhJ9cohwirGL5gB5ja1kHoAuMkoJaYJe&method=accesstoken';

    fetch(token_url).then(function (res) {
        return res.json();
    }).then(function (json) {
        if(json.error_code != "0") {
            console.log(json);
            update_token();
            return false;
        }
        var a = json.access_token;
        var e = new Date().getTime() + (200) * 1000;
        var js = "";
        var ticketurl = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + a + '&type=jsapi';
        fetch(ticketurl).then(function (res) {
            return res.json();
        }).then(function (json) {
            js = json.ticket;
            var doc = {
                name: "wx",
                access_token: a,
                expires_time: e,
                jsticket: js
            }
            // collection_wx.insertOne(doc);
            console.log("updating...");
            collection_wx.update({ name: 'wx' }, doc, { upsert: true }, function(err) {
                if(!err) {
                    console.log("new token", doc);
                } else {
                    console.log(err);
                    console.log("new token failed.");
                }
            });
        })
    });
}

var rule = new schedule.RecurrenceRule();
rule.minute = [2, 12, 22, 32, 42, 52];
mongoClient.connect(db_url, function (err, db) {
    //get the collection
    collection_wx = db.collection("weixin");
    //first time get
    collection_wx.findOne({
        name: "wx"
    }, function (err, wx) {
        if (!wx) {
            update_token();
        } else {
            console.log("Old token: ", wx);
        }
    });
    //定时 
    var j = schedule.scheduleJob(rule, function () {
        update_token();
    });
});