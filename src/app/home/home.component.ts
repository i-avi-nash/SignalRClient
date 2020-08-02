import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Message } from 'src/models/message.model';
import { SignalrService } from 'src/services/signalr.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

    constructor(
        private router: Router,
        private _ctx: UserService,
        private _lxp: SignalrService,
        private toastr: ToastrService
    ) { }

    userDetails: any;
    username: string = '';
    searchText: string = '';
    chat: any;
    user: any;
    enabled = false;

    ngOnInit(): void {
        this._ctx.getUserProfile()
            .then((data: any) => {
                this.userDetails = data;
                this.username = this.userDetails.userName;
            }).catch(err => {
                this.toastr.error("Invalid Response!!");
            });
    }

    searchUser() {
        console.log(this.searchText);
        this._ctx.searchUser(this.searchText).then((user) => this.user = user);
    }

    chatUser(user) {
        console.log(user);
        this._ctx.JoinChat(this.userDetails.id, user.id).then((data) => {
            console.log(data);
            this.chat = data;
            this.enabled = true;
        });
    }

    onLogout() {
        localStorage.removeItem('token');
        this.router.navigate(['/user/login']);
    }

}
