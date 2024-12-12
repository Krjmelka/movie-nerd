import { MongoClient, Db } from "mongodb";
let cachedDB: Db | null = null;

export const connectToDatabase = async () => {
  if (cachedDB) {
    return cachedDB;
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  const db = client.db("mn-db");
  const indexes = await db.collection("rounds").indexes();

  const indexExists = indexes.some(index => index.name === "expiresAt_1");
  if (!indexExists) {
    await db.collection("rounds").createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0 }
    );
    console.log("TTL index created for expiresAt");
  }
  cachedDB = db;
  return db;
};
