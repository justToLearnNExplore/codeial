const Post = require('../models/post');
const Comment = require('../models/comment');

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

module.exports.destroy = async function (req, res) {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).send('Post not found');
        }

        if(post.user == req.user.id){
            // await post.remove();
            await Post.deleteOne({ _id: req.params.id });

            // Delete associated comments
            await Comment.deleteMany({ post: req.params.id });
            
            return res.redirect('back');
        } else {
            return res.status(403).send('Unauthorized'); // Or handle unauthorized access
        }
       
    } catch (error) {
        console.error('Error in deleting the post', error);
        return res.status(500).send('Internal Server Error');
    }
};
