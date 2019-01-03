const express = require('express');
const router = express.Router();
const Joi = require("joi");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

const bookModel = require('../schema/bookSchema');
const userModel = require('../schema/userSchema');

mongoose.connect('mongodb://localhost:27017/booksProject', {
    useNewUrlParser: true
})
app.use(bodyParser.json());
let postBook = (listName, currentBook, currentUser) => {
    userModel.findOne({
        "userName": currentUser
    }).then(userData => {
        if (userData === null)
            return {
                "status": 400,
                "res": `${currentUser} doesn't exist!`
            }
        let currentList = userData[listName]
        bookModel.findOne({
                "isbn": currentBook.isbn
            })
            .then(bookData => {
                if (bookData === null)
                    return {
                        "status": 400,
                        "res": `book ${currentBook} doesn't exist`
                    }
                if (currentList.includes(currentBook.isbn))
                    return {
                        "status": 400,
                        "res": `book with ${currentBook} already exists in list`
                    }
                userModel.findOneAndUpdate({
                        "userName": user
                    }, {
                        $push: {
                            listName: book
                        }
                    })
                    .then(() => {
                        return {
                            "status": 201,
                            "res": currentBook
                        }
                    })
                    .catch((err) => {
                        return {
                            "status": 400,
                            "res": err.message
                        }
                    })
            })
    }).catch(err => {
        return {
            "status": 400,
            "res": err.message
        }
    }
        )
}

module.exports.postBook = postBook