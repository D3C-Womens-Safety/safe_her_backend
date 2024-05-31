const express = require('express');
const router = express.Router();
const Post = require('../models/post.model');
const User = require('../models/user.model');
const moment = require('moment');

router.post('/:email', async (req, res) => {
    try {
      const { title, content, email, name } = req.body;
  
      const formattedDate = moment().format('MM/DD/YYYY');
      const newPost = new Post({
        title,
        content,
        email: email,
        name: name,
        timestamp: formattedDate
      });
  
      await newPost.save();
      res.json(newPost);
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

router.post('/delete/:id/:email', async (req, res) => {
    try {
        const deleteID = req.params.id;
        const userEmail = req.body.email;

        const post = await Post.findById(deleteID);

        if (post && post.email === userEmail) {
            await Post.findByIdAndDelete(deleteID);
            res.json({ status: 'success' });
        } else {
            res.status(404).json({ status: 'error', message: 'Post not found or unauthorized' });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * 9;
        const posts = await Post.find()
                                .sort({ timestamp: -1 })
                                .skip(skip)
                                .limit(9);

        const totalCount = await Post.countDocuments();
        const totalPages = Math.ceil(totalCount / 9);

        // metadata
        const response = {
            posts: posts,
            totalPages: totalPages,
            currentPage: page
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

router.get('/user/:email', async (req, res) => {
    try {
      const userEmail = req.params.email;
  
      const posts = await Post.find({ email: userEmail }).sort({ timestamp: -1 });
      res.json(posts);
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  });

module.exports = router;