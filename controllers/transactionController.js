const Transaction = require('../models/Transaction');
const transactionController = {

    async addTransaction (req,res,next){
        try {
            const { amount, type, category, description } = req.body;
        
            if (!amount || !type || !category) {
              return res.status(400).json({ message: 'All fields (amount, type, category) are required' });
            }
        
            const transaction = new Transaction({
              amount,
              type,
              category,
              date: new Date(),
              description,
              userId: req.user.id, // Get user ID from authMiddleware
            });
        
            await transaction.save();
            res.status(201).json({ message: 'Transaction added successfully', transaction });
          } catch (err) {
            res.status(500).json({ message: 'Server error', error: err.message });
          }
    },
    async getTransactions (req,res,next){
        try {
            const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 }); // Sort by latest date
            res.status(200).json(transactions);
          } catch (err) {
            res.status(500).json({ message: 'Server error', error: err.message });
          }
    },
    async getTransactionById (req,res,next){
        try {
            const { id } = req.params;
        
            const transaction = await Transaction.findOne({ _id: id, userId: req.user.id });
            if (!transaction) {
              return res.status(404).json({ message: 'Transaction not found' });
            }
        
            res.status(200).json(transaction);
          } catch (err) {
            res.status(500).json({ message: 'Server error', error: err.message });
          }
    },
    async updateTransaction (req,res,next){
        try {
            const { id } = req.params;
            const { amount, type, category, description } = req.body;
        
            if (!amount || !type || !category) {
              return res.status(400).json({ message: 'All fields (amount, type, category) are required' });
            }
        
            const updatedTransaction = await Transaction.findOneAndUpdate(
              { _id: id, userId: req.user.id },
              { amount, type, category, date: new Date(), description },
              { new: true } // Return the updated document
            );
        
            if (!updatedTransaction) {
              return res.status(404).json({ message: 'Transaction not found' });
            }
        
            res.status(200).json({ message: 'Transaction updated successfully', updatedTransaction });
          } catch (err) {
            res.status(500).json({ message: 'Server error', error: err.message });
          }
    },
    async deleteTransaction (req,res,next){
        try {
            const { id } = req.params;
        
            const deletedTransaction = await Transaction.findOneAndDelete({
              _id: id,
              userId: req.user.id,
            });
        
            if (!deletedTransaction) {
              return res.status(404).json({ message: 'Transaction not found' });
            }
        
            res.status(200).json({ message: 'Transaction deleted successfully' });
          } catch (err) {
            res.status(500).json({ message: 'Server error', error: err.message });
          }
    }

}


module.exports = transactionController;