import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

    constructor(
        private router: Router,
        private _ctx: UserService,
        private toastr: ToastrService
    ) { }

    userDetails: any;
    username: string = '';

    ngOnInit(): void {
        this._ctx.getUserProfile()
            .then((data: any) => {
                this.userDetails = data;
                this.username = this.userDetails.userName;
            }).catch(err => {
                this.toastr.error("Invalid Response!!");
            });
    }

    onLogout() {
        localStorage.removeItem('token');
        this.router.navigate(['/user/login']);
    }

}
