import { Request, Response } from 'express';
import { IProductService } from '../service/IProductService';
import { ProductDTO } from '../dto/ProductDTO';
import pRetry from 'p-retry';
import { IProduct } from '../entity/Product';

export class ProductController {
  private productService: IProductService;

  constructor(productService: IProductService) {
    this.productService = productService;
  }

  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const retryableOperation = async () => {
        return await this.productService.getAllProducts();
      };

      const products = await pRetry(retryableOperation, {
        retries: 3,
        onFailedAttempt: (error: any) => {
          console.error(`Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`);
        },
        timeout: 1000, // Timeout in milliseconds (1 second)
      });

      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProductById(req: Request, res: Response): Promise<void> {
    const productId = req.params.id;

    try {
      const retryableOperation = async () => {
        return await this.productService.getProductById(productId);
      };

      const product = await pRetry(retryableOperation, {
        retries: 3,
        onFailedAttempt: (error: any) => {
          console.error(`Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`);
        },
        timeout: 1000, // Timeout in milliseconds (1 second)
      });

      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createProduct(req: Request, res: Response): Promise<void> {
    const productData: IProduct = req.body;

    try {
      const retryableOperation = async () => {
        return await this.productService.createProduct(productData);
      };

      const newProduct = await pRetry(retryableOperation, {
        retries: 3,
        onFailedAttempt: (error: any) => {
          console.error(`Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`);
        },
        timeout: 1000, // Timeout in milliseconds (1 second)
      });

      res.status(201).json(newProduct);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    const productId = req.params.id;
    const productData: IProduct = req.body;

    try {
      const retryableOperation = async () => {
        return await this.productService.updateProduct(productId, productData);
      };

      const updatedProduct = await pRetry(retryableOperation, {
        retries: 3,
        onFailedAttempt: (error: any) => {
          console.error(`Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`);
        },
        timeout: 1000, // Timeout in milliseconds (1 second)
      });

      if (updatedProduct) {
        res.json(updatedProduct);
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    const productId = req.params.id;

    try {
      const retryableOperation = async () => {
        return await this.productService.deleteProduct(productId);
      };

      const result = await pRetry(retryableOperation, {
        retries: 3,
        onFailedAttempt: (error: any) => {
          console.error(`Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`);
        },
        timeout: 1000, // Timeout in milliseconds (1 second)
      });

      if (result) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
