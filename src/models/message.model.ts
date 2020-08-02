import { Chat } from './chat.model';

export class Message {
    id: string;
    name: string;
    text: string;
    timeStamp: string;
    chatId: string;
    chat?: Chat;
    user?: any;
}
