export interface ChatInput {
    model: string;
    messages: Array<{ role: string; message: string }>;
}
