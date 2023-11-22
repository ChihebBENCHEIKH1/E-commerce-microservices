import Product,{IProduct} from '../entity/Product';

interface ProductRepository {


  create(productData: IProduct): Promise<IProduct>;

  findById(id: string): Promise<IProduct | null>;

   findAll(): Promise<IProduct[]>;
   update(id: string, productData: Partial<IProduct>): Promise<IProduct | null> ;
   delete(id: string): Promise<boolean> ;
}

export default ProductRepository;
