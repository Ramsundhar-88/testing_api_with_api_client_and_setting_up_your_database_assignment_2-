const express = require("express");
const data = require("./data.json");
const app = express();
const PORT = 3000;

app.use(express.json());

// Use the existing data from data.json
let books = data;
app.get('/', function (req, res) {
    res.send('Hello World');
  });
// Create a new book (POST /books)
app.post("/books", (req, res) => {
    const { book_id, title, author, genre, year, copies } = req.body;
    
    if (!book_id || !title || !author || !genre || !year || !copies) {
        return res.status(400).json({ error: "All fields are required." });
    }

    if (books.find(book => book.book_id === book_id)) {
        return res.status(400).json({ error: "Book with this ID already exists." });
    }

    const newBook = { book_id, title, author, genre, year, copies };
    books.push(newBook);
    res.status(201).json(newBook);
});

// Get all books (GET /books)
app.get("/books", (req, res) => {
    res.json(books);
});

// Get a specific book by ID (GET /books/:id)
app.get("/books/:id", (req, res) => {
    const book = books.find(b => b.book_id === req.params.id);
    if (!book) {
        return res.status(404).json({ error: "Book not found." });
    }
    res.json(book);
});

// Update book details (PUT /books/:id)
app.put("/books/:id", (req, res) => {
    const book = books.find(b => b.book_id === req.params.id);
    if (!book) {
        return res.status(404).json({ error: "Book not found." });
    }

    const { title, author, genre, year, copies } = req.body;
    if (title) book.title = title;
    if (author) book.author = author;
    if (genre) book.genre = genre;
    if (year) book.year = year;
    if (copies) book.copies = copies;
    
    res.json(book);
});

// Delete a book (DELETE /books/:id)
app.delete("/books/:id", (req, res) => {
    const bookIndex = books.findIndex(b => b.book_id === req.params.id);
    if (bookIndex === -1) {
        return res.status(404).json({ error: "Book not found." });
    }
    books.splice(bookIndex, 1);
    res.json({ message: "Book deleted successfully." });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});