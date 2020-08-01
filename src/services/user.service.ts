import { Injectable, ErrorHandler } from '@angular/core';
import axios from "axios";
import { AxiosInstance } from "axios";
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private axiosClient: AxiosInstance;
    private errorHandler: ErrorHandler;
    // private BaseURI: string = 'http://localhost:5000';
    private BaseURI: string = 'http://signalrserver.ap-south-1.elasticbeanstalk.com';

    constructor(errorHandler: ErrorHandler, private toastr: ToastrService) {
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
                // url: 'http://localhost:5000/api/auth/Register',
                url: 'http://signalrserver.ap-south-1.elasticbeanstalk.com/api/auth/Register',
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
                url: this.BaseURI + '/api/auth/login',
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
                url: this.BaseURI + '/api/profile'
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
