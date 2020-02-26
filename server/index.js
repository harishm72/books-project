import express, { static } from 'express';
import { join } from 'path';
import { json } from 'body-parser';
import { object, string, validate } from 'joi';

import books from './routes/books';
import wantToRead from './routes/want-to-read';
import reading from './routes/reading';
import read from './routes/read';

import userModel, { findOne } from './schema/userSchema';
import { findOne as _findOne } from './schema/bookSchema';


const app = express();
const port = 3000;

app.use(json());

app.use(static(join(__dirname, "../client")))

app.use("/register", (req, res, next) => {
    if (req.method === "POST") {
        let currentUser = req.body
        if (currentUser === undefined || currentUser.length === 0) {
            return res.status(400).send("Request body Missing!!")
        }
        let userSchema = object().keys({
            "userName": string().min(3)
        })
        let joiResult = validate(req.body, userSchema)

        if (joiResult.error !== null) {
            return res.status(400).send(`invalid`)
        }
        findOne({
                "userName": currentUser.userName
            })
            // .then(user => {
            //     if (user) {
            //         throw new Error('User exists')
            //     }
            //     let newUser = new userModel(currentUser);
            //     return newUser.save()
            // })
            // .then(() => {
            //     return res.status(201).send()
            // })
            // .catch(err => {
            //     return res.status().send(err.message)
            // })
            .then(data => {
                if (data !== null)
                    return res.status(400).send(`exists`)
                else if (data === null){
                let model = new userModel(currentUser)
                model.save((err, saved) => {
                 res.status(201).send(`created`)
                    next();
                    console.log(saved)
                })
            }
            }).catch(err => res.send(500).send())

    }
})
app.use("/api/list", (req, res, next) => {
    findOne({
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
        let bookSchema = object().keys({
            "isbn": string()
        })
        let joiResult = validate(currentBook, bookSchema)
        if (joiResult.error !== null || Object.keys(currentBook).length === 0)
            return res.status(400).send(`Invalid Book!`);
        _findOne({
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