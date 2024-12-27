import { Router } from 'express';
import authController from './auth/auth.controller';
import conversationController from './conversation/conversation.controller';
import expressListRoutes from 'express-list-routes';
import messageController from './message/message.controller';

const api = Router();

api.get('/', (req, res) => {
  res.send(expressListRoutes(api, { prefix: '/v1' }));
});

api.use(authController);
api.use(conversationController);
api.use(messageController);

export default Router().use('/v1', api);
