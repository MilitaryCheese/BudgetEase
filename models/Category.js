const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {type: String, required: true, trim: true, maxlength: 50},
  type: {type: String, enum: ['income', 'expense'],required: true},
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  
},
{timestamps:true}
);

module.exports = mongoose.model('Category', categorySchema);
