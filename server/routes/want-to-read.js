const express = require('express');

const bookModel = require('../schema/bookSchema');
const userModel = require('../schema/userSchema');

const router = express.Router();

//router.route("/").get().post().delete();

router.get("/", (req, res) => {
    userModel.findOne({
            "userName": req.get("userName")
        })
        .then(data =>
            res.send(data['want-to-read'])
        ).catch(err => res.send(500).send(err.message))
})

router.post("/", (req, res) => {
    let currentBook = req.body;
    let currentUser = req.get("userName");

    userModel.findOne({
            "userName": currentUser
        })
        .then(userData => {
            let allLists = userData['want-to-read'].concat(userData['read'], userData['reading'])
            let currentList = allLists.map(book => book['isbn'])
            if (currentList.includes(currentBook.isbn))
                return res.status(400).send(`book with isbn ${currentBook.isbn} already exists in list`)
            return userModel.findOneAndUpdate({
                "userName": currentUser
            }, {
                $push: {
                    "want-to-read": currentBook
                }
            })
        })
        .then(() => res.status(201).send(currentBook))
        .catch(err => res.status(500).send(err.message))
})


router.delete("/:id", (req, res) => {
    let bookId = req.params.id;
    let currentUser = req.get("userName");

    userModel.findOne({
            "userName": currentUser
        })
        .then(userData => {
            let currentList = userData['want-to-read'].map(book => book['isbn'])
            if (!currentList.includes(bookId))
                return res.status(400).send(`book with isbn ${bookId} doesn't exist`)
            userModel.findOneAndUpdate({
                    "userName": currentUser
                }, {
                    $pull: {
                        "want-to-read": {
                            "isbn": bookId
                        }
                    }
                }, {
                    new: true
                })
                .then((currentBook) => res.status(201).json(currentBook))
        })
        .catch(err => res.status(400).send(err.message))

})

module.exports = router;