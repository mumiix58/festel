import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
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

gallerySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Gallery', gallerySchema);