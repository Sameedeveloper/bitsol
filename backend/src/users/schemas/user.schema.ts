import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  addresses: [
    {
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      country: String,
    },
  ],
  role: String,
  phoneNo: String,
  password: String,
});
