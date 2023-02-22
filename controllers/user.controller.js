const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');

const signup = catchAsync(async function (req, res, next) {
   const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      mobile: req.body.mobile,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      country: req.body.country,
      city: req.body.city,
      address: req.body.address,
      postalCode: req.body.postalCode,
   });

   // Remove password from output
   newUser.password = undefined;

   const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

   res.status(200).json({
      message: 'success',
      token: token,
      data: newUser,
   });
});

const getUserByEmail = catchAsync(async function (req, res, next) {
   const user = await User.findOne({ email: req.body.email });
   if (!user)
      res.status(404).json({
         message: 'user not found',
      });

   res.status(200).json({
      message: 'success',
      data: user,
   });
});

const updateUser = catchAsync(async function (req, res, next) {
   const user = await User.findById(req.params.id);

   if (!user)
      res.status(404).json({
         message: 'user not found',
      });

   user.firstName = req.body.firstName;
   user.lastName = req.body.lastName;
   user.email = req.body.email;
   user.mobile = req.body.mobile;
   user.password = req.body.password;
   user.passwordConfirm = req.body.passwordConfirm;
   user.country = req.body.country;
   user.city = req.body.city;
   user.address = req.body.address;
   user.postalCode = req.body.postalCode;

   await user.save();

   res.status(200).json({
      message: 'updated successfully',
      data: user,
   });
});

const deleteUser = catchAsync(async function (req, res, next) {
   await User.findByIdAndDelete(req.params.id);

   res.status(204).json({
      message: 'deleted successfully',
      data: null,
   });
});

module.exports = {
   signup,
   getUserByEmail,
   updateUser,
   deleteUser,
};
