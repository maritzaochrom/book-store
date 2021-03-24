// CORRE EN TERMINAL  node app.js     // VER RESULTADOS EN POSTMAN LOCALHOST 5000

/** EXTERNAL DEPENDENCIES */
const express = require("express");
const path = require("path");
// const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const hbs = require('express-handlebars');



//agrege sessioon
const session = require("express-session");

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

// ENGINE - PARA VER EN EL BROWSER  tmb se debe instalar en terminal --> npm i express handlebars
app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: null }))   //layout name of the file without extension
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

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

//agrege session
app.use(session({ secret: "secrets", saveUninitialized: false, resave: false }));

/** STATIC FILES*/
app.use(express.static(path.join(__dirname, "public")));

/** ROUTES */
app.use("/", indexRouter);
app.use("/users", usersRouter);     // para la ruta users agregar un sigup que valide si el email es unico y encriptar la contrasena
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

