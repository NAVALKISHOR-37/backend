const Transaction = require('../models/Transaction');
const Book = require('../models/Book');

// Issue a book
const issueBook = async (req, res) => {
  const { bookId, userId, issueDate } = req.body;
  
  try {
    // Create a new transaction with issueDate
    const transaction = new Transaction({ bookId, userId, issueDate });
    await transaction.save();
    res.json({ message: 'Book issued' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Return a book and calculate rent
const returnBook = async (req, res) => {
  const { bookId, userId, returnDate } = req.body;

  try {
    // Fetch the transaction by bookId and userId where returnDate is null (indicating the book is still issued)
    const transaction = await Transaction.findOne({ bookId, userId, returnDate: null });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Fetch the book to get its rentPerDay
    const book = await Book.findById(bookId);
    if (!book || !book.rentPerDay) {
      return res.status(404).json({ message: 'Book not found or rentPerDay missing' });
    }

    // Parse issueDate and returnDate to Date objects
    const issueDate = new Date(transaction.issueDate);
    const parsedReturnDate = new Date(returnDate);

    // Check if the dates are valid
    if (isNaN(issueDate.getTime()) || isNaN(parsedReturnDate.getTime())) {
      return res.status(400).json({ message: 'Invalid issueDate or returnDate' });
    }

    // Calculate the rent based on the number of days between issueDate and returnDate
    const rentDuration = (parsedReturnDate - issueDate) / (1000 * 3600 * 24); // Convert milliseconds to days

    if (rentDuration < 0) {
      return res.status(400).json({ message: 'Return date cannot be before the issue date' });
    }

    // Update the transaction record with returnDate and calculated rent
    transaction.returnDate = parsedReturnDate;
    transaction.rentGenerated = rentDuration * book.rentPerDay;

    // Save the updated transaction
    await transaction.save();

    res.json({
      message: 'Book returned',
      totalRent: transaction.rentGenerated
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { issueBook, returnBook };
