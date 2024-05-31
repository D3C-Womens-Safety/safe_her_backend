const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    timestamp: {
        type: String,
        default: () => new Date().toISOString()
    }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;