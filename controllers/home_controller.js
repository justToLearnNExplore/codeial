const Post = require('../models/post');

module.exports.home = async function (req, res) {
    // console.log(req.cookies);
    // res.cookie('user_id', 25);
    // res.render('home',{
    //     title:"Home",
    // });

    // Post.find({}, function (err, posts) {
    //     return res.render('home', {
    //         title: "Codeial | Home",
    //         posts: posts
    //     });
    // });

    // Post.find({}).populate('user').exec(function (err, posts) {
    //     return res.render('home', {
    //         title: "Codeial | Home",
    //         posts: posts
    //     });
    // });

    try {
        const posts = await Post.find({}).populate('user').exec();
        
        return res.render('home', {
            title: "Codeial | Home",
            posts: posts
        });
    } catch (err) {
        console.error('Error fetching posts:', err);
        // Handle the error, render an error page, or send an error response
        return res.status(500).send('Internal Server Error');
    }
    
}    