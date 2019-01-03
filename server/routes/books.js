const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const bookModel = require('../schema/bookSchema');

mongoose.connect('mongodb://localhost:27017/booksProject', {
    useNewUrlParser: true
})

router.get("/books", (req, res) => {
    bookModel.find()
        .then(data => res.send(data))
        .catch(err => res.status(404).send(err.message))
})
router.get("/books/:id", (req, res) => {
    let bookId = req.params.id;
    bookModel.findOne({
            "isbn": bookId
        })
        .then(data => data ? res.send(data) : res.status(400).send(`book ${bookId} not found!!!`))
        .catch(err => res.status(400).send(err.message))
})

module.exports = router
