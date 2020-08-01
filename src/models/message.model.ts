import { Chat } from './chat.model';

export class Message {
    id: number;
    name: string;
    text: string;
    timeStamp: string;
    chatId: number;
    chat?: Chat;
    user?: any;
}
