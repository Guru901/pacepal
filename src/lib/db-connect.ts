import * as mongoose from "mongoose";

export async function connectToDB() {
  try {
    if (mongoose.connection.readyState) return;
    await mongoose.connect(process.env.DATABASE_URL!);
    console.log(`Connected to database`);
  } catch (error) {
    console.error(`Error connecting to database: ${error}`);
  }
}
