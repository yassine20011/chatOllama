import { Router } from 'express';
import authController from './auth/auth.controller';
import conversationController from './conversation/conversation.controller';
import router from './auth/auth.controller';
import expressListRoutes from 'express-list-routes';


const api = Router();

api.get('/', (req, res) => {
  res.send(expressListRoutes(api, { prefix: '/v1' }));
});

api.use(authController);
api.use(conversationController);

export default Router().use('/v1', api);
