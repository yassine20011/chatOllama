export interface Message {
    id: string;
    conversationId: string;
    userInput: string;
    modelResponse: string;
    createdAt: Date;
}