require("dotenv").config();

const express = require('express');
const sqlite3 = require('sqlite3');
const app = express();

//connect database
const db = new sqlite3.Database('./Database/Book.sqlite');

//parse incoming rq
app.use(express.json());

db.run(`CREATE TABLE IF NOT EXISTS books (
    id INTERGER PRIMARY KEY,
    title TEXT,
    auther TEXT
)`);
// get all books
app.get('/books', (req,res) => {
    db.all('SELECT * FROM books', (err,rows) =>{
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(rows);
        }
    });
});
//get book by ID
app.get('/book/:id',(req,res) => {
    db.get('SELECT * FROM books WHERE id = ?', req.params.id, (err, row) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (!row) {
                res.status(500).send('Book not found');
            } else {
                res.json(row);
            }
        }
    });
});

//new book
app.post('/books', (req,res) => {
    const book = req.body;
    db.run('INSERT INTO books (title,author) VALUE (?,?)',book.title,book.author,function(err){
        if(err){
            res.status(500).send(err);
        } else {
            book.id = this.lastID;
            res.send(book);
        }
    });
});

//update book
app.put('/books/:id', (req,res) => {
    const book = req.body;
    db.run('UPDATE books SET title = ?, author = ?, WHERE id = ?', book.title, book.author, req.params.id, function(err){
        if (err){
            res.status(500).send(err);
        } else {
            res.send(book);
        }
    });
});

//delete book
app.delete('/books/:id',(req,res) => {
    db.run('DELETE FROM books WHERE id =?', req.params.id,function(err){
        if(err){
            res.status(500).send(err);
        } else {
            res.send({});
        }
    });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));