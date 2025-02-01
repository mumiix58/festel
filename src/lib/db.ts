import localforage from 'localforage';

// Initialize localforage instances for different collections
const collections: { [key: string]: LocalForage } = {};

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
        find: async (query = {}) => ({
          sort: () => ({
            toArray: async () => {
              const items = [];
              await collections[name].iterate((value: any) => {
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
        findOne: async (query = {}) => {
          let result = null;
          await collections[name].iterate((value: any, key) => {
            if (!result && Object.entries(query).every(
              ([k, v]) => !query || value[k] === v
            )) {
              result = { ...value, _id: key };
            }
          });
          return result;
        },
        insertOne: async (doc: any) => {
          const id = doc._id || crypto.randomUUID();
          await collections[name].setItem(id, { ...doc, _id: id });
          return { insertedId: id };
        },
        updateOne: async (filter: any, update: any, options: any = {}) => {
          let found = false;
          await collections[name].iterate(async (value: any, key) => {
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
        deleteOne: async (filter: any) => {
          let found = false;
          await collections[name].iterate(async (value: any, key) => {
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