const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // Add mongoose
const BlogPost = require('../../models/blog-post'); // Import schema

const { ensureAutenticated } = require('../../../config/auth'); // require authentification to allow access if logged in

router.get('/dashboard', ensureAutenticated, (req, res, next) => {
    BlogPost.find(function(err, content) {
      res.render('admindash', { contents: content });
  });
});

router.get('/', (req, res) => {
	BlogPost.find(function(err, content) {
      res.render('home', { contents: content });
  });
});

module.exports = router;