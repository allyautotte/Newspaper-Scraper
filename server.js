var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");
var Article = require("./models/Article.js");
var Note = require("./models/Note.js");
var Promise = require("bluebird");
mongoose.Promise=Promise;
var PORT = process.env.PORT || 8000;

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(express.static("public"));

// configure database
// mongoose.connect("mongodb://localhost/Newspaper-Scraper");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);
var db = mongoose.connection;

db.on("error", function(err) {
	console.log("Error:", err);
});

db.once("open", function() {
	console.log("Connection successful");
});

//routes
app.get("/", function(req, res) {
	res.send(index.html);
});

//request to load html 
app.get("/scrape", function(req, res) {
	console.log("Scraping the latest and greatest...");
	request("https://www.reddit.com", function(error, response, html) {
		var $ = cheerio.load(html);
		$("p.title").each(function(i, element) {
			var result = {};
			result.title = $(this).children("a").text();
			result.link = $(this).children("a").attr("href");

			var entry = new Article (result);

	try {
		entry.save(function(err, doc) {
			console.log(doc);
		});
	} catch (err) {
		if (err) {
			console.log(err);
		}
	}	
});

		res.redirect("/");
	});
});

//retrieve articles scraped from Mongo
app.get("/articles", function(req, res) {
	Article.find({}, function(err, doc) {
		if (err) {
			console.log(err);
		} else {
			res.json(doc);
		}
	});
});

//retrieve articles by ID
app.get("/articles/:id", function(req, res) {
	Note.find({"articleId": req.params.id})
	.exec(function(err, found) {
		if (err) {
			console.log(err);
		} else {
			res.json(found);
		}
	});
});

//post new note by ID
app.post("/articles/:id", function(req, res) {
	var newNote = new Note(req.body);
	newNote.save(function(err, doc) {
		if (err) {
			console.log(err);
		} else {
			console.log("Article Saved! Article ID: " + doc.articleId + "Note: " + doc.body);
			res.send(doc);
		}
	});
});

//delete note by ID
app.get("/delete/:id", function(req, res) {
	Note.remove({"_id": req.params.id})
	  .exec(function(err, doc) {
	  	if (err) {
	  		console.log(err);
	  	} else {
	  		console.log("Note Deleted!");
	  		res.send(doc);
	  	}
	  })
});

//delete all notes
app.get("/deleteall/:id", function(req, res) {
	Note.remove({"articleId": req.params.id})
	  .exec(function(err, doc) {
	  	if (err) {
	  		console.log(err);
	  	} else {
	  		console.log("All notes deleted!");
	  		res.send(doc);
	  	}
	  })
});


app.listen(PORT, function() {
	console.log("App listening on port " + PORT);
});
