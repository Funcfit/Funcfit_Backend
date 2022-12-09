const { StatusCodes } = require("http-status-codes");
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
   createJWT,
} = require("../utils/auth");
const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

exports.signup = (req, res, next) => {
  let { username, email, password, password_confirmation } = req.body;
  let errors = [];
  if (!username) {
    errors.push({ username: "required" });
  }
  if (!email) {
    errors.push({ email: "required" });
  }
  if (!emailRegexp.test(email)) {
    errors.push({ email: "invalid" });
  }
  if (!password) {
    errors.push({ password: "required" });
  }
  if (!password_confirmation) {
    errors.push({
     password_confirmation: "required",
    });
  }
  if (password != password_confirmation) {
    errors.push({ password: "mismatch" });
  }
  if (errors.length > 0) {
    return res.status(422).json({ errors: errors });
  }
 User.findOne({email: email})
    .then(user=>{
       if(user){
          return res.status(422).json({ errors: [{ user: "user already exists" }] });
       }else {
         const user = new User({
           username: username,
           email: email,
           password: password,
         });
 bcrypt.genSalt(10, function(err, salt) { bcrypt.hash(password, salt, function(err, hash) {
         if (err) throw err;
         user.password = hash;
         user.save()
             .then(response => {
                res.status(200).json({
                  success: true,
                  result: response
                })
             })
             .catch(err => {
               res.status(500).json({
                  errors: [{ error: err }]
               });
            });
         });
      });
     }
  }).catch(err =>{
      res.status(500).json({
        errors: [{ error: 'Something went wrong' }]
      });
  })
}

exports.signin = async (req, res) => {
  const { username, email, password } = req.body;

  if ((!username && !email) || !password) {
    throw new BadRequestError("Please Provide All the Values");
  }

  const isUser = await User.findOne({
    $or: [{ email: email }, { username: username }],
  });

  if (!isUser) {
    throw new NotFoundError("Invalid Credentials");
  }

  //compare password
  const comparePassword = await bcrypt.compare(password, isUser.password);

  if (!comparePassword) {
    throw new BadRequestError(
      "Please Make Sure You have entered Correct Password!"
    );
  }

  const token = jwt.sign(
    {
      userId: isUser._id,
      username: isUser.username,
      userEmail: isUser.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );

  res.status(StatusCodes.OK).json({
    _id: isUser._id,
    username: isUser.username,
    email: isUser.email,
    avatar: isUser.avatar,
    token,
  });
};

exports.searchUser = async (req, res) => {
  const search = req.query.search;

  console.log(search);
  const user = await User.find({
    username: { $regex: search, $options: "i" },
  }).select("username avatar _id email bio");

  res.status(StatusCodes.OK).json(user);
};