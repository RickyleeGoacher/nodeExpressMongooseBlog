const mongoose = require('mongoose'); // Add mongoose
const bcrypt = require('bcrypt'); // Add bcrypt for passsword encryption

require('dotenv').config(); // Allow use of .env file 

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }); // Get Mongodb URI from env file 

// Check if connection has been made 
mongoose.connection.once('open', function(){
	console.log('Connection to users has been made!'); // Connected
}).on('error', function(error){
	console.log('Error is: ', error); // Error connecting
});

const Schema = mongoose.Schema;

// Create blog post schema

const UserSchema = new Schema({
	username: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model('Users', UserSchema); // Export schema