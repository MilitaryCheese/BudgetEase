const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  amount: { type: Number, required: true,
    validate: {
      validator: function (v) {
        return v > 0;
      },
      message: 'Amount must be greater than zero.'
    }
  },
  type: { type: String, enum: ['income', 'expense'],required: true },
  category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true},
  date: {type: Date, default: Date.now },
  description: {type: String, maxlength: 200,trim: true},
  
},
{timestamps:true}
);

module.exports = mongoose.model('Transaction', transactionSchema);
