import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var _mongoosePromise: Promise<typeof mongoose> | undefined;
}

function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not defined");

  if (global._mongoosePromise) return global._mongoosePromise;

  global._mongoosePromise = mongoose.connect(uri, { bufferCommands: false });
  return global._mongoosePromise;
}

export default connectDB;
