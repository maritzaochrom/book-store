const express = require("express");
const router = express.Router();

const {
  getBooks,
  getBook,
  updateBook,
  deleteBook,
  addBook
} = require("../controllers/booksController");

router
  .route("/")
  .get(getBooks)
  .post(addBook);

router
  .route("/:id")
  .get(getBook)
  .delete(deleteBook)
  .put(updateBook);

module.exports = router;
