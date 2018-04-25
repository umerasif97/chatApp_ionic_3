import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {  FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';
import { ChatPage } from '../chat/chat';
import { LoginPage, User } from '../login/login';
import { LoginProvider } from '../../providers/login/login';
import * as firebase from 'firebase/app';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [LoginProvider]
})
export class HomePage {

  dbUser: FirebaseListObservable<any[]>;
  currentUser;

  constructor(public navCtrl: NavController,
              public db: AngularFireDatabase,
              public loginService: LoginProvider) {
   this.dbUser = db.list('/users');
   this.currentUser = firebase.auth().currentUser.email;
   //console.log(this.dbUser);
  }

  logout(){
    this.loginService.logout();
  }

  chat(user){
    this.navCtrl.push(ChatPage ,{
      id: user.id,
      email: user.email,
      username: user.username
    });
  }
}
