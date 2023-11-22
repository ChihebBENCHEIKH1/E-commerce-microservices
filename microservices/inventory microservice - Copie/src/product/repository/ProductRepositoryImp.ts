import { Model, Document } from 'mongoose';
import Product,{IProduct} from '../entity/Product';

class ProductRepositoryImp {
  private productModel: Model<IProduct>;

  constructor() {
    this.productModel = Product;
  }

  async create(productData: IProduct): Promise<IProduct> {
    const createdProduct = await this.productModel.create(productData);
    return createdProduct;
  }

  async findById(id: string): Promise<IProduct | null> {
    const product = await this.productModel.findById(id).exec();
    return product;
  }

  async findAll(): Promise<IProduct[]> {
    const products = await this.productModel.find().exec();
    return products;
  }

  async update(id: string, productData: Partial<IProduct>): Promise<IProduct | null> {
    const updatedProduct = await this.productModel.findByIdAndUpdate(id, productData, { new: true }).exec();
    return updatedProduct;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    return !!result;
  }
}

export default ProductRepositoryImp;
