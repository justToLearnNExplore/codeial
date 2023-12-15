const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.ObjectId
    },
    //this defines obj id of liked obj
    likeable: {
        type: mongoose.Schema.ObjectId,
        required: true,
        refPath: 'onModel'
    },
    //this defines type of liked obj as it is a dynamic ref
    onModel: {
        type: String,
        required: true,
        enum: ['Post', 'Comment'] 
    }
},{
    timestamps: true
}); 

const Like = mongoose.model('Like', likeSchema);
module.exports = Like;