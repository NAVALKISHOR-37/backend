const Book = require('../models/Book');

// Create a new book
const addBook = async (req, res) => {
  const { bookName, category, rentPerDay } = req.body;
  
  try {
    const newBook = new Book({ bookName, category, rentPerDay });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get books by name or term
const searchBooks = async (req, res) => {
  const term = req.query.term;
  try {
    const books = await Book.find({ bookName: { $regex: term, $options: 'i' } });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get books by rent and range
const getBooksByRentRange = async (req, res) => {
  const { min, max } = req.query;
  
  console.log(`Rent range received - Min: ${min}, Max: ${max}`); // Add logging

  try {
    const books = await Book.find({
      rentPerDay: { $gte: min, $lte: max }
    });

    if (!books.length) {
      console.log('No books found in this range'); // Log if no books are found
      return res.status(404).json({ message: 'No books found in this price range' });
    }

    console.log('Books found:', books); // Log the books found
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error); // Log any error that occurs
    res.status(500).json({ error: error.message });
  }
};


// Get books by category, name/term, and rent range
const filterBooks = async (req, res) => {
  const { category, term, minRent, maxRent } = req.query;
  try {
    const books = await Book.find({
      category,
      bookName: { $regex: term, $options: 'i' },
      rentPerDay: { $gte: minRent, $lte: maxRent },
    });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { searchBooks, getBooksByRentRange, filterBooks, addBook};
