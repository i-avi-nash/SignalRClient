import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from 'src/services/user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router, private injector: Injector) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let userService = this.injector.get(UserService);
        if (localStorage.getItem('token') != null) {
            let tokenRequest = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${userService.getToken()}`
                }
            });
            return next.handle(tokenRequest).pipe(
                tap(
                    succ => { },
                    err => {
                        if (err.status == 401) {
                            localStorage.removeItem('token');
                            this.router.navigateByUrl('/user/login');
                        }
                    }
                )
            );
        } else
            return next.handle(req.clone());
    }

}