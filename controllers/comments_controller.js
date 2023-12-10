const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function (req, res) {
    try {
        const post = await Post.findById(req.body.post);
        
        if (post) {
            const comment = await Comment.create({
                content: req.body.content,
                user: req.user._id,
                post: req.body.post
            });

            post.comments.push(comment);
            await post.save();
            return res.redirect('/');
        }
    } catch (error) {
        console.error('Error in creating the comment', error);
        return res.status(500).send('Internal Server Error');
    }

    return res.redirect('back');
};

module.exports.destroy = async function (req, res) {
    try {
        const comment = await Comment.findById(req.params.id);

        if (comment.user == req.user.id) {
            let postId = comment.post;

            await comment.deleteOne({ _id: req.params.id });

            await Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });

            return res.redirect('back');
        } else {
            return res.status(403).send('Unauthorized');
        }

    } catch (error) {
        console.error('Error in deleting the comment', error);
        return res.status(500).send('Internal Server Error');
    }
};


