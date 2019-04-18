const express = require('express'); // Require express
const app = express(); // Asign expess to the variable app
const blogRoute = require('./src/routes/api/blog');
const usersRoute = require('./src/routes/api/users');
const bodyParser = require('body-parser'); // Body parser for parsing JSON
const router = express.Router(); // Routing
const path = require('path');
const exbs = require('express-handlebars'); // Require handle bars
const passport = require('passport'); // Require passport
const flash = require('express-flash'); // Flash messaging
const session = require('express-session');
const helmet = require('helmet');

app.use(helmet());

app.engine('handlebars', exbs( {
	layoutsDir: __dirname + '/views'
}));

// Flash connection
app.use(flash());

// Passport for authentification
require('./config/passport')(passport);

app.use(session({
	secret: process.env.SECRET,
	resave: true,
	saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Use user information
app.use(function(req, res, next) {
	res.locals.isAuthenticated = req.isAuthenticated();
	res.locals.user = req.user;
	next();
});

//Enable the view engine
app.set('view engine', 'handlebars'); // Set the view engine to handlebars
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }))

// Enable use of static file like css or js
app.use(express.static(path.join(__dirname, 'src/public')));

// Use blog route
app.use('/post', blogRoute);
//Use user route
app.use('/users', usersRoute);
//Use index route
app.use('/', require('./src/routes/api/index'))
// Set PORT variable
const PORT = process.env.PORT || 3000;

// Listen for the PORT and log the port to the console
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));