var mongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017";
var startid = 104927;
var endid = 120389;
mongoClient.connect(url, function(err, db) {
	var collection_museum = db.collection("new_museum");
	for(var i = startid; i < endid; i++) {
		(function(){
			collection_museum.findOne({id: i}, function(err, user) {
				if(!user || user.url) return;
				var id = user.id;
				var name = user.name;
				var time = user.time;
				var unixTimestamp = new Date(time);
				commonTime = unixTimestamp.toLocaleString()
				var doc = {
					id: user.id,
					name: user.name,
					phone: user.phone,
					time: commonTime,
					url: "oxm6vcxz3.bkt.clouddn.com/"+name+time+".jpg"
				}
				console.log(JSON.stringify(doc));
				collection_museum.update({id: id}, {$set:doc}, {upsert: true}, function() {
					console.log("id:" + id + "done");
				});
			})
		})(i);
	}
	console.log("end,thx");
})