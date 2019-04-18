const mongoose = require('mongoose'); // Add mongoose

require('dotenv').config(); // Allow use of .env file 

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }); // Get Mongodb URI from env file 

// Check if connection has been made 
mongoose.connection.once('open', function(){
	console.log('Connection has been made!'); // Connected
}).on('error', function(error){
	console.log('Error is: ', error); // Error connecting
});

const Schema = mongoose.Schema;

// Create blog post schema

const BlogPostSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	image: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	url: {
		type: String,
		required: true
	},
	created: { 
        type: Date,
        default: Date.now
    },
    author: {
    	type: String
    }
});

module.exports = mongoose.model('Blog', BlogPostSchema); // Export schema