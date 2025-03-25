import { MongoClient } from "mongodb";
import { config } from 'dotenv';

config();

let db;

async function connectToDb(callback) {
    const client = new MongoClient(process.env.MONGO_DB_URI);
    await client.connect();
    db = client.db(process.env.MONGO_DB_NAME);
    callback();
}

export {
    db,
    connectToDb
}
