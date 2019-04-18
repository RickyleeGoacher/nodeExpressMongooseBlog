const BlogPost = require('../../models/blog-post'); // Import schema
const express = require('express'); 
const router = express.Router(); // Use router
const mongoose = require('mongoose'); // Add mongoose
const { ensureAutenticated } = require('../../../config/auth');
mongoose.set('useFindAndModify', false); // Stop FindAndModify depreciation error
const path = require('path');
const upload = require('../../services/image-upload');
// Get create post page

router.get('/create', (req, res) => {
  res.render("create-post");
});

// Get blog posts

router.get('/blogPost', (req, res, next) => {
    BlogPost.find(function(err, content) {
      res.render('blog-posts', { contents: content });
  });
});

// Get blog post by title

router.get('/blogPost/:url', (req, res) => {
	const url = req.params.url // Get url params
	// Find one post by url
	BlogPost.findOne({url: url}, (err, data) => {
		res.render('post-template', { contents: data }); // Render the template with the data found
	});
});

// get single blog post by ID

router.get('/edit/:id', ensureAutenticated, (req, res) => {
    BlogPost.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("update-post", {
                contents: doc
            });
        }
    });
});

// Post blog post || Update blog post

router.post('/', ensureAutenticated, (req, res) => {
    upload(req, res, (err) => {
    if (req.body._id == '') {
        insertRecord(req, res);
       } else {
        updateRecord(req, res);
    }
});
});

// Add a new blog post

function insertRecord(req, res) {

  if(req.file) {
	var post = new BlogPost();
    post.title = req.body.title;
    post.content = req.body.content;
    post.url = req.body.url;
    post.description = req.body.description;
    post.image = req.file.location;
    post.author = req.user.username;
    
    post.save((err, doc) => {
        if (!err) {
            res.redirect('post/blogPost');
        }
    });
  } else {
    res.render('create-post', {content: req.body}); // reload create post a pass content back in
    
  }

}

// Get post by ID and update

function updateRecord(req, res) {
    BlogPost.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('/post/blogPost'); }

    });
}

// Get post by ID and delete

router.get('/delete/:id', ensureAutenticated, (req, res) => {
    BlogPost.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/post/blogPost');
        }
        else { console.log('Error in employee delete :' + err); }
    });
});


module.exports = router; // export module to the router