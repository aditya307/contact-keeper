const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GUserSchema = new Schema({
  googleId: {
    type: String,
    // required: true,
  },
  name: {
    type: String,
    // required: true,
  },
  FirstName: {
    type: String,
    // required: true,
  },
  LastName: {
    type: String,
    // required: true,
  },
  image: {
    type: String,
  },
  email: {
    type: String,
    // required: true,
  },
  CreatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('gusers', GUserSchema);
