import express from 'express';
import bodyParser from 'body-parser';
import mongoose, { ConnectOptions } from 'mongoose';
import { ProductController } from './product/controller/ProductController';
import KafkaEventProcessor from './product/eventProcessor/KafkaEventProcessor';
import { ProductServiceImp } from './product/service/ProductServiceImp';
import { IProductService } from './product/service/IProductService';
import ProductRepository from './product/repository/ProductRepository';
import ProductRepositoryImp from './product/repository/ProductRepositoryImp';
import Product from './product/entity/Product';


//import InventoryController from './controllers/InventoryController';
//import AuthMiddleware from './middlewares/AuthMiddleware';

class App {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
    this.database();
  }

  private config(): void {
    this.app.use(bodyParser.json());
    //this.app.use(AuthMiddleware);
  }

  private routes(): void {
    const productRepository:ProductRepository=new ProductRepositoryImp();
    const productService:IProductService=new ProductServiceImp(productRepository);
    const productController = new ProductController(productService);
    const kafkaEventProcessor = new KafkaEventProcessor();

    // Define routes for ProductController
    this.app.get('/products', productController.getAllProducts.bind(productController));
    this.app.get('/products/:id', productController.getProductById.bind(productController));
    this.app.post('/products', productController.createProduct.bind(productController));
    this.app.put('/products/:id', productController.updateProduct.bind(productController));
    this.app.delete('/products/:id', productController.deleteProduct.bind(productController));

    kafkaEventProcessor.startConsuming('product-topic'); // Replace with your input topic
  }

  private database(): void {
    const MONGO_URI = 'mongodb://localhost:27017/product';
    mongoose.connect(MONGO_URI)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch(error => {
      console.error('Error connecting to MongoDB', error);
    });
  }
  public start(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}

export default App;
