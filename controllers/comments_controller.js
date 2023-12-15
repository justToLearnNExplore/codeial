const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');
const Like = require('../models/like');
module.exports.create = async function (req, res) {
   
    try {
        let post = await Post.findById(req.body.post);   
        if (post) {
            let comment = await Comment.create({
                content: req.body.content,
                user: req.user._id,
                post: req.body.post
            });

            post.comments.push(comment);
            post.save();

            //comment = await comment.populate('user', 'name email').exec();
            comment = await Comment.findById(comment._id).populate('user', 'email').exec();
            //commentsMailer.newComment(comment)
            let job = queue.create('emails', comment).save(function(err){
                if(err){
                    console.log('error in creating queue', err);
                    return;
                }
                console.log('job enqueued', job.id);
            });
            if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Comment created!"
                });
            }

            req.flash('success', 'Comment created!');
            res.redirect('/');
        }
    } catch (error) {
        req.flash('error', error);
        console.error('Error in creating the comment', error);
        return res.status(500).send('Internal Server Error');
    }


};

module.exports.destroy = async function (req, res) {
    try {
        let comment = await Comment.findById(req.params.id);

        if (comment.user == req.user.id) {
            let postId = comment.post;

            await comment.deleteOne({ _id: req.params.id });

            let post = Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });
            
            await Like.deleteMany({likeable: comment_id, onModel: 'Comment'});

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Comment deleted!"
                });
            }

            req.flash('success', 'Comment deleted!');
            return res.redirect('back');
        } else {
            req.flash('error', 'Unauthorized!');
            //res.redirect('back');
            return res.status(403).send('Unauthorized');
        }

    } catch (error) {
        console.error('Error in deleting the comment', error);
        return res.status(500).send('Internal Server Error');
    }
};


