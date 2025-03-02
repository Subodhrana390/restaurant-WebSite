import mongoose from "mongoose";

export function dbConnection() {
  // "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.0"
  mongoose
    .connect(process.env.MONGO_URL, {
      dbName: "BrewMaster",
    })
    .then(() => {
      console.log("DB Connected Succesfully");
    })
    .catch((error) => {
      console.log("DB Failed to connect", error);
    });
}
