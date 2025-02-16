import mongoose from 'mongoose';

const legalSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['impressum', 'datenschutz', 'agb'],
    unique: true
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

// Update timestamp on save
legalSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

const Legal = mongoose.model('Legal', legalSchema);

// Initialize default legal content if none exists
export async function initializeLegalContent() {
  try {
    const types = ['impressum', 'datenschutz', 'agb'];
    
    for (const type of types) {
      const exists = await Legal.findOne({ type });
      if (!exists) {
        await Legal.create({
          type,
          content: `# ${type.charAt(0).toUpperCase() + type.slice(1)}\n\nDefault content for ${type}`
        });
        console.log(`Default ${type} content initialized`);
      }
    }
  } catch (error) {
    console.error('Error initializing legal content:', error);
  }
}

export default Legal;