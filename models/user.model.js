const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
   firstName: {
      type: String,
      required: [true, 'firstName is required'],
      minlength: 3,
      maclength: 50,
      trim: true,
      validate: [validator.isAlpha, 'First name must only containe characters'],
   },
   lastName: {
      type: String,
      required: [true, 'lastName is required'],
      minlength: 3,
      maclength: 50,
      trim: true,
      validate: [validator.isAlpha, 'Last name must only containe characters'],
   },
   email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
   },
   mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: [validator.isMobilePhone, 'Please provide a valid phone number'],
   },
   password: {
      type: String,
      required: [true, 'Please provide a valid password'],
      minlength: 8,
      select: false,
      trim: true,
      validate: [
         validator.isStrongPassword,
         'Password must be at least 8 characters, at least one uppercase letter, one number and one symbol',
      ],
   },
   passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      trim: true,
      select: false,
      validate: {
         validator: function (value) {
            return value === this.password;
         },
         message: 'Passwords do not match',
      },
   },
   role: {
      type: String,
      trim: true,
      enum: {
         values: ['Admin', 'User', 'Apicultor', 'Seller'], // Seller -> vinde produse pentru apicultori, User => persoana interesata in procurare miere sau produse de apicultura de la Apicultor.
         message: 'A role is required',
      },
      default: 'User',
   },
   country: {
      type: String,
      required: [true, 'House number is a required field'],
      minlength: 2,
      maxlength: 50,
      trim: true,
      validate: [validator.isAlpha, 'Country must only containe characters'],
   },
   city: {
      type: String,
      required: [true, 'City is a required field'],
      minlength: 2,
      maxlength: 50,
      trim: true,
      validate: [validator.isAlpha, 'City must only containe characters'],
   },
   address: {
      type: String,
      required: [true, 'Address is a required field'],
      minlength: 2,
      maxlength: 50,
      trim: true,
   },
   postalCode: {
      type: String,
      required: [true, 'Postal Code is a required field'],
      minlength: 2,
      maxlength: 50,
      trim: true,
   },
   active: {
      type: Boolean,
      default: true,
      select: false,
   },
   passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
   //Only run this function if password was actually modified
   if (!this.isModified('password')) return next();

   this.password = await bcrypt.hash(this.password, 12);
   // Delete passwordConfirm field
   this.passwordConfirm = undefined;
   next();
});

userSchema.pre('save', function (next) {
   if (!this.isModified('password') || this.isNew) return next();

   this.passwordChangedAt = Date.now() - 1000;
   next();
});

//Export the model
module.exports = mongoose.model('User', userSchema);
