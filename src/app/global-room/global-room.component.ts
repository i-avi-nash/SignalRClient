import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Chat } from 'src/models/chat.model';
import { Message } from 'src/models/message.model';

import { SignalrService } from 'src/services/signalr.service';

@Component({
    selector: 'app-global-room',
    templateUrl: './global-room.component.html',
    styleUrls: ['./global-room.component.css']
})
export class GlobalRoomComponent implements OnInit, AfterViewChecked {
    @ViewChild('globalForm') globalForm: NgForm;
    @ViewChild('name') nameField: ElementRef;
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    @Input() username: string;

    room: Chat = new Chat();
    message: Message = new Message();
    messages: Message[] = [];
    joinChatTriggered = false;

    constructor(private _service: SignalrService) {

    }

    ngOnInit() {
        this._service.currentMessage.subscribe((message: Message) => {
            this.messages = [...this.messages, message];
        });
    }

    joinGlobal() {
        this.joinChatTriggered = true;
        this._service.joinRoom('global')
            .then((room: Chat) => {
                this.room = room;
                this.messages = room.messages;
            });
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    sendMessage() {
        this._service.sendMessage(this.room.id, this.message.text, this.username, this.room.name)
            .then(() => {
                this.globalForm.resetForm();
                this.nameField.nativeElement.focus();
            });
    }

    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) { }
    }

}
