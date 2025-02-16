import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const equipmentItemSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    default: () => `item-${uuidv4()}`
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
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const equipmentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    default: () => `category-${uuidv4()}`
  },
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
  items: [equipmentItemSchema],
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Add indexes for better performance
equipmentSchema.index({ slug: 1 });
equipmentSchema.index({ order: 1 });
equipmentItemSchema.index({ order: 1 });

const Equipment = mongoose.model('Equipment', equipmentSchema);

// Initialize default equipment if none exists
export async function initializeEquipment() {
  try {
    console.log('Checking for existing equipment...');
    const count = await Equipment.countDocuments();
    
    if (count === 0) {
      console.log('No equipment found. Creating defaults...');
      
      const defaultCategories = [
        {
          id: `category-${uuidv4()}`,
          name: 'Geschirr & Besteck',
          slug: 'geschirr-besteck',
          description: 'Hochwertiges Porzellan und edles Besteck für jeden Anlass',
          items: [
            {
              id: `item-${uuidv4()}`,
              title: 'Menüteller',
              description: 'Elegante Menüteller aus hochwertigem Porzellan',
              image: 'https://images.unsplash.com/photo-1603199506016-b9a594b593c0?w=800',
              order: 0,
              isActive: true
            },
            {
              id: `item-${uuidv4()}`,
              title: 'Suppenteller',
              description: 'Tiefe Suppenteller für Suppen und Eintöpfe',
              image: 'https://images.unsplash.com/photo-1603199506016-b9a594b593c0?w=800',
              order: 1,
              isActive: true
            },
            {
              id: `item-${uuidv4()}`,
              title: 'Dessertbesteck',
              description: 'Feines Besteck für Desserts und Nachspeisen',
              image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800',
              order: 2,
              isActive: true
            },
            {
              id: `item-${uuidv4()}`,
              title: 'Menübesteck',
              description: 'Hochwertiges Besteck für Hauptgänge',
              image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800',
              order: 3,
              isActive: true
            },
            {
              id: `item-${uuidv4()}`,
              title: 'Vorspeisenteller',
              description: 'Kleine Teller für Vorspeisen und Appetizer',
              image: 'https://images.unsplash.com/photo-1603199506016-b9a594b593c0?w=800',
              order: 4,
              isActive: true
            },
            {
              id: `item-${uuidv4()}`,
              title: 'Servierlöffel',
              description: 'Große Löffel zum Servieren von Speisen',
              image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800',
              order: 5,
              isActive: true
            }
          ],
          order: 0,
          isActive: true
        },
        {
          id: `category-${uuidv4()}`,
          name: 'Gläser',
          slug: 'glaeser',
          description: 'Hochwertige Gläser für jeden Anlass',
          items: [
            {
              id: `item-${uuidv4()}`,
              title: 'Weißweingläser',
              description: 'Elegante Gläser für Weißwein',
              image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800',
              order: 0,
              isActive: true
            },
            {
              id: `item-${uuidv4()}`,
              title: 'Rotweingläser',
              description: 'Bauchige Gläser für Rotwein',
              image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800',
              order: 1,
              isActive: true
            },
            {
              id: `item-${uuidv4()}`,
              title: 'Sektgläser',
              description: 'Schlanke Gläser für Sekt und Champagner',
              image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800',
              order: 2,
              isActive: true
            },
            {
              id: `item-${uuidv4()}`,
              title: 'Wassergläser',
              description: 'Schlichte Gläser für Wasser und Softdrinks',
              image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800',
              order: 3,
              isActive: true
            },
            {
              id: `item-${uuidv4()}`,
              title: 'Cocktailgläser',
              description: 'Stilvolle Gläser für Cocktails',
              image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800',
              order: 4,
              isActive: true
            },
            {
              id: `item-${uuidv4()}`,
              title: 'Biergläser',
              description: 'Verschiedene Gläser für Biere',
              image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800',
              order: 5,
              isActive: true
            }
          ],
          order: 1,
          isActive: true
        },
        {
          id: `category-${uuidv4()}`,
          name: 'Buffet-Ausstattung',
          slug: 'buffet-ausstattung',
          description: 'Professionelle Ausstattung für Ihr Buffet',
          items: [
            {
              id: `item-${uuidv4()}`,
              title: 'Chafing Dishes',
              description: 'Warmhaltebehälter mit Brennpaste',
              image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
              order: 0,
              isActive: true
            },
            {
              id: `item-${uuidv4()}`,
              title: 'Buffetplatten',
              description: 'Große Platten für kalte Speisen',
              image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
              order: 1,
              isActive: true
            },
            {
              id: `item-${uuidv4()}`,
              title: 'Servierzangen',
              description: 'Verschiedene Zangen zum Servieren',
              image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
              order: 2,
              isActive: true
            },
            {
              id: `item-${uuidv4()}`,
              title: 'Warmhalteplatten',
              description: 'Elektrische Platten zum Warmhalten',
              image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
              order: 3,
              isActive: true
            },
            {
              id: `item-${uuidv4()}`,
              title: 'Kühlvitrinen',
              description: 'Vitrinen für gekühlte Speisen',
              image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
              order: 4,
              isActive: true
            },
            {
              id: `item-${uuidv4()}`,
              title: 'Buffetständer',
              description: 'Etageren und Ständer für Buffetaufbau',
              image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
              order: 5,
              isActive: true
            }
          ],
          order: 2,
          isActive: true
        },
        {
          id: `category-${uuidv4()}`,
          name: 'Möbel',
          slug: 'moebel',
          description: 'Hochwertige Möbel für Ihre Veranstaltung',
          items: [
            {
              id: `item-${uuidv4()}`,
              title: 'Banketttische',
              description: 'Runde Tische für 8-10 Personen',
              image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800',
              order: 0,
              isActive: true
            },
            {
              id: `item-${uuidv4()}`,
              title: 'Stehtische',
              description: 'Hohe Tische für den Empfang',
              image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800',
              order: 1,
              isActive: true
            },
            {
              id: `item-${uuidv4()}`,
              title: 'Bankettstühle',
              description: 'Komfortable Stühle für lange Veranstaltungen',
              image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800',
              order: 2,
              isActive: true
            },
            {
              id: `item-${uuidv4()}`,
              title: 'Barhocker',
              description: 'Hohe Stühle für Stehtische',
              image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800',
              order: 3,
              isActive: true
            },
            {
              id: `item-${uuidv4()}`,
              title: 'Lounge-Möbel',
              description: 'Bequeme Sessel und Sofas',
              image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800',
              order: 4,
              isActive: true
            },
            {
              id: `item-${uuidv4()}`,
              title: 'Buffettische',
              description: 'Lange Tische für Buffetaufbau',
              image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800',
              order: 5,
              isActive: true
            }
          ],
          order: 3,
          isActive: true
        },
        {
          id: `category-${uuidv4()}`,
          name: 'Bar-Equipment',
          slug: 'bar-equipment',
          description: 'Professionelle Ausstattung für Ihre Bar',
          items: [
            {
              id: `item-${uuidv4()}`,
              title: 'Mobile Bar',
              description: 'Komplette mobile Baranlage',
              image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800',
              order: 0,
              isActive: true
            },
            {
              id: `item-${uuidv4()}`,
              title: 'Cocktail-Set',
              description: 'Professionelles Cocktail-Equipment',
              image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800',
              order: 1,
              isActive: true
            },
            {
              id: `item-${uuidv4()}`,
              title: 'Kühlschränke',
              description: 'Getränkekühlschränke für die Bar',
              image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800',
              order: 2,
              isActive: true
            },
            {
              id: `item-${uuidv4()}`,
              title: 'Eiswürfelbehälter',
              description: 'Behälter für Crushed Ice und Eiswürfel',
              image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800',
              order: 3,
              isActive: true
            },
            {
              id: `item-${uuidv4()}`,
              title: 'Barzubehör',
              description: 'Shaker, Messbecher und weiteres Zubehör',
              image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800',
              order: 4,
              isActive: true
            },
            {
              id: `item-${uuidv4()}`,
              title: 'Zapfanlage',
              description: 'Professionelle Bierzapfanlage',
              image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800',
              order: 5,
              isActive: true
            }
          ],
          order: 4,
          isActive: true
        },
        {
          id: `category-${uuidv4()}`,
          name: 'Küchentechnik',
          slug: 'kuechentechnik',
          description: 'Professionelle Küchentechnik für Ihre Veranstaltung',
          items: [
            {
              id: `item-${uuidv4()}`,
              title: 'Konvektomat',
              description: 'Professioneller Heißluftofen',
              image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
              order: 0,
              isActive: true
            },
            {
              id: `item-${uuidv4()}`,
              title: 'Induktionsplatte',
              description: 'Mobile Kochstelle für Live-Cooking',
              image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
              order: 1,
              isActive: true
            },
            {
              id: `item-${uuidv4()}`,
              title: 'Salamander',
              description: 'Überbackgerät für Gratins',
              image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
              order: 2,
              isActive: true
            },
            {
              id: `item-${uuidv4()}`,
              title: 'Kühlschrank',
              description: 'Professioneller Gastro-Kühlschrank',
              image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
              order: 3,
              isActive: true
            },
            {
              id: `item-${uuidv4()}`,
              title: 'Spülmaschine',
              description: 'Schnelle Gastro-Spülmaschine',
              image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
              order: 4,
              isActive: true
            },
            {
              id: `item-${uuidv4()}`,
              title: 'Warmhaltebox',
              description: 'Box zum Transport warmer Speisen',
              image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
              order: 5,
              isActive: true
            }
          ],
          order: 5,
          isActive: true
        }
      ];

      await Equipment.create(defaultCategories);
      console.log('Default equipment initialized');
    } else {
      console.log(`Found ${count} existing equipment categories`);
    }
  } catch (error) {
    console.error('Error initializing equipment:', error);
    throw error;
  }
}

export default Equipment;