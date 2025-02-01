import mongoose from 'mongoose';

const referenceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  event: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  quote: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

referenceSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Reference', referenceSchema);