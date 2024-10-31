import { MongoClient, Db } from "mongodb";
let cachedDB: Db | null = null;

export const connectToDatabase = async () => {
  if (cachedDB) {
    return cachedDB;
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  const db = client.db("mn-db");
  cachedDB = db;
  return db;
};
