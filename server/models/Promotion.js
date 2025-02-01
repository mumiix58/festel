import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: String,
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed', 'special'],
    required: true
  },
  discountValue: Number,
  minimumGuests: Number,
  maximumGuests: Number,
  termsAndConditions: String,
  eventTypes: [{
    type: String
  }],
  code: {
    type: String,
    unique: true
  },
  usageLimit: Number,
  usageCount: {
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
  }
});

export default mongoose.model('Promotion', promotionSchema);