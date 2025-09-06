import express from 'express';
import cookieParser from 'cookie-parser';
import pino from 'pino-http';
import cors from 'cors';
import router from './routers/index.js';
import { getEnvVar } from './utils/getEnvVar.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { UPLOAD_DIR } from './constants/index.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';


const swaggerDocument = JSON.parse(
  fs.readFileSync(path.resolve('./docs/swagger.json'), 'utf-8')
);

export const setupServer = () => {
  const app = express();
  const PORT = Number(getEnvVar('PORT', '3000'));

  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    })
  );

  app.use('/uploads', express.static(UPLOAD_DIR));

  app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
  });

  app.use(router);

  
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
