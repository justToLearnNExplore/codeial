const Post = require('../models/post');

module.exports.create = async function (req, res) {
    try {
        const newPost = await Post.create({
            content: req.body.content,
            user: req.user._id
        });
       
    } catch (error) {
        console.error('Error in creating the post', error);
        return res.status(500).send('Internal Server Error');
    }
    return res.redirect('back');
};
