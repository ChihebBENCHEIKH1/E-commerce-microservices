import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
//import InventoryController from './controllers/InventoryController';
//import AuthMiddleware from './middlewares/AuthMiddleware';
class App {
    app;
    constructor() {
        this.app = express();
        //this.config();
        // this.routes();
        this.database();
    }
    config() {
        this.app.use(bodyParser.json());
        //this.app.use(AuthMiddleware);
    }
    routes() {
        // this.app.use('/inventory', InventoryController);
    }
    database() {
        const MONGO_URI = 'mongodb://localhost:27017/product';
        mongoose.connect(MONGO_URI)
            .then(() => {
            console.log('Connected to MongoDB');
        })
            .catch(error => {
            console.error('Error connecting to MongoDB', error);
        });
    }
    start(port) {
        this.app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
}
export default App;
