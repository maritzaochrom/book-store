const express = require("express");

const { validateUser } = require('../middleware/validator');

const router = express.Router();

const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  addUser
} = require("../controllers/usersController");

router
  .route("/")
  .get(getUsers)
  .post(validateUser(), addUser);

router
  .route("/:id")
  .get(getUser)
  .delete(deleteUser)
  .put(updateUser);

module.exports = router;
