import mongoose, { Document, Model, Schema } from "mongoose";

export interface IVariation {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  estimatedMeasurements: Record<string, string>;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  designInput: {
    text: string;
    inspirationImageUrls: string[];
  };
  measurementsSnapshot: Record<string, number | undefined>;
  variations: IVariation[];
  selectedVariationId?: string;
  status:
    | "awaiting_selection"
    | "pending_quote"
    | "quoted"
    | "paid"
    | "in_production"
    | "shipped";
  quote?: {
    amount: number;
    currency: string;
    notes: string;
  };
  payment?: {
    orderId: string;
    paymentId: string;
    paidAt: Date;
  };
}

const VariationSchema = new Schema<IVariation>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  estimatedMeasurements: { type: Map, of: String, default: {} },
});

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    designInput: {
      text: { type: String, required: true },
      inspirationImageUrls: [String],
    },
    measurementsSnapshot: { type: Map, of: Number },
    variations: [VariationSchema],
    selectedVariationId: String,
    status: {
      type: String,
      enum: [
        "awaiting_selection",
        "pending_quote",
        "quoted",
        "paid",
        "in_production",
        "shipped",
      ],
      default: "awaiting_selection",
    },
    quote: {
      amount: Number,
      currency: { type: String, default: "INR" },
      notes: String,
    },
    payment: {
      orderId: String,
      paymentId: String,
      paidAt: Date,
    },
  },
  { timestamps: true }
);

const Order: Model<IOrder> =
  mongoose.models.Order ?? mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
