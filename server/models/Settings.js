import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  logo: {
    url: String,
    cloudinaryPublicId: String
  },
  company: {
    name: {
      type: String,
      default: "FEST'LMACHER Gastronomie"
    },
    address: {
      street: {
        type: String,
        default: "Handelskai 265"
      },
      city: {
        type: String,
        default: "Wien"
      },
      postalCode: {
        type: String,
        default: "1020"
      },
      country: {
        type: String,
        default: "Österreich"
      }
    },
    contact: {
      phone: {
        type: String,
        default: "+43 (0)699 – 1600 2800"
      },
      email: {
        type: String,
        default: "catering@festlmacher.at"
      }
    }
  },
  social: {
    facebook: String,
    instagram: String,
    linkedin: String
  },
  seo: {
    title: String,
    description: String,
    keywords: String,
    googleMapsApiKey: String,
    googlePlaceId: String,
    googleAnalyticsId: String
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Settings = mongoose.model('Settings', settingsSchema);

// Initialize settings if they don't exist
export async function initializeSettings() {
  try {
    const count = await Settings.countDocuments();
    if (count === 0) {
      await Settings.create({
        company: {
          name: "FEST'LMACHER Gastronomie",
          address: {
            street: "Handelskai 265",
            city: "Wien",
            postalCode: "1020",
            country: "Österreich"
          },
          contact: {
            phone: "+43 (0)699 – 1600 2800",
            email: "catering@festlmacher.at"
          }
        },
        social: {
          facebook: "https://facebook.com/festlmacher",
          instagram: "https://instagram.com/festlmacher",
          linkedin: "https://linkedin.com/company/festlmacher"
        },
        seo: {
          title: "Fest'lmacher Gastronomie | Ihr Catering Partner in Wien",
          description: "Professioneller Catering-Service in Wien für Ihre Veranstaltungen.",
          keywords: "catering wien, event catering, hochzeit catering"
        }
      });
      console.log('Default settings initialized');
    }
  } catch (error) {
    console.error('Error initializing settings:', error);
  }
}

export default Settings;