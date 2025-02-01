import mongoose from 'mongoose';

const legalSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['impressum', 'datenschutz', 'agb']
  },
  content: {
    type: String,
    required: true
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Legal', legalSchema);