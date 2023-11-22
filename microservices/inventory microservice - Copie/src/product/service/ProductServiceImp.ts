// ProductService.ts
import { Model } from 'mongoose';
import { IProduct } from '../entity/Product';
import { IProductService } from './IProductService';
import logger from '../../loggers/Logger'; // Import the logger
import ProductRepository from '../repository/ProductRepository';

export class ProductServiceImp implements IProductService {
  private productModel: ProductRepository;

  constructor(productModel: ProductRepository) {
    this.productModel = productModel;
  }

  async getAllProducts(): Promise<IProduct[]> {
    try {
      const products = await this.productModel.find().exec();
      logger.info('Retrieved all products');
      return products;
    } catch (error:any) {
      logger.error(`Error retrieving products: ${error.message}`);
      throw error;
    }
  }

  async getProductById(id: string): Promise<IProduct | null> {
    try {
      const product = await this.productModel.findById(id).exec();
      if (product) {
        logger.info(`Retrieved product by ID: ${id}`);
      } else {
        logger.info(`Product with ID ${id} not found`);
      }
      return product;
    } catch (error:any) {
      logger.error(`Error retrieving product by ID: ${error.message}`);
      throw error;
    }
  }

  async createProduct(productData: IProduct): Promise<IProduct> {
    try {
      const newProduct = await this.productModel.create(productData);
      logger.info(`Created new product: ${newProduct}`);
      return newProduct;
    } catch (error:any) {
      logger.error(`Error creating product: ${error.message}`);
      throw error;
    }
  }

  async updateProduct(id: string, productData: IProduct): Promise<IProduct | null> {
    try {
      const updatedProduct = await this.productModel
        .findByIdAndUpdate(id, productData, { new: true })
        .exec();
      if (updatedProduct) {
        logger.info(`Updated product with ID ${id}: ${updatedProduct}`);
      } else {
        logger.info(`Product with ID ${id} not found`);
      }
      return updatedProduct;
    } catch (error:any) {
      logger.error(`Error updating product: ${error.message}`);
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const result = await this.productModel.findByIdAndDelete(id).exec();
      if (result) {
        logger.info(`Deleted product with ID ${id}`);
      } else {
        logger.info(`Product with ID ${id} not found`);
      }
      return !!result;
    } catch (error:any) {
      logger.error(`Error deleting product: ${error.message}`);
      throw error;
    }
  }
}
