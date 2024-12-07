import { Router } from 'express';
import authController from './auth/auth.controller';
import router from './auth/auth.controller';
import expressListRoutes from 'express-list-routes';

const api = Router();

api.get('/', (req, res) => {
  res.send(expressListRoutes(api, { prefix: '/v1' }));
});

api.use(authController);

export default Router().use('/v1', api);
