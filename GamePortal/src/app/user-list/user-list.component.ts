import {Component, Input, OnInit} from '@angular/core';
import {User} from '../models/user';
import {ChatService} from '../services/chat.service';
import {GroupService} from '../services/group.service';
import {Router} from '@angular/router';
import 'rxjs/add/operator/mergeMap';

// TODO: to set up groups!
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
@Input() isChat: boolean;
  users: any;
  groups: any;

  constructor(chatService: ChatService, groupService: GroupService, private router: Router) {
    this.isChat = false;
    // display users and groups!!

    const snap = chatService.getUsers().snapshotChanges();
    snap.subscribe( actions => {
      // const $key = action.key;
      // const user = { userId: $key, ...action.payload.val() };
      // console.log(user);
      // return user;
      let mylist = [];
      actions.forEach(action => {
        console.log(action.key);
        console.log(action.payload.val());
        const $key = action.key;
        const user = { userId: $key, ...action.payload.val() };
        console.log(user);
        mylist.push(user);
        console.log(mylist);
        return user;
      });
      // console.log('map ends');
      this.users = mylist;
      console.log(this.users);
    });
    if (this.users) {
      console.log('this is users: ' + this.users);
    }
    // chatService.getUsers().valueChanges().subscribe(users => {
    //   this.users = users;
    //   console.log(users[0]);
    // });
    this.groups = groupService.getGroupsForUser();
  }

  ngOnInit() {

  }

  startChat() {
    console.log('wo jin lai le');
    this.router.navigate(['/participant-list']);
  }
}