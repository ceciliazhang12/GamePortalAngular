import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import {AngularFireDatabase} from 'angularfire2/database';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-email-login',
  templateUrl: './email-login.component.html',
  styleUrls: ['./email-login.component.css']
})
export class EmailLoginComponent implements OnInit {
  public authState: any;
  email: string;
  password: string;
  errMessage = '';

  constructor(public afAuth: AngularFireAuth,
              public af: AngularFireDatabase,
              private router: Router,
              public authservice: AuthService) {
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth;
    });
  }
  ngOnInit() {
  }
  signUp() {
    this.afAuth.auth.createUserWithEmailAndPassword(this.email, this.password)
      .then((result) => {
/*        this.email = result.user.email;
        this.password = result.user.password;*/
        // console.log('user: ', result, 'created');
        // note in this callback function, result is actually user!!!
        this.authState = result;
        const userInfo = this.authservice.createUserInfo(result);
        // console.log('Email user info: ', userInfo);
        // this.af.database.ref('users/' + result.uid).update(userInfo);
        firebase.database().ref('users/' + result.uid).update(userInfo); // permission denied!
        this.af.list('gamePortal/recentlyConnected').push(
          {
            userId: result.uid,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
          }
        );
        // console.log('success');
        this.router.navigate(['/']);
      })
      .catch(error => {
        console.log(error);
        this.errMessage = error.message;
      });
  }
  signIn() {
    // console.log('ready to sign in...');
    this.afAuth.auth.signInWithEmailAndPassword(this.email, this.password)
      .then((result) => {
        // console.log('success');
        this.router.navigate(['/']);
      })
      .catch(error => {
        console.log(error);
        this.errMessage = error.message;
      });
    // console.log('sign in success...');
  }
}
