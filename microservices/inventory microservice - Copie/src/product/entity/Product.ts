import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  inventory_id: string;
  availability_status: string;
  created_at: Date;
  updated_at: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    inventory_id: { type: String, required: true },
    availability_status: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now, required: false },
  },
  { timestamps: true } 
);

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
