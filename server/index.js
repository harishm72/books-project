const express = require('express')
const path = require('path');
const bodyParser = require('body-parser');
const Joi = require('joi')

const books = require('./routes/books')
const wantToRead = require('./routes/want-to-read')
const reading = require('./routes/reading')
const read = require('./routes/read')

const userModel = require('./schema/userSchema')
const bookModel = require('./schema/bookSchema')


const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "../client")))

app.use("/register", (req, res, next) => {
    if (req.method === "POST") {
        let currentUser = req.body
        if (currentUser === undefined || currentUser.length === 0) {
            return res.status(400).send("Request body Missing!!")
        }
        let userSchema = Joi.object().keys({
            "userName": Joi.string().min(3)
        })
        let joiResult = Joi.validate(req.body, userSchema)

        if (joiResult.error !== null) {
            return res.status(400).send(`invalid`)
        }
        userModel.findOne({
                "userName": currentUser.userName
            })
            .then(data => {
                if (data !== null)
                    return res.status(400).send(`exists`)
                else if (data === null){
                let model = new userModel(currentUser)
                model.save((err) => {
                 res.status(201).send(`created`)
                    next();
                })
            }
            }).catch(err => res.send(500).send())

    }
})
app.use("/api/list", (req, res, next) => {
    userModel.findOne({
            "userName": req.get("userName")
        })
        .then(data => {
            if (data !== null)
                next();
            else res.status(401).send("Unauthorized")
        })
        .catch(err => res.status(404).send(err.message))
})

app.use("/api/list", (req, res, next) => {
    if (req.method === "POST") {
        let currentBook = req.body;
        let bookSchema = Joi.object().keys({
            "isbn": Joi.string()
        })
        let joiResult = Joi.validate(currentBook, bookSchema)
        if (joiResult.error !== null || Object.keys(currentBook).length === 0)
            return res.status(400).send(`Invalid Book!`);
        bookModel.findOne({
            "isbn": currentBook.isbn
        }).then(data => {
            if (data !== null)
                return next();
            else res.status(400).send(`book with isbn ${currentBook.isbn} doesn't exist!`)
        })
    } else next();
})
app.use("/api", books);
app.use("/api/list/want-to-read", wantToRead)
app.use("/api/list/reading", reading)
app.use("/api/list/read", read)


app.get("/", (req, res) => res.send("Hey man!!! Welcome to BookStore!"))

app.listen(port, console.log(`i'm listening on port ${port}`))