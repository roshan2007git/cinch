import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var _mongoosePromise: Promise<typeof mongoose> | undefined;
}

async function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not defined");

  if (!global._mongoosePromise) {
    global._mongoosePromise = mongoose.connect(uri, { bufferCommands: false }).catch((err) => {
      global._mongoosePromise = undefined;
      throw err;
    });
  }
  return global._mongoosePromise;
}

export default connectDB;
