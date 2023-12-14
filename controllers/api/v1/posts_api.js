const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(req, res){

    let posts = await Post
        .find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        });

    return res.status(200).json( {
        message: "List of posts",
        posts: posts
    });
}

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

            return res.status(200).json( {
                message: 'Posts & associated Comments deleted!'
            });
        } else {
            return res.status(401).json({
                message: 'Cannot delete the post!'
            });
        }
       
    } catch (error) {
        console.error('Error in deleting the post', error);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};
