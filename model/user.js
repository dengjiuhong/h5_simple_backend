var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
	name: { type: String, default: "未填写" },
	phone: { type: String, default: "未填写" }
});

module.exports = UserSchema;