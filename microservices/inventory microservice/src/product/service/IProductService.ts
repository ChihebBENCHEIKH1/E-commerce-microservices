import { IProduct } from  "../entity/Product";

export interface IProductService {
  getAllProducts(): Promise<IProduct[]>;
  getProductById(id: string): Promise<IProduct|null>;
  createProduct(productData: IProduct): Promise<IProduct>;
  updateProduct(id: string, productData: IProduct): Promise<IProduct | null>;
  deleteProduct(id: string): Promise<boolean>;
}
