var mongoClient = require('mongodb').MongoClient;
var schedule = require('node-schedule');

var rule = new schedule.RecurrenceRule();
rule.minute = 45;

var app_id = "wxdeb5dc277a2c46bf";
var app_secret = "0d26703921a9fa7e001f0128cebe14bc";
var wxurl = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + app_id + "&secret=" + app_secret;

var url = "mongodb://root:Oppo-ZBC-db1@dds-uf6a1325246e89e41.mongodb.rds.aliyuncs.com:3717,dds-uf6a1325246e89e42.mongodb.rds.aliyuncs.com:3717/admin?replicaSet=mgset-4528113";
mongoClient.connect(url,
function(err, db) {
    //get the collection
    var collection_wx = db.collection("weixin");
    //first time get
    collection_wx.findOne({
        name: "wx"
    },
    function(err, wx) {
        if (!wx) {
            fetch(wxurl).then(function(res) {
                return res.json();
            }).then(function(json) {
                var a = json.access_token;
                var e = new Date().getTime() + (parseInt(json.expires_in) - 200) * 1000;
                var js = "";
                var ticketurl = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + a + '&type=jsapi';
                fetch(ticketurl).then(function(res) {
                    return res.json();
                }).then(function(json) {
                    js = json.ticket;
                    var doc = {
                        name: "wx",
                        access_token: a,
                        expires_time: e,
                        jsticket: js
                    }
                    collection_wx.insertOne(doc);
                })
            })
        }
    });
    //定时 
    var j = schedule.scheduleJob(rule,
    function() {
        fetch(wxurl).then(function(res) {
            return res.json();
        }).then(function(json) {
            var a = json.access_token;
            var e = new Date().getTime() + (parseInt(json.expires_in) - 200) * 1000;
            var js = "";
            var ticketurl = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + a + '&type=jsapi';
            fetch(ticketurl).then(function(res) {
                return res.json();
            }).then(function(json) {
                js = json.ticket;
                var doc = {
                    name: "wx",
                    access_token: a,
                    expires_time: e,
                    jsticket: js
                }
                collection_wx.updateOne({name: "wx"}, doc);
            })
        })
    });
})