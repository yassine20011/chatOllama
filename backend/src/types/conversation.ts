import { Message } from './message';

export interface Conversation {
    id: string;
    userId: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    messages: Message[];
}