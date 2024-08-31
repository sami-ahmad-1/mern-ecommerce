// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const userSchema = new Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: Buffer, required: true },
//   role: { type: String, required: true, default:'user' },
//   addresses: { type: [Schema.Types.Mixed] },
//   name: { type: String },
//   orders: { type: [Schema.Types.Mixed] },
//   salt:Buffer
// });


// userSchema.virtual('id').get(function () {
//   return this._id.toHexString();
// });

// userSchema.set('toJSON', {
//   virtuals: true,
//   versionKey: false,
//   transform: (doc, ret) => {
//     delete ret._id;
//   }
// });

// const User = mongoose.model('User', userSchema);

// module.exports = { User };



const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },  // Store as a hex string
  role: { type: String, required: true, default: 'user' },
  addresses: { type: [Schema.Types.Mixed] },
  name: { type: String },
  orders: { type: [Schema.Types.Mixed] },
  salt: { type: String, required: true }  // Store salt as a hex string
});

userSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
  }
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
