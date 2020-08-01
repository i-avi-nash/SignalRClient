import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { BehaviorSubject } from 'rxjs';
import axios from "axios";
import { AxiosInstance } from "axios";
import { ErrorHandler } from "@angular/core";
import { Message } from 'src/models/message.model';

@Injectable({
    providedIn: 'root'
})
export class SignalrService {

    private connection: HubConnection;
    connectionId: string = undefined;

    message: Message = new Message();

    private messageSource = new BehaviorSubject(this.message);
    currentMessage = this.messageSource.asObservable();

    private axiosClient: AxiosInstance;
    private errorHandler: ErrorHandler;

    constructor(errorHandler: ErrorHandler) {
        this.connection = new HubConnectionBuilder()
            // .withUrl('http://localhost:5000/ChatHub')
            .withUrl('http://signalrserver.ap-south-1.elasticbeanstalk.com/ChatHub')
            .build();

        this.connection.start()
            .then(() => {
                this.connection.invoke("getConnectionId").then((connectionId: string) => {
                    console.log(connectionId);
                    this.connectionId = connectionId;
                });
            });

        this.connection.on("receiveMessage", (message: Message) => {
            this.messageSource.next(message);
        });

        this.errorHandler = errorHandler;
        this.axiosClient = axios.create({
            timeout: 3000,
            headers: {
                "X-Initialized-At": Date.now().toString()
            }
        });
    }

    public async sendMessage<T>(chatId: number, message: string, userName: string, roomName: string): Promise<T> {
        var paramData = { chatId, message, userName, roomName };
        try {
            var result = await this.axiosClient.request<T>({
                method: "post",
                // url: 'http://localhost:5000/api/chathub/SendMessage',
                url: 'http://signalrserver.ap-south-1.elasticbeanstalk.com/api/chathub/SendMessage',
                params: paramData
            });
            return result.data;
        } catch (error) {
            return (Promise.reject(this.normalizeError(error)));
        }
    }

    public async joinRoom<T>(roomName: string): Promise<T> {
        var paramData = { connectionId: this.connectionId, roomName };
        try {
            var axiosResponse = await this.axiosClient.request<T>({
                method: "post",
                // url: 'http://localhost:5000/api/chathub/JoinRoom',
                url: 'http://signalrserver.ap-south-1.elasticbeanstalk.com/api/chathub/JoinRoom',
                params: paramData
            });
            return (axiosResponse.data);
        } catch (error) {
            return (Promise.reject(this.normalizeError(error)));
        }
    }

    public async CreateRoom<T>(roomName: string): Promise<T> {
        try {
            var axiosResponse = await this.axiosClient.request<T>({
                method: "post",
                // url: 'http://localhost:5000/api/chat/CreateRoom',
                url: 'http://signalrserver.ap-south-1.elasticbeanstalk.com/api/chat/CreateRoom',
                params: { roomName }
            });
            return (axiosResponse.data);
        } catch (error) {
            return (Promise.reject(this.normalizeError(error)));
        }
    }

    private normalizeError(error: any): ErrorResponse {
        this.errorHandler.handleError(error);
        return ({
            id: "-1",
            code: "UnknownError",
            message: "An unexpected error occurred."
        });
    }

}

export interface data {
    user: string;
    text: string;
    time: string;
    self: boolean;
}

export interface ErrorResponse {
    id: string;
    code: string;
    message: string;
}

export interface GetOptions {
    url: string;
    params?: Params;
}

export interface Params {
    [key: string]: any;
}