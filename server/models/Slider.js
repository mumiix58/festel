import mongoose from 'mongoose';

const sliderSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true
  },
  cloudinaryPublicId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  buttonText: String,
  buttonLink: String,
  order: {
    type: Number,
    default: 0
  },
  showLogo: {
    type: Boolean,
    default: false
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

// Update timestamp on save
sliderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Add indexes for better performance
sliderSchema.index({ order: 1 });
sliderSchema.index({ isActive: 1 });

export default mongoose.model('Slider', sliderSchema);