const express = require('express');
const { searchBooks, getBooksByRentRange, filterBooks,addBook} = require('../controllers/bookController');

const router = express.Router();

router.post('/add', addBook);
router.get('/search', searchBooks);
router.get('/rent', getBooksByRentRange);
router.get('/filter', filterBooks);

module.exports = router;
