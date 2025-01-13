const Joi = require('joi');
const Category = require('../models/Category');

const categoryController = {
    async addCategory (req,res,next) {
        try {
            const { name, type } = req.body;
            if (!name || !type) {
              return res.status(400).json({ message: 'Name and type are required' });
            }
            const category = new Category({ ...req.body, userId: req.user.id }); 
            await category.save();
            res.status(201).json({ message: 'Category added successfully', category });
          } catch (err) {
            res.status(500).json({ message: 'Server error', error: err.message });
          }
    },

    async getCategories (req,res,next){

        try {
            const categories = await Category.find({ userId: req.user.id });
            res.status(200).json(categories);
          } catch (err) {
            res.status(500).json({ message: 'Server error', error: err.message });
          }

    },
    async getCategoryById (req,res,next){
        try {
            const { id } = req.params;
            const category = await Category.findOne({ _id: id, userId: req.user.id });
            if (!category) {
              return res.status(404).json({ message: 'Category not found' });
            }
            res.status(200).json(category);
          } catch (err) {
            res.status(500).json({ message: 'Server error', error: err.message });
          }
    },
    async updateCategory (req,res,next){
        try {
            const { id } = req.params;
            const { name, type } = req.body;
        
            if (!name || !type) {
              return res.status(400).json({ message: 'Name and type are required' });
            }
        
            const updatedCategory = await Category.findOneAndUpdate(
              { _id: id, userId: req.user.id },
              { name, type },
              { new: true } 
            );
        
            if (!updatedCategory) {
              return res.status(404).json({ message: 'Category not found' });
            }
        
            res.status(200).json({ message: 'Category updated successfully', updatedCategory });
          } catch (err) {
            res.status(500).json({ message: 'Server error', error: err.message });
          }
    },
    async deleteCategory(req,res,next){

        try {
            const { id } = req.params;
        
            const deletedCategory = await Category.findOneAndDelete({
              _id: id,
              userId: req.user.id
            });
        
            if (!deletedCategory) {
              return res.status(404).json({ message: 'Category not found' });
            }
        
            res.status(200).json({ message: 'Category deleted successfully' });
          } catch (err) {
            res.status(500).json({ message: 'Server error', error: err.message });
          }

    }
}

module.exports = categoryController;