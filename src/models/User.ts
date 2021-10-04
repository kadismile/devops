import { Model, Schema, model } from 'mongoose';
import mongoose from 'mongoose'
import TimeStampPlugin from './plugins/timestamp-plugin';
import  UserAfterUpdate   from './hooks/user_after_update'
import  UserBeforeSave   from './hooks/user_before_save'
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import accessEnv from '../helpers/accessEnv';
import { IUser } from '../types';


interface IUserModel extends Model<IUser> { }

const schema = new Schema<IUser>({
  email: {
    type: String,
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ],
    required: [true, 'Please Add Email']
  },
  fullName: {
    type: String,
    required: [true, 'Please Add Full Name']
  },
  phoneNumber: {
    type : Array,
    default : [],
  },
  customerNumber: {
    type: Number,
    default : 1000,
    optional: true,
  },
  userType: {
    type: String,
  },
  accountBalance: {
    type: Number,
    default: function() {
      return 0.0;
    }
  },
  address: {
    type : Array,
    required: [true, 'Please add an address']
  },
  password: {
    type: String,
    select: false, //dont show the password
    min: [4, 'password too short'],
  },
  resetPasswordToken: {
    type: String,
    optional: true,
  },
  resetPasswordExpire: {
    type: Date,
    optional: true,
  },
  verifyEmailToken: {
    type: String,
    optional: true,
  },
  roles: {
    type : Array,
    default : [],
    optional: true,
  },
  history: {
    type: Array,
    optional: true,
  },
  superAdmin: {
    type: Boolean,
    default: function() {
      return false;
    }
  },
  isActive: {
    type: Boolean,
    default: function() {
      return true;
    }
  },
  isVerified: {
    type: Boolean,
    default: function() {
      return false;
    }
  },
  attachments: [{
    type: String,
    ref: 'Attachment'
  }]
},{versionKey: false});

// Add timestamp plugin for createdAt and updatedAt in miliseconds from epoch
schema.plugin(TimeStampPlugin);

schema.pre('findOne', async function() {
  this.where({ isActive: true })
});

schema.pre('find', async function() {
  this.where({ isActive: true })
});

schema.pre('findOneAndUpdate', async function(this, next) {
  await UserAfterUpdate(this, next)
});


schema.pre("save", async function(this, next) {
  await UserBeforeSave(this)
});

schema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

schema.methods.getSignedJwtToken = function(expires) {
  const JWT_SECRET = accessEnv("JWT_SECRET")
  return jwt.sign({ _id: this._id}, JWT_SECRET, {
    expiresIn: expires ? expires : process.env.JWT_EXPIRE
  });
};

const User: IUserModel = model<IUser, IUserModel>('User', schema);

export default User;
