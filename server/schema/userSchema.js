let mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/booksProject', { useNewUrlParser: true })

let userSchema = new mongoose.Schema({
    "userName": {
        type : String,
        required : true
    },
    "want-to-read": [],
    "reading": [],
    "read": [],
}, {versionKey : false})

const user = module.exports =  mongoose.model('user', userSchema);

module.exports.getUsers = (callback) =>{
    user.find(callback)
}