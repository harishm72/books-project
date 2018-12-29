let express = require('express');
let mongoose = require('mongoose');

let path = require('path');

let bookModel = require('./bookSchema.js')

let app = express();
let port = 3000;

mongoose.connect('mongodb://localhost:27017/booksProject', { useNewUrlParser: true })

let db = mongoose.connection;
app.use(express.static(path.join(__dirname, "../client")))

app.get("/", (req, res) => res.send("Home page!!!"))

app.get("/books", (req, res) => {
    bookModel.getBooks((err, books) =>{
        res.json(books);
    })
})

app.get("/books/:id" , (req, res) =>{
    bookModel.getBooks((err, books) =>{      
        books.forEach(element => {
            if(element['isbn'] == req.params.id )
            res.send(element)    
        });
        
    })
})
app.listen(port, console.log(`i'm listening on port ${port}`))