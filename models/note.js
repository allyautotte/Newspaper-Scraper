var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// creates a new schema
var NoteSchema = new Schema({
	articleId: {
		type: String
	},
	body: {
		type: String
	}
});

var Note = mongoose.model("Note", NoteSchema);

//export the note module
module.exports = Note;