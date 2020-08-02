import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Message } from 'src/models/message.model';
import { UserService } from 'src/services/user.service';
import { NgForm } from '@angular/forms';
import { SignalrService } from 'src/services/signalr.service';

@Component({
  selector: 'app-private-room',
  templateUrl: './private-room.component.html'
})
export class PrivateRoomComponent implements OnInit, AfterViewChecked {

  @ViewChild('privateForm') globalForm: NgForm;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  @Input() username: string;
  @Input() chat: any;
  @Input() messages: Message[] = [];
  message: Message = new Message();

  constructor(private _ctx: SignalrService) {

  }

  ngOnInit(): void {
    if (this.chat.messages != null) this.messages = this.chat.messages;
    this._ctx.currentPrivateMessage.subscribe((message: Message) => {
      console.log(this.messages.length);
      if (message.id != undefined) this.messages = [...this.messages, message];
      console.log(this.messages.length);
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  sendMessage() {
    this._ctx.sendPM(this.chat.id, this.message.text, this.username)
      .then(() => {
        this.globalForm.resetForm();
      });
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

}
