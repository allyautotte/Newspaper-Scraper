var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//creates a new schema
var ArticleSchema = new Schema ({
	title: {
		type: String,
		required: true,
		unique: true
	},
	link: {
		type: String,
		required: true
	}
});

var Article = mongoose.model("Article", ArticleSchema);

//export the article module
module.exports = Article;