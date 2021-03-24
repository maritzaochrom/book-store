const User = require("../models/User");
const createError = require("http-errors");
const bcrypt = require('bcrypt');

// requerir para el /login
const jwt = require('jsonwebtoken');
require('dotenv').config();



exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (e) {
    next(e);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new createError.NotFound();
    res.status(200).send(user);
  } catch (e) {
    next(e);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) throw new createError.NotFound();
    res.status(200).send(user);
  } catch (e) {
    next(e);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!user) throw new createError.NotFound();
    res.status(200).send(user);
  } catch (e) {
    next(e);
  }
};


//USING ASYNC AWAIT
exports.addUser = async (req, res, next) => {
  try {
    const users = await User.find({ email: req.body.email }).exec();

    if (users.length > 0) {
      // user already exists
      return res.status(409).json({
        message: "Mail exists"
      });
    }

    const plainPassword = req.body.password;
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const user = new User({
      firstName: req.body.name,      // .name representa lo del html name="name"  // firstName es lo del schema
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword
    });

    await user.save();

    res.status(200).send(user);
  } catch (e) {
    next(e);
  }
};



exports.addUserSync = async (req, res, next) => {
  try {
    const users = await User.find({ email: req.body.email }).exec();

    if (users.length > 0) {
      // user already exists
      return res.status(409).json({
        message: "Mail exists"
      });
    }

    const plainPassword = req.body.password;
    // with sync call (not recommended because it's blocking)
    const hashedPassword = bcrypt.hashSync(plainPassword, 10);
    const user = new User({
      firstName: req.body.name,      // .name representa lo del html name="name"  // firstName es lo del schema
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword
    });

    await user.save();

    res.status(200).send(user);
  } catch (e) {
    next(e);
  }
};

exports.addUserCallback = async (req, res, next) => {
  try {
    const users = await User.find({ email: req.body.email }).exec();

    if (users.length > 0) {
      // user already exists
      return res.status(409).json({
        message: "Mail exists"
      });
    }

    const plainPassword = req.body.password;
    // with callbacks
    bcrypt.hash(plainPassword, 10, async (err, hashedPassword) => {
      if (err) {
        return next(err);
      }

      const user = new User({
        firstName: req.body.name,      // .name representa lo del html name="name"  // firstName es lo del schema
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword
      });
    })

    res.status(200).send(user);
  } catch (e) {
    next(e);
  }
};


exports.addUserPromise = async (req, res, next) => {
  try {
    const users = await User.find({ email: req.body.email }).exec();

    if (users.length > 0) {
      // user already exists
      return res.status(409).json({
        message: "Mail exists"
      });
    }

    const plainPassword = req.body.password;
    // with promises
    bcrypt.hash(plainPassword, 10).then(async (hashedPassword) => {
      const user = new User({
        firstName: req.body.name,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword
      });

      res.status(200).send(user);
    }).catch((error) => {
      next(error);
    });
  } catch (e) {
    next(e);
  }
};




exports.getLogin = (req, res) => {
  // res.render('login');
  res.send('Hello')
}

//LOGIN USER IGUAL ARCHIVO: EXPRESS-LOGIN-STARTER-CODE
exports.loginUser = (req, res) => {

  //AUTENTICATION STARTS WHEN YOU LOOK THE EMAIL IN THE DB AND COMPARE THE PASSWORD
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: 'Auth failed'
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: 'Auth failed'
          })
        }
        if (result) {
          //
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            },
            process.env.JWT_KEY,
            {
              expiresIn: '1h'
            }
          );
          return res.status(200).json({
            message: 'Auth successful',
            token: token
          });
        }
        return res.status(401).json({
          message: 'Auth failed'
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}


//USING ASYNC - AWAIT FOR LOGIN AUTH
// exports.loginUser = async (req, res, next) => {

//   try {

//     const users = await User.find({ email: req.body.email }).exec();

//     if (users.length < 1) {
//       return res.status(401).json({
//         message: 'Auth failed'
//       });
//     }

//     bcrypt.compare(req.body.password, users[0].password, (err, result) => {
//       if (err) {
//         return res.status(401).json({
//           message: 'Auth failed'
//         })
//       }
//       if (result) {
//         const token = jwt.sign(
//           {
//             email: users[0].email,
//             userId: users[0]._id
//           },
//           process.env.JWT_KEY,
//           {
//             expiresIn: '1h'
//           }
//         );
//         return res.status(200).json({
//           message: 'Auth successful',
//           token: token
//         });
//       }
//       return res.status(401).json({
//         message: 'Auth failed'
//       });
//     });

//   }

//   catch (err) {
//     // console.log(err);
//     // res.status(500).json({
//     //   error: err
//     // });
//     next(e);
//   };
// }
