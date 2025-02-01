import mongoose from 'mongoose';

const menuCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu'
  }]
});

export default mongoose.model('MenuCategory', menuCategorySchema);