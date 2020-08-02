import { Injectable, ErrorHandler } from '@angular/core';
import axios from "axios";
import { AxiosInstance } from "axios";
import { ToastrService } from 'ngx-toastr';
import { environment } from '../environments/environment';
import { SignalrService } from './signalr.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private axiosClient: AxiosInstance;
    private errorHandler: ErrorHandler;
    private API_URI = environment.API_URI;
    connectionId: string = '';

    constructor(errorHandler: ErrorHandler, private toastr: ToastrService, private _signalRService: SignalrService) {
        console.log(this.API_URI);
        this.errorHandler = errorHandler;
        this.axiosClient = axios.create({
            timeout: 3000,
            headers: {
                "X-Initialized-At": Date.now().toString()
            }
        });
    }

    getToken() {
        return localStorage.getItem('token');
    }

    public async register<T>(user: any): Promise<T> {
        try {
            var result = await this.axiosClient.request<T>({
                method: "post",
                url: `${this.API_URI}/api/auth/Register`,
                params: { ...user }
            });
            return result.data;
        } catch (error) {
            return (Promise.reject(this.normalizeError(error)));
        }
    }

    public async login<T>(user: any): Promise<T> {
        try {
            var result = await this.axiosClient.request<T>({
                method: "post",
                url: `${this.API_URI}/api/auth/login`,
                params: { ...user }
            });
            return result.data;
        } catch (error) {
            return (Promise.reject(this.normalizeError(error)));
        }
    }

    public async getUserProfile<T>(): Promise<T> {
        try {
            var result = await this.axiosClient.request<T>({
                method: "get",
                headers: { Authorization: `Bearer ${this.getToken()}` },
                url: `${this.API_URI}/api/profile`
            });
            return result.data;
        } catch (error) {
            return (Promise.reject(this.normalizeError(error)));
        }
    }

    public async searchUser<T>(searchText): Promise<T> {
        try {
            var result = await this.axiosClient.request<T>({
                method: "get",
                headers: { Authorization: `Bearer ${this.getToken()}` },
                url: `${this.API_URI}/api/auth/search`,
                params: { username: searchText }
            });
            return result.data;
        } catch (error) {
            return (Promise.reject(this.normalizeError(error)));
        }
    }

    public async JoinChat<T>(sender: string, receiver: string): Promise<T> {
        const paramData = { sender, receiver, connectionId: this._signalRService.connectionId };
        try {
            var result = await this.axiosClient.request<T>({
                method: "post",
                headers: { Authorization: `Bearer ${this.getToken()}` },
                url: `${this.API_URI}/api/chat/JoinChat`,
                params: paramData
            });
            return result.data;
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
