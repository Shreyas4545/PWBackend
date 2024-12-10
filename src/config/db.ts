import mongoose from "mongoose";

export const connectDB = async () => {
  const connect = await mongoose.connect(`${process.env.MONGO_URI}`);
  console.log(
    `MongoDB connected => ` +
      `Host: ${connect.connection.host}:${connect.connection.port}, ` +
      `Database: ${connect.connection.name} `
  );
};
