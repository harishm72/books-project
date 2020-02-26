let mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/booksProject', { useNewUrlParser: true })

let bookSchema = new mongoose.Schema({
    "isbn": String,
    "title": String,
    "subtitle": String,
    "author": String,
    "published": String,
    "publisher": String,
    "pages": String,
    "description": String,
    "website": String
}, {versionKey : false})


const book = module.exports =  mongoose.model('book', bookSchema);

// module.exports.getBooks = (callback) => {
//     book.find(callback);
// }