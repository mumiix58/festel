// This file is only used on the server side, so we'll create a dummy version for the frontend
export const connectDB = async () => {
  throw new Error('Database connection not available in frontend');
};

export const getCollection = async (name: string) => {
  throw new Error('Database collections not available in frontend');
};

export const closeDB = async () => {
  throw new Error('Database connection not available in frontend');
};

export default {
  connectDB,
  getCollection,
  closeDB
};