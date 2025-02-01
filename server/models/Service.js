import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  features: [{
    type: String
  }],
  order: {
    type: Number,
    default: 0
  },
  buttonText: {
    type: String,
    required: true
  },
  buttonLink: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  seo: {
    title: String,
    description: String,
    keywords: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

serviceSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Service', serviceSchema);