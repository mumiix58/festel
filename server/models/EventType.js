import mongoose from 'mongoose';

const eventTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  minGuests: {
    type: Number,
    default: 1
  },
  maxGuests: {
    type: Number
  },
  pricePerPerson: {
    type: Number
  },
  features: [{
    type: String
  }],
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

export default mongoose.model('EventType', eventTypeSchema);