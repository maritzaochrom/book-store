/** EXTERNAL DEPENDENCIES */
const express = require("express");
const path = require("path");
// const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");

/** ROUTERS */
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const booksRouter = require("./routes/books");
const ordersRouter = require("./routes/orders");
const { setCors } = require("./middleware/security");


// set up server
const hostname = '127.0.0.1';
const port = process.env.PORT || 5000;
const app = express();

/** LOGGING */
app.use(morgan("dev"));

/**CONNECT TO DB */
mongoose.connect("mongodb://localhost:27017/book-shop", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

mongoose.connection.on("error", console.error);
mongoose.connection.on("open", function() {
  console.log("Database connection established...");
});

/** REQUEST PARSERS */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(setCors);

/** STATIC FILES*/
app.use(express.static(path.join(__dirname, "public")));

/** ROUTES */
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/books", booksRouter);
app.use("/orders", ordersRouter);

/** ERROR HANDLING */
app.use(function(req, res, next) {
  const error = new Error("Looks like something broke...");
  error.status = 400;
  next(error);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500).send({
    error: {
      message: err.message
    }
  });
});

app.listen(port, hostname, () => { console.log(`Listening at http://${hostname}:${port}.`) });

