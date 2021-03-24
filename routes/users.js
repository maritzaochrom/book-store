const express = require("express");

const { validateUser } = require('../middleware/validator');

const router = express.Router();

// para agregar en una ruta la autentication
const auth = require('../middleware/auth');

const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  addUser,
  getLogin,
  loginUser
} = require("../controllers/usersController");

router
  .route("/singup")
  .get(getUsers)
  .post(validateUser(), addUser);

router
  .route("/:id")
  .get(getUser)
  .delete(auth, deleteUser)
  .put(updateUser);

// npm i jsonwebtoken
// npm i dotenv
// ROUTE FOR LOGIN
router
  .route("/login")
  .get(getLogin)
  .post(loginUser)


module.exports = router;
