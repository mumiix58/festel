import localforage from 'localforage';

// Initialize localforage instances for different collections
const collections: { [key: string]: LocalForage } = {};

interface DbDocument {
  _id?: string;
  [key: string]: any;
}

export async function connectDB() {
  return {
    collection: (name: string) => {
      // Create or get collection instance
      if (!collections[name]) {
        collections[name] = localforage.createInstance({
          name: 'festlmacher',
          storeName: name
        });
      }

      return {
        find: async (query: Record<string, any> = {}) => ({
          sort: () => ({
            toArray: async () => {
              const items: DbDocument[] = [];
              await collections[name].iterate((value: DbDocument) => {
                // Simple query matching
                const matches = Object.entries(query).every(
                  ([key, val]) => !query || value[key] === val
                );
                if (matches) {
                  items.push(value);
                }
              });
              return items;
            }
          })
        }),
        findOne: async (query: Record<string, any> = {}) => {
          let result = null;
          await collections[name].iterate((value: DbDocument, key) => {
            if (!result && Object.entries(query).every(
              ([k, v]) => !query || value[k] === v
            )) {
              result = { ...value, _id: key };
            }
          });
          return result;
        },
        insertOne: async (doc: DbDocument) => {
          const id = doc._id || crypto.randomUUID();
          await collections[name].setItem(id, { ...doc, _id: id });
          return { insertedId: id };
        },
        updateOne: async (filter: Record<string, any>, update: { $set: Record<string, any> }, options: { upsert?: boolean } = {}) => {
          let found = false;
          await collections[name].iterate(async (value: DbDocument, key) => {
            if (!found && Object.entries(filter).every(
              ([k, v]) => value[k] === v
            )) {
              found = true;
              const newDoc = { ...value, ...update.$set };
              await collections[name].setItem(key, newDoc);
            }
          });

          if (!found && options.upsert) {
            const id = crypto.randomUUID();
            await collections[name].setItem(id, { 
              ...filter, 
              ...update.$set, 
              _id: id 
            });
            found = true;
          }

          return { modifiedCount: found ? 1 : 0 };
        },
        deleteOne: async (filter: Record<string, any>) => {
          let found = false;
          await collections[name].iterate(async (value: DbDocument, key) => {
            if (!found && Object.entries(filter).every(
              ([k, v]) => value[k] === v
            )) {
              found = true;
              await collections[name].removeItem(key);
            }
          });
          return { deletedCount: found ? 1 : 0 };
        }
      };
    }
  };
}

export async function closeDB() {
  // Clear references to collections
  Object.keys(collections).forEach(key => {
    delete collections[key];
  });
}