import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { BehaviorSubject } from 'rxjs';
import axios from "axios";
import { AxiosInstance } from "axios";
import { ErrorHandler } from "@angular/core";
import { Message } from 'src/models/message.model';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SignalrService {

    private connection: HubConnection;
    connectionId: string = undefined;

    message: Message = new Message();
    private messageSource = new BehaviorSubject(this.message);
    currentMessage = this.messageSource.asObservable();

    privateMessage: Message = new Message();
    private privateMessageSource = new BehaviorSubject(this.privateMessage);
    currentPrivateMessage = this.privateMessageSource.asObservable();

    private axiosClient: AxiosInstance;
    private errorHandler: ErrorHandler;
    private API_URI = environment.API_URI;

    constructor(errorHandler: ErrorHandler) {
        this.connection = new HubConnectionBuilder()
            .withUrl(`${this.API_URI}/ChatHub`)
            .build();

        this.connection.start()
            .then(() => {
                this.connection.invoke("getConnectionId").then((connectionId: string) => {
                    localStorage.setItem('connectionId', connectionId);
                    this.connectionId = connectionId;
                });
            });

        this.connection.on("receiveMessage", (message: Message) => {
            this.messageSource.next(message);
        });

        this.connection.on("receivePM", (privateMessage: Message) => {
            this.privateMessageSource.next(privateMessage);
        });

        this.errorHandler = errorHandler;
        this.axiosClient = axios.create({
            timeout: 3000,
            headers: {
                "X-Initialized-At": Date.now().toString()
            }
        });
    }

    public async sendMessage<T>(chatId: string, message: string, userName: string, roomName: string): Promise<T> {
        var paramData = { chatId, message, userName, roomName };
        try {
            var result = await this.axiosClient.request<T>({
                method: "post",
                url: `${this.API_URI}/api/chathub/SendMessage`,
                params: paramData
            });
            return result.data;
        } catch (error) {
            return (Promise.reject(this.normalizeError(error)));
        }
    }

    public async sendPM<T>(chatId: string, message: string, username: string): Promise<T> {
        var paramData = { chatId, message, username };
        try {
            var result = await this.axiosClient.request<T>({
                method: "post",
                url: `${this.API_URI}/api/chathub/sendPM`,
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
                url: `${this.API_URI}/api/chathub/JoinRoom`,
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
                url: `${this.API_URI}/api/chat/CreateRoom`,
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