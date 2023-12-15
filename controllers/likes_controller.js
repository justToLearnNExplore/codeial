const Like = require('../models/like');
const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.toggleLike = async function(req, res){
    try {
        let likeable;
        let deleted = false;

        if (req.query.type === 'Post') {
            likeable = await Post.findById(req.query.id).populate('likes');
        } else {
            likeable = await Comment.findById(req.query.id).populate('likes');
        }

        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        });

        if (existingLike) {
            likeable.likes.pull(existingLike._id);
            likeable.save();

            // Check if the existingLike object has a valid _id and then delete it
            if (existingLike._id) {
                await Like.findByIdAndDelete(existingLike._id);
                deleted = true;
            }
        } else {
            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type
            });
            likeable.likes.push(newLike._id);
            likeable.save();
        }

        return res.status(200).json({
            message: 'Request Successful',
            data: {
                deleted: deleted
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}



// const Like = require('../models/like');
// const Post = require('../models/post');
// const Comment = require('../models/comment');

// module.exports.toggleLike = async function(req, res){
//     try {
        
//         //likes/toggle/?id=abcdef&type=Post
//         let likeable;
//         let deleted = false;

//         if(req.query.type == 'Post'){
//             likeable = await Post.findById(req.query.id).populate('likes');
//         }else{
//             likeable = await Comment.findById(req.query.id).populate('likes');
//         }

//         //check if a like already exists
//         let existingLike = await Like.findOne({
//             likeable: req.query.id,
//             onModel: req.query.type,
//             user: req.user._id
//         })

//         //if a like already exists then delete it
//         if(existingLike){
//             likeable.likes.pull(existingLike._id);
//             likeable.save();

//             existingLike.remove();
//             deleted: true;
//         }else{
//             //make new like 
//             let newLike = await Like.create({
//                 user: req.user.id,
//                 likeable: req.query.id,
//                 onModel: req.user.type
//             });
//             likeable.likes.push(newLike._id);
//             likeable.save();
//         }
//         return res.status(200).json({
//         message: 'Request Successful',
//         data: {
//             deleted: deleted
//         }
//     })
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             message: 'Internal Server Error'
//         });
//     }
// }