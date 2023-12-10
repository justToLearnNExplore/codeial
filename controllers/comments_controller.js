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



// const Comment = require('../models/comment');
// const Post = require('../models/post');

// module.exports.create = async function (req, res) {
//     try {
//         const newPost = await Post.findById(req.body.post, function(err, post){
//             if(post){
//                 Comment.create({
//                     content: req.body.content,
//                     user: req.user._id,
//                     post: req.body.post
//                 },function(err, comment){
//                      post.comments.push(comment);
//                      post.save();
//                      res.redirect('/');
//                 })
//             }
            
//         });
       
//     } catch (error) {
//         console.error('Error in creating the post', error);
//         return res.status(500).send('Internal Server Error');
//     }
//     return res.redirect('back');
// };
