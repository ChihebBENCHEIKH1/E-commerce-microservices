import App from './app.js';
import * as dotenv from 'dotenv';
dotenv.config();
const PORT = parseInt(process.env?.PORT || '4000', 10);
const app = new App();
app.start(PORT);
