const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

const analyticsController = {

   async getSummary (req,res,next){
    try {
        const userId = req.user.id;
        const summary = await Transaction.aggregate([
          { $match: { userId: new mongoose.Types.ObjectId(userId) } },
          {
            $group: {
              _id: "$type",
              total: { $sum: "$amount" }
            }
          }
        ]);
    
        let totalIncome = 0;
        let totalExpenses = 0;
    
        summary.forEach((item) => {
          if (item._id === "income") totalIncome = item.total;
          if (item._id === "expense") totalExpenses = item.total;
        });
    
        const balance = totalIncome - totalExpenses;
    
        res.status(200).json({
          totalIncome,
          totalExpenses,
          balance
        });
      } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
      }
    },

    async getChartData (req,res,next){
        try {
            const userId = req.user.id;
            const chartData = await Transaction.aggregate([
              { $match: { userId: new mongoose.Types.ObjectId(userId) } },
              {
                $group: {
                  _id: { category: "$category", type: "$type" },
                  total: { $sum: "$amount" }
                }
              }
            ]);
        
            // Structure data for frontend visualization
            const incomeData = [];
            const expenseData = [];
        
            chartData.forEach((item) => {
              const dataPoint = {
                category: item._id.category,
                total: item.total
              };
              if (item._id.type === "income") {
                incomeData.push(dataPoint);
              } else {
                expenseData.push(dataPoint);
              }
            });
        
            res.status(200).json({
              incomeData,
              expenseData
            });
          } catch (err) {
            res.status(500).json({ message: "Server error", error: err.message });
          }
    }

}

module.exports = analyticsController;