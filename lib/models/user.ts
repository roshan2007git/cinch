import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  name: string;
  plan: "free" | "atelier" | "label";
  measurements: {
    height?: number;
    weight?: number;
    chest?: number;
    waist?: number;
    hips?: number;
    shoulderWidth?: number;
    sleeveLength?: number;
    inseam?: number;
  };
  usage: {
    generationsThisMonth: number;
    usageMonth: string; // "YYYY-MM"
    savedProjectsCount: number;
  };
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    name: { type: String, default: "" },
    plan: { type: String, enum: ["free", "atelier", "label"], default: "free" },
    measurements: {
      height: Number,
      weight: Number,
      chest: Number,
      waist: Number,
      hips: Number,
      shoulderWidth: Number,
      sleeveLength: Number,
      inseam: Number,
    },
    usage: {
      generationsThisMonth: { type: Number, default: 0 },
      usageMonth: { type: String, default: "" },
      savedProjectsCount: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema);

export default User;
