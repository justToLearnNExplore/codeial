const nodemailer = require('../config/nodemailer');

exports.newComment = (comment) => {
    let htmlString = nodemailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');
    console.log('Inside newComment mailer', comment);

    nodemailer.transporter.sendMail({
        from: 'pranusha11201@gmail.com',
        to: comment.user.email,
        subject: 'New Comment Published',
        text: 'CODEIAL',
        html: htmlString,
    }, (err, info) =>{
        console.log('Error in sending mail', err);
        return;
    });
    

}