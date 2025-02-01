import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true,
    enum: ['kitchen', 'service', 'management', 'sales', 'admin']
  },
  image: String,
  bio: String,
  specialties: [{
    type: String
  }],
  certifications: [{
    name: String,
    issuer: String,
    year: Number
  }],
  languages: [{
    language: String,
    level: {
      type: String,
      enum: ['basic', 'intermediate', 'fluent', 'native']
    }
  }],
  email: {
    type: String,
    unique: true
  },
  phone: String,
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  showOnWebsite: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Staff', staffSchema);