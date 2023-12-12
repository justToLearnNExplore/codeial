const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = async function (req, res) {
    try {
        const post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        if(req.xhr){
            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post created!"
            });
        }
        
        req.flash('success', 'Post created!');
        return res.redirect('back');
       
    } catch (error) {
        req.flash('error', err);
        //console.error('Error in creating the post', error);
        return res.status(500).send('Internal Server Error');
    }
    
};

module.exports.destroy = async function (req, res) {
    try {
        let post = await Post.findById(req.params.id);

        // if (!post) {
        //     return res.status(404).send('Post not found');
        // }

        if(post.user == req.user.id){
            //await post.remove();
            await Post.deleteOne({ _id: req.params.id });

            // Delete associated comments
            await Comment.deleteMany({ post: req.params.id });
            
            if(req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted!"
                });
            }

            return res.redirect('back');
        } else {
            return res.status(403).send('Unauthorized'); // Or handle unauthorized access
        }
       
    } catch (error) {
        console.error('Error in deleting the post', error);
        return res.status(500).send('Internal Server Error');
    }
};
