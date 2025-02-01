import mongoose from 'mongoose';

const initiativeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const certificationSchema = new mongoose.Schema({
  name: {
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
  validUntil: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const sustainabilitySchema = new mongoose.Schema({
  initiatives: [initiativeSchema],
  certifications: [certificationSchema],
  lastModified: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Sustainability', sustainabilitySchema);