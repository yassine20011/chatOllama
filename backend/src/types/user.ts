import { Conversation } from './conversation';

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    conversations: Conversation[];
  }